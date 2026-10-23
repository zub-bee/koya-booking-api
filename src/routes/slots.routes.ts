import { Router } from "express";
import { getSlots, replaceSlots } from "../controllers/slots.controller";

const router = Router();

router.get("/slots", getSlots);
router.post("/reset", replaceSlots);

export default router;
