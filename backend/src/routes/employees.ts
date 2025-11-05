// src/routes/employees.ts
const { Router } = require("express");
const EmployeeController = require("../controllers/employeeContoller");
const { authenticateToken, authorize } = require("../middleware/auth");
const { validateEmployee } = require("../middleware/validation");

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

module.exports = router;
