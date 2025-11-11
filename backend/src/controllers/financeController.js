// src/controllers/financeController.ts
const FinanceModel = require("../models/Finance");
import { Response } from "express";
import { AuthRequest } from "../types";

class FinanceController {
  static async createRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recordData = {
        ...req.body,
        created_by: req.user!.id,
      };

      const record = await FinanceModel.create(recordData);
      res.status(201).json({
        message: "Finance record created successfully",
        record,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      const records = await FinanceModel.getAll();
      res.json({ records });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecordById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const record = await FinanceModel.findById(parseInt(req.params.id));
      if (!record) {
        res.status(404).json({ error: "Record not found" });
        return;
      }
      res.json({ record });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const record = await FinanceModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Finance record updated successfully",
        record,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      await FinanceModel.delete(parseInt(req.params.id));
      res.json({ message: "Finance record deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecordsByCategory(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { category } = req.params;
      const records = await FinanceModel.getByCategory(category);
      res.json({ records });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFinancialSummary(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        res.status(400).json({ error: "Start date and end date are required" });
        return;
      }

      const summary = await FinanceModel.getFinancialSummary(
        start_date as string,
        end_date as string
      );

      res.json({
        start_date,
        end_date,
        ...summary,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FinanceController;
