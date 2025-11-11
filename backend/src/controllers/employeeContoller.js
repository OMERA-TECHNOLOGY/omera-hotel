// src/controllers/employeeController.ts
import EmployeeModel from "../models/Employee";
// Plain JS: removed type-only imports

class EmployeeController {
  static async createEmployee(req, res) {
    try {
      const employee = await EmployeeModel.create(req.body);
      res.status(201).json({
        message: "Employee created successfully",
        employee,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllEmployees(req, res) {
    try {
      const employees = await EmployeeModel.getAll();
      res.json({ employees });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeById(req, res) {
    try {
      const employee = await EmployeeModel.findById(parseInt(req.params.id));
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json({ employee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEmployee(req, res) {
    try {
      const employee = await EmployeeModel.update(
        parseInt(req.params.id),
        req.body
      );
      res.json({
        message: "Employee updated successfully",
        employee,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteEmployee(req, res) {
    try {
      await EmployeeModel.delete(parseInt(req.params.id));
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByDepartment(req, res) {
    try {
      const { department } = req.params;
      const employees = await EmployeeModel.getByDepartment(department);
      res.json({ employees });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default EmployeeController;
