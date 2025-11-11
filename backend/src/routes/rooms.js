import { Router } from "express";
import { body, param } from "express-validator";
import RoomController from "../controllers/roomController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

// Public routes (authenticated users)
router.get("/", RoomController.getAllRooms);
router.get("/available", RoomController.getAvailableRooms);
router.get("/:id", RoomController.getRoomById);

// Admin/Receptionist only routes
router.post(
  "/",
  authorize("admin", "receptionist"),
  [
    body("room_number").isString(),
    body("room_type_id").isString().isUUID(),
    body("floor").isInt(),
    body("status")
      .optional()
      .isIn(["vacant", "occupied", "cleaning", "maintenance"]),
    body("base_price_birr").isNumeric(),
  ],
  RoomController.createRoom
);
router.put(
  "/:id",
  authorize("admin", "receptionist"),
  [param("id").isString().isUUID()],
  RoomController.updateRoom
);
router.delete("/:id", authorize("admin"), RoomController.deleteRoom);

export default router;
