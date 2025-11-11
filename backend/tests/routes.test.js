import request from "supertest";
import app from "../src/app.js";

// Basic route smoke tests to ensure routes are mounted and protected as expected

describe("API smoke tests", () => {
  it("GET /api/health -> 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("POST /api/auth/login (missing fields) -> 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("GET /api/rooms requires auth -> 401", async () => {
    const res = await request(app).get("/api/rooms");
    expect(res.status).toBe(401);
  });

  it("GET /api/dashboard/metrics requires auth -> 401", async () => {
    const res = await request(app).get("/api/dashboard/metrics");
    expect(res.status).toBe(401);
  });

  it("Unknown route -> 404", async () => {
    const res = await request(app).get("/api/unknown-route");
    expect(res.status).toBe(404);
  });
});
