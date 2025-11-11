// src/routes/settings.ts
import { Router } from "express";
import SettingsController from "../controllers/settingController";
import { authenticateToken, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager"),
  SettingsController.getAllSettings
);
router.get("/:key", SettingsController.getSettingByKey);
router.post("/", authorize("admin"), SettingsController.createSetting);
router.put("/:id", authorize("admin"), SettingsController.updateSetting);
router.delete("/:id", authorize("admin"), SettingsController.deleteSetting);
router.post("/upsert", authorize("admin"), SettingsController.upsertSetting);

export default router;
