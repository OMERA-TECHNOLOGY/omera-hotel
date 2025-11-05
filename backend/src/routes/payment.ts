// src/routes/payments.ts
const { Router } = require("express");
const PaymentController = require("../controllers/paymentController");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager", "finance"),
  PaymentController.getAllPayments
);
router.get(
  "/booking/:bookingId",
  authorize("admin", "manager", "finance"),
  PaymentController.getPaymentsByBooking
);
router.get(
  "/:id",
  authorize("admin", "manager", "finance"),
  PaymentController.getPaymentById
);
router.post(
  "/",
  authorize("admin", "manager", "finance"),
  PaymentController.createPayment
);
router.put(
  "/:id",
  authorize("admin", "manager", "finance"),
  PaymentController.updatePayment
);
router.delete("/:id", authorize("admin"), PaymentController.deletePayment);
router.get(
  "/revenue/summary",
  authorize("admin", "manager", "finance"),
  PaymentController.getRevenueSummary
);

module.exports = router;
