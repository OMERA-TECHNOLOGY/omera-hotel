// src/controllers/restaurantController.ts
const RestaurantModel = require("../models/Restaurant");
import { Response } from "express";
import { AuthRequest } from "../types";

class RestaurantController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await RestaurantModel.create(req.body);
      res.status(201).json({
        message: "Restaurant order created successfully",
        order,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const orders = await RestaurantModel.getAll();
      res.json({ orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await RestaurantModel.findById(parseInt(req.params.id));
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json({ order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const order = await RestaurantModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Order updated successfully",
        order,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      await RestaurantModel.delete(parseInt(req.params.id));
      res.json({ message: "Order deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrdersByBooking(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      const orders = await RestaurantModel.getByBooking(parseInt(bookingId));
      res.json({ orders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRevenueSummary(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        res.status(400).json({ error: "Start date and end date are required" });
        return;
      }

      const revenue = await RestaurantModel.getRevenueByDate(
        start_date as string,
        end_date as string
      );

      res.json({
        start_date,
        end_date,
        total_revenue: revenue,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = RestaurantController;
