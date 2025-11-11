import { jest } from "@jest/globals";
import request from "supertest";

// Mock the FinanceService before importing the app (ESM)
const mockFinance = {
  listInvoices: jest.fn().mockResolvedValue([]),
  findInvoice: jest.fn().mockResolvedValue(null),
  createInvoice: jest
    .fn()
    .mockResolvedValue({
      id: "11111111-1111-1111-1111-111111111111",
      invoice_number: "INV-TEST-1",
    }),
  updateInvoice: jest
    .fn()
    .mockResolvedValue({
      id: "11111111-1111-1111-1111-111111111111",
      invoice_number: "INV-TEST-1-UPDATED",
    }),
  removeInvoice: jest.fn().mockResolvedValue(true),
  listPayments: jest.fn().mockResolvedValue([]),
  findPayment: jest.fn().mockResolvedValue(null),
  createPayment: jest
    .fn()
    .mockResolvedValue({ id: "22222222-2222-2222-2222-222222222222" }),
  updatePayment: jest
    .fn()
    .mockResolvedValue({ id: "22222222-2222-2222-2222-222222222222" }),
  removePayment: jest.fn().mockResolvedValue(true),
  listExpenses: jest.fn().mockResolvedValue([]),
  findExpense: jest.fn().mockResolvedValue(null),
  createExpense: jest
    .fn()
    .mockResolvedValue({ id: "33333333-3333-3333-3333-333333333333" }),
  updateExpense: jest
    .fn()
    .mockResolvedValue({ id: "33333333-3333-3333-3333-333333333333" }),
  removeExpense: jest.fn().mockResolvedValue(true),
};

await jest.unstable_mockModule("../src/services/financeService.js", () => ({
  default: mockFinance,
}));

const { default: app } = await import("../src/app.js");

// Helper to inject test user via header bypass (role = cashier)
const cashierHeaders = {
  "x-test-user": JSON.stringify({
    id: "00000000-0000-0000-0000-000000000001",
    role: "cashier",
  }),
};
const adminHeaders = {
  "x-test-user": JSON.stringify({
    id: "00000000-0000-0000-0000-000000000002",
    role: "admin",
  }),
};

describe("Finance API", () => {
  test("Requires auth", async () => {
    const res = await request(app).get("/api/finance/invoices");
    expect(res.status).toBe(401);
  });

  test("List invoices (cashier)", async () => {
    const res = await request(app)
      .get("/api/finance/invoices")
      .set(cashierHeaders);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.invoices)).toBe(true);
  });

  test("Validation failure creating invoice", async () => {
    const res = await request(app)
      .post("/api/finance/invoices")
      .set(cashierHeaders)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Create invoice (cashier)", async () => {
    const payload = {
      invoice_number: "INV-TEST-1",
      subtotal_birr: 100,
      vat_amount_birr: 15,
      total_amount_birr: 115,
      payment_status: "unpaid",
    };
    const res = await request(app)
      .post("/api/finance/invoices")
      .set(cashierHeaders)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("Delete invoice requires admin", async () => {
    const resForbidden = await request(app)
      .delete("/api/finance/invoices/11111111-1111-1111-1111-111111111111")
      .set(cashierHeaders);
    expect(resForbidden.status).toBe(403);

    const res = await request(app)
      .delete("/api/finance/invoices/11111111-1111-1111-1111-111111111111")
      .set(adminHeaders);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
