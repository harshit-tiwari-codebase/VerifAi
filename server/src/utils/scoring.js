/**
 * VerifAI Versioned Scoring Policy (§3)
 *
 * scoreVersion: "v1"
 * correctness = 100 * weighted_points_passed / weighted_points_total
 * finalScore  = round(
 *   0.70 * correctness +
 *   0.15 * codeQuality +
 *   0.10 * efficiency +
 *   0.05 * edgeCases
 * )
 */

const BADGE_THRESHOLD = Number(process.env.BADGE_SCORE_THRESHOLD || 70);

/**
 * Validates whether a value is a finite number in [0, 100].
 */
function isValidSubscore(val) {
  return typeof val === "number" && Number.isFinite(val) && val >= 0 && val <= 100;
}

/**
 * Validates AI evaluation schema.
 * Rejects and marks ai_evaluation_failed if qualitative scores are missing or out of [0, 100].
 */
function validateAiEvaluation(aiEvaluation) {
  if (!aiEvaluation || typeof aiEvaluation !== "object") {
    return { valid: false, reason: "Missing or malformed AI evaluation object" };
  }
  const { codeQuality, efficiency, edgeCases } = aiEvaluation;
  if (!isValidSubscore(codeQuality)) {
    return { valid: false, reason: `Invalid codeQuality subscore: ${codeQuality}` };
  }
  if (!isValidSubscore(efficiency)) {
    return { valid: false, reason: `Invalid efficiency subscore: ${efficiency}` };
  }
  if (!isValidSubscore(edgeCases)) {
    return { valid: false, reason: `Invalid edgeCases subscore: ${edgeCases}` };
  }
  return { valid: true };
}

/**
 * Centralized Scoring Policy v1
 */
function calculateScore({
  executionType = "both",
  testResults = [],
  aiEvaluation = null,
  threshold = BADGE_THRESHOLD,
}) {
  // 1. review_only challenges: explicit result shape, no correctness field, no auto badge
  if (executionType === "review_only") {
    const aiValidation = validateAiEvaluation(aiEvaluation);
    if (!aiValidation.valid) {
      const err = new Error(aiValidation.reason);
      err.code = "AI_EVALUATION_FAILED";
      throw err;
    }
    const { codeQuality, efficiency, edgeCases } = aiEvaluation;
    const finalScore = Math.round(
      0.40 * codeQuality + 0.35 * efficiency + 0.25 * edgeCases
    );
    return {
      scoreVersion: "v1",
      executionType: "review_only",
      finalScore,
      subscores: { codeQuality, efficiency, edgeCases },
      badgeEligible: false, // review_only requires human review, cannot issue automatic badge
      threshold,
    };
  }

  // 2. Automated testcases / both: must have tests
  if (!Array.isArray(testResults) || testResults.length === 0) {
    const err = new Error("Cannot score submission: test suite is empty or missing");
    err.code = "EVALUATION_ERROR";
    throw err;
  }

  let weightedPointsPassed = 0;
  let weightedPointsTotal = 0;
  let passedCount = 0;
  let totalCount = testResults.length;
  let requiredPassedCount = 0;
  let requiredTotalCount = 0;

  for (const tr of testResults) {
    const weight = typeof tr.weight === "number" && tr.weight >= 0 ? tr.weight : 1;
    const isRequired = tr.isRequired !== false; // default true

    weightedPointsTotal += weight;
    if (isRequired) requiredTotalCount++;

    if (tr.passed) {
      weightedPointsPassed += weight;
      passedCount++;
      if (isRequired) requiredPassedCount++;
    }
  }

  // Hard rule: if weighted_points_total === 0 -> evaluation_error
  if (weightedPointsTotal === 0) {
    const err = new Error("Cannot score submission: total weighted test points is 0");
    err.code = "EVALUATION_ERROR";
    throw err;
  }

  const correctness = (100 * weightedPointsPassed) / weightedPointsTotal;

  // For pure testcases (no AI review)
  if (executionType === "testcases") {
    const finalScore = Math.round(correctness);
    const badgeEligible =
      requiredPassedCount === requiredTotalCount && finalScore >= threshold;
    return {
      scoreVersion: "v1",
      executionType: "testcases",
      correctness,
      finalScore,
      passedCount,
      totalCount,
      requiredPassedCount,
      requiredTotalCount,
      badgeEligible,
      threshold,
    };
  }

  // executionType === "both"
  const aiValidation = validateAiEvaluation(aiEvaluation);
  if (!aiValidation.valid) {
    const err = new Error(aiValidation.reason);
    err.code = "AI_EVALUATION_FAILED";
    throw err;
  }

  const { codeQuality, efficiency, edgeCases } = aiEvaluation;
  const finalScore = Math.round(
    0.70 * correctness +
    0.15 * codeQuality +
    0.10 * efficiency +
    0.05 * edgeCases
  );

  // Badge eligibility is a separate gate: required tests passed AND finalScore >= threshold
  const badgeEligible =
    requiredPassedCount === requiredTotalCount && finalScore >= threshold;

  return {
    scoreVersion: "v1",
    executionType: "both",
    correctness,
    finalScore,
    subscores: {
      correctness: Math.round(correctness),
      codeQuality,
      efficiency,
      edgeCases,
    },
    passedCount,
    totalCount,
    requiredPassedCount,
    requiredTotalCount,
    badgeEligible,
    threshold,
  };
}

module.exports = {
  calculateScore,
  validateAiEvaluation,
  isValidSubscore,
  BADGE_THRESHOLD,
};
