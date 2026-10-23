import { db } from "../configs/database";
import { redis } from "../configs/redis";
import { slots } from "../db/schema/slots";
import { bookings } from "../db/schema/booking";
import { asc, eq } from "drizzle-orm";

type SlotInput = {
  id: string;
  provider: string;
  start: string | Date;
  end: string | Date;
};

const CACHE_KEY = "slots:all";
const CACHE_TTL = 60;

export const SlotService = {
  async getAll(provider?: string) {
    const cacheKey = provider ? `${CACHE_KEY}:${provider}` : CACHE_KEY;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = db.select().from(slots).orderBy(asc(slots.start));
    const result = provider
      ? await query.where(eq(slots.provider, provider))
      : await query;

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  },

  async getById(id: string) {
    const [slot] = await db.select().from(slots).where(eq(slots.id, id));
    return slot ?? null;
  },

  async replaceAll(newSlots: SlotInput[]) {
    const values = newSlots.map(s => ({
      id: s.id,
      provider: s.provider,
      available: true,
      start: new Date(s.start),
      end: new Date(s.end)
    }));
    await db.delete(bookings);
    await db.delete(slots);
    const inserted = await db.insert(slots).values(values).returning();
    await redis.del(CACHE_KEY);
    return inserted;
  }
};
