const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new user.
 *
 * @route   POST /api/auth/register
 * @access  Public
 *
 * @param   {Object} req.body
 * @param   {string} req.body.name       - Full name of the user.
 * @param   {string} req.body.email      - User's email address. Must be unique.
 * @param   {string} req.body.password   - Plaintext password, min 8 characters. Hashed before storage.
 *
 * @returns {201} { message, user: { id, name, email, role } } - Account created successfully.
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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Authenticate a user and issue access/refresh tokens.
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * @param   {Object} req.body
 * @param   {string} req.body.email      - Registered email address.
 * @param   {string} req.body.password   - Plaintext password to verify against the stored hash.
 *
 * @sideEffects
 *  - Appends the new refresh token to `user.refreshTokens`.
 *  - Updates `user.lastLogin` to the current timestamp.
 *  - Sets `accessToken` and `refreshToken` httpOnly cookies (see `cookieOptions`).
 *
 * @returns {200} { message, accessToken, user: { id, name, email, role } } - Login successful.
 * @returns {400} { message } - Missing email or password.
 * @returns {401} { message } - Email not found, or password does not match ("Invalid credentials" in both cases to avoid user enumeration).
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
 * @param   {string} req.cookies.refreshToken - Refresh token issued at login/last refresh.
 *
 * @sideEffects
 *  - Removes the presented refresh token from `user.refreshTokens` and replaces it with a newly generated one (rotation).
 *  - Sets new `accessToken` and `refreshToken` cookies.
 *
 * @returns {200} { accessToken } - New access token issued.
 * @returns {401} { message } - No `refreshToken` cookie present on the request.
 * @returns {403} { message } - Token failed JWT verification (invalid/expired signature).
 * @returns {403} { message } - Token is well-formed but not present in the user's stored `refreshTokens`
 *                               (e.g. already rotated/reused, or session was revoked).
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

    // Rotate refresh token
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
 * @access  Public (no-op safe even without a valid session)
 *
 * @param   {string} [req.cookies.refreshToken] - Refresh token for the current session, if present.
 *
 * @sideEffects
 *  - If a refresh token cookie is present and decodable, removes it from `user.refreshTokens`
 *    (only that session is revoked; other devices/sessions remain logged in).
 *  - Clears the `accessToken` and `refreshToken` cookies regardless of whether a token was present.
 *
 * @returns {200} { message } - Always returned on success, even if no refresh token was present.
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

module.exports = { register, login, refresh, logout };