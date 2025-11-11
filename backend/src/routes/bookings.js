import { Router } from "express";
import { body, param, query } from "express-validator";
import BookingController from "../controllers/bookingController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  [query("status").optional().isString()],
  BookingController.getAllBookings
);
router.get("/:id", [param("id").isUUID()], BookingController.getBookingById);
router.post(
  "/",
  authorize("admin", "receptionist", "manager"),
  [
    body("guest_id").isUUID(),
    body("room_id").isUUID(),
    body("check_in").isISO8601(),
    body("check_out").isISO8601(),
    body("number_of_guests").optional().isInt({ min: 1 }),
    body("status")
      .optional()
      .isIn(["confirmed", "active", "checking_out", "completed", "cancelled"]),
    body("total_price_birr").isNumeric(),
    body("advance_payment_birr").optional().isNumeric(),
  ],
  BookingController.createBooking
);
router.put(
  "/:id",
  authorize("admin", "receptionist", "manager"),
  [param("id").isUUID()],
  BookingController.updateBooking
);
router.delete(
  "/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  BookingController.deleteBooking
);
router.post(
  "/:id/check-in",
  authorize("admin", "receptionist"),
  [param("id").isUUID()],
  BookingController.checkIn
);
router.post(
  "/:id/check-out",
  authorize("admin", "receptionist"),
  [param("id").isUUID()],
  BookingController.checkOut
);

export default router;
