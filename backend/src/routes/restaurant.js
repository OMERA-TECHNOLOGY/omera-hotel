// src/routes/restaurant.ts
const { Router } = require("express");
const RestaurantController = require("../controllers/restaurantController");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager", "receptionist"),
  RestaurantController.getAllOrders
);
router.get(
  "/booking/:bookingId",
  authorize("admin", "manager", "receptionist"),
  RestaurantController.getOrdersByBooking
);
router.get(
  "/:id",
  authorize("admin", "manager", "receptionist"),
  RestaurantController.getOrderById
);
router.post(
  "/",
  authorize("admin", "manager", "receptionist"),
  RestaurantController.createOrder
);
router.put(
  "/:id",
  authorize("admin", "manager", "receptionist"),
  RestaurantController.updateOrder
);
router.delete("/:id", authorize("admin"), RestaurantController.deleteOrder);
router.get(
  "/revenue/summary",
  authorize("admin", "manager"),
  RestaurantController.getRevenueSummary
);

module.exports = router;
