const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { evaluateSubmissionWithAi } = require("../utils/aiEvaluator");
const { calculateScore, BADGE_THRESHOLD } = require("../utils/scoring");
const { sanitizeSubmission } = require("../utils/sanitizer");
const { getIO } = require("../socket");
const aiEvaluationQueueModule = require("../queues/aiEvaluation.queue");

async function issueBadgeIdempotently(userId, challengeId, score) {
  const updateResult = await User.updateOne(
    {
      _id: userId,
      "badges.challengeId": { $ne: challengeId },
    },
    {
      $push: {
        badges: {
          challengeId,
          score,
          earnedAt: new Date(),
        },
      },
    }
  );
  return updateResult.modifiedCount > 0;
}

async function processEvaluationJob({ submissionId }) {
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  try {
    const challenge = await Challenge.findById(submission.challenge);
    if (!challenge) {
      submission.status = "failed";
      submission.errorCode = "CHALLENGE_NOT_FOUND";
      submission.errorMessage = "Challenge not found";
      await submission.save();
      return submission;
    }

    let aiResult;
    try {
      aiResult = await evaluateSubmissionWithAi({
        code: submission.code,
        language: submission.language,
        challenge,
        testSummary: {
          passedCount: submission.executionResult?.passedCount || 0,
          totalCount: submission.executionResult?.totalCount || 0,
        },
      });
    } catch (evalErr) {
      submission.status = "ai_evaluation_failed";
      submission.errorCode = evalErr.code || "AI_EVALUATION_FAILED";
      submission.errorMessage = evalErr.message;
      await submission.save();

      const io = getIO();
      if (io) {
        io.to(submission.user.toString()).emit(
          "submission:complete",
          sanitizeSubmission(submission, { id: submission.user })
        );
      }
      return submission;
    }

    // Schema validation and score calculation
    const scoreResult = calculateScore({
      executionType: challenge.executionType,
      testResults: submission.executionResult?.testResults || [],
      aiEvaluation: aiResult,
      threshold: BADGE_THRESHOLD,
    });

    submission.aiEvaluation = {
      codeQuality: aiResult.codeQuality,
      efficiency: aiResult.efficiency,
      edgeCases: aiResult.edgeCases,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      suggestions: aiResult.suggestions,
      evaluatorVersion: aiResult.evaluatorVersion,
      validated: true,
    };

    submission.finalScore = scoreResult.finalScore;
    submission.badgeEligible = scoreResult.badgeEligible;
    submission.status = "completed";

    // Idempotent badge issuance
    if (scoreResult.badgeEligible) {
      await issueBadgeIdempotently(
        submission.user,
        submission.challenge,
        submission.finalScore
      );
      submission.badgeIssued = true;
    }

    await submission.save();

    const io = getIO();
    if (io) {
      io.to(submission.user.toString()).emit(
        "submission:complete",
        sanitizeSubmission(submission, { id: submission.user })
      );
    }
    return submission;
  } catch (err) {
    submission.status = "failed";
    submission.errorCode = err.code || "EVALUATION_ERROR";
    submission.errorMessage = err.message;
    await submission.save();

    const io = getIO();
    if (io) {
      io.to(submission.user.toString()).emit(
        "submission:complete",
        sanitizeSubmission(submission, { id: submission.user })
      );
    }
    throw err;
  }
}

// Attach Bull worker if queue is active
const bullQueue = aiEvaluationQueueModule.getQueue();
if (bullQueue && typeof bullQueue.process === "function") {
  bullQueue.process(async (job) => {
    return processEvaluationJob(job.data);
  });
}

module.exports = {
  processEvaluationJob,
  issueBadgeIdempotently,
};