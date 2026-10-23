import { Request, Response } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { BookingService } from "../services/booking.service";
import { ApiError } from "../utils/api-error";

export const getBookings = AsyncHandler(async (req: Request, res: Response) => {
  const { email, limit, cursor } = req.query;

  if (!email) throw ApiError.badRequest("email is required");

  const parsedLimit = limit !== undefined ? Number(limit) : 10;
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
    throw ApiError.badRequest("limit must be between 1 and 50");
  }

  const result = await BookingService.getAll(
    email as string,
    parsedLimit,
    cursor as string | undefined
  );
  return res.status(200).json(result);
});

export const getBookingById = AsyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.getById(req.params.id as string);
  return res.status(200).json(booking);
});

export const createBooking = AsyncHandler(async (req: Request, res: Response) => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const booking = await BookingService.create(req.body, idempotencyKey);
  return res.status(201).json(booking);
});

export const cancelBooking = AsyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.cancelById(req.params.id as string);
  return res.status(200).json(booking);
});
