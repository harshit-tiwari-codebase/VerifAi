require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Challenge = require("../src/models/Challenge");

const ENTRY_POINTS = {
  "Distributed LRU Cache with TTL Expiration": "LRUCache",
  "Distributed Token Bucket Rate Limiter": "TokenBucket",
  "Design a High-Throughput URL Shortener": "UrlShortener",
  "Concurrent Task Queue with Concurrency Limit": "TaskQueue",
  "Circuit Breaker Pattern for Resilient Microservices": "CircuitBreaker",
  "Robust JWT Authentication & Expiry Validator": "JwtValidator",
  "Fix Memory Leak in Event Bus Listener Registry": "EventBus",
  "E-Commerce Order State Machine & Invariants": "OrderStateMachine",
  "Zero-Downtime Database Migration Schema Validator": "MigrationValidator",
  "Fix Race Condition in Optimistic Concurrency Wallet": "WalletAccount",
  "RESTful API Idempotency Key Middleware Engine": "IdempotencyEngine",
  "Sliding Window Log Rate Limiter": "SlidingWindowLogLimiter",
  "Fix Broken Async Deduplication Cache": "DeduplicatingCache",
  "Deadlock Detection in Distributed Lock Manager": "DeadlockDetector",
  "Consistent Hashing Ring with Virtual Nodes": "ConsistentHashRing",
  "Pub/Sub Message Broker with Topic Wildcards": "TopicMatcher",
  "GraphQL Query Depth and Complexity Cost Analyzer": "GraphQLQueryAnalyzer",
  "Fix Floating Point Precision Currency Rounding Engine": "CurrencyCalculator",
  "Priority Inversion Free Async Semaphore": "AsyncSemaphore",
  "Distributed 64-Bit Snowflake ID Generator": "SnowflakeIdGenerator",
};

async function migrate() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI missing from environment");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for Challenge migration...");

  const challenges = await Challenge.find({});
  let updatedCount = 0;

  for (const c of challenges) {
    const entryPoint = ENTRY_POINTS[c.title] || "Solution";
    c.executionAdapter = {
      kind: "class-stateless",
      entryPoint,
      comparisonMode: "exact",
      constructorArgs: [],
    };
    await c.save();
    updatedCount++;
    console.log(`Updated [${c.title}] -> entryPoint: ${entryPoint}`);
  }

  console.log(`Migration complete! Updated ${updatedCount} challenges.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
