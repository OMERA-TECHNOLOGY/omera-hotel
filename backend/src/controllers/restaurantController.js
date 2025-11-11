import { validationResult } from "express-validator";
import RestaurantService from "../services/restaurantService.js";

class RestaurantController {
  // Menu Items
  static async listMenuItems(req, res) {
    try {
      const menu = await RestaurantService.listMenuItems(req.query);
      res.json({ success: true, data: { menu } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getMenuItem(req, res) {
    try {
      const item = await RestaurantService.findMenuItem(req.params.id);
      if (!item)
        return res
          .status(404)
          .json({ success: false, error: "Menu item not found" });
      res.json({ success: true, data: { item } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createMenuItem(req, res) {
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
      const item = await RestaurantService.createMenuItem(req.body);
      res.status(201).json({ success: true, data: { item } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateMenuItem(req, res) {
    try {
      const item = await RestaurantService.updateMenuItem(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { item } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteMenuItem(req, res) {
    try {
      await RestaurantService.removeMenuItem(req.params.id);
      res.json({ success: true, data: { message: "Menu item deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Orders
  static async listOrders(req, res) {
    try {
      const orders = await RestaurantService.listOrders(req.query);
      res.json({ success: true, data: { orders } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getOrder(req, res) {
    try {
      const order = await RestaurantService.findOrder(req.params.id);
      if (!order)
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      const items = await RestaurantService.listOrderItems(order.id);
      res.json({ success: true, data: { order, items } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createOrder(req, res) {
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
      const order = await RestaurantService.createOrder(req.body);
      res.status(201).json({ success: true, data: { order } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateOrder(req, res) {
    try {
      const order = await RestaurantService.updateOrder(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { order } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteOrder(req, res) {
    try {
      await RestaurantService.removeOrder(req.params.id);
      res.json({ success: true, data: { message: "Order deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Order Items
  static async listOrderItems(req, res) {
    try {
      const items = await RestaurantService.listOrderItems(req.params.orderId);
      res.json({ success: true, data: { items } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async addOrderItem(req, res) {
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
      const item = await RestaurantService.addOrderItem({
        ...req.body,
        order_id: req.params.orderId,
      });
      res.status(201).json({ success: true, data: { item } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateOrderItem(req, res) {
    try {
      const item = await RestaurantService.updateOrderItem(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { item } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteOrderItem(req, res) {
    try {
      await RestaurantService.removeOrderItem(req.params.id);
      res.json({ success: true, data: { message: "Order item deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}

export default RestaurantController;
