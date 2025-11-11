// src/routes/employees.ts
import { Router } from "express";
import EmployeeController from "../controllers/employeeContoller";
import { authenticateToken, authorize } from "../middleware/auth";
import { validateEmployee } from "../middleware/validation";

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager"),
  EmployeeController.getAllEmployees
);
router.get(
  "/department/:department",
  authorize("admin", "manager"),
  EmployeeController.getEmployeesByDepartment
);
router.get(
  "/:id",
  authorize("admin", "manager"),
  EmployeeController.getEmployeeById
);
router.post(
  "/",
  authorize("admin"),
  validateEmployee,
  EmployeeController.createEmployee
);
router.put("/:id", authorize("admin"), EmployeeController.updateEmployee);
router.delete("/:id", authorize("admin"), EmployeeController.deleteEmployee);

export default router;
