const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  refresh,
  logout,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  
} = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Prevent brute-force attacks on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", verifyAccessToken, getMe);

// Forget Password

// Password reset
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);

module.exports = router;
