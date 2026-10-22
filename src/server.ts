import app from "./app";
import env from "./configs/env";
import { logger } from "./utils/logger";
import { configureGracefulShutdown } from "./utils/shutdown";
import { connectDatabase } from "./configs/database";
import { connectRedis } from "./configs/redis";

const port = env.PORT || 9000;

const start = async () => {
  await connectDatabase();
  logger.info("[server]: Postgres connected");

  await connectRedis();
  logger.info("[server]: Redis connected");

  const server = app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
    logger.info(`[server]: Environment: ${env.NODE_ENV}`);
    logger.info(
      `[server]: Swagger docs are available at http://localhost:${port}/api/docs`
    );
  });

  configureGracefulShutdown(server);
};

start().catch(err => {
  logger.error(err, "[server]: Failed to start");
  process.exit(1);
});
