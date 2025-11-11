// src/controllers/roomController.ts
import RoomModel from "../models/Room";
// Plain JS: removed type-only imports

class RoomController {
  static async createRoom(req, res) {
    try {
      const room = await RoomModel.create(req.body);
      res.status(201).json({
        message: "Room created successfully",
        room,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllRooms(req, res) {
    try {
      const rooms = await RoomModel.getAll();
      res.json({ rooms });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRoomById(req, res) {
    try {
      const room = await RoomModel.findById(parseInt(req.params.id));
      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }
      res.json({ room });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRoom(req, res) {
    try {
      const room = await RoomModel.update(parseInt(req.params.id), req.body);
      res.json({
        message: "Room updated successfully",
        room,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteRoom(req, res) {
    try {
      await RoomModel.delete(parseInt(req.params.id));
      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableRooms(req, res) {
    try {
      const { check_in, check_out } = req.query;

      if (!check_in || !check_out) {
        res
          .status(400)
          .json({ error: "Check-in and check-out dates are required" });
        return;
      }

      const rooms = await RoomModel.getAvailableRooms(
        String(check_in),
        String(check_out)
      );
      res.json({ rooms });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default RoomController;
