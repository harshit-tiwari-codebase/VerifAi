export const DEFAULT_CHALLENGE_DATA = {
  id: "rate-limiter",
  slug: "rate-limiter",
  title: "Distributed Token Bucket Rate Limiter",
  difficulty: "Medium",
  category: "Distributed Systems",
  tags: ["distributed-systems", "concurrency", "algorithms", "redis"],
  description: `Design and implement a thread-safe Token Bucket Rate Limiter class in JavaScript.

The rate limiter must accurately replenish tokens based on elapsed time without running an active loop or background interval timer (achieving O(1) time complexity for token consumption).

Requirements:
1. Initialize with 'capacity' (maximum tokens stored) and 'refillRate' (tokens replenished per second).
2. 'allow(tokensRequested = 1)' should return 'true' if enough tokens are available and deduct them, or 'false' otherwise without mutating existing tokens.
3. Automatically clamp tokens at capacity so excessive idle periods do not accrue infinite tokens.
4. Support microsecond elapsed accuracy and handle arbitrary burst request patterns gracefully.`,
  starterCode: `class TokenBucket {
  /**
   * @param {number} capacity - Maximum bucket burst capacity
   * @param {number} refillRate - Tokens replenished per second
   */
  constructor(capacity = 10, refillRate = 2) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  /**
   * Evaluates if the requested tokens can be consumed.
   * @param {number} tokensRequested
   * @returns {boolean}
   */
  allow(tokensRequested = 1) {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefill) / 1000;

    // Replenish tokens based on elapsed delta
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsedSeconds * this.refillRate
    );
    this.lastRefill = now;

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }

    return false;
  }
}

// Export for sandbox runner
if (typeof module !== "undefined") {
  module.exports = { TokenBucket };
}
`,
  testCases: [
    {
      id: "tc_1",
      name: "Burst capacity allows up to max tokens limit",
      input: "bucket = new TokenBucket(10, 2); [bucket.allow(5), bucket.allow(5)]",
      expectedOutput: "[true, true]",
      actualOutput: "[true, true]",
      runtime: "9ms",
      passed: true,
      isHidden: false,
      logs: "PASS: Initial allocation of 5 tokens succeeded (remaining: 5)\nPASS: Second allocation of 5 tokens succeeded (remaining: 0)",
    },
    {
      id: "tc_2",
      name: "Exceeding capacity returns false without dropping state",
      input: "bucket = new TokenBucket(5, 1); bucket.allow(6)",
      expectedOutput: "false",
      actualOutput: "false",
      runtime: "4ms",
      passed: true,
      isHidden: false,
      logs: "PASS: Bucket rejected allocation of 6 with capacity 5",
    },
    {
      id: "tc_3",
      name: "Tokens replenish accurately over simulated elapsed time",
      input: "bucket = new TokenBucket(2, 2); bucket.allow(2); sleep(500); bucket.allow(1)",
      expectedOutput: "true",
      actualOutput: "true",
      runtime: "12ms",
      passed: true,
      isHidden: false,
      logs: "PASS: Token count recharged to 1.0 after 500ms sleep",
    },
    {
      id: "tc_4",
      name: "High-frequency concurrent requests preserve atomicity",
      input: "bucket = new TokenBucket(100, 50); Promise.all(100x allow(1))",
      expectedOutput: "100 passed, 0 rejected",
      actualOutput: "100 passed, 0 rejected",
      runtime: "15ms",
      passed: true,
      isHidden: false,
      logs: "PASS: Concurrency test verified without state corruption",
    },
    {
      id: "tc_5",
      name: "Hidden edge case: Negative and fractional token request handling",
      input: "/* Hidden case input masked */",
      expectedOutput: "/* Hidden expected output */",
      actualOutput: "/* Verified */",
      runtime: "11ms",
      passed: true,
      isHidden: true,
      logs: "PASS: Hidden edge case passed validation in isolated runner",
    },
    {
      id: "tc_6",
      name: "Hidden stress case: System clock jitter and backwards leap tolerance",
      input: "/* Hidden case input masked */",
      expectedOutput: "/* Hidden expected output */",
      actualOutput: "/* Verified */",
      runtime: "14ms",
      passed: true,
      isHidden: true,
      logs: "PASS: Monotonic clock fallback verified under simulated skew",
    },
  ],
  aiReview: {
    rubric: `EVALUATION CRITERIA:
• Algorithmic Complexity: O(1) runtime and auxiliary space for token consumption
• Thread Safety & Concurrency: Safe state mutation under rapid microservice spikes
• Edge Cases: Clamping against negative numbers, burst spikes, and zero refill rates
• Production Readiness: Idempotency, descriptive JSDoc comments, clean separation`,
    finalScore: 92,
    passingThreshold: 80,
    subscores: {
      correctness: 96,
      codeQuality: 92,
      efficiency: 94,
      edgeCases: 86,
    },
    verdict: "Production-Grade Solution",
    badge: {
      name: "Distributed Systems: Token Bucket Architect",
      issueId: "VRF-2026-8942-TB",
      credentialUrl: "verifai.dev/verify/VRF-2026-8942-TB",
    },
    reviewNotes: [
      "Optimal O(1) delta arithmetic avoids intervals or CPU-heavy background timers.",
      "Deterministic token reservation ensures zero dropped allocations under peak loads.",
      "Clean adherence to class encapsulation with readable variable naming.",
      "Recommendation: consider process.hrtime.bigint() for sub-millisecond precision under high-frequency distributed calls.",
    ],
  },
};
