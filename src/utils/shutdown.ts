import { Server } from "http";
import { logger } from "./logger";
import { disconnectDatabase } from "../configs/database";
import { disconnectRedis } from "../configs/redis";

export const configureGracefulShutdown = (server: Server) => {
  const signals = ["SIGTERM", "SIGINT"];

  signals.forEach(signal => {
    process.on(signal, () => {
      logger.info(`\n${signal} signal received. Shutting down gracefully...`);

      server.close(async err => {
        if (err) {
          logger.error(err, "Error during server close");
          process.exit(1);
        }

        logger.info("HTTP server closed.");

        try {
          await Promise.all([disconnectDatabase(), disconnectRedis()]);
          logger.info("All connections closed.");
          process.exit(0);
        } catch (closeErr) {
          logger.error(closeErr, "Error closing connections");
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    });
  });
};
