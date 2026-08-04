const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const { generateSecureToken, hashToken } = require("../utils/tokenUtils");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/sendEmail");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Register a new user and send an email verification link.
 *
 * @route   POST /api/auth/register
 * @access  Public
 *
 * @returns {201} { message, user } - Account created, verification email sent.
 * @returns {400} { message } - Missing required fields, or password shorter than 8 characters.
 * @returns {409} { message } - Email is already registered.
 * @returns {500} { message } - Unexpected server/database error.
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const { rawToken, hashedToken } = generateSecureToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpiry: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS),
    });

    await sendVerificationEmail(user.email, user.name, rawToken);

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Verify a user's email address using the token from the verification link.
 *
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 *
 * @returns {200} { message } - Email verified successfully.
 * @returns {400} { message } - Token missing, invalid, or expired.
 * @returns {500} { message } - Unexpected server/database error.
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      verificationToken: hashToken(token),
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or has expired" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Verify email error:", error.message);
    return res.status(500).json({ message: "Server error during email verification" });
  }
};

/**
 * Resend a verification email (e.g. if the original link expired or was lost).
 *
 * @route   POST /api/auth/resend-verification
 * @access  Public
 *
 * @returns {200} { message } - Generic success message regardless of whether the email
 *                               exists or is already verified, to avoid user enumeration.
 * @returns {400} { message } - Email not provided.
 * @returns {500} { message } - Unexpected server/database error.
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const genericResponse = { message: "If an account exists and isn't verified, a new link has been sent." };
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(200).json(genericResponse);
    }

    const { rawToken, hashedToken } = generateSecureToken();

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);
    await user.save();

    await sendVerificationEmail(user.email, user.name, rawToken);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Resend verification error:", error.message);
    return res.status(500).json({ message: "Server error while resending verification email" });
  }
};

/**
 * Request a password reset link.
 *
 * @route   POST /api/auth/forgot-password
 * @access  Public
 *
 * @sideEffects
 *  - Generates a reset token (stored hashed) and emails the raw token as a link.
 *  - If the email fails to send, the token is rolled back so it can't be used.
 *
 * @returns {200} { message } - Generic success message regardless of whether the email
 *                               exists, to avoid user enumeration.
 * @returns {400} { message } - Email not provided.
 * @returns {500} { message } - Reset email failed to send, or unexpected server error.
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const genericResponse = {
      message: "If an account with that email exists, a password reset link has been sent.",
    };

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const { rawToken, hashedToken } = generateSecureToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS);
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.name, rawToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError.message);

      // Roll back the token — no point leaving a valid reset token active
      // for a link the user never received
      user.passwordResetToken = null;
      user.passwordResetTokenExpiry = null;
      await user.save();

      return res.status(500).json({ message: "Failed to send password reset email. Please try again." });
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Server error while processing password reset request" });
  }
};

/**
 * Reset a user's password using the token from the reset email.
 *
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 *
 * @sideEffects
 *  - Sets a new hashed password and clears the reset token.
 *  - Invalidates ALL existing sessions (clears `refreshTokens`) — if a
 *    password was compromised, any session using the old credentials
 *    should not survive the reset.
 *
 * @returns {200} { message } - Password reset successful.
 * @returns {400} { message } - Token missing/invalid/expired, or password too short.
 * @returns {500} { message } - Unexpected server/database error.
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    user.refreshTokens = []; // log out every existing session
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Server error during password reset" });
  }
};

/**
 * Authenticate a user and issue access/refresh tokens.
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * @returns {200} { message, accessToken, user } - Login successful.
 * @returns {400} { message } - Missing email or password.
 * @returns {401} { message } - Invalid credentials.
 * @returns {403} { message } - Account exists but email is not yet verified.
 * @returns {500} { message } - Unexpected server/database error.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Rotate the refresh token and issue a new access token.
 *
 * @route   POST /api/auth/refresh
 * @access  Public (requires a valid `refreshToken` cookie)
 *
 * @returns {200} { accessToken } - New access token issued.
 * @returns {401} { message } - No refresh token cookie present.
 * @returns {403} { message } - Token invalid/expired or not recognized.
 * @returns {500} { message } - Unexpected server/database error.
 */
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Refresh token not recognized" });
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const newAccessToken = generateAccessToken(user);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error.message);
    return res.status(500).json({ message: "Server error during token refresh" });
  }
};

/**
 * Log out the current session by revoking its refresh token and clearing auth cookies.
 *
 * @route   POST /api/auth/logout
 * @access  Public
 *
 * @returns {200} { message } - Always returned on success.
 * @returns {500} { message } - Unexpected server/database error.
 */
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, {
          $pull: { refreshTokens: token },
        });
      }
    }
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Server error during logout" });
  }
};

/**
 * Get the currently authenticated user's profile.
 *
 * @route   GET /api/auth/me
 * @access  Private (requires valid access token)
 *
 * @returns {200} { user } - Profile without password/refreshTokens/tokens.
 * @returns {404} { message } - User not found.
 * @returns {500} { message } - Unexpected server/database error.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokens -verificationToken -passwordResetToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe error:", error.message);
    return res.status(500).json({ message: "Server error while fetching user" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
};
