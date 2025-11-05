// src/controllers/roomController.ts
const RoomModel = require("../models/Room");
import { Request, Response } from "express";
import { AuthRequest } from "../types";

class RoomController {
  static async createRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const room = await RoomModel.create(req.body);
      res.status(201).json({
        message: "Room created successfully",
        room,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await RoomModel.getAll();
      res.json({ rooms });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const room = await RoomModel.findById(parseInt(req.params.id));
      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }
      res.json({ room });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const room = await RoomModel.update(parseInt(req.params.id), req.body);
      res.json({
        message: "Room updated successfully",
        room,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      await RoomModel.delete(parseInt(req.params.id));
      res.json({ message: "Room deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableRooms(req: Request, res: Response): Promise<void> {
    try {
      const { check_in, check_out } = req.query;

      if (!check_in || !check_out) {
        res
          .status(400)
          .json({ error: "Check-in and check-out dates are required" });
        return;
      }

      const rooms = await RoomModel.getAvailableRooms(
        check_in as string,
        check_out as string
      );
      res.json({ rooms });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RoomController;
