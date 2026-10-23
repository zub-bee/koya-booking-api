import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { BookingService } from "../services/booking.service";
import { ApiError } from "@/utils/api-error";

export const getBookings = AsyncHandler(
  async (_req: Request, res: Response) => {
    const { email, limit, cursor } = _req.query;
    if (Number(limit) > 50 || Number(limit) < 0) {
      throw ApiError.badRequest();
    }
    /*
      #swagger.description = 'Get bookings'
      #swagger.parameters['email'] = {
        in: 'query',
        required: true,
        type: 'string',
        description: 'Filter by email'
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: '1-50 only'
      }
      #swagger.parameters['cursor'] = {
        in: 'query',
        required: false,
        type: 'string'
      }
      #swagger.responses[200] = {
      description: 'List of slots',
      schema: [{
        id: 'slot-1',
        provider: 'Dr. Smith',
        available: true,
        start: '2026-10-25T09:00:00Z',
        end: '2026-10-25T09:30:00Z'
      }]
    }
  */
    const result = await BookingService.getAll(
      email as string,
      Number(limit) || undefined,
      cursor as string | undefined
    );
    return res.status(200).json(result);
  }
);

export const getBookingById = AsyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingService.getById(req.params.id as string);
    return ApiResponse.Success(res, "booking", booking);
  }
);

export const createBooking = AsyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingService.create(req.body);
    return ApiResponse.Success(res, "bookings", booking);
  }
);

export const cancelBooking = AsyncHandler(
  async (req: Request, res: Response) => {
    const booking = await BookingService.cancelById(req.params.id as string);
    return ApiResponse.Success(res, "bookings", booking);
  }
);
