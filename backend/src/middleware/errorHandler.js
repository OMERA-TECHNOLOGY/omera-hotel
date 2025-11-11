import logger from "./logger.js";

const errorHandler = (err, req, res, next) => {
  // Log detailed error
  logger.error(err);

  // Supabase error
  if (
    err &&
    err.message &&
    String(err.message).toLowerCase().includes("supabase")
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Database error", details: err.message });
  }

  // JWT errors
  if (err && err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
  if (err && err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, error: "Token expired" });
  }

  const statusCode = err?.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err?.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && err?.stack
      ? { stack: err.stack }
      : {}),
  });
};

export default errorHandler;
