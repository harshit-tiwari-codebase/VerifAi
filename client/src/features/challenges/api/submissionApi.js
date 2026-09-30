import axiosInstance from "../../../api/axiosInstance";

/**
 * Non-authoritative local preview evaluator for offline dev/interactive feedback.
 * Labeled non-authoritative — never generates badges or official credentials (§8).
 */
export function evaluateSolutionPreview(code, testCases = [], customInput = null) {
  const results = [];
  let totalTime = 0;

  try {
    const createModule = new Function(`
      "use strict";
      const exports = {};
      const module = { exports };
      ${code}
      if (typeof Solution !== 'undefined') return Solution;
      if (typeof TokenBucket !== 'undefined') return TokenBucket;
      if (typeof module.exports === 'function') return module.exports;
      if (typeof module.exports.default === 'function') return module.exports.default;
      const keys = Object.keys(module.exports);
      if (keys.length > 0 && typeof module.exports[keys[0]] === 'function') {
        return module.exports[keys[0]];
      }
      return null;
    `);

    const TargetClass = createModule();

    if (customInput !== null) {
      const startTime = performance.now();
      let parsed = customInput;
      try { parsed = JSON.parse(customInput); } catch (_) {}
      let res;
      if (typeof TargetClass === "function") {
        try {
          const instance = new TargetClass();
          res = typeof instance.solve === "function" ? instance.solve(parsed) : TargetClass(parsed);
        } catch (_) {
          res = TargetClass(parsed);
        }
      }
      const elapsed = Math.max(1, Math.round(performance.now() - startTime));
      return {
        success: true,
        isNonAuthoritativePreview: true,
        customOutput: `[Local Preview] Output: ${JSON.stringify(res, null, 2)} (${elapsed}ms)`,
        runtimeMs: elapsed,
      };
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const startCase = performance.now();
      let passed = false;
      let actualOutput = "";

      try {
        let parsedInput = tc.input;
        try { parsedInput = JSON.parse(tc.input); } catch (_) {}
        let res;
        if (typeof TargetClass === "function") {
          try {
            const instance = new TargetClass();
            res = typeof instance.solve === "function" ? instance.solve(parsedInput) : TargetClass(parsedInput);
          } catch (_) {
            res = TargetClass(parsedInput);
          }
        }
        actualOutput = typeof res === "object" && res !== null ? JSON.stringify(res) : String(res ?? "");
        passed = actualOutput.trim().toLowerCase() === String(tc.expectedOutput ?? "").trim().toLowerCase();
      } catch (err) {
        passed = false;
        actualOutput = `Error: ${err.message}`;
      }

      const runtimeMs = Math.max(1, Math.round(performance.now() - startCase));
      totalTime += runtimeMs;

      results.push({
        ...tc,
        passed,
        actualOutput,
        runtime: `${runtimeMs}ms`,
        isNonAuthoritativePreview: true,
      });
    }

    return {
      success: true,
      isNonAuthoritativePreview: true,
      testCases: results,
      totalTimeMs: totalTime,
    };
  } catch (err) {
    return {
      success: false,
      isNonAuthoritativePreview: true,
      error: err.message,
      testCases: testCases.map((tc) => ({
        ...tc,
        passed: false,
        actualOutput: `Syntax/Runtime Error: ${err.message}`,
        runtime: "0ms",
      })),
      totalTimeMs: 0,
    };
  }
}

/**
 * Interactive test runner (POST /api/challenges/:id/run)
 * Runs against public tests only. No scores, no badges, no persistence (§5).
 */
export async function executeChallengeTests({
  challengeId,
  code,
  language = "javascript",
  testCases = [],
  customInput = null,
}) {
  try {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/run`, {
      code,
      language,
      customInput,
    });
    return data;
  } catch (err) {
    // If backend is unreachable, offer non-authoritative local preview with explicit flag
    console.warn("Backend run failed, providing non-authoritative local preview:", err.message);
    return evaluateSolutionPreview(code, testCases, customInput);
  }
}

/**
 * Submit challenge solution (POST /api/submissions)
 * Canonical endpoint (§5). Real ObjectId, 202 status.
 * Never invents scores or badges on error (§0 Invariant 2).
 */
export async function submitChallengeSolution({
  challengeId,
  code,
  language = "javascript",
  keystrokeCount = 0,
  timeSpentSeconds = 0,
}) {
  const payload = {
    challengeId,
    code,
    language,
    telemetry: {
      keystrokeCount,
      timeSpentSeconds,
    },
  };

  const response = await axiosInstance.post("/submissions", payload);
  return response.data; // { submissionId, status: "queued" }
}

/**
 * Fetch persisted submission by ID (GET /api/submissions/:id)
 */
export async function getSubmissionById(submissionId) {
  const response = await axiosInstance.get(`/submissions/${submissionId}`);
  return response.data?.submission;
}

/**
 * Poll submission status until terminal state is reached
 */
export async function pollSubmissionStatus(submissionId, onStatusUpdate, maxAttempts = 40, intervalMs = 1000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const submission = await getSubmissionById(submissionId);
    if (onStatusUpdate && submission) {
      onStatusUpdate(submission);
    }

    if (submission && !["queued", "executing", "evaluating"].includes(submission.status)) {
      return submission;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Submission processing timed out while waiting for server verification");
}

/**
 * Fetch past submissions for a challenge (GET /api/submissions?challengeId=...)
 */
export async function getChallengeSubmissions(challengeId) {
  try {
    const { data } = await axiosInstance.get(`/submissions?challengeId=${challengeId}`);
    return data;
  } catch {
    return { submissions: [] };
  }
}
