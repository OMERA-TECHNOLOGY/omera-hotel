// src/routes/housekeeping.ts
import { Router } from "express";
import HousekeepingController from "../controllers/houseKeepingController";
import { authenticateToken, authorize } from "../middleware/auth";
import { validateHousekeeping } from "../middleware/validation";

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager", "housekeeping"),
  HousekeepingController.getAllTasks
);
router.get(
  "/status/:status",
  authorize("admin", "manager", "housekeeping"),
  HousekeepingController.getTasksByStatus
);
router.get(
  "/:id",
  authorize("admin", "manager", "housekeeping"),
  HousekeepingController.getTaskById
);
router.post(
  "/",
  authorize("admin", "manager"),
  validateHousekeeping,
  HousekeepingController.createTask
);
router.put(
  "/:id",
  authorize("admin", "manager", "housekeeping"),
  HousekeepingController.updateTask
);
router.delete("/:id", authorize("admin"), HousekeepingController.deleteTask);
router.patch(
  "/:id/complete",
  authorize("admin", "manager", "housekeeping"),
  HousekeepingController.completeTask
);

export default router;
