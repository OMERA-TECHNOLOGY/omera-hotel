// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
import { User, AuthRequest } from "../types";

const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader =
    (req as Request).get?.("authorization") ??
    (req as Request).headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    // Fix: Define the interface locally instead of using jwt.JwtPayload
    interface JwtPayloadWithUserId {
      userId?: string;
      email?: string;
      role?: string;
      iat?: number;
      exp?: number;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayloadWithUserId;

    if (!decoded || !decoded.userId) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = user as User;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
};

module.exports = { authenticateToken, authorize };
