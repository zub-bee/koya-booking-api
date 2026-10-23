import { Router } from "express";
import { getSlots } from "../controllers/slots.controller";

const router = Router();

router.get("/", getSlots);

export default router;
