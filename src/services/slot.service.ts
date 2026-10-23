import { db } from "../configs/database";
import { redis } from "../configs/redis";
import { slots } from "../db/schema/slots";
import { eq } from "drizzle-orm";

type ReplaceSlots = {
  id: string;
  provider: string;
  start: string;
  end: string;
};

const CACHE_KEY = "bookings:all";
const CACHE_TTL = 60;

export const BookingService = {
  async getAll() {
    const cached = await redis.get(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const result = await db.select().from(slots).orderBy(slots.start);
    await redis.set(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  },

  async getById(id: string) {
    const [booking] = await db.select().from(slots).orderBy(slots.start); //TODO: check if it is desc/asc
    return booking ?? null;
  }

  //   async update(data: ReplaceSlots) {
  //     const [booking] = await db.insert(slots).values(data).returning();
  //     await redis.del(CACHE_KEY);
  //     return booking;
  //   }
};
