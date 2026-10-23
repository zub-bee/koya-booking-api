import { Request, Response } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { BookingService } from "../services/booking.service";
import { ApiError } from "../utils/api-error";

export const getBookings = AsyncHandler(async (req: Request, res: Response) => {
  /*
    #swagger.description = "List a person's bookings, oldest first. Email match is case-insensitive."
    #swagger.parameters['email'] = {
      in: 'query',
      required: true,
      type: 'string',
      description: 'Email address of the person'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: '1 to 50. Defaults to 10.'
    }
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Pagination cursor from previous response next_cursor'
    }
    #swagger.responses[200] = {
      description: 'A page of bookings',
      schema: {
        bookings: [
          {
            id: 'string',
            slot_id: 's1',
            name: 'Ada Obi',
            email: 'ada@example.com',
            status: 'confirmed',
            created_at: '2026-10-23T03:19:47.580Z'
          }
        ],
        next_cursor: 'string'
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid limit',
      schema: { error: 'limit must be between 1 and 50' }
    }
  */
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
  /*
    #swagger.description = 'Get a single booking by ID'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'The booking',
      schema: {
        id: 'string',
        slot_id: 's1',
        name: 'Ada Obi',
        email: 'ada@example.com',
        status: 'confirmed',
        created_at: '2026-10-23T03:19:47.580Z'
      }
    }
    #swagger.responses[404] = {
      description: 'Booking not found',
      schema: { error: 'booking not found' }
    }
  */
  const booking = await BookingService.getById(req.params.id as string);
  return res.status(200).json(booking);
});

export const createBooking = AsyncHandler(async (req: Request, res: Response) => {
  /*
    #swagger.description = 'Book a slot'
    #swagger.parameters['Idempotency-Key'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Optional. Same key + same body returns the same booking without creating a duplicate.'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        slot_id: 's1',
        name: 'Ada Obi',
        email: 'ada@example.com'
      }
    }
    #swagger.responses[201] = {
      description: 'Booking created',
      schema: {
        id: 'string',
        slot_id: 's1',
        name: 'Ada Obi',
        email: 'ada@example.com',
        status: 'confirmed',
        created_at: '2026-10-23T03:19:47.580Z'
      }
    }
    #swagger.responses[400] = {
      description: 'Missing or invalid field, or slot has already started',
      schema: { error: 'slot_id is required' }
    }
    #swagger.responses[404] = {
      description: 'Slot not found',
      schema: { error: 'slot not found' }
    }
    #swagger.responses[409] = {
      description: 'Slot already booked',
      schema: { error: 'slot not available' }
    }
    #swagger.responses[422] = {
      description: 'Idempotency key reused with different body',
      schema: { error: 'idempotency key reused with different body' }
    }
    #swagger.responses[429] = {
      description: 'Too many attempts for this email',
      schema: { error: 'too many attempts' }
    }
  */
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;
  const booking = await BookingService.create(req.body, idempotencyKey);
  return res.status(201).json(booking);
});

export const cancelBooking = AsyncHandler(async (req: Request, res: Response) => {
  /*
    #swagger.description = 'Cancel a booking. Sets status to cancelled and frees the slot.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'The cancelled booking',
      schema: {
        id: 'string',
        slot_id: 's1',
        name: 'Ada Obi',
        email: 'ada@example.com',
        status: 'cancelled',
        created_at: '2026-10-23T03:19:47.580Z'
      }
    }
    #swagger.responses[404] = {
      description: 'Booking not found',
      schema: { error: 'booking not found' }
    }
    #swagger.responses[409] = {
      description: 'Already cancelled',
      schema: { error: 'already cancelled' }
    }
  */
  const booking = await BookingService.cancelById(req.params.id as string);
  return res.status(200).json(booking);
});
