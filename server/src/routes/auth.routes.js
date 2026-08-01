const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, refresh, logout } = require("../controllers/auth.controller");
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

module.exports = router;
