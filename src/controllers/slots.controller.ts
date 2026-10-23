import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { BookingService } from "../services/booking.service";

export const getSlots = AsyncHandler(async (_req: Request, res: Response) => {
  const slots = await BookingService.getAll();
  if (slots) {
    return ApiResponse.Success(res, slots);
  } else {
    return ApiResponse.NotFound(res, "no slots were found");
  }
});
