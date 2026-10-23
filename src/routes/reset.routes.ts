import { Router } from "express";
import { replaceSlots } from "../controllers/slots.controller";

const router = Router();

router.post("/", replaceSlots);

export default router;
