const test = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateScore,
  validateAiEvaluation,
  isValidSubscore,
  BADGE_THRESHOLD,
} = require("../utils/scoring");

// ─── isValidSubscore ─────────────────────────────────────────────────────────

test("isValidSubscore rejects NaN", () => {
  assert.equal(isValidSubscore(NaN), false);
});

test("isValidSubscore rejects Infinity", () => {
  assert.equal(isValidSubscore(Infinity), false);
  assert.equal(isValidSubscore(-Infinity), false);
});

test("isValidSubscore rejects out-of-range numbers", () => {
  assert.equal(isValidSubscore(-1), false);
  assert.equal(isValidSubscore(101), false);
});

test("isValidSubscore accepts valid numbers", () => {
  assert.equal(isValidSubscore(0), true);
  assert.equal(isValidSubscore(50), true);
  assert.equal(isValidSubscore(100), true);
});

test("isValidSubscore rejects non-numbers", () => {
  assert.equal(isValidSubscore("90"), false);
  assert.equal(isValidSubscore(null), false);
  assert.equal(isValidSubscore(undefined), false);
});

// ─── validateAiEvaluation ────────────────────────────────────────────────────

test("validateAiEvaluation rejects null", () => {
  const result = validateAiEvaluation(null);
  assert.equal(result.valid, false);
});

test("validateAiEvaluation rejects missing fields", () => {
  const result = validateAiEvaluation({ codeQuality: 80 });
  assert.equal(result.valid, false);
});

test("validateAiEvaluation rejects out-of-range scores", () => {
  const result = validateAiEvaluation({
    codeQuality: 80,
    efficiency: 150,
    edgeCases: 70,
  });
  assert.equal(result.valid, false);
});

test("validateAiEvaluation accepts valid evaluation", () => {
  const result = validateAiEvaluation({
    codeQuality: 85,
    efficiency: 92,
    edgeCases: 78,
  });
  assert.equal(result.valid, true);
});

// ─── calculateScore — empty/missing test suite ──────────────────────────────

test("No tests / malformed challenge → evaluation error, no score or badge", () => {
  assert.throws(
    () =>
      calculateScore({
        executionType: "testcases",
        testResults: [],
      }),
    (err) => {
      assert.equal(err.code, "EVALUATION_ERROR");
      return true;
    }
  );
});

test("Empty code with zero tests → evaluation error, never 94/100", () => {
  assert.throws(
    () =>
      calculateScore({
        executionType: "both",
        testResults: [],
        aiEvaluation: { codeQuality: 92, efficiency: 94, edgeCases: 88 },
      }),
    (err) => {
      assert.equal(err.code, "EVALUATION_ERROR");
      return true;
    }
  );
});

// ─── calculateScore — correct formula ────────────────────────────────────────

test("All tests passed with valid AI evaluation yields deterministic test score", () => {
  const result = calculateScore({
    executionType: "both",
    testResults: [
      { passed: true, weight: 1, isRequired: true },
      { passed: true, weight: 1, isRequired: true },
      { passed: true, weight: 1, isRequired: true },
    ],
    aiEvaluation: { codeQuality: 90, efficiency: 80, edgeCases: 70 },
  });

  // correctness = 100
  // AI review scores are advisory; only test correctness determines finalScore.
  assert.equal(result.finalScore, 100);
  assert.equal(result.badgeEligible, true);
  assert.equal(result.scoreVersion, "v2");
});

test("Half tests failed yields reduced correctness", () => {
  const result = calculateScore({
    executionType: "both",
    testResults: [
      { passed: true, weight: 1, isRequired: true },
      { passed: false, weight: 1, isRequired: true },
    ],
    aiEvaluation: { codeQuality: 80, efficiency: 80, edgeCases: 80 },
  });

  // correctness = 100 * 1/2 = 50
  assert.equal(result.finalScore, 50);
  assert.equal(result.badgeEligible, false);
});

test("AI review scores cannot lower a passing test score or affect badge eligibility", () => {
  const result = calculateScore({
    executionType: "both",
    testResults: [
      { passed: true, weight: 1, isRequired: true },
    ],
    aiEvaluation: { codeQuality: 10, efficiency: 10, edgeCases: 10 },
    threshold: 80,
  });

  // correctness = 100
  assert.equal(result.finalScore, 100);
  assert.equal(result.badgeEligible, true);
});

test("High score but required test failed → badge not eligible", () => {
  const result = calculateScore({
    executionType: "both",
    testResults: [
      { passed: true, weight: 1, isRequired: true },
      { passed: true, weight: 1, isRequired: true },
      { passed: false, weight: 1, isRequired: true },
    ],
    aiEvaluation: { codeQuality: 100, efficiency: 100, edgeCases: 100 },
  });

  // correctness = 100*2/3 = 66.67
  assert.equal(result.finalScore, 67);
  assert.equal(result.badgeEligible, false); // required test failed!
});

// ─── calculateScore — AI evaluation failures ─────────────────────────────────

test("Invalid AI evaluation (NaN) → ai_evaluation_failed, no fabricated score", () => {
  assert.throws(
    () =>
      calculateScore({
        executionType: "both",
        testResults: [{ passed: true, weight: 1, isRequired: true }],
        aiEvaluation: { codeQuality: NaN, efficiency: 80, edgeCases: 80 },
      }),
    (err) => {
      assert.equal(err.code, "AI_EVALUATION_FAILED");
      return true;
    }
  );
});

test("Missing AI evaluation for 'both' type → ai_evaluation_failed", () => {
  assert.throws(
    () =>
      calculateScore({
        executionType: "both",
        testResults: [{ passed: true, weight: 1, isRequired: true }],
        aiEvaluation: null,
      }),
    (err) => {
      assert.equal(err.code, "AI_EVALUATION_FAILED");
      return true;
    }
  );
});

// ─── calculateScore — pure testcases (no AI) ─────────────────────────────────

test("Pure testcases: correctness equals the weighted result directly", () => {
  const result = calculateScore({
    executionType: "testcases",
    testResults: [
      { passed: true, weight: 2, isRequired: true },
      { passed: false, weight: 1, isRequired: true },
    ],
  });

  // correctness = 100 * 2/3 = 66.67
  // finalScore = round(66.67) = 67
  assert.equal(result.finalScore, 67);
  assert.equal(result.badgeEligible, false);
});

test("Pure testcases: all passed with correct weight → badge eligible", () => {
  const result = calculateScore({
    executionType: "testcases",
    testResults: [
      { passed: true, weight: 1, isRequired: true },
      { passed: true, weight: 1, isRequired: true },
    ],
  });

  assert.equal(result.finalScore, 100);
  assert.equal(result.badgeEligible, true);
});

// ─── calculateScore — review_only ────────────────────────────────────────────

test("review_only: no model-generated score or badge is issued", () => {
  const result = calculateScore({
    executionType: "review_only",
    aiEvaluation: { codeQuality: 90, efficiency: 85, edgeCases: 80 },
  });

  assert.equal(result.finalScore, null);
  assert.equal(result.badgeEligible, false);
});

// ─── calculateScore — weighted tests ─────────────────────────────────────────

test("Weighted tests: weighted points correctly used", () => {
  const result = calculateScore({
    executionType: "testcases",
    testResults: [
      { passed: true, weight: 3, isRequired: true },
      { passed: false, weight: 1, isRequired: false },
    ],
  });

  // correctness = 100 * 3/4 = 75
  assert.equal(result.finalScore, 75);
  // Required: 1 passed out of 1 required → met. Score 75 >= 70 threshold → eligible
  assert.equal(result.badgeEligible, true);
});
