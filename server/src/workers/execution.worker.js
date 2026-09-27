const executionQueue = require("../queues/execution.queue");
const aiEvaluationQueue = require("../queues/aiEvaluation.queue");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const { runCodeInSandbox } = require("../utils/sandboxExecutor");
const { getIO } = require("../socket");

// Process execution jobs
if (executionQueue && typeof executionQueue.process === "function") {
  executionQueue.process(async (job) => {
    const { submissionId } = job.data;
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error("Submission not found");

    try {
      submission.status = "running";
      await submission.save();

      const challenge = await Challenge.findById(submission.challengeId);
      if (!challenge) throw new Error("Challenge not found");

      if (challenge.executionType === "testcases" || (challenge.testCases && challenge.testCases.length > 0)) {
        // Execute in isolated V8 sandbox
        const sandboxResult = runCodeInSandbox({
          code: submission.code,
          testCases: challenge.testCases || [],
          timeoutMs: 3000,
        });

        submission.judge0Result = {
          overallPassed: sandboxResult.overallPassed,
          testCaseResults: sandboxResult.testCaseResults,
          rawStderr: sandboxResult.rawStderr || "",
        };
      } else {
        submission.judge0Result = {
          overallPassed: true,
          testCaseResults: [],
          rawStderr: "",
        };
      }

      submission.status = "judge0_done";
      await submission.save();

      // Dispatch to AI evaluation
      if (aiEvaluationQueue && typeof aiEvaluationQueue.add === "function") {
        await aiEvaluationQueue.add({ submissionId: submission._id.toString() });
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
}

module.exports = executionQueue;