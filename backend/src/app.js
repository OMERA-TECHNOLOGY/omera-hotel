import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

// Core middleware & utilities
import { apiResponse } from "./middleware/response.js";
import errorHandler from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";

// Routes (will progressively be filled)
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import bookingRoutes from "./routes/bookings.js";
import dashboardRoutes from "./routes/dashboard.js";
import roomsRoutes from "./routes/rooms.js";
import financeRoutes from "./routes/finance.js";
import restaurantRoutes from "./routes/restaurant.js";
import houseKeepingRoutes from "./routes/houseKeeping.js";
import settingsRoutes from "./routes/settings.js";
import frontDeskRoutes from "./routes/frontdesk.js";
import usersRoutes from "./routes/users.js";

const app = express();

// Security & parsing
app.use(helmet());
// Robust CORS: allow specific origins and credentials
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no origin) and configured origins
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(morgan("tiny"));
app.use(requestLogger);

// Unified response helper (adds res.success / res.fail)
app.use(apiResponse);

// Health check
app.get("/api/health", (req, res) => {
  res.success({
    status: "OK",
    message: "Omera Hotel API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/housekeeping", houseKeepingRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/frontdesk", frontDeskRoutes);
app.use("/api/users", usersRoutes);

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Central error handler
app.use(errorHandler);

export default app;
