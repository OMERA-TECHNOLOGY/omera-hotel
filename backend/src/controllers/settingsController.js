import { validationResult } from "express-validator";
import SettingsService from "../services/settingsService.js";

class SettingsController {
  static async get(req, res) {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ success: true, data: { settings } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
          });
      const updated = await SettingsService.updateSettings(req.body);
      res.json({ success: true, data: { settings: updated } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
export default SettingsController;
