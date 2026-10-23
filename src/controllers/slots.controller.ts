import { Request, Response } from "express";
import { AsyncHandler } from "../utils/async-handler";
import { SlotService } from "../services/slot.service";

export const getSlots = AsyncHandler(async (req: Request, res: Response) => {
  const provider = req.query.provider as string | undefined;
  const slots = await SlotService.getAll(provider);
  return res.status(200).json({ slots });
});

export const replaceSlots = AsyncHandler(async (req: Request, res: Response) => {
  const replaced = await SlotService.replaceAll(req.body.slots);
  return res.status(200).json({ slots: replaced });
});
