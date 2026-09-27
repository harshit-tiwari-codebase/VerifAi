require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Challenge = require("../src/models/Challenge");

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI not found");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const email = "harshit20112005@gmail.com";
  let user = await User.findOne({ email });
  if (!user) {
    console.error("User not found:", email);
    process.exit(1);
  }

  const challengeData = {
    title: "Distributed LRU Cache with TTL Expiration",
    description: `Design and implement a high-throughput Least Recently Used (LRU) Cache with Time-To-Live (TTL) expiration in JavaScript.

The cache must support O(1) time complexity for both \`get\` and \`set\` operations using a Doubly Linked List and a Hash Map.

Requirements:
1. \`constructor(capacity = 3)\`: Initializes the cache with a maximum capacity.
2. \`get(key)\`: Returns the value of the key if it exists and has not expired, and marks it as most recently used. Returns \`-1\` if expired or missing.
3. \`set(key, value, ttlMs = 0)\`: Inserts or updates the key-value pair with an optional TTL in milliseconds. If capacity is exceeded, evicts the least recently used item in O(1) time.
4. \`size()\`: Returns the number of unexpired items currently in the cache.
5. Must achieve O(1) operations without iterating through all keys or spawning recurring timer intervals.`,
    difficulty: "medium",
    category: "dsa",
    executionType: "both",
    tags: ["dsa", "lru-cache", "doubly-linked-list", "hashmap", "system-design"],
    starterCode: `/**
 * Challenge: Distributed LRU Cache with TTL Expiration
 * Category: dsa / system-design
 * Difficulty: medium
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
  /**
   * @param {number} capacity
   */
  constructor(capacity = 3) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node(0, 0); // Dummy head (most recent)
    this.tail = new Node(0, 0); // Dummy tail (least recent)
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Remove a node from doubly linked list
   * @private
   */
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * Insert node right after dummy head (most recently used)
   * @private
   */
  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * Get value of key
   * @param {string|number} key
   * @returns {any}
   */
  get(key) {
    if (!this.map.has(key)) return -1;

    const node = this.map.get(key);

    // Check TTL expiration
    if (Date.now() > node.expiresAt) {
      this._remove(node);
      this.map.delete(key);
      return -1;
    }

    // Move to front (most recently used)
    this._remove(node);
    this._add(node);
    return node.value;
  }

  /**
   * Set key-value pair with optional TTL
   * @param {string|number} key
   * @param {any} value
   * @param {number} ttlMs
   */
  set(key, value, ttlMs = 0) {
    const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : Infinity;

    if (this.map.has(key)) {
      const existing = this.map.get(key);
      this._remove(existing);
    } else if (this.map.size >= this.capacity) {
      // Evict least recently used (node before tail)
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }

    const newNode = new Node(key, value, expiresAt);
    this._add(newNode);
    this.map.set(key, newNode);
  }

  /**
   * Number of items in cache
   */
  size() {
    return this.map.size;
  }

  /**
   * Test runner adapter
   */
  solve(input) {
    if (!input) return true;
    if (input.action === "get") return this.get(input.key);
    if (input.action === "set") {
      this.set(input.key, input.value, input.ttlMs || 0);
      return true;
    }
    return true;
  }
}

if (typeof module !== "undefined") {
  module.exports = { LRUCache, Node };
}
`,
    testCases: [
      {
        input: '{"action": "set", "key": "a", "value": 100}',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: '{"action": "get", "key": "a"}',
        expectedOutput: "100",
        isHidden: false,
      },
      {
        input: '{"action": "get", "key": "non_existent"}',
        expectedOutput: "-1",
        isHidden: false,
      },
      {
        input: '{"action": "set", "key": "b", "value": 200}',
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: '{"action": "get", "key": "b"}',
        expectedOutput: "200",
        isHidden: true,
      },
    ],
    evaluationCriteria: `CRITERIA FOR 100/100 SCORE:
• Algorithmic Efficiency: O(1) constant time get/set operations using Doubly Linked List with dummy head and tail nodes + Hash Map.
• TTL Expiration: Lazy O(1) expiration validation on access without spawning background interval threads.
• Memory Bounds & Eviction: Deterministic O(1) eviction of least recently used keys when capacity is reached.
• Code Quality: Clean Node class encapsulation, private pointer helper methods, and strict type safety.`,
    isPublished: true,
    createdBy: user._id,
  };

  const saved = await Challenge.findOneAndUpdate(
    { title: challengeData.title },
    challengeData,
    { upsert: true, returnDocument: "after" }
  );

  console.log("Challenge published successfully!");
  console.log("Title:", saved.title);
  console.log("ID:", saved._id);
  console.log("Execution Type:", saved.executionType);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
