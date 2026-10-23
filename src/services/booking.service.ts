import { db } from "../configs/database";
import { redis } from "../configs/redis";
import { bookings } from "../db/schema/booking";
import { and, desc, eq, lt, or } from "drizzle-orm";

type CreateBookingInput = {
  id: string;
  slotId: string;
  name: string;
  email: string;
  status: string;
};

const CACHE_KEY = "bookings:all";

export const BookingService = {
  async getAll(email: string, limit = 10, cursor?: string) {
    const pageSize = Math.min(limit, 50);

    let decoded: { createdAt: string; id: string } | null = null;
    if (cursor) {
      decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    }

    const conditions = [eq(bookings.email, email)];
    if (decoded) {
      conditions.push(
        or(
          lt(bookings.createdAt, new Date(decoded.createdAt)),
          and(
            eq(bookings.createdAt, new Date(decoded.createdAt)),
            lt(bookings.id, decoded.id)
          )
        )!
      );
    }

    const rows = await db
      .select()
      .from(bookings)
      .where(and(...conditions))
      .orderBy(desc(bookings.createdAt), desc(bookings.id))
      .limit(pageSize + 1);

    const hasMore = rows.length > pageSize;
    const result = hasMore ? rows.slice(0, pageSize) : rows;
    const last = result[result.length - 1];
    const next_cursor =
      hasMore && last
        ? Buffer.from(
            JSON.stringify({ createdAt: last.createdAt, id: last.id })
          ).toString("base64")
        : null;

    return { bookings: result, next_cursor };
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

  async cancelById(id: string) {
    const [cancelled] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();
    await redis.del(CACHE_KEY);
    return cancelled ?? null;
  }
};
