import { STATUS_CODES, StatusCode } from "../constants/status-codes";
import type { Response } from "express";

type ApiResponseParams<T> = {
  error?: string;
  data?: T | null;
};

export class ApiResponse<T = unknown> {
  public readonly error: string | undefined;
  public readonly data?: T | null;
  public readonly statusCode!: number;

  constructor({ error, data }: ApiResponseParams<T>) {
    this.error = error;
    this.data = data;
  }

  send(res: Response): Response {
    return res.status(this.statusCode).json({
      error: this.error,
      ...(this.data !== undefined && { data: this.data })
    });
  }

  static Success<T>(res: Response, data?: T): Response {
    return new ApiResponse<T>({
      data
    }).send(res);
  }

  static NotFound<T>(res: Response, error: string): Response {
    return new ApiResponse<T>({
      error
    }).send(res);
  }

  static ok<T>(res: Response, data?: T) {
    return ApiResponse.Success(res, data);
  }

  static created<T>(res: Response, data?: T) {
    return ApiResponse.Success(res, data);
  }
}

/*
 * Usage:
 * ApiResponse.ok(res, "OK", data);
 * ApiResponse.created(res, "Created", data);
 */
