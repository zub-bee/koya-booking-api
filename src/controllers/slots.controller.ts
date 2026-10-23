import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { SlotService } from "../services/slot.service";
import { ApiError } from "@/utils/api-error";

export const getSlots = AsyncHandler(async (_req: Request, res: Response) => {
  /*
      #swagger.description = 'Get all slots'
      #swagger.parameters['provider'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter by provider name'
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
  const slots = await SlotService.getAll();
  if (slots) {
    return ApiResponse.Success(res, "slots", slots);
  } else {
    throw ApiError.notFound();
  }
});

export const replaceSlots = AsyncHandler(
  async (req: Request, res: Response) => {
    /*
      #swagger.description = 'Replace all slots'
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
        "slots" : [
            {
              id: 'slot-1',
              provider: 'Dr. Smith',
              available: true,
              start: '2026-10-25T09:00:00Z',
              end: '2026-10-25T09:30:00Z'
            }
          ]
        }
      }
    */
    const updatedSlots = await SlotService.replaceAll(req.body.slots);
    return ApiResponse.Success(res, "slots", updatedSlots);
  }
);
