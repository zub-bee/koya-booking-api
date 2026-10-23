import { Request, Response } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { SlotService } from "../services/slot.service";

export const getSlots = AsyncHandler(async (req: Request, res: Response) => {
  /*
    #swagger.description = 'List all slots, earliest start first'
    #swagger.parameters['provider'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: 'Filter by provider (exact match)'
    }
    #swagger.responses[200] = {
      description: 'The slots',
      schema: {
        slots: [
          {
            id: 's1',
            provider: 'Dr Ade',
            available: true,
            start: '2026-12-10T09:00:00Z',
            end: '2026-12-10T09:30:00Z'
          }
        ]
      }
    }
  */
  const provider = req.query.provider as string | undefined;
  const slots = await SlotService.getAll(provider);
  return res.status(200).json({ slots });
});

export const replaceSlots = AsyncHandler(async (req: Request, res: Response) => {
  /*
    #swagger.description = 'Replace all slots. Deletes every booking and replaces all slots with the ones sent.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        slots: [
          {
            id: 's1',
            provider: 'Dr Ade',
            start: '2026-12-10T09:00:00Z',
            end: '2026-12-10T09:30:00Z'
          }
        ]
      }
    }
    #swagger.responses[200] = {
      description: 'Done',
      schema: {
        slots: [
          {
            id: 's1',
            provider: 'Dr Ade',
            available: true,
            start: '2026-12-10T09:00:00Z',
            end: '2026-12-10T09:30:00Z'
          }
        ]
      }
    }
  */
  const replaced = await SlotService.replaceAll(req.body.slots);
  return res.status(200).json({ slots: replaced });
});
