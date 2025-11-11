// src/controllers/settingsController.ts
import SettingsModel from "../models/Settings";
// Plain JS version (removed TS types)

class SettingsController {
  static async createSetting(req, res) {
    try {
      const settingData = {
        ...req.body,
        user_id: req.user && req.user.id,
      };

      const setting = await SettingsModel.create(settingData);
      res.status(201).json({
        message: "Setting created successfully",
        setting,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllSettings(req, res) {
    try {
      const settings = await SettingsModel.getAll();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSettingByKey(req, res) {
    try {
      const { key } = req.params;
      const setting = await SettingsModel.findByKey(key);
      if (!setting) {
        res.status(404).json({ error: "Setting not found" });
        return;
      }
      res.json({ setting });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSetting(req, res) {
    try {
      const setting = await SettingsModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Setting updated successfully",
        setting,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteSetting(req, res) {
    try {
      await SettingsModel.delete(parseInt(req.params.id));
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async upsertSetting(req, res) {
    try {
      const settingData = {
        ...req.body,
        user_id: req.user && req.user.id,
      };

      const setting = await SettingsModel.upsert(settingData);
      res.json({
        message: "Setting upserted successfully",
        setting,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default SettingsController;
