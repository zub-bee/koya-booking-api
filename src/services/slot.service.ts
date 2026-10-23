import { db } from "../configs/database";
import { redis } from "../configs/redis";
import { slots } from "../db/schema/slots";
import { bookings } from "../db/schema/booking";
import { eq } from "drizzle-orm";

type ReplaceSlots = {
  id: string;
  provider: string;
  available: boolean;
  start: Date;
  end: Date;
};

const CACHE_KEY = "slots:all";
const CACHE_TTL = 60;

export const SlotService = {
  async getAll() {
    const cached = await redis.get(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const result = await db.select().from(slots).orderBy(slots.start);
    await redis.set(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  },

  async getById(id: string) {
    const [slot] = await db.select().from(slots).where(eq(slots.id, id));
    return slot ?? null;
  },

  async update(id: string, data: Omit<ReplaceSlots, "id">) {
    const [updated] = await db
      .update(slots)
      .set(data)
      .where(eq(slots.id, id))
      .returning();
    await redis.del(CACHE_KEY);
    return updated ?? null;
  },

  async replaceAll(newSlots: ReplaceSlots[]) {
    const parsed = newSlots.map(s => ({
      ...s,
      start: new Date(s.start),
      end: new Date(s.end)
    }));
    await db.delete(bookings);
    await db.delete(slots);
    const inserted = await db.insert(slots).values(parsed).returning();
    await redis.del(CACHE_KEY);
    return inserted;
  }
};
