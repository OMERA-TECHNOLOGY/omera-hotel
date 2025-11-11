import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("full_name").isString().isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isString(),
  ],
  AuthController.register
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  AuthController.login
);
router.get("/profile", authenticateToken, AuthController.getProfile);
router.put(
  "/profile",
  authenticateToken,
  [body("full_name").optional().isString(), body("email").optional().isEmail()],
  AuthController.updateProfile
);

export default router;
