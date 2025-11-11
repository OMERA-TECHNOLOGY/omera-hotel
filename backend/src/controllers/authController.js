// src/controllers/authController.ts
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
import { AuthRequest } from "../types";

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password, role } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const user = await UserModel.create({
        full_name,
        email,
        password_hash: password,
        role: role || "staff",
        status: "active",
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isValidPassword = await UserModel.verifyPassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      if (user.status !== "active") {
        res.status(401).json({ error: "Account is deactivated" });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      await UserModel.update(user.id, { last_login: new Date().toISOString() });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user!.id);
      res.json({
        user: {
          id: user!.id,
          full_name: user!.full_name,
          email: user!.email,
          role: user!.role,
          created_at: user!.created_at,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { full_name, email } = req.body;
      const user = await UserModel.update(req.user!.id, { full_name, email });

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
