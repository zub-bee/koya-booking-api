import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import env from "./env";
import * as schema from "../db/schema/index";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const db = drizzle(pool, { schema });

export const connectDatabase = async () => {
  await pool.connect();
};

export const disconnectDatabase = async () => {
  await pool.end();
};
