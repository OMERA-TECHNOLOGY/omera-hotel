// src/routes/finance.ts
const Router = require("express");
const FinanceController = require("../controllers/financeController");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = Router();

router.use(authenticateToken);

router.get(
  "/",
  authorize("admin", "manager", "finance"),
  FinanceController.getAllRecords
);
router.get(
  "/category/:category",
  authorize("admin", "manager", "finance"),
  FinanceController.getRecordsByCategory
);
router.get(
  "/:id",
  authorize("admin", "manager", "finance"),
  FinanceController.getRecordById
);
router.post(
  "/",
  authorize("admin", "manager", "finance"),
  FinanceController.createRecord
);
router.put(
  "/:id",
  authorize("admin", "manager", "finance"),
  FinanceController.updateRecord
);
router.delete("/:id", authorize("admin"), FinanceController.deleteRecord);
router.get(
  "/summary/overview",
  authorize("admin", "manager", "finance"),
  FinanceController.getFinancialSummary
);

module.exports = router;
