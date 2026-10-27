const { submitBatch, pollBatch, LANGUAGE_IDS } = require("./judge0Client");
const { buildHarness } = require("./executionHarness");

let mockExecutor = null;

function setMockExecutor(fn) {
  mockExecutor = fn;
}

/**
 * Executes a submission's code against a challenge's test cases using Judge0.
 *
 * Terminal statuses:
 * - "completed"
 * - "compilation_error"
 * - "runtime_error"
 * - "timeout"
 * - "provider_unavailable"
 */
async function executeSubmissionAgainstChallenge({
  code,
  language = "javascript",
  challenge,
}) {
  if (mockExecutor) {
    return mockExecutor({ code, language, challenge });
  }

  const testCases = challenge?.testCases || [];
  if (testCases.length === 0) {
    return {
      status: "completed",
      testResults: [],
      passedCount: 0,
      totalCount: 0,
      requiredPassedCount: 0,
      requiredTotalCount: 0,
      compileOutput: "",
    };
  }

  const submissions = testCases.map((tc) => {
    const harness = buildHarness({
      code,
      language,
      executionAdapter: challenge.executionAdapter,
      testCase: tc,
    });

    const langId = LANGUAGE_IDS[language.toLowerCase()] || 93;
    const item = {
      source_code: harness.sourceCode,
      language_id: langId,
      stdin: harness.stdin || "",
      cpu_time_limit: 3.0,
      wall_time_limit: 5.0,
      memory_limit: 128000,
      max_file_size: 1024,
    };
    if (harness.expectedOutput) {
      item.expected_output = harness.expectedOutput;
    }
    return item;
  });

  const hasJudge0Config = !!(
    process.env.RAPIDAPI_KEY ||
    process.env.JUDGE0_API_KEY ||
    (process.env.JUDGE0_API_URL && !process.env.JUDGE0_API_URL.includes("rapidapi.com"))
  );

  let batchResults;

  if (hasJudge0Config) {
    try {
      const batchResponse = await submitBatch(submissions);
      const tokens = batchResponse.map((r) => r.token);
      batchResults = await pollBatch(tokens);
    } catch (err) {
      console.error(`[codeExecutor] Judge0 provider unavailable: ${err.message}`);
      return {
        status: "provider_unavailable",
        errorCode: "PROVIDER_UNAVAILABLE",
        errorMessage: "Code execution provider is currently unavailable. Please try again later.",
        testResults: [],
        compileOutput: "",
      };
    }
  } else {
    return {
      status: "provider_unavailable",
      errorCode: "PROVIDER_UNAVAILABLE",
      errorMessage: "Code execution provider is not configured.",
      testResults: [],
      compileOutput: "",
    };
  }

  // Analyze batch results
  let overallStatus = "completed";
  let terminalError = null;
  const testResults = [];
  let passedCount = 0;
  let requiredPassedCount = 0;
  let requiredTotalCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const res = batchResults[i] || {};
    const isRequired = tc.isRequired !== false;
    if (isRequired) requiredTotalCount++;

    const statusId = res.status_id;
    const stdout = (res.stdout || "").trim();
    const stderr = (res.stderr || "").trim();
    const compileOutput = (res.compile_output || "").trim();

    // Check for compilation / syntax errors
    if (statusId === 6 || stderr.includes("SyntaxError")) {
      overallStatus = "compilation_error";
      terminalError = compileOutput || stderr || "Compilation/Syntax Error";
      break;
    }

    // Check for timeout
    if (statusId === 5) {
      overallStatus = "timeout";
      terminalError = "Execution timed out (Time Limit Exceeded)";
      break;
    }

    // Check for runtime errors
    if (statusId >= 7 && statusId <= 12) {
      overallStatus = "runtime_error";
      terminalError = stderr || res.status?.description || "Runtime Error";
      break;
    }

    // Parse harness output
    let passed = false;
    let actualOutput = stdout;
    let expectedOutput = tc.expectedOutput || "";

    if (stdout.startsWith("{") && stdout.endsWith("}")) {
      try {
        const parsed = JSON.parse(stdout);
        passed = !!parsed.passed;
        actualOutput =
          parsed.actual !== undefined
            ? JSON.stringify(parsed.actual)
            : JSON.stringify(parsed.opResults || stdout);
        if (parsed.expected !== undefined) {
          expectedOutput = JSON.stringify(parsed.expected);
        }
      } catch (_) {
        passed = statusId === 3;
      }
    } else {
      passed = statusId === 3;
    }

    if (passed) {
      passedCount++;
      if (isRequired) requiredPassedCount++;
    }

    testResults.push({
      testCaseId: tc._id,
      passed,
      isHidden: !!tc.isHidden,
      statusDescription: res.status?.description || (passed ? "Accepted" : "Failed"),
      time: res.time ? `${Math.round(parseFloat(res.time) * 1000)}ms` : "0ms",
      memory: res.memory || 0,
      actualOutput,
      expectedOutput,
      stdout,
      stderr,
      weight: tc.weight !== undefined ? tc.weight : 1,
      isRequired,
    });
  }

  if (overallStatus !== "completed") {
    return {
      status: overallStatus,
      errorCode: overallStatus.toUpperCase(),
      errorMessage: terminalError,
      testResults: [],
      compileOutput: terminalError,
    };
  }

  return {
    status: "completed",
    testResults,
    passedCount,
    totalCount: testCases.length,
    requiredPassedCount,
    requiredTotalCount,
    compileOutput: "",
  };
}

module.exports = {
  executeSubmissionAgainstChallenge,
  setMockExecutor,
};
