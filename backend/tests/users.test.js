import request from "supertest";
import { jest } from "@jest/globals";

// Mock UsersService to prevent DB dependency in this test
const mockUsers = {
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest
    .fn()
    .mockResolvedValue({
      id: "u-sample",
      email: "sample@omera.local",
      role: "admin",
      is_active: true,
    }),
};

await jest.unstable_mockModule("../src/services/usersService.js", () => ({
  default: mockUsers,
}));

const { default: app } = await import("../src/app.js");

const adminHeaders = {
  "x-test-user": JSON.stringify({ id: "admin-1", role: "admin" }),
};

describe("Users API", () => {
  test("Create sample user (admin)", async () => {
    const res = await request(app).post("/api/users/sample").set(adminHeaders);
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });

  test("List users requires admin/manager", async () => {
    const res401 = await request(app).get("/api/users");
    expect(res401.status).toBe(401);

    const res403 = await request(app)
      .get("/api/users")
      .set({
        "x-test-user": JSON.stringify({ id: "u2", role: "receptionist" }),
      });
    expect(res403.status).toBe(403);
  });
});
