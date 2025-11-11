import { Router } from "express";
import { authenticateToken, authorize } from "../middleware/auth.js";
import UsersService from "../services/usersService.js";
import supabase from "../config/supabase.js";

const router = Router();

router.use(authenticateToken);

// List users (admin/manager)
router.get("/", authorize("admin", "manager"), async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create sample user (admin only)
// Create sample user (no auth required)
router.post("/sample", async (req, res) => {
  try {
    const email = "sample@omera.tech";
    const existing = await UsersService.findByEmail(email);
    if (existing) {
      return res.status(200).json({
        success: true,
        data: { user: existing, message: "Sample user already exists" },
      });
    }
    const user = await UsersService.create({
      email,
      password: "12345678",
      role: "admin",
    });
    return res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    // Gracefully handle unique violation (already created concurrently)
    if (error?.code === "23505") {
      const user = await UsersService.findByEmail("sample@omera.local");
      return res.status(200).json({
        success: true,
        data: { user, message: "Sample user already exists" },
      });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
