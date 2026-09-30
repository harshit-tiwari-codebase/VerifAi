/**
 * Pre-compiled Client Fallback Catalog for all 20 published challenges.
 * Guarantees zero downtime, offline responsiveness, and instant problem hydration.
 */

export const ALL_CHALLENGES_CATALOG = [
  {
    "_id": "6ab52d184a6089fdfec33d21",
    "id": "6ab52d184a6089fdfec33d21",
    "title": "Distributed LRU Cache with TTL Expiration",
    "difficulty": "medium",
    "category": "dsa",
    "executionType": "both",
    "tags": [
      "dsa",
      "lru-cache",
      "doubly-linked-list",
      "hashmap",
      "caching"
    ],
    "description": "Design and implement a high-throughput Least Recently Used (LRU) Cache with Time-To-Live (TTL) expiration in JavaScript.\nThe cache must support O(1) time complexity for both `get` and `set` operations using a Doubly Linked List and a Hash Map.\n\nRequirements:\n1. `constructor(capacity = 3)`: Initializes cache capacity.\n2. `get(key)`: Returns value if present and not expired, marking it as most recently used. Returns -1 if missing/expired.\n3. `set(key, value, ttlMs = 0)`: Inserts or updates key. If capacity is exceeded, evicts the least recently used item in O(1) time.\n4. `size()`: Returns count of active unexpired items.",
    "starterCode": "/**\n * Challenge: Distributed LRU Cache with TTL Expiration\n * Category: dsa | Difficulty: medium\n */\n\nclass Node {\n  constructor(key, value, expiresAt = Infinity) {\n    this.key = key;\n    this.value = value;\n    this.expiresAt = expiresAt;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity = 3) {\n    this.capacity = capacity;\n    // TODO: Initialize Doubly Linked List and Hash Map\n  }\n\n  get(key) {\n    // TODO: Return value if present and unexpired; return -1 otherwise. Update LRU order.\n    return -1;\n  }\n\n  set(key, value, ttlMs = 0) {\n    // TODO: Insert or update key with TTL. Evict least recently used node if capacity exceeded.\n    return false;\n  }\n\n  size() {\n    // TODO: Return count of active unexpired items\n    return 0;\n  }\n\n  solve(input) {\n    if (!input) return true;\n    if (input.action === \"get\") return this.get(input.key);\n    if (input.action === \"set\") return this.set(input.key, input.value, input.ttlMs || 0);\n    return true;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { LRUCache, Solution: LRUCache };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Algorithmic Complexity: Strictly O(1) time for both get and set operations.\n• Doubly Linked List: Dummy head and tail nodes to eliminate edge-case pointer null checks.\n• TTL Expiration: Lazy invalidation upon access without thread leaks or unneeded timers.",
    "testCases": [
      {
        "_id": "6ab5308d873a60e2514db867",
        "id": "6ab5308d873a60e2514db867",
        "input": "{\"action\": \"set\", \"key\": \"a\", \"value\": 100}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308d873a60e2514db868",
        "id": "6ab5308d873a60e2514db868",
        "input": "{\"action\": \"get\", \"key\": \"a\"}",
        "expectedOutput": "100"
      },
      {
        "_id": "6ab5308d873a60e2514db869",
        "id": "6ab5308d873a60e2514db869",
        "input": "{\"action\": \"get\", \"key\": \"unknown\"}",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "_id": "6ab5308e4a6089fdfec33de4",
    "id": "6ab5308e4a6089fdfec33de4",
    "title": "Distributed Token Bucket Rate Limiter",
    "difficulty": "medium",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "rate-limiter",
      "token-bucket",
      "concurrency",
      "distributed-systems"
    ],
    "description": "Implement a high-throughput, memory-bounded Token Bucket Rate Limiter in JavaScript.\nThe system controls traffic flow by replenishing tokens at a continuous rate and consuming tokens upon valid requests.\n\nRequirements:\n1. `constructor(capacity = 10, refillRate = 2)`: Maximum tokens in bucket, and replenishment rate (tokens/sec).\n2. `allow(tokens = 1)`: Consumes tokens if available and returns `true`. If insufficient tokens, returns `false` without dropping state.\n3. Must use lazy replenishment based on timestamp differences (O(1) time complexity) rather than active timer intervals.",
    "starterCode": "/**\n * Challenge: Distributed Token Bucket Rate Limiter\n * Category: system-design | Difficulty: medium\n */\n\nclass TokenBucket {\n  constructor(capacity = 10, refillRate = 2) {\n    this.capacity = capacity;\n    this.refillRate = refillRate;\n    // TODO: Initialize token bucket state and timestamp\n  }\n\n  allow(tokens = 1) {\n    // TODO: Implement lazy token replenishment and consumption\n    // Return true if sufficient tokens are available, false otherwise\n    return false;\n  }\n\n  solve(input) {\n    if (typeof input === \"number\") return this.allow(input);\n    if (input && typeof input.tokens === \"number\") return this.allow(input.tokens);\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { TokenBucket, Solution: TokenBucket };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Algorithmic Efficiency: O(1) mathematical delta replenishment without setInterval or setTimeout.\n• Burst Tolerance: Handles instantaneous token bursts up to max capacity.\n• State Preservation: Failed requests must not deduct tokens or corrupt timestamp markers.\n• Clean API: Robust input validation and encapsulation.",
    "testCases": [
      {
        "_id": "6ab5308d873a60e2514db85d",
        "id": "6ab5308d873a60e2514db85d",
        "input": "{\"tokens\": 5}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308d873a60e2514db85e",
        "id": "6ab5308d873a60e2514db85e",
        "input": "{\"tokens\": 10}",
        "expectedOutput": "false"
      },
      {
        "_id": "6ab5308d873a60e2514db85f",
        "id": "6ab5308d873a60e2514db85f",
        "input": "{\"tokens\": 1}",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "_id": "6ab5308e4a6089fdfec33de5",
    "id": "6ab5308e4a6089fdfec33de5",
    "title": "Design a High-Throughput URL Shortener",
    "difficulty": "hard",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "base62",
      "url-shortener",
      "hashing",
      "scalability"
    ],
    "description": "Implement the core algorithmic shortening and lookup engine for a URL shortener like bit.ly.\nThe system converts incremental or hashed 64-bit numerical IDs into compact Base62 slugs ([0-9a-zA-Z]) and maintains bi-directional mappings.\n\nRequirements:\n1. `encode(num)`: Encodes a non-negative integer into a Base62 string.\n2. `decode(str)`: Decodes a Base62 string back into its original integer ID.\n3. `shorten(url)`: Generates a shortened URL slug and caches it for O(1) retrieval.\n4. `resolve(slug)`: Returns the original URL or returns `404` if not found.",
    "starterCode": "/**\n * Challenge: Design a High-Throughput URL Shortener\n * Category: system-design | Difficulty: hard\n */\n\nclass UrlShortener {\n  constructor() {\n    // TODO: Initialize Base62 mapping and URL storage\n  }\n\n  encode(num) {\n    // TODO: Convert positive integer ID to Base62 string\n    return \"\";\n  }\n\n  decode(str) {\n    // TODO: Convert Base62 string back to integer ID\n    return 0;\n  }\n\n  shorten(url) {\n    // TODO: Generate slug and save mapping\n    return \"\";\n  }\n\n  resolve(slug) {\n    // TODO: Return original URL or 404 if not found\n    return 404;\n  }\n\n  solve(input) {\n    if (!input) return \"\";\n    if (input.action === \"encode\") return this.encode(input.num);\n    if (input.action === \"decode\") return this.decode(input.str);\n    if (input.action === \"shorten\") return this.shorten(input.url);\n    if (input.action === \"resolve\") return this.resolve(input.slug);\n    return \"\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { UrlShortener, Solution: UrlShortener };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Bijective Base62 Algorithm: Perfect reversibility between numerical IDs and Base62 strings.\n• Collision Resistance: Guarantees unique short URLs without hash collisions.\n• Memory Complexity: Efficient bidirectional map storage with O(1) resolution.",
    "testCases": [
      {
        "_id": "6ab5308d873a60e2514db871",
        "id": "6ab5308d873a60e2514db871",
        "input": "{\"action\": \"encode\", \"num\": 125}",
        "expectedOutput": "21"
      },
      {
        "_id": "6ab5308d873a60e2514db872",
        "id": "6ab5308d873a60e2514db872",
        "input": "{\"action\": \"decode\", \"str\": \"21\"}",
        "expectedOutput": "125"
      },
      {
        "_id": "6ab5308d873a60e2514db873",
        "id": "6ab5308d873a60e2514db873",
        "input": "{\"action\": \"resolve\", \"slug\": \"nonexistent\"}",
        "expectedOutput": "404"
      }
    ]
  },
  {
    "_id": "6ab5308e4a6089fdfec33de6",
    "id": "6ab5308e4a6089fdfec33de6",
    "title": "Concurrent Task Queue with Concurrency Limit",
    "difficulty": "medium",
    "category": "dsa",
    "executionType": "both",
    "tags": [
      "dsa",
      "concurrency",
      "promise-pool",
      "async",
      "queue"
    ],
    "description": "Implement an asynchronous Task Queue (Promise Pool) that executes a collection of tasks with a strict concurrency limit.\nAt no point may more than `limit` tasks be running simultaneously.\n\nRequirements:\n1. `constructor(limit = 2)`: Sets the maximum number of concurrent executions.\n2. `add(taskFn)`: Enqueues an async task and returns a Promise that resolves when the task finishes.\n3. Automatically triggers waiting tasks in FIFO order as running tasks resolve or reject.",
    "starterCode": "/**\n * Challenge: Concurrent Task Queue with Concurrency Limit\n * Category: concurrency | Difficulty: medium\n */\n\nclass TaskQueue {\n  constructor(concurrency = 2) {\n    this.concurrency = concurrency;\n    // TODO: Initialize pending queue and active task counter\n  }\n\n  async add(taskFn) {\n    // TODO: Schedule task to run adhering to maximum concurrency limit\n    return null;\n  }\n\n  solve(input) {\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { TaskQueue, Solution: TaskQueue };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Concurrency Enforcement: Guarantees active tasks never exceed specified limit.\n• Clean Async Lifecycle: Handles both resolution and rejection gracefully in finally blocks.\n• FIFO Guarantee: Maintains strictly ordered dispatching of queued jobs.",
    "testCases": [
      {
        "_id": "6ab5308d873a60e2514db87b",
        "id": "6ab5308d873a60e2514db87b",
        "input": "{\"limit\": 2, \"tasksCount\": 4}",
        "expectedOutput": "limit_2_tasks_4_completed"
      },
      {
        "_id": "6ab5308d873a60e2514db87c",
        "id": "6ab5308d873a60e2514db87c",
        "input": "{\"limit\": 1, \"tasksCount\": 3}",
        "expectedOutput": "limit_1_tasks_3_completed"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33de7",
    "id": "6ab5308f4a6089fdfec33de7",
    "title": "Circuit Breaker Pattern for Resilient Microservices",
    "difficulty": "hard",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "circuit-breaker",
      "microservices",
      "resilience",
      "fault-tolerance"
    ],
    "description": "Implement the Circuit Breaker pattern with states `CLOSED`, `OPEN`, and `HALF_OPEN`.\nWhen failures exceed a threshold within a time window, the circuit trips to `OPEN` and rejects calls immediately to protect downstream systems.\n\nRequirements:\n1. `CLOSED`: Normal operation. Count consecutive failures. If failures >= failureThreshold, transition to `OPEN`.\n2. `OPEN`: Rejects all executions immediately with `CircuitOpenError`. After `cooldownMs`, transition to `HALF_OPEN`.\n3. `HALF_OPEN`: Allows a trial request. If it succeeds, reset to `CLOSED`. If it fails, trip back to `OPEN`.",
    "starterCode": "/**\n * Challenge: Circuit Breaker Pattern for Resilient Microservices\n * Category: system-design | Difficulty: hard\n */\n\nclass CircuitBreaker {\n  constructor(failureThreshold = 3, recoveryTimeoutMs = 1000) {\n    this.failureThreshold = failureThreshold;\n    this.recoveryTimeout = recoveryTimeoutMs;\n    // TODO: Initialize state: 'CLOSED', 'OPEN', or 'HALF-OPEN'\n    this.state = \"CLOSED\";\n  }\n\n  async execute(actionFn) {\n    // TODO: Execute action honoring circuit breaker state transitions\n    throw new Error(\"execute() not implemented\");\n  }\n\n  solve(input) {\n    return \"CLOSED\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { CircuitBreaker, Solution: CircuitBreaker };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Accurate Finite State Machine: Exact transitions between CLOSED, OPEN, and HALF_OPEN.\n• Threshold Detection: Accurate triggering upon reaching consecutive failure limits.\n• Cooldown Management: Non-blocking time-based transitions to trial state.",
    "testCases": [
      {
        "_id": "6ab5308d873a60e2514db883",
        "id": "6ab5308d873a60e2514db883",
        "input": "{\"action\": \"getState\"}",
        "expectedOutput": "CLOSED"
      },
      {
        "_id": "6ab5308d873a60e2514db884",
        "id": "6ab5308d873a60e2514db884",
        "input": "{\"action\": \"recordFailure\"}",
        "expectedOutput": "CLOSED"
      },
      {
        "_id": "6ab5308d873a60e2514db885",
        "id": "6ab5308d873a60e2514db885",
        "input": "{\"action\": \"recordSuccess\"}",
        "expectedOutput": "CLOSED"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33de8",
    "id": "6ab5308f4a6089fdfec33de8",
    "title": "Robust JWT Authentication & Expiry Validator",
    "difficulty": "easy",
    "category": "api-design",
    "executionType": "both",
    "tags": [
      "api-design",
      "jwt",
      "auth",
      "security",
      "rfc7519"
    ],
    "description": "Implement a parser and validator for JSON Web Tokens (JWT) adhering to RFC 7519 without using heavy external npm packages.\n\nRequirements:\n1. Validate token format has exactly three base64url-encoded parts (`header.payload.signature`).\n2. Decode the header and payload safely handling URL-safe base64 characters (`-` and `_`).\n3. Verify mandatory claims: `exp` (expiration timestamp) and `iat` (issued at).\n4. Return an object: `{ valid: boolean, reason?: string, claims?: object }`.",
    "starterCode": "/**\n * Challenge: Robust JWT Authentication & Expiry Validator\n * Category: api-design | Difficulty: easy\n */\n\nclass JwtValidator {\n  static base64UrlDecode(str) {\n    // TODO: Implement Base64URL decoding with padding\n    return \"\";\n  }\n\n  static validate(token) {\n    // TODO: Validate token structure, header parameters, and exp expiry timestamp\n    return { valid: false, reason: \"Not implemented\" };\n  }\n\n  solve(input) {\n    if (!input || !input.token) return \"false\";\n    const res = JwtValidator.validate(input.token);\n    return String(res.valid);\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { JwtValidator, Solution: JwtValidator };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• RFC Compliance: Correct handling of base64url padding and character substitutions.\n• Expiration Checking: Accurate Unix timestamp comparison in seconds.\n• Defensive Parsing: Resilient against invalid JSON or malformed segment counts.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db88d",
        "id": "6ab5308e873a60e2514db88d",
        "input": "{\"token\": \"invalid_string\"}",
        "expectedOutput": "false"
      },
      {
        "_id": "6ab5308e873a60e2514db88e",
        "id": "6ab5308e873a60e2514db88e",
        "input": "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoyNTI0NjA4MDAwfQ.signature\"}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308e873a60e2514db88f",
        "id": "6ab5308e873a60e2514db88f",
        "input": "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDAwfQ.sig\"}",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33de9",
    "id": "6ab5308f4a6089fdfec33de9",
    "title": "Fix Memory Leak in Event Bus Listener Registry",
    "difficulty": "easy",
    "category": "bug-fix",
    "executionType": "both",
    "tags": [
      "bug-fix",
      "event-emitter",
      "memory-leak",
      "garbage-collection"
    ],
    "description": "Debug and fix a memory leak in a high-frequency EventEmitter / Event Bus implementation.\nThe buggy code stores listeners in an unbounded array without providing a mechanism to unsubscribe or remove duplicate callbacks, eventually causing out-of-memory crashes.\n\nRequirements:\n1. Provide `on(event, callback)`: Registers listener and returns an unsubscribe function.\n2. Provide `off(event, callback)`: Safely removes the callback.\n3. Provide `listenerCount(event)`: Returns active listener count for that event.\n4. Provide `emit(event, ...args)`: Dispatches payload to registered listeners.",
    "starterCode": "/**\n * Challenge: Fix Memory Leak in Event Bus Listener Registry\n * Category: concurrency | Difficulty: medium\n */\n\nclass EventBus {\n  constructor() {\n    // TODO: Initialize listeners map avoiding unbounded memory leaks\n  }\n\n  on(event, handler) {\n    // TODO: Register listener and return unsubscribe function\n    return () => {};\n  }\n\n  emit(event, data) {\n    // TODO: Dispatch event to registered handlers\n  }\n\n  solve(input) {\n    return true;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { EventBus, Solution: EventBus };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Memory Leak Elimination: Automatic removal of empty sets from parent map when listeners reach 0.\n• Unsubscribe Closure: Returns deterministic cleanup function on subscription.\n• Set-based Storage: Prevents accidental duplicate registrations of the same function.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db897",
        "id": "6ab5308e873a60e2514db897",
        "input": "{\"action\": \"subscribeAndClean\", \"cleanup\": true}",
        "expectedOutput": "0"
      },
      {
        "_id": "6ab5308e873a60e2514db898",
        "id": "6ab5308e873a60e2514db898",
        "input": "{\"action\": \"subscribeAndClean\", \"cleanup\": false}",
        "expectedOutput": "1"
      },
      {
        "_id": "6ab5308e873a60e2514db899",
        "id": "6ab5308e873a60e2514db899",
        "input": "{\"event\": \"nonexistent\"}",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33dea",
    "id": "6ab5308f4a6089fdfec33dea",
    "title": "E-Commerce Order State Machine & Invariants",
    "difficulty": "medium",
    "category": "schema-modeling",
    "executionType": "both",
    "tags": [
      "schema-modeling",
      "state-machine",
      "e-commerce",
      "invariants",
      "validation"
    ],
    "description": "Model and enforce strict state transitions for an e-commerce order lifecycle.\nIllegal transitions (such as transitioning from `CANCELLED` to `SHIPPED`) must be rejected with descriptive errors.\n\nAllowed transitions:\n• PENDING -> PAID, CANCELLED\n• PAID -> PROCESSING, REFUNDED\n• PROCESSING -> SHIPPED, CANCELLED\n• SHIPPED -> DELIVERED, RETURNED\n• DELIVERED -> RETURNED\n• CANCELLED -> (Terminal)\n• REFUNDED -> (Terminal)",
    "starterCode": "/**\n * Challenge: E-Commerce Order State Machine & Invariants\n * Category: system-design | Difficulty: medium\n */\n\nclass OrderStateMachine {\n  constructor(initialState = \"PENDING\") {\n    this.state = initialState;\n    // TODO: Define valid transitions: PENDING -> PAID -> SHIPPED -> DELIVERED (or CANCELLED)\n  }\n\n  transition(event) {\n    // TODO: Validate transition and update order state\n    return false;\n  }\n\n  solve(input) {\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { OrderStateMachine, Solution: OrderStateMachine };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Deterministic Graph: Accurately reflects valid and invalid state machine edges.\n• Terminal State Protection: Locks terminal states (CANCELLED, REFUNDED) against further mutation.\n• Clean Descriptive Responses: Returns clear boolean or error status.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8a1",
        "id": "6ab5308e873a60e2514db8a1",
        "input": "{\"from\": \"PENDING\", \"to\": \"PAID\"}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308e873a60e2514db8a2",
        "id": "6ab5308e873a60e2514db8a2",
        "input": "{\"from\": \"CANCELLED\", \"to\": \"SHIPPED\"}",
        "expectedOutput": "false"
      },
      {
        "_id": "6ab5308e873a60e2514db8a3",
        "id": "6ab5308e873a60e2514db8a3",
        "input": "{\"from\": \"SHIPPED\", \"to\": \"DELIVERED\"}",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33deb",
    "id": "6ab5308f4a6089fdfec33deb",
    "title": "Zero-Downtime Database Migration Schema Validator",
    "difficulty": "hard",
    "category": "schema-modeling",
    "executionType": "both",
    "tags": [
      "schema-modeling",
      "migrations",
      "zero-downtime",
      "database",
      "sql"
    ],
    "description": "Implement a schema migration analyzer that validates database migration DDL changes for zero-downtime deployment safety.\nDangerous operations that lock tables (e.g. adding NOT NULL column without a default value or renaming an active column) must be flagged as unsafe.\n\nSafety Rules:\n1. Adding a column: Safe only if `nullable: true` OR `defaultValue` is provided.\n2. Dropping a column: Flag as `unsafe` without an expand/contract deprecation period.\n3. Adding an index: Safe if `concurrently: true`, unsafe if locking.",
    "starterCode": "/**\n * Challenge: Zero-Downtime Database Migration Schema Validator\n * Category: backend | Difficulty: hard\n */\n\nclass MigrationValidator {\n  static validateMigration(change) {\n    // TODO: Detect dangerous DDL operations (e.g. adding NOT NULL columns without default)\n    return { isSafe: false, warnings: [\"Not implemented\"] };\n  }\n\n  solve(input) {\n    return \"false\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { MigrationValidator, Solution: MigrationValidator };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Zero-Downtime Principles: Enforces expand-and-contract patterns and non-blocking DDL.\n• Accurate Risk Analysis: Catches dangerous table-exclusive lock patterns.\n• Comprehensive Diagnostics: Provides explicit rationale when operations are rejected.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8ab",
        "id": "6ab5308e873a60e2514db8ab",
        "input": "{\"type\": \"ADD_COLUMN\", \"nullable\": true}",
        "expectedOutput": "safe"
      },
      {
        "_id": "6ab5308e873a60e2514db8ac",
        "id": "6ab5308e873a60e2514db8ac",
        "input": "{\"type\": \"ADD_COLUMN\", \"nullable\": false}",
        "expectedOutput": "unsafe"
      },
      {
        "_id": "6ab5308e873a60e2514db8ad",
        "id": "6ab5308e873a60e2514db8ad",
        "input": "{\"type\": \"DROP_COLUMN\", \"column\": \"email\"}",
        "expectedOutput": "unsafe"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33dec",
    "id": "6ab5308f4a6089fdfec33dec",
    "title": "Fix Race Condition in Optimistic Concurrency Wallet",
    "difficulty": "medium",
    "category": "debugging",
    "executionType": "both",
    "tags": [
      "debugging",
      "race-condition",
      "concurrency",
      "optimistic-locking",
      "transactions"
    ],
    "description": "Fix a critical concurrency bug in a digital wallet transfer engine where simultaneous debits cause negative balances due to stale read race conditions.\n\nRequirements:\n1. Each wallet record contains `balance` and integer `version`.\n2. A debit transaction may only succeed if the database row's `version` has not changed between reading and writing.\n3. If versions mismatch, throw or return `VERSION_CONFLICT` and retry up to 3 times before failing.",
    "starterCode": "/**\n * Challenge: Fix Race Condition in Optimistic Concurrency Wallet\n * Category: concurrency | Difficulty: hard\n */\n\nclass WalletAccount {\n  constructor(initialBalance = 1000) {\n    this.balance = initialBalance;\n    this.version = 1;\n  }\n\n  withdraw(amount, expectedVersion) {\n    // TODO: Implement optimistic concurrency check before deducting balance\n    return false;\n  }\n\n  solve(input) {\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { WalletAccount, Solution: WalletAccount };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Optimistic Concurrency Invariants: Strict version incrementation upon successful mutation.\n• Race Condition Defense: Immediate rejection of writes based on stale version reads.\n• Boundary Protection: Verifies sufficient balance prior to debit.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8b5",
        "id": "6ab5308e873a60e2514db8b5",
        "input": "{\"balance\": 100, \"version\": 1, \"amount\": 30, \"expectedVersion\": 1}",
        "expectedOutput": "success"
      },
      {
        "_id": "6ab5308e873a60e2514db8b6",
        "id": "6ab5308e873a60e2514db8b6",
        "input": "{\"balance\": 100, \"version\": 2, \"amount\": 30, \"expectedVersion\": 1}",
        "expectedOutput": "VERSION_CONFLICT"
      },
      {
        "_id": "6ab5308e873a60e2514db8b7",
        "id": "6ab5308e873a60e2514db8b7",
        "input": "{\"balance\": 20, \"version\": 1, \"amount\": 50, \"expectedVersion\": 1}",
        "expectedOutput": "INSUFFICIENT_FUNDS"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33ded",
    "id": "6ab5308f4a6089fdfec33ded",
    "title": "RESTful API Idempotency Key Middleware Engine",
    "difficulty": "medium",
    "category": "api-design",
    "executionType": "both",
    "tags": [
      "api-design",
      "idempotency",
      "http",
      "stripe",
      "payments"
    ],
    "description": "Implement an Idempotency Key caching engine for mission-critical HTTP API endpoints (like Stripe payment processing).\nWhen a client sends duplicate requests with the same `Idempotency-Key` header, return the cached previous response rather than processing the transaction twice.\n\nRequirements:\n1. Cache keys by `Idempotency-Key` with an expiration TTL (e.g. 24 hours).\n2. If request is currently in-flight, return `CONFLICT_IN_PROGRESS`.\n3. If already completed, return stored payload and status code with header `Idempotent-Replay: true`.",
    "starterCode": "/**\n * Challenge: RESTful API Idempotency Key Middleware Engine\n * Category: api-design | Difficulty: medium\n */\n\nclass IdempotencyEngine {\n  constructor(ttlMs = 86400000) {\n    // TODO: Initialize cache for storing idempotency keys and responses\n  }\n\n  process(key, requestPayload, handlerFn) {\n    // TODO: If key seen, return cached response; otherwise execute handlerFn\n    return null;\n  }\n\n  solve(input) {\n    return \"false\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { IdempotencyEngine, Solution: IdempotencyEngine };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• RFC & Industry Standard: Correct HTTP status codes (201 Created vs 200 OK replay vs 409 Conflict).\n• Atomic In-Flight Locking: Prevents double-processing when two identical requests hit concurrently.\n• Replay Integrity: Unaltered return of original cached payload.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8bf",
        "id": "6ab5308e873a60e2514db8bf",
        "input": "{\"key\": \"tx_key_1\", \"payload\": {\"amount\": 100}}",
        "expectedOutput": "201"
      },
      {
        "_id": "6ab5308e873a60e2514db8c0",
        "id": "6ab5308e873a60e2514db8c0",
        "input": "{\"key\": \"tx_key_1\", \"payload\": {\"amount\": 100}}",
        "expectedOutput": "200"
      },
      {
        "_id": "6ab5308e873a60e2514db8c1",
        "id": "6ab5308e873a60e2514db8c1",
        "input": "{\"payload\": {\"amount\": 100}}",
        "expectedOutput": "400"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33dee",
    "id": "6ab5308f4a6089fdfec33dee",
    "title": "Sliding Window Log Rate Limiter",
    "difficulty": "hard",
    "category": "dsa",
    "executionType": "both",
    "tags": [
      "dsa",
      "rate-limiting",
      "sliding-window",
      "timestamps",
      "system-design"
    ],
    "description": "Implement a high-precision Sliding Window Log Rate Limiter in JavaScript.\nUnlike fixed window limiters that suffer from boundary burst vulnerabilities, the sliding window log tracks individual request timestamps in a sorted buffer.\n\nRequirements:\n1. `constructor(limit = 5, windowMs = 1000)`: Max requests allowed within sliding interval.\n2. `allow(userId)`: Evicts timestamps older than `Date.now() - windowMs`.\n3. If remaining log count < limit, appends current timestamp and returns `true`; else returns `false`.",
    "starterCode": "/**\n * Challenge: Sliding Window Log Rate Limiter\n * Category: system-design | Difficulty: medium\n */\n\nclass SlidingWindowLogLimiter {\n  constructor(windowSizeMs = 1000, maxRequests = 5) {\n    this.windowSizeMs = windowSizeMs;\n    this.maxRequests = maxRequests;\n    // TODO: Initialize sliding window log\n  }\n\n  allow(timestamp = Date.now()) {\n    // TODO: Remove outdated timestamps and verify request count\n    return false;\n  }\n\n  solve(input) {\n    return \"false\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { SlidingWindowLogLimiter, Solution: SlidingWindowLogLimiter };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Boundary Precision: Exact timestamp sliding window without interval rounding anomalies.\n• Memory Management: Active pruning of expired timestamps to avoid unbounded growth.\n• Per-User Partitioning: Isolated independent buckets per user/tenant.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8c9",
        "id": "6ab5308e873a60e2514db8c9",
        "input": "{\"userId\": \"alice\"}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308e873a60e2514db8ca",
        "id": "6ab5308e873a60e2514db8ca",
        "input": "{\"userId\": \"alice\"}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308e873a60e2514db8cb",
        "id": "6ab5308e873a60e2514db8cb",
        "input": "{\"userId\": \"bob\"}",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33def",
    "id": "6ab5308f4a6089fdfec33def",
    "title": "Fix Broken Async Deduplication Cache",
    "difficulty": "medium",
    "category": "bug-fix",
    "executionType": "both",
    "tags": [
      "bug-fix",
      "thundering-herd",
      "cache-stampede",
      "async",
      "promises"
    ],
    "description": "Fix a cache stampede / thundering herd vulnerability where 50 concurrent requests for an expired key all miss the cache simultaneously and execute 50 duplicate upstream queries.\n\nRequirements:\n1. When multiple callers request the same key concurrently, share a single in-flight Promise.\n2. Once the upstream Promise resolves, cache the value and broadcast the result to all awaiting callers.\n3. If the upstream call fails, clear the in-flight state so future requests can retry.",
    "starterCode": "/**\n * Challenge: Fix Broken Async Deduplication Cache\n * Category: concurrency | Difficulty: medium\n */\n\nclass DeduplicatingCache {\n  constructor() {\n    // TODO: Initialize in-flight request deduplication map\n  }\n\n  async getOrFetch(key, fetcherFn) {\n    // TODO: If request for key is in-flight, return the same promise to prevent thundering herd\n    return null;\n  }\n\n  solve(input) {\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { DeduplicatingCache, Solution: DeduplicatingCache };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Thundering Herd Mitigation: Guaranteed single upstream call during burst cache misses.\n• Memory Cleanliness: Guaranteed cleanup of in-flight promises inside finally block.\n• Correct Caching: Persistent storage of resolved values for subsequent O(1) hits.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8d3",
        "id": "6ab5308e873a60e2514db8d3",
        "input": "{\"key\": \"users_list\", \"concurrency\": 20}",
        "expectedOutput": "single_upstream_fetch"
      },
      {
        "_id": "6ab5308e873a60e2514db8d4",
        "id": "6ab5308e873a60e2514db8d4",
        "input": "{\"key\": \"pricing_table\", \"concurrency\": 50}",
        "expectedOutput": "single_upstream_fetch"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33df0",
    "id": "6ab5308f4a6089fdfec33df0",
    "title": "Deadlock Detection in Distributed Lock Manager",
    "difficulty": "hard",
    "category": "debugging",
    "executionType": "both",
    "tags": [
      "debugging",
      "deadlock",
      "graph-cycle",
      "distributed-systems",
      "dfs"
    ],
    "description": "Implement a cycle-detection algorithm for a Wait-For Graph (WFG) in a distributed transaction coordinator.\nWhen transactions form a circular dependency (e.g. T1 waits for T2, T2 waits for T3, T3 waits for T1), detect the cycle and declare a deadlock.\n\nRequirements:\n1. `addDependency(waiterId, holderId)`: Adds directed edge `waiterId -> holderId`.\n2. `hasDeadlock()`: Returns `true` if a directed cycle exists in the graph, `false` otherwise.\n3. Must use Depth-First Search with 3-color marking (White/Gray/Black) for O(V + E) complexity.",
    "starterCode": "/**\n * Challenge: Deadlock Detection in Distributed Lock Manager\n * Category: concurrency | Difficulty: hard\n */\n\nclass DeadlockDetector {\n  constructor() {\n    // TODO: Maintain wait-for graph\n  }\n\n  hasDeadlock() {\n    // TODO: Detect cycle in directed wait-for graph using DFS/Tarjan's\n    return false;\n  }\n\n  solve(input) {\n    return \"false\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { DeadlockDetector, Solution: DeadlockDetector };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Algorithmic Correctness: Cycle detection using 3-color graph traversal.\n• Linear Time Complexity: O(V + E) worst case performance.\n• Forest Traversal: Handles disconnected components across multiple transaction pools.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8d9",
        "id": "6ab5308e873a60e2514db8d9",
        "input": "{\"edges\": [[\"T1\", \"T2\"], [\"T2\", \"T3\"], [\"T3\", \"T1\"]]}",
        "expectedOutput": "deadlock_detected"
      },
      {
        "_id": "6ab5308e873a60e2514db8da",
        "id": "6ab5308e873a60e2514db8da",
        "input": "{\"edges\": [[\"T1\", \"T2\"], [\"T2\", \"T3\"]]}",
        "expectedOutput": "no_deadlock"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33df1",
    "id": "6ab5308f4a6089fdfec33df1",
    "title": "Consistent Hashing Ring with Virtual Nodes",
    "difficulty": "hard",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "consistent-hashing",
      "virtual-nodes",
      "distributed-cache",
      "binary-search"
    ],
    "description": "Implement a Consistent Hashing ring with virtual nodes (replicas) to distribute keys across a cluster of caching servers evenly.\n\nRequirements:\n1. `constructor(replicas = 3)`: Number of virtual points placed per physical server.\n2. `addNode(nodeId)`: Hashes virtual points and places them on the 32-bit ring.\n3. `removeNode(nodeId)`: Removes all virtual points belonging to that server.\n4. `getNode(key)`: Hashes the key and finds the next closest node clockwise on the ring using binary search.",
    "starterCode": "/**\n * Challenge: Consistent Hashing Ring with Virtual Nodes\n * Category: system-design | Difficulty: hard\n */\n\nclass ConsistentHashRing {\n  constructor(replicas = 3) {\n    this.replicas = replicas;\n    // TODO: Initialize hash ring\n  }\n\n  addNode(node) {\n    // TODO: Add virtual replicas of node to ring\n  }\n\n  getNode(key) {\n    // TODO: Find first server node clockwise on ring\n    return null;\n  }\n\n  solve(input) {\n    return \"\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { ConsistentHashRing, Solution: ConsistentHashRing };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Ring Wrap-around: Correctly loops back to index 0 when key hash exceeds largest ring value.\n• Virtual Node Uniformity: Multi-point virtual replica distribution for load balancing.\n• Binary Search: O(log N) node lookup on sorted ring.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8e1",
        "id": "6ab5308e873a60e2514db8e1",
        "input": "{\"key\": \"session_user_1\"}",
        "expectedOutput": "node_C"
      },
      {
        "_id": "6ab5308e873a60e2514db8e2",
        "id": "6ab5308e873a60e2514db8e2",
        "input": "{\"key\": \"session_user_2\"}",
        "expectedOutput": "node_B"
      },
      {
        "_id": "6ab5308e873a60e2514db8e3",
        "id": "6ab5308e873a60e2514db8e3",
        "input": "{\"key\": \"session_user_3\"}",
        "expectedOutput": "node_A"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33df2",
    "id": "6ab5308f4a6089fdfec33df2",
    "title": "Pub/Sub Message Broker with Topic Wildcards",
    "difficulty": "medium",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "pub-sub",
      "mqtt",
      "wildcards",
      "message-broker"
    ],
    "description": "Implement an MQTT-compliant topic matching engine for an event broker.\nSupport hierarchical topics (separated by `/`), single-level wildcard `+`, and multi-level wildcard `#`.\n\nExamples:\n• `sensors/+/temperature` matches `sensors/kitchen/temperature`, but not `sensors/kitchen/fridge/temperature`\n• `sports/#` matches `sports/football/scores` and `sports/tennis`",
    "starterCode": "/**\n * Challenge: Pub/Sub Message Broker with Topic Wildcards\n * Category: system-design | Difficulty: medium\n */\n\nclass TopicMatcher {\n  static matches(pattern, topic) {\n    // TODO: Support single-level ('*') and multi-level ('#') wildcards (e.g. MQTT style)\n    return false;\n  }\n\n  solve(input) {\n    return \"false\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { TopicMatcher, Solution: TopicMatcher };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Strict MQTT Spec: Handles single-level '+' and trailing multi-level '#' wildcards.\n• Boundary Precision: Distinguishes exact token depths for single-level wildcards.\n• Segment Isolation: Tokenizes slash delimiters without false-positive substring matches.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8eb",
        "id": "6ab5308e873a60e2514db8eb",
        "input": "{\"pattern\": \"sensors/+/temp\", \"topic\": \"sensors/living_room/temp\"}",
        "expectedOutput": "true"
      },
      {
        "_id": "6ab5308e873a60e2514db8ec",
        "id": "6ab5308e873a60e2514db8ec",
        "input": "{\"pattern\": \"sensors/+/temp\", \"topic\": \"sensors/living/room/temp\"}",
        "expectedOutput": "false"
      },
      {
        "_id": "6ab5308e873a60e2514db8ed",
        "id": "6ab5308e873a60e2514db8ed",
        "input": "{\"pattern\": \"orders/#\", \"topic\": \"orders/us/east/created\"}",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33df3",
    "id": "6ab5308f4a6089fdfec33df3",
    "title": "GraphQL Query Depth and Complexity Cost Analyzer",
    "difficulty": "medium",
    "category": "api-design",
    "executionType": "both",
    "tags": [
      "api-design",
      "graphql",
      "query-depth",
      "security",
      "dos-protection"
    ],
    "description": "Protect your GraphQL backend from Denial of Service (DoS) attacks caused by recursively nested queries (e.g., author -> posts -> author -> posts...).\nImplement a static depth analyzer that parses query strings and computes max depth.\n\nRequirements:\n1. Compute deepest nesting level of curly brackets `{` and `}`.\n2. If depth exceeds `maxDepth`, reject with `DEPTH_EXCEEDED`.\n3. Calculate field complexity cost (each field = 1 point; lists = 5 points).",
    "starterCode": "/**\n * Challenge: GraphQL Query Depth and Complexity Cost Analyzer\n * Category: api-design | Difficulty: medium\n */\n\nclass GraphQLQueryAnalyzer {\n  static calculateDepth(queryAST) {\n    // TODO: Calculate nested query depth to prevent DOS queries\n    return 0;\n  }\n\n  solve(input) {\n    return 0;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { GraphQLQueryAnalyzer, Solution: GraphQLQueryAnalyzer };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Depth Calculation: Accurate tracking of nested bracket scopes.\n• DoS Defense: Strict threshold rejection preventing stack exhaustion.\n• String Scanning Efficiency: Linear O(N) single-pass tokenization.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8f5",
        "id": "6ab5308e873a60e2514db8f5",
        "input": "{\"query\": \"{ user { id name } }\", \"maxDepth\": 3}",
        "expectedOutput": "allowed"
      },
      {
        "_id": "6ab5308e873a60e2514db8f6",
        "id": "6ab5308e873a60e2514db8f6",
        "input": "{\"query\": \"{ user { posts { comments { author { id } } } } }\", \"maxDepth\": 3}",
        "expectedOutput": "DEPTH_EXCEEDED"
      },
      {
        "_id": "6ab5308e873a60e2514db8f7",
        "id": "6ab5308e873a60e2514db8f7",
        "input": "{\"query\": \"{ items { id } }\", \"maxDepth\": 2}",
        "expectedOutput": "allowed"
      }
    ]
  },
  {
    "_id": "6ab5308f4a6089fdfec33df4",
    "id": "6ab5308f4a6089fdfec33df4",
    "title": "Fix Floating Point Precision Currency Rounding Engine",
    "difficulty": "easy",
    "category": "bug-fix",
    "executionType": "both",
    "tags": [
      "bug-fix",
      "floating-point",
      "currency",
      "financial",
      "math"
    ],
    "description": "In JavaScript, `0.1 + 0.2 === 0.30000000000000004` causes catastrophic billing discrepancies in financial applications.\nBuild a financial currency calculator that performs all arithmetic in integer cents (micros) and formats output to exactly two decimal places.\n\nRequirements:\n1. Accepts array of floating-point dollar amounts (e.g. `[0.1, 0.2, 0.05]`).\n2. Scales each number to integer cents without floating-point artifacts.\n3. Sums integer cents and formats back to USD `$X.XX` string.",
    "starterCode": "/**\n * Challenge: Fix Floating Point Precision Currency Rounding Engine\n * Category: backend | Difficulty: easy\n */\n\nclass CurrencyCalculator {\n  static add(a, b) {\n    // TODO: Add monetary amounts without IEEE 754 floating point precision drift\n    return 0;\n  }\n\n  solve(input) {\n    return 0;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { CurrencyCalculator, Solution: CurrencyCalculator };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• IEEE 754 Remediation: Converts all continuous floats to discrete integer cents before summation.\n• Deterministic Two-Decimal Output: Strict two-place decimal string formatting.\n• Empty & Zero Case Handling: Handles empty arrays and zero values gracefully.",
    "testCases": [
      {
        "_id": "6ab5308e873a60e2514db8ff",
        "id": "6ab5308e873a60e2514db8ff",
        "input": "{\"amounts\": [0.1, 0.2]}",
        "expectedOutput": "0.30"
      },
      {
        "_id": "6ab5308e873a60e2514db900",
        "id": "6ab5308e873a60e2514db900",
        "input": "{\"amounts\": [0.1, 0.2, 0.3]}",
        "expectedOutput": "0.60"
      },
      {
        "_id": "6ab5308e873a60e2514db901",
        "id": "6ab5308e873a60e2514db901",
        "input": "{\"amounts\": [19.99, 0.01, 5.5]}",
        "expectedOutput": "25.50"
      }
    ]
  },
  {
    "_id": "6ab530904a6089fdfec33df5",
    "id": "6ab530904a6089fdfec33df5",
    "title": "Priority Inversion Free Async Semaphore",
    "difficulty": "hard",
    "category": "dsa",
    "executionType": "both",
    "tags": [
      "dsa",
      "semaphore",
      "concurrency",
      "locks",
      "synchronization"
    ],
    "description": "Implement an asynchronous Counting Semaphore that manages a fixed number of permits with strict FIFO fairness.\nTasks requesting permits are queued and granted permits in exact arrival order, preventing starvation.\n\nRequirements:\n1. `constructor(permits = 1)`: Total concurrent permits available.\n2. `acquire()`: Resolves immediately if permit available; otherwise queues caller in FIFO Promise queue.\n3. `release()`: Yields permit back, resolving the next waiting queue head.",
    "starterCode": "/**\n * Challenge: Priority Inversion Free Async Semaphore\n * Category: concurrency | Difficulty: hard\n */\n\nclass AsyncSemaphore {\n  constructor(permits = 1) {\n    this.permits = permits;\n    // TODO: Initialize priority queue for waiting tasks\n  }\n\n  async acquire(priority = 0) {\n    // TODO: Acquire permit honoring task priority\n  }\n\n  release() {\n    // TODO: Release permit to highest priority waiting task\n  }\n\n  solve(input) {\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { AsyncSemaphore, Solution: AsyncSemaphore };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Starvation Avoidance: Strict FIFO dispatching of waiting resolvers.\n• Permit Invariants: Permits never drop below 0 or exceed initialized maximums.\n• Clean Non-blocking Async Design: Zero thread spinning or busy-wait polling.",
    "testCases": [
      {
        "_id": "6ab5308f873a60e2514db909",
        "id": "6ab5308f873a60e2514db909",
        "input": "{\"permits\": 2}",
        "expectedOutput": "permits_synchronized"
      },
      {
        "_id": "6ab5308f873a60e2514db90a",
        "id": "6ab5308f873a60e2514db90a",
        "input": "{\"permits\": 1}",
        "expectedOutput": "permits_synchronized"
      }
    ]
  },
  {
    "_id": "6ab530904a6089fdfec33df6",
    "id": "6ab530904a6089fdfec33df6",
    "title": "Distributed 64-Bit Snowflake ID Generator",
    "difficulty": "hard",
    "category": "system-design",
    "executionType": "both",
    "tags": [
      "system-design",
      "snowflake",
      "distributed-id",
      "twitter-snowflake",
      "scalability"
    ],
    "description": "Implement the Twitter Snowflake distributed 64-bit unique ID generation algorithm.\nSnowflake IDs are time-sortable 64-bit integers composed of:\n• 1 unused sign bit\n• 41-bit timestamp (milliseconds since custom epoch)\n• 5-bit datacenter ID\n• 5-bit worker node ID\n• 12-bit sequence counter (supports 4,096 IDs per millisecond per node)\n\nRequirements:\n1. Handle clock backwards skew (throw or sleep until clock catches up).\n2. Increment sequence counter if multiple IDs generated in the exact same millisecond.\n3. Reset sequence to 0 when timestamp advances.",
    "starterCode": "/**\n * Challenge: Distributed 64-Bit Snowflake ID Generator\n * Category: system-design | Difficulty: hard\n */\n\nclass SnowflakeIdGenerator {\n  constructor(datacenterId = 1, workerId = 1) {\n    // TODO: Initialize 5-bit datacenterId, 5-bit workerId, sequence, and lastTimestamp\n    this.datacenterId = datacenterId;\n    this.workerId = workerId;\n  }\n\n  nextId() {\n    // TODO: Implement 64-bit Snowflake ID generation algorithm:\n    // 1. Guard against backwards clock skew\n    // 2. Increment 12-bit sequence counter (max 4095) for same millisecond\n    // 3. Reset sequence to 0 when timestamp advances\n    // 4. Return packed 64-bit BigInt string (timestamp << 22 | datacenter << 17 | worker << 12 | sequence)\n    throw new Error(\"nextId() not implemented\");\n  }\n\n  solve(input) {\n    if (!input) return \"invalid\";\n    const dc = input.datacenterId ?? 1;\n    const worker = input.workerId ?? 1;\n    const gen = new SnowflakeIdGenerator(dc, worker);\n    const id = gen.nextId();\n    return id.length >= 15 ? \"valid_id\" : \"invalid\";\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { SnowflakeIdGenerator, Solution: SnowflakeIdGenerator };\n}\n",
    "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Bitwise Precision: Accurate 41-5-5-12 bit alignment using BigInt.\n• Monotonic Sorting: IDs generated later in time compare strictly greater than earlier IDs.\n• Clock Skew Defense: Safeguards against backward NTP clock synchronization.",
    "testCases": [
      {
        "_id": "6ab5308f873a60e2514db911",
        "id": "6ab5308f873a60e2514db911",
        "input": "{\"datacenterId\": 1, \"workerId\": 1}",
        "expectedOutput": "valid_id"
      },
      {
        "_id": "6ab5308f873a60e2514db912",
        "id": "6ab5308f873a60e2514db912",
        "input": "{\"datacenterId\": 2, \"workerId\": 5}",
        "expectedOutput": "valid_id"
      },
      {
        "_id": "6ab5308f873a60e2514db913",
        "id": "6ab5308f873a60e2514db913",
        "input": "{\"datacenterId\": 0, \"workerId\": 0}",
        "expectedOutput": "valid_id"
      }
    ]
  }
];

export const DEFAULT_CHALLENGE_DATA = {
  "_id": "6ab5308e4a6089fdfec33de4",
  "id": "6ab5308e4a6089fdfec33de4",
  "title": "Distributed Token Bucket Rate Limiter",
  "difficulty": "medium",
  "category": "system-design",
  "executionType": "both",
  "tags": [
    "system-design",
    "rate-limiter",
    "token-bucket",
    "concurrency",
    "distributed-systems"
  ],
  "description": "Implement a high-throughput, memory-bounded Token Bucket Rate Limiter in JavaScript.\nThe system controls traffic flow by replenishing tokens at a continuous rate and consuming tokens upon valid requests.\n\nRequirements:\n1. `constructor(capacity = 10, refillRate = 2)`: Maximum tokens in bucket, and replenishment rate (tokens/sec).\n2. `allow(tokens = 1)`: Consumes tokens if available and returns `true`. If insufficient tokens, returns `false` without dropping state.\n3. Must use lazy replenishment based on timestamp differences (O(1) time complexity) rather than active timer intervals.",
  "starterCode": "/**\n * Challenge: Distributed Token Bucket Rate Limiter\n * Category: system-design | Difficulty: medium\n */\n\nclass TokenBucket {\n  constructor(capacity = 10, refillRate = 2) {\n    this.capacity = capacity;\n    this.refillRate = refillRate;\n    // TODO: Initialize token bucket state and timestamp\n  }\n\n  allow(tokens = 1) {\n    // TODO: Implement lazy token replenishment and consumption\n    // Return true if sufficient tokens are available, false otherwise\n    return false;\n  }\n\n  solve(input) {\n    if (typeof input === \"number\") return this.allow(input);\n    if (input && typeof input.tokens === \"number\") return this.allow(input.tokens);\n    return false;\n  }\n}\n\nif (typeof module !== \"undefined\") {\n  module.exports = { TokenBucket, Solution: TokenBucket };\n}\n",
  "evaluationCriteria": "CRITERIA FOR 100/100 SCORE:\n• Algorithmic Efficiency: O(1) mathematical delta replenishment without setInterval or setTimeout.\n• Burst Tolerance: Handles instantaneous token bursts up to max capacity.\n• State Preservation: Failed requests must not deduct tokens or corrupt timestamp markers.\n• Clean API: Robust input validation and encapsulation.",
  "testCases": [
    {
      "_id": "6ab5308d873a60e2514db85d",
      "id": "6ab5308d873a60e2514db85d",
      "input": "{\"tokens\": 5}",
      "expectedOutput": "true"
    },
    {
      "_id": "6ab5308d873a60e2514db85e",
      "id": "6ab5308d873a60e2514db85e",
      "input": "{\"tokens\": 10}",
      "expectedOutput": "false"
    },
    {
      "_id": "6ab5308d873a60e2514db85f",
      "id": "6ab5308d873a60e2514db85f",
      "input": "{\"tokens\": 1}",
      "expectedOutput": "true"
    }
  ]
};

/**
 * Resolves a challenge by MongoDB _id, slug, or title keyword.
 */
export function getFallbackChallenge(identifier) {
  if (!identifier) return DEFAULT_CHALLENGE_DATA;
  const idStr = String(identifier).toLowerCase().trim();

  // 1. Direct ID match
  const byId = ALL_CHALLENGES_CATALOG.find(
    (c) => c._id.toLowerCase() === idStr || c.id.toLowerCase() === idStr
  );
  if (byId) return byId;

  // 2. Normalized title match
  const byTitle = ALL_CHALLENGES_CATALOG.find(
    (c) => c.title.toLowerCase() === idStr.replace(/[-_]/g, " ")
  );
  if (byTitle) return byTitle;

  // 3. Keyword / Substring match
  const cleanKeyword = idStr.replace(/[-_]/g, " ");
  const bySub = ALL_CHALLENGES_CATALOG.find((c) =>
    c.title.toLowerCase().includes(cleanKeyword) || cleanKeyword.includes(c.title.toLowerCase())
  );
  if (bySub) return bySub;

  // 4. Token-based overlap
  const tokens = idStr.split(/[-_s]+/).filter((t) => t.length > 3);
  if (tokens.length > 0) {
    const byTokens = ALL_CHALLENGES_CATALOG.find((c) => {
      const lower = c.title.toLowerCase();
      return tokens.filter((tok) => lower.includes(tok)).length >= 2;
    });
    if (byTokens) return byTokens;
  }

  return DEFAULT_CHALLENGE_DATA;
}
