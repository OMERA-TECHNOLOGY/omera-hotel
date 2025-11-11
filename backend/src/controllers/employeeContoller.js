import { validationResult } from "express-validator";
import EmployeesService from "../services/employeesService.js";

class EmployeeController {
  static async createEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Validation failed",
            details: errors.array(),
          });
      }
      const employee = await EmployeesService.create(req.body);
      res.status(201).json({ success: true, data: { employee } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllEmployees(req, res) {
    try {
      const employees = await EmployeesService.list();
      res.json({ success: true, data: { employees } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getEmployeeById(req, res) {
    try {
      const employee = await EmployeesService.find(req.params.id);
      if (!employee) {
        return res
          .status(404)
          .json({ success: false, error: "Employee not found" });
      }
      res.json({ success: true, data: { employee } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const employee = await EmployeesService.update(req.params.id, req.body);
      res.json({ success: true, data: { employee } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteEmployee(req, res) {
    try {
      await EmployeesService.remove(req.params.id);
      res.json({
        success: true,
        data: { message: "Employee deleted successfully" },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getEmployeesByDepartment(req, res) {
    try {
      const { department } = req.params;
      const employees = await EmployeesService.list({ department });
      res.json({ success: true, data: { employees } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default EmployeeController;
