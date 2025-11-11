// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  // Supabase error
  if (err.message && err.message.includes("supabase")) {
    res.status(400).json({
      error: "Database error",
      details: err.message,
    });
    return;
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expired" });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
