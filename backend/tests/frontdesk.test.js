import { jest } from "@jest/globals";
import request from "supertest";

const mockFrontdesk = {
  stats: jest.fn().mockResolvedValue({ totalRooms: 10, occupiedRooms: 5 }),
  currentGuests: jest.fn().mockResolvedValue([]),
  currentGuestsFromView: jest.fn().mockRejectedValue(new Error("no view")),
  arrivals: jest.fn().mockResolvedValue([]),
  departures: jest.fn().mockResolvedValue([]),
  availability: jest.fn().mockResolvedValue([]),
};

await jest.unstable_mockModule("../src/services/frontdeskService.js", () => ({
  default: mockFrontdesk,
}));

const { default: app } = await import("../src/app.js");

const receptionistHeaders = {
  "x-test-user": JSON.stringify({ id: "u1", role: "receptionist" }),
};

describe("FrontDesk API", () => {
  test("Requires auth", async () => {
    const res = await request(app).get("/api/frontdesk/stats");
    expect(res.status).toBe(401);
  });

  test("Stats OK", async () => {
    const res = await request(app)
      .get("/api/frontdesk/stats")
      .set(receptionistHeaders);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Arrivals OK", async () => {
    const res = await request(app)
      .get("/api/frontdesk/arrivals")
      .set(receptionistHeaders);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
