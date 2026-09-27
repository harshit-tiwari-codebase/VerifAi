const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createSubmission,
  getSubmissionById,
  runChallengeCode,
  getChallengeSubmissions,
} = require("../controllers/submission.controller");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const optionalAuth = require("../middlewares/optionalAuth");
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

// Run code tests interactively in sandbox (no auth strictly required for local/guest playground)
router.post("/run", optionalAuth, runChallengeCode);

// Full solution submission
router.post(
  "/",
  optionalAuth,
  submitLimiter,
  createSubmissionValidator,
  validateRequest,
  createSubmission
);

// Get submission by ID
router.get(
  "/:id",
  verifyAccessToken,
  submissionIdValidator,
  validateRequest,
  getSubmissionById
);

// Get submissions for a challenge
router.get("/challenge/:challengeId", optionalAuth, getChallengeSubmissions);

module.exports = router;