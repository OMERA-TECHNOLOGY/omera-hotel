import { validationResult } from "express-validator";
import FinanceService from "../services/financeService.js";

class FinanceController {
  static async listInvoices(req, res) {
    try {
      const invoices = await FinanceService.listInvoices(req.query);
      res.json({ success: true, data: { invoices } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getInvoice(req, res) {
    try {
      const invoice = await FinanceService.findInvoice(req.params.id);
      if (!invoice)
        return res
          .status(404)
          .json({ success: false, error: "Invoice not found" });
      res.json({ success: true, data: { invoice } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createInvoice(req, res) {
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
      const invoice = await FinanceService.createInvoice(req.body);
      res.status(201).json({ success: true, data: { invoice } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateInvoice(req, res) {
    try {
      const invoice = await FinanceService.updateInvoice(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { invoice } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteInvoice(req, res) {
    try {
      await FinanceService.removeInvoice(req.params.id);
      res.json({ success: true, data: { message: "Invoice deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async listPayments(req, res) {
    try {
      const payments = await FinanceService.listPayments(req.query);
      res.json({ success: true, data: { payments } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getPayment(req, res) {
    try {
      const payment = await FinanceService.findPayment(req.params.id);
      if (!payment)
        return res
          .status(404)
          .json({ success: false, error: "Payment not found" });
      res.json({ success: true, data: { payment } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createPayment(req, res) {
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
      const payment = await FinanceService.createPayment(req.body);
      res.status(201).json({ success: true, data: { payment } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updatePayment(req, res) {
    try {
      const payment = await FinanceService.updatePayment(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { payment } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deletePayment(req, res) {
    try {
      await FinanceService.removePayment(req.params.id);
      res.json({ success: true, data: { message: "Payment deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async listExpenses(req, res) {
    try {
      const expenses = await FinanceService.listExpenses(req.query);
      res.json({ success: true, data: { expenses } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async getExpense(req, res) {
    try {
      const expense = await FinanceService.findExpense(req.params.id);
      if (!expense)
        return res
          .status(404)
          .json({ success: false, error: "Expense not found" });
      res.json({ success: true, data: { expense } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async createExpense(req, res) {
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
      const expense = await FinanceService.createExpense(req.body);
      res.status(201).json({ success: true, data: { expense } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async updateExpense(req, res) {
    try {
      const expense = await FinanceService.updateExpense(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: { expense } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
  static async deleteExpense(req, res) {
    try {
      await FinanceService.removeExpense(req.params.id);
      res.json({ success: true, data: { message: "Expense deleted" } });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
export default FinanceController;
