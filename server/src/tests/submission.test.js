const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Submission = require("../models/Submission");

test("Submission persists correctness breakdown and test scoring metadata", () => {
  const submission = new Submission({
    user: new mongoose.Types.ObjectId(),
    challenge: new mongoose.Types.ObjectId(),
    code: "function solve() { return true; }",
    language: "javascript",
    executionResult: {
      testResults: [{ passed: true, weight: 3, isRequired: false }],
    },
    correctness: 75,
    subscores: {
      correctness: 75,
      codeQuality: 80,
      efficiency: 85,
      edgeCases: 90,
    },
  });

  const persistedShape = submission.toObject();
  assert.equal(persistedShape.correctness, 75);
  assert.equal(persistedShape.subscores.correctness, 75);
  assert.equal(persistedShape.executionResult.testResults[0].weight, 3);
  assert.equal(persistedShape.executionResult.testResults[0].isRequired, false);
});
