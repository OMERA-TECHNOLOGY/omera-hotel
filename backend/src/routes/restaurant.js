import { Router } from "express";
import { body, param } from "express-validator";
import RestaurantController from "../controllers/restaurantController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

// Menu
router.get(
  "/menu",
  authorize("admin", "manager", "chef", "waiter", "cashier"),
  RestaurantController.listMenuItems
);
router.get(
  "/menu/:id",
  authorize("admin", "manager", "chef", "waiter", "cashier"),
  [param("id").isUUID()],
  RestaurantController.getMenuItem
);
router.post(
  "/menu",
  authorize("admin", "manager", "chef"),
  [
    body("name_english").isString(),
    body("category").optional().isString(),
    body("price_birr").isNumeric(),
    body("description_english").optional().isString(),
    body("is_available").optional().isBoolean(),
  ],
  RestaurantController.createMenuItem
);
router.put(
  "/menu/:id",
  authorize("admin", "manager", "chef"),
  [param("id").isUUID()],
  RestaurantController.updateMenuItem
);
router.delete(
  "/menu/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  RestaurantController.deleteMenuItem
);

// Orders
router.get(
  "/orders",
  authorize("admin", "manager", "receptionist", "chef", "waiter"),
  RestaurantController.listOrders
);
router.get(
  "/orders/:id",
  authorize("admin", "manager", "receptionist", "chef", "waiter"),
  [param("id").isUUID()],
  RestaurantController.getOrder
);
router.post(
  "/orders",
  authorize("admin", "manager", "receptionist", "waiter"),
  [
    body("order_number").isString(),
    body("total_amount_birr").isNumeric(),
    body("status")
      .optional()
      .isIn(["received", "preparing", "ready", "delivered"]),
  ],
  RestaurantController.createOrder
);
router.put(
  "/orders/:id",
  authorize("admin", "manager", "receptionist", "chef", "waiter"),
  [param("id").isUUID()],
  RestaurantController.updateOrder
);
router.delete(
  "/orders/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  RestaurantController.deleteOrder
);

// Order Items
router.get(
  "/orders/:orderId/items",
  authorize("admin", "manager", "receptionist", "chef", "waiter"),
  [param("orderId").isUUID()],
  RestaurantController.listOrderItems
);
router.post(
  "/orders/:orderId/items",
  authorize("admin", "manager", "receptionist", "chef", "waiter"),
  [
    param("orderId").isUUID(),
    body("menu_item_id").isUUID(),
    body("quantity").isInt({ min: 1 }),
    body("unit_price").isNumeric(),
    body("special_instructions").optional().isString(),
  ],
  RestaurantController.addOrderItem
);
router.put(
  "/order-items/:id",
  authorize("admin", "manager", "chef", "waiter"),
  [param("id").isUUID()],
  RestaurantController.updateOrderItem
);
router.delete(
  "/order-items/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  RestaurantController.deleteOrderItem
);

export default router;
