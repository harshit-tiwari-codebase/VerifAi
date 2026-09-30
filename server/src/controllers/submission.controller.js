const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const executionQueueModule = require("../queues/execution.queue");
const { processExecutionJob } = require("../workers/execution.worker");
const { executeSubmissionAgainstChallenge } = require("../utils/codeExecutor");
const { sanitizeSubmission, sanitizeTestResult } = require("../utils/sanitizer");

/**
 * POST /api/submissions
 * Canonical submission endpoint (§5).
 * Authenticated only. Returns 202 with real ObjectId and queued status.
 */
const createSubmission = async (req, res, next) => {
  try {
    const challengeId = req.body.challengeId || req.params.id;
    const { code, language = "javascript", telemetry } = req.body;

    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({
        message: "Authentication required to submit solutions",
        errorCode: "UNAUTHORIZED",
      });
    }

    const userId = req.user.id || req.user._id;

    if (!challengeId || !mongoose.Types.ObjectId.isValid(challengeId)) {
      return res.status(400).json({
        message: "Invalid challenge ID",
        errorCode: "INVALID_CHALLENGE_ID",
      });
    }

    // Resolve challenge against DB — unknown ID is 404, never fallback to default (§5)
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
        errorCode: "CHALLENGE_NOT_FOUND",
      });
    }

    // Check queue availability (§6)
    if (!executionQueueModule.isQueueAvailable()) {
      return res.status(503).json({
        message:
          "Submission processing queue is currently unavailable. Please try again later.",
        retryable: true,
        errorCode: "QUEUE_UNAVAILABLE",
      });
    }

    // Create queued submission record
    const submission = await Submission.create({
      user: userId,
      challenge: challenge._id,
      code,
      language,
      status: "queued",
      scoreVersion: "v1",
      telemetry: {
        keystrokeCount:
          telemetry?.keystrokeCount || req.body.keystrokeCount || 0,
        timeSpentSeconds:
          telemetry?.timeSpentSeconds || req.body.timeSpentSeconds || 0,
      },
    });

    // Enqueue job or run in test environment
    if (executionQueueModule.getQueue()) {
      await executionQueueModule.add({
        submissionId: submission._id.toString(),
      });
    } else {
      // In-process async execution for test/dev mode without external Redis
      setImmediate(() => {
        processExecutionJob({ submissionId: submission._id.toString() }).catch(
          (err) => console.error("Async worker error:", err)
        );
      });
    }

    // Always 202, always real ObjectId, never a synthetic score (§5)
    return res.status(202).json({
      submissionId: submission._id,
      status: "queued",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/submissions/:id
 * Fetches persisted submission. Owner or mentor/admin only.
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("challenge", "title difficulty category executionType")
      .populate("user", "name email");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const isOwner =
      req.user &&
      String(submission.user?._id || submission.user) ===
        String(req.user.id || req.user._id);
    const isPrivileged =
      req.user && ["mentor", "admin"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this submission" });
    }

    return res
      .status(200)
      .json({ submission: sanitizeSubmission(submission, req.user) });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/submissions
 * Authenticated user's own submission history.
 */
const getUserSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const filter = { user: userId };

    if (req.query.challengeId) {
      filter.challenge = req.query.challengeId;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("challenge", "title difficulty category");

    return res.status(200).json({
      submissions: submissions.map((s) => sanitizeSubmission(s, req.user)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/challenges/:id/run
 * Interactive public test runner.
 * Evaluates public tests only. No score, no badge, no persistence (§5).
 */
const runChallengeCode = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.body.challengeId;
    const { code, language = "javascript", customInput } = req.body;

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(targetId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Public tests only! Never run or leak hidden tests here (§5)
    let publicTestCases = (challenge.testCases || []).filter(
      (tc) => !tc.isHidden
    );

    if (customInput !== undefined && customInput !== null) {
      publicTestCases = [
        {
          _id: new mongoose.Types.ObjectId(),
          input: String(customInput),
          expectedOutput: "",
          isHidden: false,
        },
      ];
    }

    const challengeForRun = {
      ...challenge.toObject(),
      testCases: publicTestCases,
    };

    const execResult = await executeSubmissionAgainstChallenge({
      code,
      language,
      challenge: challengeForRun,
    });

    const sanitizedResults = (execResult.testResults || []).map(
      sanitizeTestResult
    );

    return res.status(200).json({
      success: execResult.status === "completed",
      status: execResult.status,
      testCases: sanitizedResults,
      passedCount: execResult.passedCount || 0,
      totalCount: publicTestCases.length,
      compileOutput: execResult.compileOutput || "",
      errorMessage: execResult.errorMessage,
    });
  } catch (error) {
    next(error);
  }
};

const getChallengeSubmissions = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.params.challengeId;
    const filter = { challenge: targetId };

    if (req.user?.id) {
      filter.user = req.user.id;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      submissions: submissions.map((s) => sanitizeSubmission(s, req.user)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  runChallengeCode,
  getChallengeSubmissions,
};