import { Router } from "express";
import ActivityController from "../controllers/activityController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", authorize("admin", "manager"), ActivityController.getAll);

export default router;
