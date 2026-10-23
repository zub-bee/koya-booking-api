import { Devdb, prodDb } from "../configs/database";
import { redis } from "../configs/redis";
import { bookings } from "../db/schema/booking";
import { slots } from "../db/schema/slots";
import { and, asc, eq, gt, or, sql } from "drizzle-orm";
import { ApiError } from "../utils/api-error";
import { z } from "zod";
import { env } from "process";

const db = process.env.NODE_ENV === "production" ? prodDb : Devdb;

const bookingSchema = z.object({
  slot_id: z.string().min(1, "slot_id is required"),
  name: z
    .string()
    .min(1, "name is required")
    .transform(s => s.trim()),
  email: z
    .string()
    .email("invalid email")
    .transform(s => s.trim().toLowerCase())
});

type BookingRow = typeof bookings.$inferSelect;

const toResponse = (b: BookingRow) => ({
  id: b.id,
  slot_id: b.slotId,
  name: b.name,
  email: b.email,
  status: b.status,
  created_at: b.createdAt
});

export const BookingService = {
  async getAll(email: string, limit = 10, cursor?: string) {
    const pageSize = Math.min(Math.max(limit, 1), 50);

    let decoded: { createdAt: string; id: string } | null = null;
    if (cursor) {
      decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    }

    const emailCondition = sql`lower(${bookings.email}) = ${email.toLowerCase()}`;
    const conditions = [emailCondition];

    if (decoded) {
      conditions.push(
        or(
          gt(bookings.createdAt, new Date(decoded.createdAt)),
          and(
            eq(bookings.createdAt, new Date(decoded.createdAt)),
            gt(bookings.id, decoded.id)
          )
        )!
      );
    }

    const rows = await db
      .select()
      .from(bookings)
      .where(and(...conditions))
      .orderBy(asc(bookings.createdAt), asc(bookings.id))
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

    return { bookings: result.map(toResponse), next_cursor };
  },

  async getById(id: string) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!booking) throw ApiError.notFound("booking not found");
    return toResponse(booking);
  },

  async create(body: unknown, idempotencyKey?: string) {
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      throw ApiError.badRequest(
        parsed.error.issues[0]?.message ?? "invalid request"
      );
    }
    const { slot_id: slotId, name, email } = parsed.data;

    // 5 attempts per email per minute (failed attempts count)
    const rateLimitKey = `ratelimit:booking:${email}`;
    const count = await redis.incr(rateLimitKey);
    if (count === 1) await redis.expire(rateLimitKey, 60);
    if (count > (Number(env.REDIS_LIMIT) || 5)) {
      const ttl = await redis.ttl(rateLimitKey);
      throw ApiError.tooManyRequests("too many attempts", ttl > 0 ? ttl : 60);
    }

    // Idempotency check
    if (idempotencyKey) {
      const idemKey = `idempotency:booking:${idempotencyKey}`;
      const stored = await redis.get(idemKey);
      if (stored) {
        const { bodyHash, booking } = JSON.parse(stored);
        if (bodyHash !== JSON.stringify(body)) {
          throw ApiError.unprocessable(
            "idempotency key reused with different body"
          );
        }
        return booking;
      }
    }

    const now = new Date();

    // Transaction with row lock for concurrency safety
    const booking = await db.transaction(async tx => {
      const [slot] = await tx
        .select()
        .from(slots)
        .where(eq(slots.id, slotId))
        .for("update");

      if (!slot) throw ApiError.notFound("slot not found");
      if (slot.start <= now)
        throw ApiError.badRequest("slot has already started");
      if (!slot.available) throw ApiError.conflict("slot not available");

      await tx
        .update(slots)
        .set({ available: false })
        .where(eq(slots.id, slotId));

      const id = crypto.randomUUID();
      const [newBooking] = await tx
        .insert(bookings)
        .values({ id, slotId, name, email, status: "confirmed" })
        .returning();

      return toResponse(newBooking);
    });

    // store idempotency response (24h TTL)
    if (idempotencyKey) {
      const idemKey = `idempotency:booking:${idempotencyKey}`;
      await redis.set(
        idemKey,
        JSON.stringify({ bodyHash: JSON.stringify(body), booking }),
        "EX",
        86400
      );
    }

    return booking;
  },

  async cancelById(id: string) {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!booking) throw ApiError.notFound("booking not found");
    if (booking.status === "cancelled")
      throw ApiError.conflict("already cancelled");

    const [cancelled] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();

    await db
      .update(slots)
      .set({ available: true })
      .where(eq(slots.id, booking.slotId));

    return toResponse(cancelled);
  }
};
