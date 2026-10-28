const test = require("node:test");
const assert = require("node:assert/strict");
const { areEqual } = require("../utils/comparator");

// ─── exact mode ──────────────────────────────────────────────────────────────

test("exact: identical strings match", () => {
  assert.equal(areEqual("true", "true", "exact"), true);
});

test("exact: different strings do not match", () => {
  assert.equal(areEqual("true", "false", "exact"), false);
});

test("exact: boolean vs string coercion", () => {
  assert.equal(areEqual(true, "true", "exact"), true);
  assert.equal(areEqual(false, "false", "exact"), true);
  assert.equal(areEqual(true, "false", "exact"), false);
});

test("exact: number vs string coercion", () => {
  assert.equal(areEqual(42, "42", "exact"), true);
  assert.equal(areEqual(42, "43", "exact"), false);
});

test("exact: null vs 'null'", () => {
  assert.equal(areEqual(null, null, "exact"), true);
  assert.equal(areEqual(null, "null", "exact"), false);
});

test("exact: deep object comparison falls through to deep-equal", () => {
  assert.equal(areEqual({ a: 1 }, { a: 1 }, "exact"), true);
  assert.equal(areEqual({ a: 1 }, { a: 2 }, "exact"), false);
});

// ─── numeric-tolerance mode ──────────────────────────────────────────────────

test("numeric-tolerance: floats within 1e-6 match", () => {
  assert.equal(areEqual(3.14159265, 3.14159265, "numeric-tolerance"), true);
  assert.equal(areEqual(1.0000001, 1.0000002, "numeric-tolerance"), true);
});

test("numeric-tolerance: floats beyond 1e-6 do not match", () => {
  assert.equal(areEqual(1.0, 1.1, "numeric-tolerance"), false);
});

test("numeric-tolerance: string numbers compared numerically", () => {
  assert.equal(areEqual("3.14", 3.14, "numeric-tolerance"), true);
});

test("numeric-tolerance: NaN is never equal", () => {
  assert.equal(areEqual(NaN, NaN, "numeric-tolerance"), false);
  assert.equal(areEqual("abc", "def", "numeric-tolerance"), false);
});

// ─── unordered-array mode ────────────────────────────────────────────────────

test("unordered-array: same elements, different order match", () => {
  assert.equal(areEqual([3, 1, 2], [1, 2, 3], "unordered-array"), true);
});

test("unordered-array: different lengths do not match", () => {
  assert.equal(areEqual([1, 2], [1, 2, 3], "unordered-array"), false);
});

test("unordered-array: duplicate elements handled correctly", () => {
  assert.equal(areEqual([1, 1, 2], [2, 1, 1], "unordered-array"), true);
  assert.equal(areEqual([1, 1, 2], [2, 2, 1], "unordered-array"), false);
});

test("unordered-array: non-arrays rejected", () => {
  assert.equal(areEqual("abc", [1, 2], "unordered-array"), false);
  assert.equal(areEqual([1, 2], "abc", "unordered-array"), false);
});

// ─── deep-equal-object mode ──────────────────────────────────────────────────

test("deep-equal-object: nested objects match", () => {
  assert.equal(
    areEqual({ a: { b: 1 } }, { a: { b: 1 } }, "deep-equal-object"),
    true
  );
});

test("deep-equal-object: unstable key ordering does not matter", () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { b: 2, a: 1 };
  assert.equal(areEqual(obj1, obj2, "deep-equal-object"), true);
});

test("deep-equal-object: extra key causes mismatch", () => {
  assert.equal(
    areEqual({ a: 1 }, { a: 1, b: 2 }, "deep-equal-object"),
    false
  );
});

test("deep-equal-object: arrays compared element-by-element in order", () => {
  assert.equal(areEqual([1, 2], [1, 2], "deep-equal-object"), true);
  assert.equal(areEqual([1, 2], [2, 1], "deep-equal-object"), false);
});

test("deep-equal-object: null handling", () => {
  assert.equal(areEqual(null, null, "deep-equal-object"), true);
  assert.equal(areEqual(null, {}, "deep-equal-object"), false);
});
