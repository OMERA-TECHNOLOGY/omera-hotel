// src/controllers/housekeepingController.ts
import HousekeepingModel from "../models/HouseKeeping";
import { Response } from "express";
import { AuthRequest } from "../types";

class HousekeepingController {
  static async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskData = {
        ...req.body,
        date_assigned: new Date().toISOString().split("T")[0],
      };

      const task = await HousekeepingModel.create(taskData);
      res.status(201).json({
        message: "Housekeeping task created successfully",
        task,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tasks = await HousekeepingModel.getAll();
      res.json({ tasks });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const task = await HousekeepingModel.findById(parseInt(req.params.id));
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json({ task });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const task = await HousekeepingModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Task updated successfully",
        task,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      await HousekeepingModel.delete(parseInt(req.params.id));
      res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTasksByStatus(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { status } = req.params;
      const tasks = await HousekeepingModel.getByStatus(status);
      res.json({ tasks });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async completeTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const task = await HousekeepingModel.completeTask(
        parseInt(req.params.id)
      );
      res.json({
        message: "Task completed successfully",
        task,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default HousekeepingController;
