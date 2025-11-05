// src/routes/rooms.ts
const { Router } = require("express");
const RoomController = require("../controllers/roomController");
const { authenticateToken, authorize } = require("../middleware/auth");
const { validateRoom } = require("../middleware/validation");

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

module.exports = router;
