const executionQueue = require("../queues/execution.queue");
const aiEvaluationQueue = require("../queues/aiEvaluation.queue");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const { runCode } = require("../utils/judge0Client");
const { getIO } = require("../socket");

executionQueue.process(async (job) => {
  const { submissionId } = job.data;
  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  try {
    submission.status = "running";
    await submission.save();

    const challenge = await Challenge.findById(submission.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    if (challenge.executionType === "testcases") {
      const testCaseResults = [];
      let overallPassed = true;

      for (const tc of challenge.testCases) {
        const result = await runCode({
          code: submission.code,
          language: submission.language,
          stdin: tc.input,
        });

        // JDoodle: request-level failure hone par "error" field aata hai, "output" nahi
        const requestFailed = !!result.error;
        const actualOutput = requestFailed
          ? `Error: ${result.error}`
          : (result.output || "").trim();

        const expected = (tc.expectedOutput || "").trim();
        const passed = !requestFailed && actualOutput === expected;
        if (!passed) overallPassed = false;

        testCaseResults.push({
          testCaseId: tc._id,
          passed,
          actualOutput,
          expectedOutput: expected,
          isHidden: tc.isHidden,
        });
      }

      submission.judge0Result = { overallPassed, testCaseResults, rawStderr: "" };
    }

    submission.status = "judge0_done";
    await submission.save();

    await aiEvaluationQueue.add({ submissionId: submission._id.toString() });
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

module.exports = executionQueue;