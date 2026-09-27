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

// Run tests for a challenge
router.post("/:id/run", optionalAuth, runChallengeCode);

// Submit solution for a challenge
router.post("/:id/submit", optionalAuth, createSubmission);

// Get submissions for a challenge
router.get("/:id/submissions", optionalAuth, getChallengeSubmissions);

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