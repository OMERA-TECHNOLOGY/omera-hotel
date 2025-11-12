import { validationResult } from "express-validator";
import RoomsService from "../services/roomsService.js";

class RoomController {
  static async createRoom(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }
      const room = await RoomsService.create(req.body);
      return res.status(201).json({ success: true, data: { room } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllRooms(req, res) {
    try {
      const { limit, offset, status, room_type_id, search } = req.query;
      const parsed = await RoomsService.list({
        limit: Number(limit) || 100,
        offset: Number(offset) || 0,
        status,
        room_type_id,
        search,
      });
      res.json({
        success: true,
        data: { rooms: parsed.rows, total: parsed.total },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getRoomById(req, res) {
    try {
      const room = await RoomsService.find(req.params.id);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, error: "Room not found" });
      }
      res.json({ success: true, data: { room } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateRoom(req, res) {
    try {
      const room = await RoomsService.update(req.params.id, req.body);
      res.json({ success: true, data: { room } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteRoom(req, res) {
    try {
      const deleted = await RoomsService.remove(req.params.id);
      res.json({
        success: true,
        data: { message: "Room deleted successfully", deleted },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAvailableRooms(req, res) {
    try {
      const { check_in, check_out } = req.query;

      if (!check_in || !check_out) {
        return res.status(400).json({
          success: false,
          error: "Check-in and check-out dates are required",
        });
      }
      // Simplified: filter by vacant for now; advanced availability would require complex joins
      const rooms = await RoomsService.list({ status: "vacant" });
      res.json({ success: true, data: { rooms } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default RoomController;
