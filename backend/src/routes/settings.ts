// src/routes/settings.ts
const { Router } = require("express");
const SettingsController = require("../controllers/settingController");
const { authenticateToken, authorize } = require("../middleware/auth");

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

module.exports = router;
