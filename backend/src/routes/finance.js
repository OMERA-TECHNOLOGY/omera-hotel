import { Router } from "express";
import { body, param } from "express-validator";
import FinanceController from "../controllers/financeController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

// Invoices
router.get(
  "/invoices",
  authorize("admin", "manager", "cashier"),
  FinanceController.listInvoices
);
router.get(
  "/invoices/:id",
  authorize("admin", "manager", "cashier"),
  [param("id").isUUID()],
  FinanceController.getInvoice
);
router.post(
  "/invoices",
  authorize("admin", "manager", "cashier"),
  [
    body("invoice_number").isString(),
    body("booking_id").optional().isUUID(),
    body("subtotal_birr").isNumeric(),
    body("vat_amount_birr").isNumeric(),
    body("total_amount_birr").isNumeric(),
    body("payment_status")
      .optional()
      .isIn([
        "unpaid",
        "partially_paid",
        "paid",
        "overpaid",
        "cancelled",
        "refund_pending",
      ]),
  ],
  FinanceController.createInvoice
);
router.put(
  "/invoices/:id",
  authorize("admin", "manager", "cashier"),
  [param("id").isUUID()],
  FinanceController.updateInvoice
);
router.delete(
  "/invoices/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  FinanceController.deleteInvoice
);

// Payments
router.get(
  "/payments",
  authorize("admin", "manager", "cashier"),
  FinanceController.listPayments
);
router.get(
  "/payments/:id",
  authorize("admin", "manager", "cashier"),
  [param("id").isUUID()],
  FinanceController.getPayment
);
router.post(
  "/payments",
  authorize("admin", "manager", "cashier"),
  [
    body("invoice_id").optional().isUUID(),
    body("booking_id").optional().isUUID(),
    body("amount_birr").isNumeric(),
    body("payment_method").isString(),
    body("payment_status")
      .optional()
      .isIn([
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
        "on_hold",
      ]),
  ],
  FinanceController.createPayment
);
router.put(
  "/payments/:id",
  authorize("admin", "manager", "cashier"),
  [param("id").isUUID()],
  FinanceController.updatePayment
);
router.delete(
  "/payments/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  FinanceController.deletePayment
);

// Expenses
router.get(
  "/expenses",
  authorize("admin", "manager", "cashier"),
  FinanceController.listExpenses
);
router.get(
  "/expenses/:id",
  authorize("admin", "manager", "cashier"),
  [param("id").isUUID()],
  FinanceController.getExpense
);
router.post(
  "/expenses",
  authorize("admin", "manager"),
  [
    body("category").isString(),
    body("description").isString(),
    body("amount_birr").isNumeric(),
    body("expense_date").isISO8601(),
  ],
  FinanceController.createExpense
);
router.put(
  "/expenses/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  FinanceController.updateExpense
);
router.delete(
  "/expenses/:id",
  authorize("admin", "manager"),
  [param("id").isUUID()],
  FinanceController.deleteExpense
);

export default router;
