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
// Public booking creation: allows creating a booking with either an existing guest_id
// or embedded guest details (first_name, last_name, phone, email). The controller
// will create the guest when guest_id is not provided.
router.post(
  "/",
  [
    // guest_id optional (if provided must be UUID)
    body("guest_id").optional().isUUID(),
    body("room_id").isUUID(),
    body("check_in").isISO8601(),
    body("check_out").isISO8601(),
    body("number_of_guests").optional().isInt({ min: 1 }),
    body("status")
      .optional()
      .isIn(["confirmed", "active", "checking_out", "completed", "cancelled"]),
    body("total_price_birr").isNumeric(),
    body("advance_payment_birr").optional().isNumeric(),
    // optional embedded guest fields
    body("guest.first_name").optional().isString(),
    body("guest.last_name").optional().isString(),
    body("guest.email").optional().isEmail(),
    body("guest.phone").optional().isString(),
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
