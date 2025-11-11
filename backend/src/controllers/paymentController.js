// src/controllers/paymentController.ts
const PaymentModel = require("../models/Payment");
import { Response } from "express";
import { AuthRequest } from "../types";

class PaymentController {
  static async createPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const payment = await PaymentModel.create(req.body);
      res.status(201).json({
        message: "Payment created successfully",
        payment,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const payments = await PaymentModel.getAll();
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const payment = await PaymentModel.findById(parseInt(req.params.id));
      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json({ payment });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const payment = await PaymentModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Payment updated successfully",
        payment,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      await PaymentModel.delete(parseInt(req.params.id));
      res.json({ message: "Payment deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentsByBooking(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { bookingId } = req.params;
      const payments = await PaymentModel.getByBooking(parseInt(bookingId));
      res.json({ payments });
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

      const revenue = await PaymentModel.getTotalRevenue(
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

module.exports = PaymentController;