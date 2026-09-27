const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

let executionQueue;

if (REDIS_URL) {
  try {
    executionQueue = new Queue("execution", REDIS_URL, {
      redis: {
        tls: REDIS_URL.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      },
    });
    executionQueue.on("error", (err) => {
      console.warn("ExecutionQueue Redis warning (falling back to in-process execution):", err.message);
    });
  } catch (err) {
    console.warn("Failed to initialize Execution Bull Queue, using in-memory runner:", err.message);
  }
}

if (!executionQueue) {
  // Safe mock queue when Redis is not present
  executionQueue = {
    add: async () => {},
    process: () => {},
    on: () => {},
  };
}

module.exports = executionQueue;