import { drizzle as drizzleDev } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema/index";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import env from "./env";

const { Pool } = pg;

const sql = neon(env.DATABASE_URL);
export const prodDb = drizzle({ client: sql });

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const Devdb = drizzleDev(pool, { schema });

export const connectDatabase = async () => {
  await pool.connect();
};

export const disconnectDatabase = async () => {
  await pool.end();
};
