require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
const Challenge = require("../src/models/Challenge");

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI not found in environment.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB successfully.");

  const email = "harshit20112005@gmail.com";
  let user = await User.findOne({ email });

  if (!user) {
    console.log(`User ${email} not found. Creating user with admin role...`);
    const hashedPassword = await bcrypt.hash("12345678", 10);
    user = await User.create({
      name: "Harshit Tiwari",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    console.log("User created:", user._id);
  } else {
    console.log(`User ${email} found (${user._id}). Ensuring admin role and verified status...`);
    user.role = "admin";
    user.isVerified = true;
    await user.save();
    console.log("User updated to admin role.");
  }

  // 1. Challenge: Distributed Token Bucket Rate Limiter
  const challenge1Data = {
    title: "Distributed Token Bucket Rate Limiter",
    description: `Design and implement a thread-safe Token Bucket Rate Limiter class in JavaScript.

The rate limiter must accurately replenish tokens based on elapsed time without running an active loop or background interval timer (achieving O(1) time complexity for token consumption).

Requirements:
1. Initialize with 'capacity' (maximum tokens stored) and 'refillRate' (tokens replenished per second).
2. 'allow(tokensRequested = 1)' should return 'true' if enough tokens are available and deduct them, or 'false' otherwise without mutating existing tokens.
3. Automatically clamp tokens at capacity so excessive idle periods do not accrue infinite tokens.
4. Support microsecond elapsed accuracy and handle arbitrary burst request patterns gracefully.`,
    difficulty: "medium",
    category: "system-design",
    executionType: "both", // BOTH automated testcases and AI evaluation enabled
    tags: ["distributed-systems", "concurrency", "rate-limiting", "algorithms"],
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

// Module export for sandboxed evaluation
if (typeof module !== "undefined") {
  module.exports = { TokenBucket };
}
`,
    testCases: [
      {
        input: "10, 2, 5",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "10, 2, 10",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "10, 2, 12",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "10, 2, 1",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "100, 50, 1",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    evaluationCriteria: `CRITERIA FOR AI ARCHITECTURAL REVIEW:
• Algorithmic Complexity: Must compute token replenishment in O(1) time complexity without active while/for loops or interval timers.
• Concurrency & Race Conditions: Evaluates deterministic token reservation and clock skew handling.
• Boundary Protection: Verifies token clamping at capacity ceiling and rejects negative or zero allocations.
• Code Quality: Clean modular class structure with explicit parameter documentation.`,
    isPublished: true,
    createdBy: user._id,
  };

  // 2. Challenge: Design a URL Shortener Service
  const challenge2Data = {
    title: "Design a URL Shortener Service",
    description: `Design the architecture and core encoding engine for a distributed URL Shortener (like bit.ly) capable of handling 10 million requests per day.

Requirements:
1. Base62 unique short-code generation (using characters [a-z, A-Z, 0-9]) resulting in compact 7-character URLs.
2. Collision-free short code mapping with deterministic redirect resolution.
3. Integrated rate limiter to protect shortening endpoints from automated abuse.
4. O(1) in-memory / cache resolution speed for high read-to-write ratios.`,
    difficulty: "hard",
    category: "system-design",
    executionType: "both",
    tags: ["system-design", "scalability", "base62", "caching", "hashing"],
    starterCode: `class DesignAUrlShortenerService {
  constructor() {
    this.BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.urlMap = new Map();
    this.codeMap = new Map();
    this.counter = 100000000;
  }

  /**
   * Shorten long URL to 7-character Base62 string
   * @param {string} originalUrl
   * @returns {string} shortUrl
   */
  shorten(originalUrl) {
    if (this.urlMap.has(originalUrl)) {
      return "https://short.ly/" + this.urlMap.get(originalUrl);
    }
    
    let num = this.counter++;
    let code = "";
    while (num > 0) {
      code = this.BASE62[num % 62] + code;
      num = Math.floor(num / 62);
    }
    code = code.padStart(7, "0");
    
    this.urlMap.set(originalUrl, code);
    this.codeMap.set(code, originalUrl);
    return "https://short.ly/" + code;
  }

  /**
   * Resolve short code to original URL
   * @param {string} shortCode
   * @returns {string|null}
   */
  redirect(shortCode) {
    const code = shortCode.replace("https://short.ly/", "");
    return this.codeMap.get(code) || null;
  }

  /**
   * Test runner adapter
   */
  solve(input) {
    if (typeof input === "object" && input.url) {
      return this.shorten(input.url);
    }
    return true;
  }
}

if (typeof module !== "undefined") {
  module.exports = { DesignAUrlShortenerService };
}
`,
    testCases: [
      {
        input: '{"url": "https://example.com/very/long/path/1"}',
        expectedOutput: "https://short.ly/000GFX0",
        isHidden: false,
      },
      {
        input: '{"url": "https://verifai.dev/challenges"}',
        expectedOutput: "https://short.ly/000GFX1",
        isHidden: false,
      },
      {
        input: '{"url": "https://github.com/verifai"}',
        expectedOutput: "https://short.ly/000GFX2",
        isHidden: true,
      },
    ],
    evaluationCriteria: `EVALUATION CRITERIA:
• Base62 Hash / ID Strategy: Collision-free 7-character encoding with 62^7 capacity.
• Cache Layering: Efficient O(1) lookup to sustain 100:1 read-to-write traffic ratios.
• Database Selection Justification: Documented tradeoffs between NoSQL key-value stores vs Relational indexing.
• Edge Cases: Empty URL validation, duplicate URL deduplication, and invalid redirect handling.`,
    isPublished: true,
    createdBy: user._id,
  };

  // Upsert Challenge 1
  const c1 = await Challenge.findOneAndUpdate(
    { title: challenge1Data.title },
    challenge1Data,
    { upsert: true, new: true }
  );
  console.log(`Challenge 1 "${c1.title}" saved with ID: ${c1._id}`);

  // Upsert Challenge 2
  const c2 = await Challenge.findOneAndUpdate(
    { title: challenge2Data.title },
    challenge2Data,
    { upsert: true, new: true }
  );
  console.log(`Challenge 2 "${c2.title}" saved with ID: ${c2._id}`);

  console.log("All challenges created successfully for", email);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating challenges:", err);
  process.exit(1);
});
