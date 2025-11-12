import { Router } from "express";
import RoomTypesController from "../controllers/roomTypesController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

// GET /api/room_types
router.get("/", RoomTypesController.list);
router.get("/:id", RoomTypesController.getById);

export default router;
