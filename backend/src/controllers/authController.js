import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import UsersService from "../services/usersService.js";

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }
      const { full_name, email, password, role } = req.body;

      const existingUser = await UsersService.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, error: "User already exists" });
      }

      const user = await UsersService.create({
        email,
        password,
        role: role || "receptionist",
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }
      const { email, password } = req.body;

      const user = await UsersService.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });
      }

      const isValidPassword = await UsersService.verifyPassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });
      }
      if (!user.is_active) {
        return res
          .status(401)
          .json({ success: false, error: "Account is deactivated" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      await UsersService.update(user.id, {
        last_login: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user ? await UsersService.findById(req.user.id) : null;
      res.json({
        success: true,
        data: {
          user: user
            ? {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
              }
            : null,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { full_name, email } = req.body;
      const updates = {};
      if (email) updates.email = email;
      // full_name not stored in users table; ignored for now.
      const user = req.user
        ? await UsersService.update(req.user.id, updates)
        : null;

      res.json({
        success: true,
        data: {
          message: "Profile updated successfully",
          user: user
            ? {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
              }
            : null,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default AuthController;
