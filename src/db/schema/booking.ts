import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { slots } from "./slots";

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  slotId: text("slot_id").notNull().references(() => slots.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull()
});
