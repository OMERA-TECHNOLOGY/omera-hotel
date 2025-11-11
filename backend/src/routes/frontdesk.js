import { Router } from "express";
import { authenticateToken, authorize } from "../middleware/auth.js";
import FrontDeskController from "../controllers/frontdeskController.js";

const router = Router();

router.use(authenticateToken);

// Reception, Manager, Admin can access
router.get(
  "/stats",
  authorize("admin", "manager", "receptionist"),
  FrontDeskController.getStats
);
router.get(
  "/current",
  authorize("admin", "manager", "receptionist"),
  FrontDeskController.getCurrentGuests
);
router.get(
  "/arrivals",
  authorize("admin", "manager", "receptionist"),
  FrontDeskController.getArrivals
);
router.get(
  "/departures",
  authorize("admin", "manager", "receptionist"),
  FrontDeskController.getDepartures
);
router.get(
  "/availability",
  authorize("admin", "manager", "receptionist"),
  FrontDeskController.getAvailability
);

export default router;
