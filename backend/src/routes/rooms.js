// src/routes/rooms.ts
import { Router } from "express";
import RoomController from "../controllers/roomController";
import { authenticateToken, authorize } from "../middleware/auth";
import { validateRoom } from "../middleware/validation";

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
  validateRoom,
  RoomController.createRoom
);
router.put(
  "/:id",
  authorize("admin", "receptionist"),
  validateRoom,
  RoomController.updateRoom
);
router.patch(
  "/:id/status",
  authorize("admin", "receptionist"),
  RoomController.updateRoomStatus
);
router.delete("/:id", authorize("admin"), RoomController.deleteRoom);

// Room maintenance routes
router.patch(
  "/:id/maintenance",
  authorize("admin", "receptionist"),
  RoomController.setMaintenance
);
router.patch(
  "/:id/clean",
  authorize("admin", "receptionist"),
  RoomController.markAsClean
);

export default router;
