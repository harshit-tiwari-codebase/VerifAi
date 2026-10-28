/**
 * Shared Sanitization Layer (§7)
 * Ensures hidden test inputs, expected outputs, and raw stdout/stderr
 * never leave the server in API responses or sockets.
 */

function sanitizeTestResult(result) {
  if (!result) return null;
  const resObj =
    typeof result.toObject === "function" ? result.toObject() : { ...result };

  if (resObj.isHidden) {
    return {
      testCaseId: resObj.testCaseId,
      passed: !!resObj.passed,
      isHidden: true,
      statusDescription: resObj.statusDescription,
      time: resObj.time,
      memory: resObj.memory,
    };
  }

  return {
    testCaseId: resObj.testCaseId,
    passed: !!resObj.passed,
    isHidden: false,
    statusDescription: resObj.statusDescription,
    time: resObj.time,
    memory: resObj.memory,
    actualOutput: resObj.actualOutput,
    expectedOutput: resObj.expectedOutput,
    stdout: resObj.stdout,
    stderr: resObj.stderr,
  };
}

function sanitizeSubmission(submissionDoc, reqUser) {
  if (!submissionDoc) return null;
  const sub =
    typeof submissionDoc.toObject === "function"
      ? submissionDoc.toObject()
      : JSON.parse(JSON.stringify(submissionDoc));

  if (sub.executionResult?.testResults) {
    sub.executionResult.testResults = sub.executionResult.testResults.map(
      sanitizeTestResult
    );
  }

  return sub;
}

module.exports = {
  sanitizeTestResult,
  sanitizeSubmission,
};
