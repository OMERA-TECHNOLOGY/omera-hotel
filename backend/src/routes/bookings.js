// src/routes/bookings.ts
import { Router } from "express";
import BookingController from "../controllers/bookingController";
import { authenticateToken, authorize } from "../middleware/auth";
import { validateBooking } from "../middleware/validation";

const router = Router();

router.use(authenticateToken);

router.get("/", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.post(
  "/",
  authorize("admin", "receptionist"),
  validateBooking,
  BookingController.createBooking
);
router.put(
  "/:id",
  authorize("admin", "receptionist"),
  BookingController.updateBooking
);
router.delete("/:id", authorize("admin"), BookingController.deleteBooking);
router.patch(
  "/:id/check-in",
  authorize("admin", "receptionist"),
  BookingController.checkIn
);
router.patch(
  "/:id/check-out",
  authorize("admin", "receptionist"),
  BookingController.checkOut
);

export default router;
