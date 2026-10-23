import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  deleteBooking
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

export default router;
