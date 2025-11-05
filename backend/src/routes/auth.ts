// src/routes/auth.ts
const { Router } = require("express");
const AuthController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authenticateToken, AuthController.getProfile);
router.put("/profile", authenticateToken, AuthController.updateProfile);

module.exports = router;
