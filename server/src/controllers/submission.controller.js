const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { runCodeInSandbox } = require("../utils/sandboxExecutor");
const { evaluateSubmission } = require("../utils/aiEvaluator");
const { getIO } = require("../socket");

const SCORE_THRESHOLD = Number(process.env.BADGE_SCORE_THRESHOLD || 70);

/**
 * Robust challenge resolver by ObjectId, slug, or title.
 */
async function resolveChallenge(targetId, candidateTitle) {
  let challenge = null;
  if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
    challenge = await Challenge.findById(targetId);
  }
  if (!challenge && targetId && targetId !== "rate-limiter" && targetId !== "default") {
    const normalized = targetId.replace(/[-_]/g, " ").trim();
    challenge = await Challenge.findOne({
      title: { $regex: new RegExp(`^${normalized}$`, "i") },
    });
    if (!challenge) {
      const partial = targetId.replace(/[-_]/g, ".*");
      challenge = await Challenge.findOne({
        title: { $regex: new RegExp(partial, "i") },
      });
    }
  }
  if (!challenge && candidateTitle) {
    const trimmed = candidateTitle.trim();
    challenge = await Challenge.findOne({
      title: { $regex: new RegExp(`^${trimmed}$`, "i") },
    });
  }
  return challenge;
}

/**
 * Execute code interactively against challenge test cases or custom input (Run Tests).
 * @route POST /api/submissions/run or POST /api/challenges/:id/run
 */
const runChallengeCode = async (req, res, next) => {
  try {
    const { challengeId, code, customInput, challenge: clientChallenge } = req.body;
    const targetId = challengeId || req.params.id;

    const challenge = await resolveChallenge(targetId, clientChallenge?.title);
    let testCases = [];
    if (challenge?.testCases && challenge.testCases.length > 0) {
      testCases = challenge.testCases;
    } else if (Array.isArray(req.body.testCases) && req.body.testCases.length > 0) {
      testCases = req.body.testCases;
    }

    const result = runCodeInSandbox({
      code,
      testCases,
      customInput,
      timeoutMs: 3000,
    });

    return res.status(200).json({
      success: result.overallPassed,
      testCases: result.testCaseResults,
      customOutput: result.customOutput,
      rawStderr: result.rawStderr,
      totalTimeMs: result.totalTimeMs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit solution for complete verified pipeline evaluation and badge issuance.
 * Sends the complete challenge problem, candidate's code, and Judge0 results to AI review.
 * @route POST /api/submissions or POST /api/challenges/:id/submit
 */
const createSubmission = async (req, res, next) => {
  try {
    const { challengeId, code, language = "javascript", challenge: clientChallenge, testResults } = req.body;
    const targetId = challengeId || req.params.id;

    const challenge = await resolveChallenge(targetId, clientChallenge?.title);

    const mockChallengeContext = {
      title: challenge?.title || clientChallenge?.title || "Distributed Token Bucket Rate Limiter",
      description:
        challenge?.description ||
        clientChallenge?.description ||
        "Design and implement a thread-safe Token Bucket Rate Limiter class in JavaScript.",
      category: challenge?.category || clientChallenge?.category || "Distributed Systems",
      difficulty: challenge?.difficulty || clientChallenge?.difficulty || "Medium",
      tags: challenge?.tags || clientChallenge?.tags || ["distributed-systems", "algorithms"],
      evaluationCriteria:
        challenge?.evaluationCriteria ||
        clientChallenge?.evaluationCriteria ||
        "Algorithmic efficiency, time complexity, boundary handling, and clean modular code design.",
    };

    let targetTestCases = [];
    if (challenge?.testCases && challenge.testCases.length > 0) {
      targetTestCases = challenge.testCases;
    } else if (Array.isArray(testResults) && testResults.length > 0 && testResults[0].input !== undefined) {
      targetTestCases = testResults;
    } else {
      targetTestCases = [
        { input: "10, 2, 5", expectedOutput: "true", isHidden: false },
        { input: "10, 2, 10", expectedOutput: "false", isHidden: false },
        { input: "10, 2, 12", expectedOutput: "false", isHidden: false },
        { input: "10, 2, 1", expectedOutput: "true", isHidden: true },
      ];
    }

    // 1. Run in isolated sandbox (Judge0 engine)
    const sandboxResult = runCodeInSandbox({
      code,
      testCases: targetTestCases,
      timeoutMs: 3000,
    });

    const judge0Result = {
      overallPassed: sandboxResult.overallPassed,
      testCaseResults: sandboxResult.testCaseResults,
      totalTimeMs: sandboxResult.totalTimeMs,
      rawStderr: sandboxResult.rawStderr || "",
    };

    // 2. Perform deep AI Architectural Review with full Problem Context + Code + Judge0 Telemetry
    const evaluation = await evaluateSubmission({
      code,
      language,
      challenge: challenge || mockChallengeContext,
      criteria: mockChallengeContext.evaluationCriteria,
      judge0Result,
    });

    // 3. If user is authenticated and challenge is in DB, persist record
    let submissionRecord = null;
    let badgeIssued = evaluation.score >= SCORE_THRESHOLD;

    if (challenge && (req.user?.id || req.user?._id)) {
      submissionRecord = await Submission.create({
        userId: req.user.id || req.user._id,
        challengeId: challenge._id,
        code,
        language,
        status: "completed",
        judge0Result,
        aiEvaluation: evaluation,
        badgeIssued,
      });

      if (badgeIssued) {
        const alreadyHasBadge = await User.exists({
          _id: req.user.id || req.user._id,
          "badges.challengeId": challenge._id,
        });

        if (!alreadyHasBadge) {
          await User.findByIdAndUpdate(req.user.id || req.user._id, {
            $push: {
              badges: {
                challengeId: challenge._id,
                score: evaluation.score,
                earnedAt: new Date(),
              },
            },
          });
        }
      }

      const io = getIO();
      if (io && req.user?.id) {
        io.to(req.user.id.toString()).emit("submission:complete", {
          submissionId: submissionRecord._id,
          status: "completed",
          judge0Result,
          aiEvaluation: evaluation,
          badgeIssued,
        });
      }
    }

    return res.status(201).json({
      message: "Submission evaluated successfully",
      submissionId: submissionRecord?._id || `sub_${Date.now()}`,
      status: "completed",
      score: evaluation.score,
      subscores: evaluation.subscores,
      badgeIssued,
      testResults: sandboxResult.testCaseResults,
      evaluation: {
        finalScore: evaluation.score,
        passingThreshold: SCORE_THRESHOLD,
        subscores: evaluation.subscores,
        badge: {
          name: `${mockChallengeContext.title} Architect`,
          issueId: `VRF-${(submissionRecord?._id || Date.now()).toString().slice(-6).toUpperCase()}`,
        },
        reviewNotes: [
          ...(evaluation.strengths || []).slice(0, 2),
          ...(evaluation.suggestions || []).slice(0, 1),
        ],
      },
      submission: submissionRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get submission by ID
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("challengeId", "title difficulty category")
      .populate("userId", "name email");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const isOwner = req.user && String(submission.userId?._id || submission.userId) === String(req.user.id);
    const isPrivileged = req.user && ["mentor", "admin"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }

    return res.status(200).json({ submission });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user submissions for a specific challenge
 */
const getChallengeSubmissions = async (req, res, next) => {
  try {
    const targetId = req.params.id || req.params.challengeId;
    const filter = { challengeId: targetId };

    if (req.user?.id) {
      filter.userId = req.user.id;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ submissions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getSubmissionById,
  runChallengeCode,
  getChallengeSubmissions,
};