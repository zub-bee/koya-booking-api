import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.delete("/:id", cancelBooking);

export default router;
