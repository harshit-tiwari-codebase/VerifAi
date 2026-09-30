const { areEqual } = require("./comparator");

/**
 * Builds candidate code + test harness wrapper for Judge0 execution.
 * Supports:
 * 1. New Target Design v2 structured operations (setup + operations sequence on one instance)
 * 2. Existing VerifAI OOP algorithm classes with .solve(input) adapter method
 * 3. Pure function invocations and static solvers
 * 4. Stdin/stdout challenges
 */
function buildHarness({ code, language = "javascript", executionAdapter = {}, testCase }) {
  const {
    kind = "function",
    entryPoint = "Solution",
    comparisonMode = "exact",
  } = executionAdapter;

  if (kind === "stdin-stdout") {
    return {
      sourceCode: code,
      stdin: testCase.input || "",
      expectedOutput: testCase.expectedOutput || "",
    };
  }

  const comparatorStr = areEqual.toString();

  // If this test case has structured operations (class-stateful §1)
  if (Array.isArray(testCase.operations) && testCase.operations.length > 0) {
    const setupArgs = JSON.stringify(testCase.setup?.constructorArgs || []);
    const operations = JSON.stringify(testCase.operations);

    const sourceCode = `
${code}

// --- VERIFAI EXECUTION HARNESS ---
const __areEqual = ${comparatorStr};

(function __verifai_run() {
  try {
    let Target = null;
    if (typeof ${entryPoint} !== 'undefined') Target = ${entryPoint};
    else if (typeof module !== 'undefined' && module.exports && module.exports.${entryPoint}) Target = module.exports.${entryPoint};
    else if (typeof module !== 'undefined' && module.exports && typeof module.exports === 'function') Target = module.exports;
    else if (typeof Solution !== 'undefined') Target = Solution;
    else if (typeof TokenBucket !== 'undefined') Target = TokenBucket;
    else if (typeof LRUCache !== 'undefined') Target = LRUCache;

    if (!Target) {
      console.error("Entry point '${entryPoint}' not found in candidate code");
      process.exit(1);
    }

    const constructorArgs = ${setupArgs};
    const instance = new Target(...constructorArgs);
    const operations = ${operations};

    let allPassed = true;
    const opResults = [];

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      if (typeof instance[op.call] !== 'function') {
        throw new Error("Method '" + op.call + "' is not a function on instance");
      }
      const actual = instance[op.call](...(op.args || []));
      const passed = __areEqual(actual, op.expected, "${comparisonMode}");
      if (!passed) allPassed = false;
      opResults.push({ call: op.call, actual, expected: op.expected, passed });
    }

    console.log(JSON.stringify({ passed: allPassed, opResults }));
  } catch (err) {
    console.error("RUNTIME_ERROR: " + (err && err.message ? err.message : String(err)));
    process.exit(1);
  }
})();
`;
    return { sourceCode, stdin: "", expectedOutput: "" };
  }

  // Universal runner for standard test cases (supports both pure functions and classes with .solve(input))
  const inputStr = JSON.stringify(testCase.input || "");
  const expectedStr = JSON.stringify(testCase.expectedOutput || "");

  const sourceCode = `
${code}

// --- VERIFAI EXECUTION HARNESS ---
const __areEqual = ${comparatorStr};

(function __verifai_run() {
  try {
    let Target = null;
    if (typeof ${entryPoint} !== 'undefined') Target = ${entryPoint};
    else if (typeof module !== 'undefined' && module.exports && module.exports.${entryPoint}) Target = module.exports.${entryPoint};
    else if (typeof module !== 'undefined' && module.exports && typeof module.exports === 'function') Target = module.exports;
    else if (typeof Solution !== 'undefined') Target = Solution;
    else if (typeof TokenBucket !== 'undefined') Target = TokenBucket;
    else if (typeof LRUCache !== 'undefined') Target = LRUCache;
    else if (typeof module !== 'undefined' && module.exports && typeof module.exports === 'object') {
      const keys = Object.keys(module.exports);
      if (keys.length > 0 && typeof module.exports[keys[0]] === 'function') {
        Target = module.exports[keys[0]];
      }
    }

    if (!Target) {
      console.error("Entry point '${entryPoint}' not found in candidate code");
      process.exit(1);
    }

    const rawInput = ${inputStr};
    let parsedInput = rawInput;
    try { parsedInput = JSON.parse(rawInput); } catch (_) {}
    const args = Array.isArray(parsedInput) ? parsedInput : [parsedInput];

    let actual;
    let invoked = false;

    // 1. Try instantiating if it's a class with .solve() method (all VerifAI algorithm classes)
    try {
      const instance = new Target();
      if (instance && typeof instance.solve === 'function') {
        actual = instance.solve(parsedInput);
        invoked = true;
      }
    } catch (_) {}

    // 2. Try static .solve()
    if (!invoked && typeof Target.solve === 'function') {
      actual = Target.solve(parsedInput);
      invoked = true;
    }

    // 3. Try direct function invocation
    if (!invoked) {
      actual = Target(...args);
    }

    const rawExpected = ${expectedStr};
    let parsedExpected = rawExpected;
    try { parsedExpected = JSON.parse(rawExpected); } catch (_) {}

    const passed = __areEqual(actual, parsedExpected, "${comparisonMode}");
    console.log(JSON.stringify({ passed, actual, expected: parsedExpected }));
  } catch (err) {
    console.error("RUNTIME_ERROR: " + (err && err.message ? err.message : String(err)));
    process.exit(1);
  }
})();
`;
  return { sourceCode, stdin: "", expectedOutput: "" };
}

module.exports = { buildHarness };
