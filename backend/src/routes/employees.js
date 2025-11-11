import { Router } from "express";
import { body, param } from "express-validator";
import EmployeeController from "../controllers/employeeContoller.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

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
  [
    body("first_name").isString().isLength({ min: 2 }),
    body("last_name").isString().isLength({ min: 2 }),
    body("email").isEmail(),
    body("phone").isString().isLength({ min: 7 }),
    body("role").isString(),
    body("department").isString(),
  ],
  EmployeeController.createEmployee
);
router.put(
  "/:id",
  authorize("admin"),
  [param("id").isUUID()],
  EmployeeController.updateEmployee
);
router.delete(
  ":id",
  authorize("admin"),
  [param("id").isUUID()],
  EmployeeController.deleteEmployee
);

export default router;
