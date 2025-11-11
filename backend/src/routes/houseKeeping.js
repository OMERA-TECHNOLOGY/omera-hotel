import { Router } from "express";
import { body, param } from "express-validator";
import HousekeepingController from "../controllers/houseKeepingController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

// Room Maintenance
router.get(
  "/maintenance",
  authorize("admin", "manager", "housekeeper", "receptionist"),
  HousekeepingController.listMaintenance
);
router.get(
  "/maintenance/:id",
  authorize("admin", "manager", "housekeeper", "receptionist"),
  [param("id").isUUID()],
  HousekeepingController.getMaintenance
);
router.post(
  "/maintenance",
  authorize("admin", "manager"),
  [
    body("room_id").isUUID(),
    body("type").isIn([
      "cleaning",
      "maintenance",
      "repair",
      "inspection",
      "deep_clean",
    ]),
    body("title").isString(),
    body("scheduled_date").isISO8601(),
    body("status")
      .optional()
      .isIn(["scheduled", "in_progress", "completed", "cancelled", "delayed"]),
  ],
  HousekeepingController.createMaintenance
);
router.put(
  "/maintenance/:id",
  authorize("admin", "manager", "housekeeper"),
  [param("id").isUUID()],
  HousekeepingController.updateMaintenance
);
router.delete(
  "/maintenance/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  HousekeepingController.deleteMaintenance
);

// Special Requests
router.get(
  "/requests",
  authorize("admin", "manager", "housekeeper", "receptionist"),
  HousekeepingController.listRequests
);
router.get(
  "/requests/:id",
  authorize("admin", "manager", "housekeeper", "receptionist"),
  [param("id").isUUID()],
  HousekeepingController.getRequest
);
router.post(
  "/requests",
  authorize("admin", "manager", "receptionist"),
  [
    body("booking_id").isUUID(),
    body("request_type").isString(),
    body("details").isString(),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    body("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
  ],
  HousekeepingController.createRequest
);
router.put(
  "/requests/:id",
  authorize("admin", "manager", "housekeeper", "receptionist"),
  [param("id").isUUID()],
  HousekeepingController.updateRequest
);
router.delete(
  "/requests/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  HousekeepingController.deleteRequest
);

export default router;
