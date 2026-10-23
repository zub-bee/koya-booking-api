import { STATUS_CODES, StatusCode } from "../constants/status-codes";
import type { Response } from "express";

type ApiResponseParams<T> = {
  error?: string;
  data?: T | null;
};

export class ApiResponse<T = unknown> {
  public readonly error: string | undefined;
  public readonly data?: T | null;

  constructor({ error, data }: ApiResponseParams<T>) {
    this.error = error;
    this.data = data;
  }

  send(res: Response, statusCode: number, dataName?: string): Response {
    return res.status(statusCode).json({
      error: this.error,
      ...(this.data !== undefined && dataName && { [dataName]: this.data })
    });
  }

  static Success<T>(res: Response, dataName: string, data?: T): Response {
    return new ApiResponse<T>({
      data
    }).send(res, STATUS_CODES.OK, dataName);
  }

  static ok<T>(res: Response, data?: T) {
    return ApiResponse.Success(res, "data", data);
  }

  static created<T>(res: Response, data?: T) {
    return ApiResponse.Success(res, "data", data);
  }
}

/*
 * Usage:
 * ApiResponse.ok(res, "OK", data);
 * ApiResponse.created(res, "Created", data);
 */
