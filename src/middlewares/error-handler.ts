import { Request, Response, NextFunction } from "express";
import env from "../configs/env";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode = 500;
  let message = "Internal server error";
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.error;
    if (err.retryAfter !== undefined) {
      res.set("Retry-After", String(err.retryAfter));
    }
  }

  logger.error(
    err,
    `Error: ${message} | Status: ${statusCode} | Path: ${req.method} ${req.originalUrl}`
  );

  const response: Record<string, unknown> = { error: message };
  if (env.NODE_ENV === "development") response.stack = err.stack;

  res.status(statusCode).json(response);
};
