const test = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluateSubmissionWithAi,
  setMockAiEvaluator,
  stripFences,
} = require("../utils/aiEvaluator");

test("stripFences: removes markdown code blocks cleanly", () => {
  assert.equal(stripFences('```json\n{"score": 90}\n```'), '{"score": 90}');
  assert.equal(stripFences('```\n{"score": 90}\n```'), '{"score": 90}');
  assert.equal(stripFences('{"score": 90}'), '{"score": 90}');
});

test("AI Evaluator: valid response returns structured evaluation", async () => {
  setMockAiEvaluator(async () => ({
    codeQuality: 88,
    efficiency: 92,
    edgeCases: 85,
    strengths: ["Clean OOP architecture"],
    weaknesses: [],
    suggestions: ["Add input bounds validation"],
  }));

  const result = await evaluateSubmissionWithAi({
    code: "class Solution {}",
    challenge: { title: "Test" },
  });

  assert.equal(result.codeQuality, 88);
  assert.equal(result.efficiency, 92);
  assert.equal(result.edgeCases, 85);
  assert.equal(result.validated, true);
  assert.equal(result.evaluatorVersion, "mock-evaluator");
});

test("AI Evaluator: out-of-range scores are rejected with AI_EVALUATION_FAILED", async () => {
  setMockAiEvaluator(async () => ({
    codeQuality: 150, // invalid!
    efficiency: 90,
    edgeCases: 80,
  }));

  await assert.rejects(
    async () => {
      await evaluateSubmissionWithAi({
        code: "class Solution {}",
        challenge: { title: "Test" },
      });
    },
    (err) => {
      assert.equal(err.code, "AI_EVALUATION_FAILED");
      return true;
    }
  );
});

test("AI Evaluator: NaN score is rejected with AI_EVALUATION_FAILED", async () => {
  setMockAiEvaluator(async () => ({
    codeQuality: NaN,
    efficiency: 90,
    edgeCases: 80,
  }));

  await assert.rejects(
    async () => {
      await evaluateSubmissionWithAi({
        code: "class Solution {}",
        challenge: { title: "Test" },
      });
    },
    (err) => {
      assert.equal(err.code, "AI_EVALUATION_FAILED");
      return true;
    }
  );
});

test("AI Evaluator: missing fields rejected with AI_EVALUATION_FAILED", async () => {
  setMockAiEvaluator(async () => ({
    codeQuality: 85,
    // efficiency and edgeCases missing!
  }));

  await assert.rejects(
    async () => {
      await evaluateSubmissionWithAi({
        code: "class Solution {}",
        challenge: { title: "Test" },
      });
    },
    (err) => {
      assert.equal(err.code, "AI_EVALUATION_FAILED");
      return true;
    }
  );

  // Reset mock
  setMockAiEvaluator(null);
});

test("AI Evaluator: missing GEMINI_API_KEY throws PROVIDER_UNAVAILABLE in production", async () => {
  const origKey = process.env.GEMINI_API_KEY;
  const origEnv = process.env.NODE_ENV;
  delete process.env.GEMINI_API_KEY;
  process.env.NODE_ENV = "production";

  await assert.rejects(
    async () => {
      await evaluateSubmissionWithAi({
        code: "class Solution {}",
        challenge: { title: "Test" },
      });
    },
    (err) => {
      assert.equal(err.code, "PROVIDER_UNAVAILABLE");
      return true;
    }
  );

  if (origKey) process.env.GEMINI_API_KEY = origKey;
  process.env.NODE_ENV = origEnv;
});
