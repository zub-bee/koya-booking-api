import { STATUS_CODES, StatusCode } from "../constants/status-codes";

export class ApiError extends Error {
  public readonly statusCode: StatusCode;
  public readonly error: string;
  public readonly retryAfter?: number;

  constructor(statusCode: StatusCode, error: string, retryAfter?: number) {
    super(error);
    this.statusCode = statusCode;
    this.error = error;
    this.retryAfter = retryAfter;
  }

  static badRequest(error = "Bad Request") {
    return new ApiError(STATUS_CODES.BAD_REQUEST, error);
  }

  static unauthorized(error = "Unauthorized") {
    return new ApiError(STATUS_CODES.UNAUTHORIZED, error);
  }

  static forbidden(error = "Forbidden") {
    return new ApiError(STATUS_CODES.FORBIDDEN, error);
  }

  static notFound(error = "Not Found") {
    return new ApiError(STATUS_CODES.NOT_FOUND, error);
  }

  static conflict(error = "Conflict") {
    return new ApiError(STATUS_CODES.CONFLICT, error);
  }

  static unprocessable(error = "Unprocessable Entity") {
    return new ApiError(STATUS_CODES.UNPROCESSABLE_ENTITY, error);
  }

  static validation(error = "Validation failed") {
    return new ApiError(STATUS_CODES.BAD_REQUEST, error);
  }

  static tooManyRequests(error = "Too Many Requests", retryAfter?: number) {
    return new ApiError(STATUS_CODES.TOO_MANY_REQUESTS, error, retryAfter);
  }

  static notImplemented(error = "Not Implemented") {
    return new ApiError(STATUS_CODES.NOT_IMPLEMENTED, error);
  }

  static badGateway(error = "Bad Gateway") {
    return new ApiError(STATUS_CODES.BAD_GATEWAY, error);
  }

  static serviceUnavailable(error = "Service Unavailable") {
    return new ApiError(STATUS_CODES.SERVICE_UNAVAILABLE, error);
  }

  static server(error = "Internal Server Error") {
    return new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, error);
  }
}
