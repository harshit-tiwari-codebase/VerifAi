/**
 * Comparator utility supporting the Challenge Execution Contract comparison modes:
 * - exact
 * - numeric-tolerance
 * - unordered-array
 * - deep-equal-object
 */

function areEqual(actual, expected, mode = "exact") {
  if (mode === "numeric-tolerance") {
    const actNum = typeof actual === "number" ? actual : Number(actual);
    const expNum = typeof expected === "number" ? expected : Number(expected);
    if (isNaN(actNum) || isNaN(expNum)) return false;
    return Math.abs(actNum - expNum) <= 1e-6;
  }

  if (mode === "unordered-array") {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    if (actual.length !== expected.length) return false;
    const remainingExpected = [...expected];
    for (const item of actual) {
      const idx = remainingExpected.findIndex((e) =>
        areEqual(item, e, "deep-equal-object")
      );
      if (idx === -1) return false;
      remainingExpected.splice(idx, 1);
    }
    return true;
  }

  if (mode === "deep-equal-object") {
    if (actual === expected) return true;
    if (
      actual === null ||
      expected === null ||
      typeof actual !== "object" ||
      typeof expected !== "object"
    ) {
      return actual === expected;
    }
    if (Array.isArray(actual) !== Array.isArray(expected)) return false;
    if (Array.isArray(actual)) {
      if (actual.length !== expected.length) return false;
      for (let i = 0; i < actual.length; i++) {
        if (!areEqual(actual[i], expected[i], "deep-equal-object")) return false;
      }
      return true;
    }
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    if (actualKeys.length !== expectedKeys.length) return false;
    for (const key of actualKeys) {
      if (!Object.prototype.hasOwnProperty.call(expected, key)) return false;
      if (!areEqual(actual[key], expected[key], "deep-equal-object")) return false;
    }
    return true;
  }

  // mode === "exact"
  if (actual === expected) return true;
  if (actual === null || expected === null || actual === undefined || expected === undefined) {
    return false;
  }

  if (
    typeof actual === "object" &&
    actual !== null &&
    typeof expected === "object" &&
    expected !== null
  ) {
    return areEqual(actual, expected, "deep-equal-object");
  }

  if (typeof actual === "boolean" && typeof expected === "string") {
    return String(actual).toLowerCase() === expected.toLowerCase();
  }
  if (typeof actual === "string" && typeof expected === "boolean") {
    return actual.toLowerCase() === String(expected).toLowerCase();
  }
  if (typeof actual === "number" && typeof expected === "string") {
    return String(actual) === expected.trim();
  }
  if (typeof actual === "string" && typeof expected === "number") {
    return actual.trim() === String(expected);
  }

  return String(actual).trim() === String(expected).trim();
}

module.exports = { areEqual };
