import { drizzle as drizzleDev } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema/index";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool as NeonPool } from "@neondatabase/serverless";
import env from "./env";

const { Pool } = pg;

const neonPool = new NeonPool({ connectionString: env.DATABASE_URL });
export const prodDb = drizzle({ client: neonPool, schema });

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
