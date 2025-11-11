import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.get("authorization") || req.headers["authorization"];
  const token = authHeader && String(authHeader).split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, error: "Access token required" });

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
