const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
// const roomRoutes = require("./routes/rooms");
const employeeRoutes = require("./routes/employees");
const housekeepingRoutes = require("./routes/houseKeeping");
const restaurantRoutes = require("./routes/restaurant");
const financeRoutes = require("./routes/finance");
const settingsRoutes = require("./routes/settings");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

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
// app.use("/api/rooms", roomRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/housekeeping", housekeepingRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/settings", settingsRoutes);

// Health check
app.get("/api/health", (req: any, res: any) => {
  res.status(200).json({
    status: "OK",
    message: "Omera Hotel API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req: any, res: any) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling
app.use(errorHandler);

module.exports = app;
