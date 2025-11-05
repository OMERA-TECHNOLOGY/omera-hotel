// src/controllers/settingsController.ts
const SettingsModel = require("../models/Settings");
import { Response } from "express";
import { AuthRequest } from "../types";

class SettingsController {
  static async createSetting(req: AuthRequest, res: Response): Promise<void> {
    try {
      const settingData = {
        ...req.body,
        user_id: req.user!.id,
      };

      const setting = await SettingsModel.create(settingData);
      res.status(201).json({
        message: "Setting created successfully",
        setting,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllSettings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const settings = await SettingsModel.getAll();
      res.json({ settings });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSettingByKey(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const setting = await SettingsModel.findByKey(key);
      if (!setting) {
        res.status(404).json({ error: "Setting not found" });
        return;
      }
      res.json({ setting });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSetting(req: AuthRequest, res: Response): Promise<void> {
    try {
      const setting = await SettingsModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Setting updated successfully",
        setting,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteSetting(req: AuthRequest, res: Response): Promise<void> {
    try {
      await SettingsModel.delete(parseInt(req.params.id));
      res.json({ message: "Setting deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async upsertSetting(req: AuthRequest, res: Response): Promise<void> {
    try {
      const settingData = {
        ...req.body,
        user_id: req.user!.id,
      };

      const setting = await SettingsModel.upsert(settingData);
      res.json({
        message: "Setting upserted successfully",
        setting,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SettingsController;
