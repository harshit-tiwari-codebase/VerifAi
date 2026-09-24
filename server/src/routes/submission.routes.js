const express = require("express");
const rateLimit = require("express-rate-limit");

const { createSubmission, getSubmissionById } = require("../controllers/submission.controller");
const { verifyAccessToken } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { createSubmissionValidator, submissionIdValidator } = require("../validators/submission.validator");

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many submissions, thodi der baad try karo" },
});

router.post("/", verifyAccessToken, submitLimiter, createSubmissionValidator, validateRequest, createSubmission);
router.get("/:id", verifyAccessToken, submissionIdValidator, validateRequest, getSubmissionById);

module.exports = router;