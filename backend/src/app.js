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

const app = express();

// Security & parsing
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(",") || "*",
    credentials: true,
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

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Central error handler
app.use(errorHandler);

export default app;
