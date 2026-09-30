const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const { executeSubmissionAgainstChallenge } = require("../utils/codeExecutor");
const { calculateScore, BADGE_THRESHOLD } = require("../utils/scoring");
const { sanitizeSubmission } = require("../utils/sanitizer");
const { getIO } = require("../socket");
const executionQueueModule = require("../queues/execution.queue");
const aiEvaluationQueueModule = require("../queues/aiEvaluation.queue");
const { processEvaluationJob, issueBadgeIdempotently } = require("./aiEvaluation.worker");

async function processExecutionJob({ submissionId }) {
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  try {
    submission.status = "executing";
    await submission.save();

    const io = getIO();
    if (io) {
      io.to(submission.user.toString()).emit("submission:status", {
        submissionId: submission._id,
        status: "executing",
      });
    }

    const challenge = await Challenge.findById(submission.challenge);
    if (!challenge) {
      submission.status = "failed";
      submission.errorCode = "CHALLENGE_NOT_FOUND";
      submission.errorMessage = "Challenge not found in database";
      await submission.save();

      if (io) {
        io.to(submission.user.toString()).emit(
          "submission:complete",
          sanitizeSubmission(submission, { id: submission.user })
        );
      }
      return submission;
    }

    // Missing test suite check (§0 Invariant 3)
    if (
      challenge.executionType === "testcases" ||
      challenge.executionType === "both"
    ) {
      if (!challenge.testCases || challenge.testCases.length === 0) {
        submission.status = "failed";
        submission.errorCode = "EVALUATION_ERROR";
        submission.errorMessage =
          "Cannot score submission: challenge has no automated test cases configured";
        await submission.save();

        if (io) {
          io.to(submission.user.toString()).emit(
            "submission:complete",
            sanitizeSubmission(submission, { id: submission.user })
          );
        }
        return submission;
      }
    }

    // Execute via provider (Judge0)
    const execResult = await executeSubmissionAgainstChallenge({
      code: submission.code,
      language: submission.language,
      challenge,
    });

    // Check terminal failure states: compilation_error, runtime_error, timeout, provider_unavailable
    if (
      [
        "compilation_error",
        "runtime_error",
        "timeout",
        "provider_unavailable",
      ].includes(execResult.status)
    ) {
      submission.status = execResult.status;
      submission.errorCode = execResult.errorCode || execResult.status.toUpperCase();
      submission.errorMessage = execResult.errorMessage;
      submission.executionResult = {
        testResults: [],
        compileOutput: execResult.compileOutput,
        passedCount: 0,
        totalCount: challenge.testCases?.length || 0,
        requiredPassedCount: 0,
        requiredTotalCount: challenge.testCases?.length || 0,
      };
      await submission.save();

      if (io) {
        io.to(submission.user.toString()).emit(
          "submission:complete",
          sanitizeSubmission(submission, { id: submission.user })
        );
      }
      // STOP — do not enqueue AI evaluation!
      return submission;
    }

    // Record test execution result
    submission.executionResult = {
      testResults: execResult.testResults,
      compileOutput: execResult.compileOutput,
      passedCount: execResult.passedCount,
      totalCount: execResult.totalCount,
      requiredPassedCount: execResult.requiredPassedCount,
      requiredTotalCount: execResult.requiredTotalCount,
    };

    // If pure testcases challenge (no AI evaluation needed)
    if (challenge.executionType === "testcases") {
      const scoreResult = calculateScore({
        executionType: "testcases",
        testResults: execResult.testResults,
        threshold: BADGE_THRESHOLD,
      });

      submission.finalScore = scoreResult.finalScore;
      submission.badgeEligible = scoreResult.badgeEligible;
      submission.status = "completed";

      if (scoreResult.badgeEligible) {
        await issueBadgeIdempotently(
          submission.user,
          submission.challenge,
          submission.finalScore
        );
        submission.badgeIssued = true;
      }

      await submission.save();

      if (io) {
        io.to(submission.user.toString()).emit(
          "submission:complete",
          sanitizeSubmission(submission, { id: submission.user })
        );
      }
      return submission;
    }

    // If AI evaluation is required ("both" or "review_only")
    submission.status = "evaluating";
    await submission.save();

    if (io) {
      io.to(submission.user.toString()).emit("submission:status", {
        submissionId: submission._id,
        status: "evaluating",
      });
    }

    if (
      aiEvaluationQueueModule.isQueueAvailable() &&
      aiEvaluationQueueModule.getQueue()
    ) {
      await aiEvaluationQueueModule.add({
        submissionId: submission._id.toString(),
      });
    } else {
      // In-process fallback for tests
      await processEvaluationJob({
        submissionId: submission._id.toString(),
      });
    }

    return submission;
  } catch (err) {
    submission.status = "failed";
    submission.errorCode = err.code || "INTERNAL_ERROR";
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
const bullQueue = executionQueueModule.getQueue();
if (bullQueue && typeof bullQueue.process === "function") {
  bullQueue.process(async (job) => {
    return processExecutionJob(job.data);
  });
}

module.exports = {
  processExecutionJob,
};