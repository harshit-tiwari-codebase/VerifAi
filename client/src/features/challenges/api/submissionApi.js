import axiosInstance from "../../../api/axiosInstance";

function formatLogArg(arg) {
  if (typeof arg === "string") return arg;
  if (typeof arg === "undefined") return "undefined";
  if (arg === null) return "null";
  try {
    return typeof arg === "object" ? JSON.stringify(arg) : String(arg);
  } catch (_) {
    return String(arg);
  }
}

/**
 * High-performance, sandboxed local preview evaluator for offline/interactive dev feedback.
 * Captures all console.log/info/warn/error statements into a structured log stream,
 * intelligently detects user classes/functions, and executes test cases accurately.
 */
export async function evaluateSolutionPreview(code, testCases = [], customInput = null) {
  const results = [];
  const logs = [];
  let totalTime = 0;

  // Intercept user console logs for interactive Terminal inspection
  const virtualConsole = {
    log: (...args) => {
      logs.push({ type: "log", text: args.map(formatLogArg).join(" "), timestamp: Date.now() });
    },
    error: (...args) => {
      logs.push({ type: "error", text: args.map(formatLogArg).join(" "), timestamp: Date.now() });
    },
    warn: (...args) => {
      logs.push({ type: "warn", text: args.map(formatLogArg).join(" "), timestamp: Date.now() });
    },
    info: (...args) => {
      logs.push({ type: "info", text: args.map(formatLogArg).join(" "), timestamp: Date.now() });
    },
  };

  try {
    // Detect classes declared in code via regex to dynamically extract target
    const declaredClasses = [];
    const classRegex = /class\s+([A-Za-z0-9_$]+)/g;
    let match;
    while ((match = classRegex.exec(code)) !== null) {
      if (!declaredClasses.includes(match[1])) declaredClasses.push(match[1]);
    }

    const declaredFunctions = [];
    const fnRegex = /(?:function\s+([A-Za-z0-9_$]+)|const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\()/g;
    while ((match = fnRegex.exec(code)) !== null) {
      const name = match[1] || match[2];
      if (name && !declaredFunctions.includes(name)) declaredFunctions.push(name);
    }

    // Build module extractor wrapper
    const createModule = new Function(
      "console",
      `
      "use strict";
      const exports = {};
      const module = { exports };
      ${code}

      // 1. Explicit exports
      if (typeof module.exports === 'function') return module.exports;
      if (module.exports && typeof module.exports.default === 'function') return module.exports.default;
      if (module.exports && typeof module.exports === 'object') {
        if (typeof module.exports.Solution === 'function') return module.exports.Solution;
        if (typeof module.exports.TokenBucket === 'function') return module.exports.TokenBucket;
        if (typeof module.exports.LRUCache === 'function') return module.exports.LRUCache;
        for (const k of Object.keys(module.exports)) {
          if (typeof module.exports[k] === 'function') return module.exports[k];
        }
      }

      // 2. Known common class names
      if (typeof Solution !== 'undefined') return Solution;
      if (typeof TokenBucket !== 'undefined') return TokenBucket;
      if (typeof LRUCache !== 'undefined') return LRUCache;

      // 3. Fallback to declared classes
      ${declaredClasses
        .map((cls) => `if (typeof ${cls} !== 'undefined') return ${cls};`)
        .join("\n")}

      // 4. Fallback to declared functions
      ${declaredFunctions
        .map((fn) => `if (typeof ${fn} !== 'undefined') return ${fn};`)
        .join("\n")}

      return null;
    `
    );

    const Target = createModule(virtualConsole);

    // Helper to invoke target class/function with input
    const executeOnTarget = async (target, input, sharedState = {}) => {
      let instance = sharedState.instance;

      if (!instance && typeof target === "function") {
        try {
          if (input && typeof input === "object" && (input.capacity !== undefined || input.refillRate !== undefined)) {
            instance = new target(input.capacity, input.refillRate);
          } else {
            instance = new target();
          }
          sharedState.instance = instance;
        } catch (_) {
          // Plain function, not constructor
        }
      }

      let res;
      if (instance) {
        if (typeof instance.solve === "function") {
          res = await instance.solve(input);
        } else if (input && typeof input.action === "string" && typeof instance[input.action] === "function") {
          if (input.key !== undefined && input.value !== undefined) {
            res = await instance[input.action](input.key, input.value, input.ttlMs || 0);
          } else if (input.key !== undefined) {
            res = await instance[input.action](input.key);
          } else {
            res = await instance[input.action]();
          }
        } else if (input && typeof input.tokens === "number" && typeof instance.allow === "function") {
          res = await instance.allow(input.tokens);
        } else if (typeof input === "number" && typeof instance.allow === "function") {
          res = await instance.allow(input);
        } else if (typeof target === "function") {
          res = await target(input);
        }
      } else if (typeof target === "function") {
        res = await target(input);
      }

      return res;
    };

    // Custom Input Execution
    if (customInput !== null) {
      const startTime = performance.now();
      let parsed = customInput;
      try {
        parsed = JSON.parse(customInput);
      } catch (_) {}

      let res;
      try {
        res = await executeOnTarget(Target, parsed);
      } catch (execErr) {
        res = `Execution error: ${execErr.message}`;
        logs.push({ type: "error", text: execErr.message, timestamp: Date.now() });
      }

      const elapsed = Math.max(1, Math.round(performance.now() - startTime));
      const formattedOutput =
        typeof res === "object" && res !== null
          ? JSON.stringify(res, null, 2)
          : String(res ?? "undefined");

      return {
        success: true,
        isNonAuthoritativePreview: true,
        customOutput: `✓ Execution finished in ${elapsed}ms\nOutput: ${formattedOutput}`,
        runtimeMs: elapsed,
        logs,
      };
    }

    // Stateful instance holder for sequential test case execution
    const sharedState = {};

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const startCase = performance.now();
      let passed = false;
      let actualOutput = "";

      try {
        let parsedInput = tc.input;
        try {
          parsedInput = JSON.parse(tc.input);
        } catch (_) {}

        let res = await executeOnTarget(Target, parsedInput, sharedState);
        actualOutput =
          typeof res === "object" && res !== null ? JSON.stringify(res) : String(res ?? "");

        const normalizedActual = actualOutput.trim().toLowerCase();
        const normalizedExpected = String(tc.expectedOutput ?? "").trim().toLowerCase();

        passed = normalizedActual === normalizedExpected;
      } catch (err) {
        passed = false;
        actualOutput = `Error: ${err.message}`;
        logs.push({ type: "error", text: `Case #${i + 1}: ${err.message}`, timestamp: Date.now() });
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

    const passedCount = results.filter((r) => r.passed).length;

    return {
      success: true,
      isNonAuthoritativePreview: true,
      testCases: results,
      passedCount,
      totalCount: testCases.length,
      logs,
      totalTimeMs: totalTime,
    };
  } catch (err) {
    logs.push({ type: "error", text: `Syntax / Compilation Error: ${err.message}`, timestamp: Date.now() });
    return {
      success: false,
      isNonAuthoritativePreview: true,
      error: err.message,
      errorMessage: err.message,
      compileOutput: err.message,
      logs,
      testCases: testCases.map((tc) => ({
        ...tc,
        passed: false,
        actualOutput: `Syntax/Runtime Error: ${err.message}`,
        runtime: "0ms",
      })),
      passedCount: 0,
      totalCount: testCases.length,
      totalTimeMs: 0,
    };
  }
}

/**
 * Interactive test runner (POST /api/challenges/:id/run with local preview fallback)
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
    if (
      challengeId &&
      typeof challengeId === "string" &&
      challengeId.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(challengeId)
    ) {
      const { data } = await axiosInstance.post(`/challenges/${challengeId}/run`, {
        code,
        language,
        customInput,
      });
      if (data && data.testCases && data.testCases.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // If backend is unreachable or returns 401/400, provide high-performance local evaluator
    console.warn("Backend run failed, providing high-performance local evaluator:", err.message);
  }

  return await evaluateSolutionPreview(code, testCases, customInput);
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
export async function pollSubmissionStatus(submissionId, onStatusUpdate, maxAttempts = 60, intervalMs = 1500) {
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
