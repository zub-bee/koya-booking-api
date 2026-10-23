import { db } from "../configs/database";
import { redis } from "../configs/redis";
import { bookings } from "../db/schema/booking";
import { eq } from "drizzle-orm";

type CreateBookingInput = {
  id: string;
  slotId: string;
  name: string;
  email: string;
  status: string;
};

const CACHE_KEY = "bookings:all";
const CACHE_TTL = 60;

export const BookingService = {
  async getAll() {
    const cached = await redis.get(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const result = await db.select().from(bookings);
    await redis.set(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);
    return result;
  },

  async getById(id: string) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking ?? null;
  },

  async create(data: CreateBookingInput) {
    const [booking] = await db.insert(bookings).values(data).returning();
    await redis.del(CACHE_KEY);
    return booking;
  },

  async deleteById(id: string) {
    const [deleted] = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();
    await redis.del(CACHE_KEY);
    return deleted ?? null;
  }
};
