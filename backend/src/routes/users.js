import { Router } from "express";
import { authenticateToken, authorize } from "../middleware/auth.js";
import UsersService from "../services/usersService.js";

const router = Router();

router.use(authenticateToken);

// List users (admin/manager)
router.get("/", authorize("admin", "manager"), async (req, res) => {
  try {
    const { data, error } = (await req.app.locals.supabase)
      ? req.app.locals.supabase.from("users").select("*")
      : { data: null, error: null };
    // Fallback to service if app.locals is not set
    if (!data) {
      // Minimal list via service not implemented; return 501
      return res.status(501).json({ success: false, error: "Not implemented" });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create sample user (admin only)
router.post("/sample", authorize("admin"), async (req, res) => {
  try {
    const email = "sample@omera.local";
    const existing = await UsersService.findByEmail(email);
    if (existing) {
      return res
        .status(200)
        .json({
          success: true,
          data: { user: existing, message: "Sample user already exists" },
        });
    }
    const user = await UsersService.create({
      full_name: "Sample Admin",
      email,
      password: "Password123!",
      role: "admin",
    });
    return res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
