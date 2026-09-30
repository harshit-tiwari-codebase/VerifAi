require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Challenge = require("../src/models/Challenge");

const SKELETONS = {
  "Distributed LRU Cache with TTL Expiration": `/**
 * Challenge: Distributed LRU Cache with TTL Expiration
 * Category: dsa | Difficulty: medium
 */

class Node {
  constructor(key, value, expiresAt = Infinity) {
    this.key = key;
    this.value = value;
    this.expiresAt = expiresAt;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity = 3) {
    this.capacity = capacity;
    // TODO: Initialize Doubly Linked List and Hash Map
  }

  get(key) {
    // TODO: Return value if present and unexpired; return -1 otherwise. Update LRU order.
    return -1;
  }

  set(key, value, ttlMs = 0) {
    // TODO: Insert or update key with TTL. Evict least recently used node if capacity exceeded.
    return false;
  }

  size() {
    // TODO: Return count of active unexpired items
    return 0;
  }

  solve(input) {
    if (!input) return true;
    if (input.action === "get") return this.get(input.key);
    if (input.action === "set") return this.set(input.key, input.value, input.ttlMs || 0);
    return true;
  }
}

if (typeof module !== "undefined") {
  module.exports = { LRUCache, Solution: LRUCache };
}
`,

  "Distributed Token Bucket Rate Limiter": `/**
 * Challenge: Distributed Token Bucket Rate Limiter
 * Category: system-design | Difficulty: medium
 */

class TokenBucket {
  constructor(capacity = 10, refillRate = 2) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    // TODO: Initialize token bucket state and timestamp
  }

  allow(tokens = 1) {
    // TODO: Implement lazy token replenishment and consumption
    // Return true if sufficient tokens are available, false otherwise
    return false;
  }

  solve(input) {
    if (typeof input === "number") return this.allow(input);
    if (input && typeof input.tokens === "number") return this.allow(input.tokens);
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { TokenBucket, Solution: TokenBucket };
}
`,

  "Design a High-Throughput URL Shortener": `/**
 * Challenge: Design a High-Throughput URL Shortener
 * Category: system-design | Difficulty: hard
 */

class UrlShortener {
  constructor() {
    // TODO: Initialize Base62 mapping and URL storage
  }

  encode(num) {
    // TODO: Convert positive integer ID to Base62 string
    return "";
  }

  decode(str) {
    // TODO: Convert Base62 string back to integer ID
    return 0;
  }

  shorten(url) {
    // TODO: Generate slug and save mapping
    return "";
  }

  resolve(slug) {
    // TODO: Return original URL or 404 if not found
    return 404;
  }

  solve(input) {
    if (!input) return "";
    if (input.action === "encode") return this.encode(input.num);
    if (input.action === "decode") return this.decode(input.str);
    if (input.action === "shorten") return this.shorten(input.url);
    if (input.action === "resolve") return this.resolve(input.slug);
    return "";
  }
}

if (typeof module !== "undefined") {
  module.exports = { UrlShortener, Solution: UrlShortener };
}
`,

  "Concurrent Task Queue with Concurrency Limit": `/**
 * Challenge: Concurrent Task Queue with Concurrency Limit
 * Category: concurrency | Difficulty: medium
 */

class TaskQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    // TODO: Initialize pending queue and active task counter
  }

  async add(taskFn) {
    // TODO: Schedule task to run adhering to maximum concurrency limit
    return null;
  }

  solve(input) {
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { TaskQueue, Solution: TaskQueue };
}
`,

  "Circuit Breaker Pattern for Resilient Microservices": `/**
 * Challenge: Circuit Breaker Pattern for Resilient Microservices
 * Category: system-design | Difficulty: hard
 */

class CircuitBreaker {
  constructor(failureThreshold = 3, recoveryTimeoutMs = 1000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeout = recoveryTimeoutMs;
    // TODO: Initialize state: 'CLOSED', 'OPEN', or 'HALF-OPEN'
    this.state = "CLOSED";
  }

  async execute(actionFn) {
    // TODO: Execute action honoring circuit breaker state transitions
    throw new Error("execute() not implemented");
  }

  solve(input) {
    return "CLOSED";
  }
}

if (typeof module !== "undefined") {
  module.exports = { CircuitBreaker, Solution: CircuitBreaker };
}
`,

  "Robust JWT Authentication & Expiry Validator": `/**
 * Challenge: Robust JWT Authentication & Expiry Validator
 * Category: api-design | Difficulty: easy
 */

class JwtValidator {
  static base64UrlDecode(str) {
    // TODO: Implement Base64URL decoding with padding
    return "";
  }

  static validate(token) {
    // TODO: Validate token structure, header parameters, and exp expiry timestamp
    return { valid: false, reason: "Not implemented" };
  }

  solve(input) {
    if (!input || !input.token) return "false";
    const res = JwtValidator.validate(input.token);
    return String(res.valid);
  }
}

if (typeof module !== "undefined") {
  module.exports = { JwtValidator, Solution: JwtValidator };
}
`,

  "Fix Memory Leak in Event Bus Listener Registry": `/**
 * Challenge: Fix Memory Leak in Event Bus Listener Registry
 * Category: concurrency | Difficulty: medium
 */

class EventBus {
  constructor() {
    // TODO: Initialize listeners map avoiding unbounded memory leaks
  }

  on(event, handler) {
    // TODO: Register listener and return unsubscribe function
    return () => {};
  }

  emit(event, data) {
    // TODO: Dispatch event to registered handlers
  }

  solve(input) {
    return true;
  }
}

if (typeof module !== "undefined") {
  module.exports = { EventBus, Solution: EventBus };
}
`,

  "E-Commerce Order State Machine & Invariants": `/**
 * Challenge: E-Commerce Order State Machine & Invariants
 * Category: system-design | Difficulty: medium
 */

class OrderStateMachine {
  constructor(initialState = "PENDING") {
    this.state = initialState;
    // TODO: Define valid transitions: PENDING -> PAID -> SHIPPED -> DELIVERED (or CANCELLED)
  }

  transition(event) {
    // TODO: Validate transition and update order state
    return false;
  }

  solve(input) {
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { OrderStateMachine, Solution: OrderStateMachine };
}
`,

  "Zero-Downtime Database Migration Schema Validator": `/**
 * Challenge: Zero-Downtime Database Migration Schema Validator
 * Category: backend | Difficulty: hard
 */

class MigrationValidator {
  static validateMigration(change) {
    // TODO: Detect dangerous DDL operations (e.g. adding NOT NULL columns without default)
    return { isSafe: false, warnings: ["Not implemented"] };
  }

  solve(input) {
    return "false";
  }
}

if (typeof module !== "undefined") {
  module.exports = { MigrationValidator, Solution: MigrationValidator };
}
`,

  "Fix Race Condition in Optimistic Concurrency Wallet": `/**
 * Challenge: Fix Race Condition in Optimistic Concurrency Wallet
 * Category: concurrency | Difficulty: hard
 */

class WalletAccount {
  constructor(initialBalance = 1000) {
    this.balance = initialBalance;
    this.version = 1;
  }

  withdraw(amount, expectedVersion) {
    // TODO: Implement optimistic concurrency check before deducting balance
    return false;
  }

  solve(input) {
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { WalletAccount, Solution: WalletAccount };
}
`,

  "RESTful API Idempotency Key Middleware Engine": `/**
 * Challenge: RESTful API Idempotency Key Middleware Engine
 * Category: api-design | Difficulty: medium
 */

class IdempotencyEngine {
  constructor(ttlMs = 86400000) {
    // TODO: Initialize cache for storing idempotency keys and responses
  }

  process(key, requestPayload, handlerFn) {
    // TODO: If key seen, return cached response; otherwise execute handlerFn
    return null;
  }

  solve(input) {
    return "false";
  }
}

if (typeof module !== "undefined") {
  module.exports = { IdempotencyEngine, Solution: IdempotencyEngine };
}
`,

  "Sliding Window Log Rate Limiter": `/**
 * Challenge: Sliding Window Log Rate Limiter
 * Category: system-design | Difficulty: medium
 */

class SlidingWindowLogLimiter {
  constructor(windowSizeMs = 1000, maxRequests = 5) {
    this.windowSizeMs = windowSizeMs;
    this.maxRequests = maxRequests;
    // TODO: Initialize sliding window log
  }

  allow(timestamp = Date.now()) {
    // TODO: Remove outdated timestamps and verify request count
    return false;
  }

  solve(input) {
    return "false";
  }
}

if (typeof module !== "undefined") {
  module.exports = { SlidingWindowLogLimiter, Solution: SlidingWindowLogLimiter };
}
`,

  "Fix Broken Async Deduplication Cache": `/**
 * Challenge: Fix Broken Async Deduplication Cache
 * Category: concurrency | Difficulty: medium
 */

class DeduplicatingCache {
  constructor() {
    // TODO: Initialize in-flight request deduplication map
  }

  async getOrFetch(key, fetcherFn) {
    // TODO: If request for key is in-flight, return the same promise to prevent thundering herd
    return null;
  }

  solve(input) {
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { DeduplicatingCache, Solution: DeduplicatingCache };
}
`,

  "Deadlock Detection in Distributed Lock Manager": `/**
 * Challenge: Deadlock Detection in Distributed Lock Manager
 * Category: concurrency | Difficulty: hard
 */

class DeadlockDetector {
  constructor() {
    // TODO: Maintain wait-for graph
  }

  hasDeadlock() {
    // TODO: Detect cycle in directed wait-for graph using DFS/Tarjan's
    return false;
  }

  solve(input) {
    return "false";
  }
}

if (typeof module !== "undefined") {
  module.exports = { DeadlockDetector, Solution: DeadlockDetector };
}
`,

  "Consistent Hashing Ring with Virtual Nodes": `/**
 * Challenge: Consistent Hashing Ring with Virtual Nodes
 * Category: system-design | Difficulty: hard
 */

class ConsistentHashRing {
  constructor(replicas = 3) {
    this.replicas = replicas;
    // TODO: Initialize hash ring
  }

  addNode(node) {
    // TODO: Add virtual replicas of node to ring
  }

  getNode(key) {
    // TODO: Find first server node clockwise on ring
    return null;
  }

  solve(input) {
    return "";
  }
}

if (typeof module !== "undefined") {
  module.exports = { ConsistentHashRing, Solution: ConsistentHashRing };
}
`,

  "Pub/Sub Message Broker with Topic Wildcards": `/**
 * Challenge: Pub/Sub Message Broker with Topic Wildcards
 * Category: system-design | Difficulty: medium
 */

class TopicMatcher {
  static matches(pattern, topic) {
    // TODO: Support single-level ('*') and multi-level ('#') wildcards (e.g. MQTT style)
    return false;
  }

  solve(input) {
    return "false";
  }
}

if (typeof module !== "undefined") {
  module.exports = { TopicMatcher, Solution: TopicMatcher };
}
`,

  "GraphQL Query Depth and Complexity Cost Analyzer": `/**
 * Challenge: GraphQL Query Depth and Complexity Cost Analyzer
 * Category: api-design | Difficulty: medium
 */

class GraphQLQueryAnalyzer {
  static calculateDepth(queryAST) {
    // TODO: Calculate nested query depth to prevent DOS queries
    return 0;
  }

  solve(input) {
    return 0;
  }
}

if (typeof module !== "undefined") {
  module.exports = { GraphQLQueryAnalyzer, Solution: GraphQLQueryAnalyzer };
}
`,

  "Fix Floating Point Precision Currency Rounding Engine": `/**
 * Challenge: Fix Floating Point Precision Currency Rounding Engine
 * Category: backend | Difficulty: easy
 */

class CurrencyCalculator {
  static add(a, b) {
    // TODO: Add monetary amounts without IEEE 754 floating point precision drift
    return 0;
  }

  solve(input) {
    return 0;
  }
}

if (typeof module !== "undefined") {
  module.exports = { CurrencyCalculator, Solution: CurrencyCalculator };
}
`,

  "Priority Inversion Free Async Semaphore": `/**
 * Challenge: Priority Inversion Free Async Semaphore
 * Category: concurrency | Difficulty: hard
 */

class AsyncSemaphore {
  constructor(permits = 1) {
    this.permits = permits;
    // TODO: Initialize priority queue for waiting tasks
  }

  async acquire(priority = 0) {
    // TODO: Acquire permit honoring task priority
  }

  release() {
    // TODO: Release permit to highest priority waiting task
  }

  solve(input) {
    return false;
  }
}

if (typeof module !== "undefined") {
  module.exports = { AsyncSemaphore, Solution: AsyncSemaphore };
}
`,

  "Distributed 64-Bit Snowflake ID Generator": `/**
 * Challenge: Distributed 64-Bit Snowflake ID Generator
 * Category: system-design | Difficulty: hard
 */

class SnowflakeIdGenerator {
  constructor(datacenterId = 1, workerId = 1) {
    // TODO: Initialize 5-bit datacenterId, 5-bit workerId, sequence, and lastTimestamp
    this.datacenterId = datacenterId;
    this.workerId = workerId;
  }

  nextId() {
    // TODO: Implement 64-bit Snowflake ID generation algorithm:
    // 1. Guard against backwards clock skew
    // 2. Increment 12-bit sequence counter (max 4095) for same millisecond
    // 3. Reset sequence to 0 when timestamp advances
    // 4. Return packed 64-bit BigInt string (timestamp << 22 | datacenter << 17 | worker << 12 | sequence)
    throw new Error("nextId() not implemented");
  }

  solve(input) {
    if (!input) return "invalid";
    const dc = input.datacenterId ?? 1;
    const worker = input.workerId ?? 1;
    const gen = new SnowflakeIdGenerator(dc, worker);
    const id = gen.nextId();
    return id.length >= 15 ? "valid_id" : "invalid";
  }
}

if (typeof module !== "undefined") {
  module.exports = { SnowflakeIdGenerator, Solution: SnowflakeIdGenerator };
}
`
};

async function updateStarterCodes() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI not set");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for starter code update...");

  let updatedCount = 0;
  for (const [title, skeleton] of Object.entries(SKELETONS)) {
    const challenge = await Challenge.findOne({ title });
    if (!challenge) {
      console.warn(`Challenge not found in DB: ${title}`);
      continue;
    }

    // Preserve existing starterCode as referenceSolution if not already set
    if (!challenge.referenceSolution || challenge.referenceSolution === challenge.starterCode) {
      challenge.referenceSolution = challenge.starterCode;
    }

    // Set the true candidate starterCode to the unsolved skeleton
    challenge.starterCode = skeleton;
    await challenge.save();
    updatedCount++;
    console.log(`Updated starterCode for: [${title}]`);
  }

  console.log(`Successfully updated ${updatedCount} challenges with unsolved skeletons!`);
  await mongoose.disconnect();
}

updateStarterCodes().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
