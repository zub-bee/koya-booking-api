import { Redis as UpstashRedis } from "@upstash/redis";
import Ioredis from "ioredis";
import env from "./env";
import { logger } from "../utils/logger";

type SetOptions = { ex?: number };

type RedisClient = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: SetOptions): Promise<unknown>;
  del(key: string): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  ttl(key: string): Promise<number>;
  connect?(): Promise<void>;
  quit?(): Promise<void>;
};

function createRedis(): RedisClient {
  if (env.NODE_ENV === "production") {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error(
        "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production"
      );
    }
    const client = new UpstashRedis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN
    });
    return {
      get: key => client.get<string>(key),
      set: (key, value, options) =>
        options?.ex ? client.set(key, value, { ex: options.ex }) : client.set(key, value),
      del: key => client.del(key),
      incr: key => client.incr(key),
      expire: (key, seconds) => client.expire(key, seconds),
      ttl: key => client.ttl(key)
    };
  }

  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is required in development");
  }
  const ioredis = new Ioredis(env.REDIS_URL as string, { lazyConnect: true });
  ioredis.on("error", err => logger.error(err, "Redis error"));
  return {
    get: key => ioredis.get(key),
    set: (key, value, options) =>
      options?.ex
        ? ioredis.set(key, value, "EX", options.ex)
        : ioredis.set(key, value),
    del: key => ioredis.del(key),
    incr: key => ioredis.incr(key),
    expire: (key, seconds) => ioredis.expire(key, seconds),
    ttl: key => ioredis.ttl(key),
    connect: () => ioredis.connect(),
    quit: () => ioredis.quit().then(() => {})
  };
}

export const redis = createRedis();

export const connectRedis = async () => {
  if (redis.connect) {
    await redis.connect();
    logger.info("Redis connected");
  }
};

export const disconnectRedis = async () => {
  if (redis.quit) {
    await redis.quit();
    logger.info("Redis disconnected");
  }
};
