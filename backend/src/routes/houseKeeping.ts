// src/routes/housekeeping.ts
const { Router } = require("express");
const HousekeepingController = require("../controllers/houseKeepingController");
const { authenticateToken, authorize } = require("../middleware/auth");
const { validateHousekeeping } = require("../middleware/validation");

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

module.exports = router;
