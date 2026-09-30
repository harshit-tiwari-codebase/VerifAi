const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challenge.controller");

const {
  runChallengeCode,
  createSubmission,
  getChallengeSubmissions,
} = require("../controllers/submission.controller");

const { verifyAccessToken, requireRole } = require("../middlewares/authMiddleware");
const optionalAuth = require("../middlewares/optionalAuth");
const validateRequest = require("../middlewares/validateRequest");
const {
  createChallengeValidator,
  updateChallengeValidator,
  listChallengesValidator,
  challengeIdValidator,
} = require("../validators/challenge.validator");

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: "Too many requests, try again later" },
});

// Create challenge
router.post(
  "/",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  createChallengeValidator,
  validateRequest,
  createChallenge
);

// List challenges
router.get("/", listChallengesValidator, validateRequest, optionalAuth, getChallenges);

const runLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { message: "Too many test runs, please slow down" },
});

// Run tests for a challenge (interactive only, public tests only)
router.post("/:id/run", verifyAccessToken, runLimiter, challengeIdValidator, validateRequest, runChallengeCode);

// Submit solution for a challenge (thin alias to canonical submission)
router.post(
  "/:id/submit",
  verifyAccessToken,
  writeLimiter,
  challengeIdValidator,
  validateRequest,
  createSubmission
);

// Get submissions for a challenge
router.get("/:id/submissions", verifyAccessToken, challengeIdValidator, validateRequest, getChallengeSubmissions);

// Get single challenge by ID
router.get("/:id", challengeIdValidator, validateRequest, optionalAuth, getChallengeById);

// Update challenge
router.put(
  "/:id",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  challengeIdValidator,
  updateChallengeValidator,
  validateRequest,
  updateChallenge
);

// Delete challenge
router.delete(
  "/:id",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  challengeIdValidator,
  validateRequest,
  deleteChallenge
);

module.exports = router;