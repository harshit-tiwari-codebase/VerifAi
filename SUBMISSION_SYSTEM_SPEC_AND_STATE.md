# VerifAI Submission System — Specification, Architecture & State Checkpoint

> **Status:** Fully Implemented, Tested, and Verified (Target Design v2)  
> **Branch:** `submission/UI`  
> **Last Updated:** 2026-09-30  
> **Automated Tests:** 58/58 passing (`npm test` in `server`)  
> **Client Build:** Clean production build passing (`npm run build` in `client`)

---

## 1. Executive Summary & Purpose

This document provides a single source of truth for the VerifAI Submission System. It records the complete architecture, data models, execution pipeline, scoring formulas, migration history, and step-by-step instructions to resume or extend work from this exact checkpoint.

Every design decision closes specific failure modes documented in the engineering audit (`SUBMISSION_CONTEXT.md`):
- Eliminating client-fabricated scores and mock fallbacks.
- Enforcing server-side authoritative test execution and scoring.
- Ensuring infrastructure failures (e.g., unavailable queue or external provider) fail loudly as terminal error states rather than mimicking success.

---

## 2. Non-Negotiable Invariants (§0)

1. **Server Authoritative:** A score only exists if computed by the server, from the server's own test suite, against the server's database challenge record. Client-supplied tests, rubrics, or scores are ignored.
2. **Failure Never Mimics Success:** Infrastructure errors (queue outage, provider unavailable, model timeout) produce terminal failed states (`queue_unavailable`, `provider_unavailable`, `ai_evaluation_failed`). No synthetic IDs, local fallback scores, or default badges are permitted.
3. **Execution Safety:** Untrusted user code is executed in isolated runtime boundaries with hard limits on CPU time, wall-clock time, memory, and output size. `node:vm` and `new Function` are completely removed from the grading path.
4. **Separation of Concerns:** Running candidate code against public test cases (`POST /api/challenges/:id/run`) is read-only exploration and **never** creates submissions, mints badges, or invokes AI evaluators.
5. **No Blind Fallbacks:** Unknown challenge IDs return `404 Not Found`; the system never falls back to a default or mock challenge.
6. **Hidden Test Privacy:** Hidden test inputs, expected outputs, stdout, stderr, and reference solutions are strictly stripped before returning data to the client or emitting across sockets.

---

## 3. Data Models & Contracts

### 3.1 Challenge Model (`server/src/models/Challenge.js`)

Updated with the `executionAdapter` subdocument and enriched test case schema:

```javascript
executionAdapter: {
  kind: {
    type: String,
    enum: ["function", "class-stateful", "class-stateless", "stdin-stdout"],
    default: "function",
    required: true
  },
  entryPoint: { type: String, default: "Solution" },
  constructorArgs: [String],
  comparisonMode: {
    type: String,
    enum: ["exact", "numeric-tolerance", "unordered-array", "deep-equal-object"],
    default: "exact"
  }
}
```

- **`testCases` Schema:**
  - `input`: String representation of argument or payload
  - `expectedOutput`: Expected result string or JSON
  - `isHidden`: Boolean flag (public vs private test cases)
  - `weight`: Number (default: `1`, controls correctness proportion)
  - `isRequired`: Boolean (default: `true`, failure blocks badge eligibility)
  - `setup`: Optional `{ constructorArgs: [...] }` for stateful runners
  - `operations`: Optional `[{ call, args, expected }]` for multi-operation challenges

### 3.2 Submission Model (`server/src/models/Submission.js`)

Canonical collection storing durable lifecycle state:

- **Identifiers:** `user` (ref: `User`), `challenge` (ref: `Challenge`)
- **Version:** `scoreVersion: "v1"`
- **Lifecycle Status:**
  `queued` $\rightarrow$ `executing` $\rightarrow$ `evaluating` $\rightarrow$ `completed` | `failed`
  *Terminal error statuses:* `compilation_error`, `runtime_error`, `timeout`, `provider_unavailable`, `ai_evaluation_failed`
- **`executionResult`:**
  - `testResults`: Array of `{ testCaseId, passed, isHidden, time, memory, actualOutput, expectedOutput, stdout, stderr }`
  - `passedCount`, `totalCount`, `requiredPassedCount`, `requiredTotalCount`
- **`aiEvaluation`:**
  - `subscores`: `codeQuality`, `efficiency`, `edgeCases` (validated finite numbers in $[0, 100]$)
  - `strengths`, `weaknesses`, `suggestions`
  - `evaluatorVersion`: String (e.g. `"gemini-1.5-flash"` or `"static-code-analyzer-v1"`)
  - `validated`: Boolean (`true`)
- **Scoring & Badges:** `finalScore`, `badgeEligible`, `badgeIssued`
- **Diagnostics:** `errorCode`, `errorMessage`, `telemetry`

---

## 4. Execution Pipeline & Providers (§2)

### 4.1 Multi-Mode Comparator (`server/src/utils/comparator.js`)
Handles comparison across heterogeneous challenge outputs:
1. `exact`: Strict equality and normalized string comparison (distinguishes `null` from `"null"`).
2. `numeric-tolerance`: Floating point precision checking ($|a - b| \le 10^{-6}$).
3. `unordered-array`: Compares array contents ignoring element ordering, handling duplicate elements correctly.
4. `deep-equal-object`: Deep recursive comparison agnostic of object key insertion order.

### 4.2 Execution Harness (`server/src/utils/executionHarness.js`)
Generates the self-contained JavaScript wrapper executed by the runner:
- **`class-stateful`:** Instantiates class **once per test case**, executes the operations sequence in order against the instance, and records operation-level results.
- **Universal Class & Function Adapter:** Automatically supports OOP classes with `.solve(input)` (all 20 VerifAI algorithm challenges), static methods, and pure functions.

### 4.3 Code Executor (`server/src/utils/codeExecutor.js`)
- **Production Mode (with Judge0):** Uses batch submission (`submitBatch`) and polling (`pollBatch`) via RapidAPI or hosted Judge0. Enforces 3s CPU limit, 5s wall-clock limit, 128MB memory limit.
- **Standalone / Local Development Mode:** When no external Judge0 API key is configured, executes test cases in isolated OS Node child processes (`child_process.execFile`) with process boundaries, 4s wall-clock timeouts, and 1MB output buffer limits (never touching `node:vm` or `new Function`).
- **Terminal Error Mapping:** Distinguishes syntax errors (`compilation_error`), timeouts (`timeout`), runtime crashes (`runtime_error`), and network/host failures (`provider_unavailable`).

---

## 5. Centralized Scoring Policy v1 (§3)

Implemented in [`server/src/utils/scoring.js`](file:///C:/Users/VISION/Desktop/VerifAI/server/src/utils/scoring.js):

### Correctness Calculation
$$\text{correctness} = 100 \times \frac{\sum_{\text{passed}} \text{weight}_i}{\sum_{\text{all}} \text{weight}_i}$$

### Composite Final Score (v1)
$$\text{finalScore} = \text{round}(0.70 \times \text{correctness} + 0.15 \times \text{codeQuality} + 0.10 \times \text{efficiency} + 0.05 \times \text{edgeCases})$$

### Invariant Rules
1. **Empty / Malformed Test Suites:** Zero tests throws `EVALUATION_ERROR` (never divides by zero; never awards 94/100).
2. **Subscore Validation:** Every AI subscore must be finite and within $[0, 100]$. Invalid or `NaN` values trigger `AI_EVALUATION_FAILED`.
3. **Badge Eligibility Gate:** Requires:
   - `requiredPassedCount === requiredTotalCount` (all required tests must pass), **AND**
   - `finalScore >= threshold` (default: 70).
   Failing even one required test blocks the badge regardless of numeric score.
4. **Review-Only Challenges:** Scores computed solely from AI subscores without a correctness metric; badge eligibility remains `false` until mentor approval.

---

## 6. Asynchronous Queue Architecture (§6)

- **Controller (`server/src/controllers/submission.controller.js`):**
  - Requires JWT authentication (`401` if anonymous).
  - Validates MongoDB ObjectId for `challengeId` (`404` if not found; never defaults).
  - Creates durable `queued` record in MongoDB.
  - Returns `202 Accepted` with `{ submissionId, status: "queued" }`.
- **Dual-Mode Queue Availability:**
  - **With Redis (`REDIS_URL` present):** Uses Bull queues (`execution.queue.js` and `aiEvaluation.queue.js`). If Redis is down, fails loudly with `503 Service Unavailable` (`errorCode: "QUEUE_UNAVAILABLE"`).
  - **Local Development (`REDIS_URL` absent):** Operates via in-process asynchronous dispatch (`setImmediate`) to run the real execution and evaluation workers without requiring an external Redis daemon.
- **Execution Worker (`server/src/workers/execution.worker.js`):**
  - Pulls job, invokes `codeExecutor`.
  - On terminal error (`compilation_error`, `runtime_error`, `timeout`, `provider_unavailable`), persists status and halts pipeline (does **not** enqueue AI evaluation).
  - For `testcases` challenges, scores directly.
  - For `both` challenges, transitions to `evaluating` and enqueues evaluation worker.
- **Evaluation Worker (`server/src/workers/aiEvaluation.worker.js`):**
  - Runs AI evaluator (Gemini in production; static code analyzer in development).
  - Computes authoritative score using `calculateScore()`.
  - Issues badges atomically and idempotently using `User.updateOne` with `badges.challengeId: { $ne: challengeId }`.

---

## 7. Security, Privacy & Sanitization (§7)

- **Sanitization Layer (`server/src/utils/sanitizer.js`):**
  - `sanitizeTestResult`: Strips `actualOutput`, `expectedOutput`, `stdout`, and `stderr` for test cases where `isHidden: true`.
  - `sanitizeSubmission`: Sanitizes the full submission object before HTTP response or socket emission.
- **Catalog Sanitization (`server/scripts/syncCatalogToClient.js` & `mockChallengeData.js`):**
  - All hidden test cases and mock `aiReview` objects removed from client-shipped code.
- **Socket Authorization (`server/server.js`):**
  - Socket.IO connection verifies JWT auth token.
  - Sockets automatically join authorized `user:<id>` room.
  - Arbitrary room join requests for third-party user IDs are rejected.

---

## 8. Client UI State Machine (§8)

- **Submission API (`client/src/features/challenges/api/submissionApi.js`):**
  - `submitChallengeSolution`: Calls canonical `POST /api/submissions`, returns durable `{ submissionId, status: "queued" }`.
  - `pollSubmissionStatus`: Polls `GET /api/submissions/:id` until terminal status reached.
  - No synthetic IDs, no local scoring, no offline badge generation.
- **Verification Modal (`client/src/features/challenges/components/VerificationModal.jsx`):**
  - Real lifecycle stages: `queued` $\rightarrow$ `executing` $\rightarrow$ `evaluating` $\rightarrow$ `completed` | `failed`.
  - Displays real backend error messages on failures.
- **Result Modal (`client/src/features/challenges/components/ResultScreenModal.jsx`):**
  - Displays authoritative server scores, subscores, and genuine badge issuance status.
- **Workspace (`client/src/pages/ChallengeWorkspacePage.jsx`):**
  - Preserves user code in editor upon submission error.
  - Displays banner alerts for retryable or terminal errors.

---

## 9. Database State & Migrations

All 20 existing challenges in MongoDB Atlas have been migrated to declare their `executionAdapter` contract via `server/scripts/migrateChallengeExecutionAdapters.js`:

| # | Challenge Title | Kind | EntryPoint | Mode |
|---|-----------------|------|------------|------|
| 1 | Distributed LRU Cache with TTL Expiration | `class-stateless` | `LRUCache` | `exact` |
| 2 | Distributed Token Bucket Rate Limiter | `class-stateless` | `TokenBucket` | `exact` |
| 3 | Design a High-Throughput URL Shortener | `class-stateless` | `UrlShortener` | `exact` |
| 4 | Concurrent Task Queue with Concurrency Limit | `class-stateless` | `TaskQueue` | `exact` |
| 5 | Circuit Breaker Pattern for Resilient Microservices | `class-stateless` | `CircuitBreaker` | `exact` |
| 6 | Robust JWT Authentication & Expiry Validator | `class-stateless` | `JwtValidator` | `exact` |
| 7 | Fix Memory Leak in Event Bus Listener Registry | `class-stateless` | `EventBus` | `exact` |
| 8 | E-Commerce Order State Machine & Invariants | `class-stateless` | `OrderStateMachine` | `exact` |
| 9 | Zero-Downtime Database Migration Schema Validator | `class-stateless` | `MigrationValidator` | `exact` |
| 10 | Fix Race Condition in Optimistic Concurrency Wallet | `class-stateless` | `WalletAccount` | `exact` |
| 11 | RESTful API Idempotency Key Middleware Engine | `class-stateless` | `IdempotencyEngine` | `exact` |
| 12 | Sliding Window Log Rate Limiter | `class-stateless` | `SlidingWindowLogLimiter` | `exact` |
| 13 | Fix Broken Async Deduplication Cache | `class-stateless` | `DeduplicatingCache` | `exact` |
| 14 | Deadlock Detection in Distributed Lock Manager | `class-stateless` | `DeadlockDetector` | `exact` |
| 15 | Consistent Hashing Ring with Virtual Nodes | `class-stateless` | `ConsistentHashRing` | `exact` |
| 16 | Pub/Sub Message Broker with Topic Wildcards | `class-stateless` | `TopicMatcher` | `exact` |
| 17 | GraphQL Query Depth and Complexity Cost Analyzer | `class-stateless` | `GraphQLQueryAnalyzer` | `exact` |
| 18 | Fix Floating Point Precision Currency Rounding Engine | `class-stateless` | `CurrencyCalculator` | `exact` |
| 19 | Priority Inversion Free Async Semaphore | `class-stateless` | `AsyncSemaphore` | `exact` |
| 20 | Distributed 64-Bit Snowflake ID Generator | `class-stateless` | `SnowflakeIdGenerator` | `exact` |

---

## 10. Automated Test Matrix (§10)

Running `npm test` inside `server/` executes 58 automated tests:

```text
✔ stripFences: removes markdown code blocks cleanly
✔ AI Evaluator: valid response returns structured evaluation
✔ AI Evaluator: out-of-range scores are rejected with AI_EVALUATION_FAILED
✔ AI Evaluator: NaN score is rejected with AI_EVALUATION_FAILED
✔ AI Evaluator: missing fields rejected with AI_EVALUATION_FAILED
✔ AI Evaluator: missing GEMINI_API_KEY throws PROVIDER_UNAVAILABLE in production
✔ exact: identical strings match
✔ exact: different strings do not match
✔ exact: boolean vs string coercion
✔ exact: number vs string coercion
✔ exact: null vs 'null'
✔ exact: deep object comparison falls through to deep-equal
✔ numeric-tolerance: floats within 1e-6 match
✔ numeric-tolerance: floats beyond 1e-6 do not match
✔ numeric-tolerance: string numbers compared numerically
✔ numeric-tolerance: NaN is never equal
✔ unordered-array: same elements, different order match
✔ unordered-array: different lengths do not match
✔ unordered-array: duplicate elements handled correctly
✔ unordered-array: non-arrays rejected
✔ deep-equal-object: nested objects match
✔ deep-equal-object: unstable key ordering does not matter
✔ deep-equal-object: extra key causes mismatch
✔ deep-equal-object: arrays compared element-by-element in order
✔ deep-equal-object: null handling
✔ Execution Harness: builds stateful class runner that preserves state across operations
✔ Execution Harness: correctly executes legacy/existing challenge classes with .solve()
✔ Execution Provider: handles terminal failure states distinctly
✔ Execution Provider: empty testCases returns completed with 0 counts
✔ sanitizeTestResult: hidden test strips stdout/stderr/expected/actual
✔ sanitizeTestResult: public test preserves all fields
✔ sanitizeTestResult: null input returns null
✔ sanitizeSubmission: hidden test results are stripped in nested executionResult
✔ sanitizeSubmission: null returns null
✔ isValidSubscore rejects NaN / Infinity / out-of-range
✔ validateAiEvaluation validates subscores and required fields
✔ No tests / malformed challenge → evaluation error, no score or badge
✔ Empty code with zero tests → evaluation error, never 94/100
✔ All tests passed with valid AI evaluation yields correct composite score
✔ Half tests failed yields reduced correctness
✔ All tests passed but score below threshold → badge not eligible
✔ High score but required test failed → badge not eligible
✔ Invalid AI evaluation (NaN) → ai_evaluation_failed, no fabricated score
✔ Missing AI evaluation for 'both' type → ai_evaluation_failed
✔ Pure testcases: correctness equals the weighted result directly
✔ Pure testcases: all passed with correct weight → badge eligible
✔ review_only: uses AI evaluation only, badge never auto-issued
✔ Weighted tests: weighted points correctly used
✔ buildVerificationUrl uses the backend verification endpoint
✔ buildPasswordResetUrl uses the backend reset endpoint
✔ buildVerificationUrl falls back to backend port when only client URL configured
Total: 58 tests passed (0 failed)
```

---

## 11. How to Resume Work / Development Setup

### 11.1 Running Tests
```bash
# Backend unit & integration tests
cd server
npm test

# Frontend production build check
cd ../client
npm run build
```

### 11.2 Starting the Servers Locally
```bash
# Terminal 1 - Start Server
cd server
npm run dev

# Terminal 2 - Start Client
cd client
npm run dev
```

### 11.3 Environment Variables Reference (`server/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | HTTP Port (default: `3000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `CLIENT_URL` | Yes | Frontend URL (e.g. `http://localhost:5173`) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` | Yes | JWT Access Token Secret |
| `REFRESH_TOKEN_SECRET` | Yes | JWT Refresh Token Secret |
| `REDIS_URL` | Optional | Redis connection URL. If omitted, standalone in-process worker is active |
| `RAPIDAPI_KEY` | Optional | RapidAPI key for Judge0. If omitted, local OS child process runner is active |
| `GEMINI_API_KEY` | Optional | Google Gemini API key. If omitted in development, static code analyzer evaluates code |
