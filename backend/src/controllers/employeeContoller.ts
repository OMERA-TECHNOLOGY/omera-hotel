// src/controllers/employeeController.ts
const EmployeeModel = require("../models/Employee");
import { Response } from "express";
import { AuthRequest } from "../types";

class EmployeeController {
  static async createEmployee(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employee = await EmployeeModel.create(req.body);
      res.status(201).json({
        message: "Employee created successfully",
        employee,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllEmployees(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employees = await EmployeeModel.getAll();
      res.json({ employees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employee = await EmployeeModel.findById(parseInt(req.params.id));
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json({ employee });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEmployee(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employee = await EmployeeModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Employee updated successfully",
        employee,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteEmployee(req: AuthRequest, res: Response): Promise<void> {
    try {
      await EmployeeModel.delete(parseInt(req.params.id));
      res.json({ message: "Employee deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByDepartment(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { department } = req.params;
      const employees = await EmployeeModel.getByDepartment(department);
      res.json({ employees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EmployeeController;
