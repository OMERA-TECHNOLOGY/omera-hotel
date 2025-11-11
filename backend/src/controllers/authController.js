// src/controllers/authController.ts
import express from "express"; // Removed TS type-only imports
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
// Removed AuthRequest type import (plain JS)

class AuthController {
  static async register(req, res) {
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
        process.env.JWT_SECRET,
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
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
        process.env.JWT_SECRET,
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user ? await UserModel.findById(req.user.id) : null;
      res.json({
        user: {
          id: user && user.id,
          full_name: user && user.full_name,
          email: user && user.email,
          role: user && user.role,
          created_at: user && user.created_at,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { full_name, email } = req.body;
      const user = req.user
        ? await UserModel.update(req.user.id, { full_name, email })
        : null;

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user && user.id,
          full_name: user && user.full_name,
          email: user && user.email,
          role: user && user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;
