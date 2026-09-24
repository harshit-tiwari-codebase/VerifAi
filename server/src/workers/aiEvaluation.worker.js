const aiEvaluationQueue = require("../queues/aiEvaluation.queue");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { evaluateSubmission } = require("../utils/aiEvaluator");
const { getIO } = require("../socket");

const SCORE_THRESHOLD = Number(process.env.BADGE_SCORE_THRESHOLD || 70);

aiEvaluationQueue.process(async (job) => {
  const { submissionId } = job.data;
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  try {
    submission.status = "ai_reviewing";
    await submission.save();

    const challenge = await Challenge.findById(submission.challengeId);
    const criteria = challenge.evaluationCriteria || "General code quality, correctness, and best practices.";

    const evaluation = await evaluateSubmission({
      code: submission.code,
      language: submission.language,
      criteria,
      judge0Result: submission.judge0Result,
    });

    submission.aiEvaluation = evaluation;

    if (evaluation.score >= SCORE_THRESHOLD) {
      const alreadyHasBadge = await User.exists({
        _id: submission.userId,
        "badges.challengeId": submission.challengeId,
      });

      if (!alreadyHasBadge) {
        await User.findByIdAndUpdate(submission.userId, {
          $push: { badges: { challengeId: submission.challengeId, score: evaluation.score, earnedAt: new Date() } },
        });
      }
      submission.badgeIssued = true;
    }

    submission.status = "completed";
    await submission.save();

    const io = getIO();
    if (io) {
      io.to(submission.userId.toString()).emit("submission:complete", {
        submissionId: submission._id,
        status: submission.status,
        judge0Result: submission.judge0Result,
        aiEvaluation: submission.aiEvaluation,
        badgeIssued: submission.badgeIssued,
      });
    }
  } catch (err) {
    submission.status = "failed";
    submission.errorMessage = err.message;
    await submission.save();

    const io = getIO();
    if (io) {
      io.to(submission.userId.toString()).emit("submission:complete", {
        submissionId: submission._id,
        status: "failed",
        error: err.message,
      });
    }
    throw err;
  }
});

module.exports = aiEvaluationQueue;