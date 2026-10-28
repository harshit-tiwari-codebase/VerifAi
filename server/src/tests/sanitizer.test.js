const test = require("node:test");
const assert = require("node:assert/strict");
const {
  sanitizeTestResult,
  sanitizeSubmission,
} = require("../utils/sanitizer");

// ─── sanitizeTestResult ──────────────────────────────────────────────────────

test("sanitizeTestResult: hidden test strips stdout/stderr/expected/actual", () => {
  const result = sanitizeTestResult({
    testCaseId: "abc123",
    passed: true,
    isHidden: true,
    statusDescription: "Accepted",
    time: "12ms",
    memory: 5000,
    actualOutput: "SECRET_ACTUAL",
    expectedOutput: "SECRET_EXPECTED",
    stdout: "SECRET_STDOUT",
    stderr: "SECRET_STDERR",
  });

  assert.equal(result.testCaseId, "abc123");
  assert.equal(result.passed, true);
  assert.equal(result.isHidden, true);
  assert.equal(result.time, "12ms");
  assert.equal(result.memory, 5000);

  // These MUST be absent for hidden tests
  assert.equal(result.actualOutput, undefined);
  assert.equal(result.expectedOutput, undefined);
  assert.equal(result.stdout, undefined);
  assert.equal(result.stderr, undefined);
});

test("sanitizeTestResult: public test preserves all fields", () => {
  const result = sanitizeTestResult({
    testCaseId: "def456",
    passed: false,
    isHidden: false,
    statusDescription: "Wrong Answer",
    time: "5ms",
    memory: 3000,
    actualOutput: "42",
    expectedOutput: "43",
    stdout: "debug log",
    stderr: "",
  });

  assert.equal(result.testCaseId, "def456");
  assert.equal(result.passed, false);
  assert.equal(result.isHidden, false);
  assert.equal(result.actualOutput, "42");
  assert.equal(result.expectedOutput, "43");
  assert.equal(result.stdout, "debug log");
});

test("sanitizeTestResult: null input returns null", () => {
  assert.equal(sanitizeTestResult(null), null);
});

// ─── sanitizeSubmission ──────────────────────────────────────────────────────

test("sanitizeSubmission: hidden test results are stripped in nested executionResult", () => {
  const sub = {
    _id: "sub123",
    status: "completed",
    executionResult: {
      testResults: [
        {
          testCaseId: "t1",
          passed: true,
          isHidden: false,
          actualOutput: "public_output",
          expectedOutput: "public_expected",
        },
        {
          testCaseId: "t2",
          passed: true,
          isHidden: true,
          actualOutput: "HIDDEN_output",
          expectedOutput: "HIDDEN_expected",
          stdout: "HIDDEN_stdout",
        },
      ],
    },
  };

  const sanitized = sanitizeSubmission(sub);

  // Public test: full detail
  assert.equal(sanitized.executionResult.testResults[0].actualOutput, "public_output");

  // Hidden test: stripped
  assert.equal(sanitized.executionResult.testResults[1].actualOutput, undefined);
  assert.equal(sanitized.executionResult.testResults[1].expectedOutput, undefined);
  assert.equal(sanitized.executionResult.testResults[1].stdout, undefined);
  assert.equal(sanitized.executionResult.testResults[1].passed, true);
  assert.equal(sanitized.executionResult.testResults[1].isHidden, true);
});

test("sanitizeSubmission: null returns null", () => {
  assert.equal(sanitizeSubmission(null), null);
});
