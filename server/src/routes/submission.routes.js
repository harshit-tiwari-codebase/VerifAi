const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  runChallengeCode,
  getChallengeSubmissions,
} = require("../controllers/submission.controller");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  createSubmissionValidator,
  submissionIdValidator,
} = require("../validators/submission.validator");

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: "Too many requests, please try again later" },
});

// Canonical submission creation — strictly requires authentication (§5)
router.post(
  "/",
  verifyAccessToken,
  submitLimiter,
  createSubmissionValidator,
  validateRequest,
  createSubmission
);

// Current user's submission history — strictly requires authentication (§5)
router.get("/", verifyAccessToken, getUserSubmissions);

// Single submission by ID — owner or mentor/admin only (§5)
router.get(
  "/:id",
  verifyAccessToken,
  submissionIdValidator,
  validateRequest,
  getSubmissionById
);

// Interactive run endpoint alias — requires authentication (§5)
router.post("/run", verifyAccessToken, runChallengeCode);

// Challenge submissions history
router.get("/challenge/:challengeId", verifyAccessToken, getChallengeSubmissions);

module.exports = router;