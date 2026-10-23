import { drizzle as drizzleDev } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema/index";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const prodDb = drizzle({ client: sql });

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// for dev env
export const Devdb = drizzleDev(pool, { schema });

export const connectDatabase = async () => {
  await pool.connect();
};

export const disconnectDatabase = async () => {
  await pool.end();
};
