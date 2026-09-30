const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

let aiEvaluationQueue = null;
let isReady = false;

if (REDIS_URL && REDIS_URL.trim().length > 0) {
  try {
    aiEvaluationQueue = new Queue("ai-evaluation", REDIS_URL, {
      redis: {
        tls: REDIS_URL.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      },
    });

    aiEvaluationQueue.on("ready", () => {
      isReady = true;
      console.log("AI evaluation queue connected to Redis and ready");
    });

    aiEvaluationQueue.on("error", (err) => {
      isReady = false;
      console.warn("AI evaluation queue Redis error:", err.message);
    });
  } catch (err) {
    isReady = false;
    console.error("Failed to initialize AI Evaluation Bull Queue:", err.message);
  }
}

function isQueueAvailable() {
  if (process.env.NODE_ENV === "test") return true;
  if (!REDIS_URL || REDIS_URL.trim().length === 0) {
    // Standalone async worker mode when Redis is not configured in local environment
    return true;
  }
  return !!aiEvaluationQueue && isReady;
}

module.exports = {
  getQueue: () => aiEvaluationQueue,
  isQueueAvailable,
  add: async (data, opts) => {
    if (!isQueueAvailable()) {
      const err = new Error("AI evaluation queue unavailable");
      err.code = "QUEUE_UNAVAILABLE";
      throw err;
    }
    if (aiEvaluationQueue) {
      return aiEvaluationQueue.add(data, opts);
    }
    return { id: `test_ai_job_${Date.now()}`, data };
  },
};