const test = require("node:test");
const assert = require("node:assert/strict");
const { buildHarness } = require("../utils/executionHarness");
const { executeSubmissionAgainstChallenge, setMockExecutor } = require("../utils/codeExecutor");

test("Execution Harness: builds stateful class runner that preserves state across operations", () => {
  const code = `
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
  }
  allow(count) {
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }
}
`;

  const harness = buildHarness({
    code,
    language: "javascript",
    executionAdapter: {
      kind: "class-stateful",
      entryPoint: "TokenBucket",
      comparisonMode: "exact",
    },
    testCase: {
      setup: { constructorArgs: [10, 2] },
      operations: [
        { call: "allow", args: [6], expected: true },
        { call: "allow", args: [6], expected: false }, // only 4 tokens left, must return false!
        { call: "allow", args: [2], expected: true },  // 4 tokens left >= 2, must return true!
      ],
    },
  });

  assert.ok(harness.sourceCode.includes("TokenBucket"));
  assert.ok(harness.sourceCode.includes("constructorArgs = [10,2]"));
  assert.ok(harness.sourceCode.includes('instance[op.call]'));
});

test("Execution Harness: correctly executes legacy/existing challenge classes with .solve()", () => {
  const code = `
class LRUCache {
  constructor(capacity = 3) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    return this.map.has(key) ? this.map.get(key) : -1;
  }
  set(key, value) {
    this.map.set(key, value);
    return true;
  }
  solve(input) {
    if (input.action === "set") return this.set(input.key, input.value);
    if (input.action === "get") return this.get(input.key);
    return true;
  }
}
if (typeof module !== "undefined") {
  module.exports = { LRUCache, Solution: LRUCache };
}
`;

  const harness = buildHarness({
    code,
    language: "javascript",
    executionAdapter: {
      kind: "function",
      entryPoint: "Solution",
      comparisonMode: "exact",
    },
    testCase: {
      input: '{"action": "set", "key": "a", "value": 100}',
      expectedOutput: "true",
    },
  });

  assert.ok(harness.sourceCode.includes("instance.solve(parsedInput)"));
});

test("Execution Provider: handles terminal failure states distinctly", async () => {
  // Test compilation_error
  setMockExecutor(async () => ({
    status: "compilation_error",
    errorCode: "COMPILATION_ERROR",
    errorMessage: "SyntaxError: Unexpected token",
    testResults: [],
    compileOutput: "SyntaxError: Unexpected token",
  }));

  const compRes = await executeSubmissionAgainstChallenge({
    code: "bad syntax {{{{",
    challenge: { testCases: [{ _id: "1" }] },
  });
  assert.equal(compRes.status, "compilation_error");
  assert.equal(compRes.errorCode, "COMPILATION_ERROR");

  // Test runtime_error
  setMockExecutor(async () => ({
    status: "runtime_error",
    errorCode: "RUNTIME_ERROR",
    errorMessage: "TypeError: undefined is not a function",
    testResults: [],
    compileOutput: "",
  }));

  const runRes = await executeSubmissionAgainstChallenge({
    code: "null.foo()",
    challenge: { testCases: [{ _id: "1" }] },
  });
  assert.equal(runRes.status, "runtime_error");

  // Test timeout
  setMockExecutor(async () => ({
    status: "timeout",
    errorCode: "TIMEOUT",
    errorMessage: "Execution timed out (Time Limit Exceeded)",
    testResults: [],
    compileOutput: "",
  }));

  const timeRes = await executeSubmissionAgainstChallenge({
    code: "while(true){}",
    challenge: { testCases: [{ _id: "1" }] },
  });
  assert.equal(timeRes.status, "timeout");

  // Test provider_unavailable
  setMockExecutor(async () => ({
    status: "provider_unavailable",
    errorCode: "PROVIDER_UNAVAILABLE",
    errorMessage: "Judge0 endpoint unreachable",
    testResults: [],
    compileOutput: "",
  }));

  const provRes = await executeSubmissionAgainstChallenge({
    code: "console.log(1)",
    challenge: { testCases: [{ _id: "1" }] },
  });
  assert.equal(provRes.status, "provider_unavailable");

  // Reset mock
  setMockExecutor(null);
});

test("Execution Provider: empty testCases returns completed with 0 counts", async () => {
  const res = await executeSubmissionAgainstChallenge({
    code: "function solve() {}",
    challenge: { testCases: [] },
  });
  assert.equal(res.status, "completed");
  assert.equal(res.totalCount, 0);
  assert.equal(res.passedCount, 0);
});
