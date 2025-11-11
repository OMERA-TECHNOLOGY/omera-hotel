import { validationResult } from "express-validator";
import HousekeepingService from "../services/housekeepingService.js";

class HousekeepingController {
  // Maintenance
  static async listMaintenance(req, res) {
    try {
      const tasks = await HousekeepingService.listMaintenance(req.query);
      res.json({ success: true, data: { tasks } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getMaintenance(req, res) {
    try {
      const task = await HousekeepingService.findMaintenance(req.params.id);
      if (!task)
        return res
          .status(404)
          .json({ success: false, error: "Task not found" });
      res.json({ success: true, data: { task } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createMaintenance(req, res) {
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
      const task = await HousekeepingService.createMaintenance(req.body);
      res.status(201).json({ success: true, data: { task } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateMaintenance(req, res) {
    try {
      const task = await HousekeepingService.updateMaintenance(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { task } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteMaintenance(req, res) {
    try {
      await HousekeepingService.removeMaintenance(req.params.id);
      res.json({ success: true, data: { message: "Task deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Special requests
  static async listRequests(req, res) {
    try {
      const requests = await HousekeepingService.listRequests(req.query);
      res.json({ success: true, data: { requests } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getRequest(req, res) {
    try {
      const request = await HousekeepingService.findRequest(req.params.id);
      if (!request)
        return res
          .status(404)
          .json({ success: false, error: "Request not found" });
      res.json({ success: true, data: { request } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createRequest(req, res) {
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
      const request = await HousekeepingService.createRequest(req.body);
      res.status(201).json({ success: true, data: { request } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateRequest(req, res) {
    try {
      const request = await HousekeepingService.updateRequest(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { request } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteRequest(req, res) {
    try {
      await HousekeepingService.removeRequest(req.params.id);
      res.json({ success: true, data: { message: "Request deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}

export default HousekeepingController;
