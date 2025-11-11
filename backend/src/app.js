import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

// Import routes
import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import employeeRoutes from "./routes/employees";
import housekeepingRoutes from "./routes/houseKeeping";
import restaurantRoutes from "./routes/restaurant";
import financeRoutes from "./routes/finance";
import settingsRoutes from "./routes/settings";

// Import middleware
import errorHandler from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Omera Hotel API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handling
app.use(errorHandler);

export default app;
