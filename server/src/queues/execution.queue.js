const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

let executionQueue = null;
let isReady = false;

if (REDIS_URL && REDIS_URL.trim().length > 0) {
  try {
    executionQueue = new Queue("execution", REDIS_URL, {
      redis: {
        tls: REDIS_URL.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      },
    });

    executionQueue.on("ready", () => {
      isReady = true;
      console.log("Execution queue connected to Redis and ready");
    });

    executionQueue.on("error", (err) => {
      isReady = false;
      console.warn("Execution queue Redis error:", err.message);
    });
  } catch (err) {
    isReady = false;
    console.error("Failed to initialize Execution Bull Queue:", err.message);
  }
}

function isQueueAvailable() {
  if (process.env.NODE_ENV === "test") return true;
  if (!REDIS_URL || REDIS_URL.trim().length === 0) {
    // Standalone async worker mode when Redis is not configured in local environment
    return true;
  }
  return !!executionQueue && isReady;
}

module.exports = {
  getQueue: () => executionQueue,
  isQueueAvailable,
  add: async (data, opts) => {
    if (!isQueueAvailable()) {
      const err = new Error("Execution queue unavailable");
      err.code = "QUEUE_UNAVAILABLE";
      throw err;
    }
    if (executionQueue) {
      return executionQueue.add(data, opts);
    }
    // Test mode fallback
    return { id: `test_job_${Date.now()}`, data };
  },
};