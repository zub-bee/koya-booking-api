import { Request, Response, NextFunction } from "express";
import env from "../configs/env";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers["x-api-key"];
  if (!key || key !== env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
