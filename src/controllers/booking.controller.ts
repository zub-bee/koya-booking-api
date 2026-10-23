import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { BookingService } from "../services/booking.service";

export const getBookings = AsyncHandler(async (_req: Request, res: Response) => {
  const bookings = await BookingService.getAll();
  return ApiResponse.Success(res, "Bookings fetched", bookings);
});

export const getBookingById = AsyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.getById(req.params.id as string);
  return ApiResponse.Success(res, "Booking fetched", booking);
});

export const createBooking = AsyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.create(req.body);
  return ApiResponse.Success(res, "Booking created", booking);
});

export const deleteBooking = AsyncHandler(async (req: Request, res: Response) => {
  const booking = await BookingService.deleteById(req.params.id as string);
  return ApiResponse.Success(res, "Booking deleted", booking);
});
