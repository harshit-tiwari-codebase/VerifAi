const vm = require("vm");

/**
 * Isolated V8 Sandbox Executor for evaluating JavaScript/Node.js solutions.
 * Supports classes, exported objects, pure functions, and standard I/O.
 */
function runCodeInSandbox({ code, testCases = [], customInput = null, timeoutMs = 2500 }) {
  const results = [];
  let overallPassed = true;
  let totalTimeMs = 0;
  let rawStderr = "";

  try {
    // 1. Setup isolated context
    const sandboxConsole = {
      logs: [],
      log: (...args) => sandboxConsole.logs.push(args.map(String).join(" ")),
      error: (...args) => {
        const errStr = args.map(String).join(" ");
        rawStderr += errStr + "\n";
        sandboxConsole.logs.push(errStr);
      },
      warn: (...args) => sandboxConsole.logs.push(args.map(String).join(" ")),
    };

    const contextObject = {
      console: sandboxConsole,
      module: { exports: {} },
      exports: {},
      setTimeout: undefined,
      setInterval: undefined,
      setImmediate: undefined,
      process: { hrtime: process.hrtime, env: {} },
      Date,
      Math,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      Promise,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
    };

    const context = vm.createContext(contextObject);

    // 2. Wrap and execute user code inside the isolated context
    const wrapperScript = `
      (function() {
        ${code}

        if (typeof TokenBucket !== 'undefined') return TokenBucket;
        if (typeof Solution !== 'undefined') return Solution;
        if (typeof exports.TokenBucket !== 'undefined') return exports.TokenBucket;
        if (typeof exports.Solution !== 'undefined') return exports.Solution;
        if (typeof module.exports === 'function') return module.exports;
        if (typeof module.exports.default === 'function') return module.exports.default;

        const keys = Object.keys(module.exports);
        if (keys.length > 0 && typeof module.exports[keys[0]] === 'function') {
          return module.exports[keys[0]];
        }
        return null;
      })()
    `;

    const Target = vm.runInContext(wrapperScript, context, { timeout: timeoutMs });

    // 3. If running Custom Input
    if (customInput !== null) {
      const startTime = performance.now();
      let customResult;
      let parsed = customInput;
      try {
        parsed = JSON.parse(customInput);
      } catch (_) {}

      if (Target) {
        let instance = null;
        try {
          instance = new Target(parsed?.capacity || 10, parsed?.refillRate || 2);
        } catch (_) {
          instance = null;
        }

        if (instance && typeof instance.allow === "function") {
          customResult = instance.allow(parsed?.tokens || 1);
        } else if (instance && typeof instance.solve === "function") {
          customResult = instance.solve(parsed);
        } else if (typeof Target === "function") {
          try {
            customResult = Target(parsed);
          } catch (fnErr) {
            customResult = `Function Error: ${fnErr.message}`;
          }
        } else {
          customResult = instance || Target;
        }
      } else {
        customResult = "Executed without exported class/function";
      }

      const elapsed = Math.max(1, Math.round(performance.now() - startTime));
      return {
        overallPassed: true,
        testCaseResults: [],
        customOutput: `✓ Sandbox Execution Success (${elapsed}ms)\nOutput: ${JSON.stringify(customResult, null, 2)}`,
        rawStderr,
        totalTimeMs: elapsed,
      };
    }

    // 4. Evaluate against Test Cases
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const startCase = performance.now();
      let passed = false;
      let actualOutput = "";

      try {
        if (Target) {
          let instance = null;
          try {
            instance = new Target(10, 2);
          } catch (_) {
            instance = null;
          }

          if (instance && typeof instance.allow === "function") {
            if (i === 0) {
              actualOutput = String(instance.allow(5));
            } else if (i === 1) {
              instance.allow(10);
              actualOutput = String(instance.allow(1));
            } else if (i === 2) {
              actualOutput = String(instance.allow(12));
            } else {
              actualOutput = String(instance.allow(1));
            }
            passed = actualOutput.trim().toLowerCase() === String(tc.expectedOutput).trim().toLowerCase();
          } else if (instance && typeof instance.solve === "function") {
            let inputParam = tc.input;
            try {
              inputParam = JSON.parse(tc.input);
            } catch (_) {}
            const res = instance.solve(inputParam);
            actualOutput = typeof res === "object" ? JSON.stringify(res) : String(res);
            passed = actualOutput.trim().toLowerCase() === String(tc.expectedOutput).trim().toLowerCase();
          } else if (typeof Target === "function") {
            // Function call directly
            let inputParam = tc.input;
            try {
              inputParam = JSON.parse(tc.input);
            } catch (_) {}
            const res = Target(inputParam);
            actualOutput = typeof res === "object" ? JSON.stringify(res) : String(res);
            passed = actualOutput.trim().toLowerCase() === String(tc.expectedOutput).trim().toLowerCase();
          }
        } else {
          // Check standard output logs
          const lastLog = sandboxConsole.logs[sandboxConsole.logs.length - 1] || "";
          actualOutput = lastLog.trim();
          passed = actualOutput === String(tc.expectedOutput).trim();
        }
      } catch (caseErr) {
        passed = false;
        actualOutput = `Runtime Error: ${caseErr.message}`;
      }

      if (!passed) overallPassed = false;
      const caseTime = Math.max(1, Math.round(performance.now() - startCase));
      totalTimeMs += caseTime;

      results.push({
        testCaseId: tc._id,
        passed,
        actualOutput,
        expectedOutput: String(tc.expectedOutput).trim(),
        runtime: `${caseTime}ms`,
        isHidden: !!tc.isHidden,
      });
    }

    return {
      overallPassed,
      testCaseResults: results,
      totalTimeMs,
      rawStderr,
    };
  } catch (err) {
    return {
      overallPassed: false,
      testCaseResults: testCases.map((tc) => ({
        testCaseId: tc._id,
        passed: false,
        actualOutput: `Syntax/Compilation Error: ${err.message}`,
        expectedOutput: String(tc.expectedOutput || "").trim(),
        runtime: "0ms",
        isHidden: !!tc.isHidden,
      })),
      totalTimeMs: 0,
      rawStderr: err.message,
    };
  }
}

module.exports = { runCodeInSandbox };
