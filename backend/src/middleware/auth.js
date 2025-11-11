import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

export const authenticateToken = async (req, res, next) => {
  // Test environment bypass: allow injecting a fake user via header to avoid DB dependency
  if (process.env.NODE_ENV === "test") {
    const testUserHeader = req.get("x-test-user");
    if (testUserHeader) {
      try {
        const user = JSON.parse(testUserHeader);
        req.user = user;
        return next();
      } catch (_) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid x-test-user header" });
      }
    }
  }

  const authHeader = req.get("authorization") || req.headers["authorization"];
  const token = authHeader && String(authHeader).split(" ")[1];

  if (!token) {
    // Instead of error, just skip setting req.user and continue
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!decoded || !decoded.userId) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid or expired token" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    if (error || !user)
      return res.status(401).json({ success: false, error: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, error: "Insufficient permissions" });
    }
    next();
  };
