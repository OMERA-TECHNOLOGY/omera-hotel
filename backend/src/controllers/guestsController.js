import { validationResult } from "express-validator";
import GuestsService from "../services/guestsService.js";

class GuestsController {
  static async createGuest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
          });
      }
      const guest = await GuestsService.create(req.body);
      res.status(201).json({ success: true, data: { guest } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async listGuests(_req, res) {
    try {
      const guests = await GuestsService.list();
      res.json({ success: true, data: { guests } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getGuestById(req, res) {
    try {
      const guest = await GuestsService.find(req.params.id);
      if (!guest)
        return res
          .status(404)
          .json({ success: false, error: "Guest not found" });
      res.json({ success: true, data: { guest } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateGuest(req, res) {
    try {
      const guest = await GuestsService.update(req.params.id, req.body);
      res.json({ success: true, data: { guest } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteGuest(req, res) {
    try {
      await GuestsService.remove(req.params.id);
      res.json({ success: true, data: { message: "Guest deleted" } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default GuestsController;
