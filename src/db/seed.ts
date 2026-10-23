import "dotenv-flow/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { slots } from "./schema/slots";
import { bookings } from "./schema/booking";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const seedSlots = [
  {
    id: "slot-1",
    provider: "Dr. Smith",
    available: true,
    start: new Date("2026-10-25T09:00:00Z"),
    end: new Date("2026-10-25T09:30:00Z")
  },
  {
    id: "slot-2",
    provider: "Dr. Smith",
    available: true,
    start: new Date("2026-10-25T10:00:00Z"),
    end: new Date("2026-10-25T10:30:00Z")
  },
  {
    id: "slot-3",
    provider: "Dr. Jones",
    available: false,
    start: new Date("2026-10-25T11:00:00Z"),
    end: new Date("2026-10-25T11:30:00Z")
  },
  {
    id: "slot-4",
    provider: "Dr. Jones",
    available: true,
    start: new Date("2026-10-26T09:00:00Z"),
    end: new Date("2026-10-26T09:30:00Z")
  }
];

const seedBookings = [
  {
    id: "booking-1",
    slotId: "slot-3",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "confirmed"
  },
  {
    id: "booking-2",
    slotId: "slot-1",
    name: "Bob Williams",
    email: "bob@example.com",
    status: "pending"
  }
];

async function seed() {
  console.log("Seeding slots...");
  await db.insert(slots).values(seedSlots).onConflictDoNothing();

  console.log("Seeding bookings...");
  await db.insert(bookings).values(seedBookings).onConflictDoNothing();

  console.log("Seed complete.");
  await pool.end();
}

seed().catch(err => {
  console.error("Seed failed:", err);
  pool.end();
  process.exit(1);
});
