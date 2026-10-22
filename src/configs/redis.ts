import Redis from "ioredis";
import env from "./env";
import { logger } from "../utils/logger";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true
});

redis.on("error", err => {
  logger.error(err, "Redis error");
});

export const connectRedis = async () => {
  await redis.connect();
  logger.info("Redis connected");
};

export const disconnectRedis = async () => {
  await redis.quit();
  logger.info("Redis disconnected");
};
