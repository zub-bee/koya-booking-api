import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const slots = pgTable("slots", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  available: boolean("available").notNull(),
  start: timestamp("start", { withTimezone: true }).notNull(),
  end: timestamp("end", { withTimezone: true }).notNull()
});
