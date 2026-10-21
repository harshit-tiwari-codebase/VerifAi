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

    aiEvaluationQueue.isReady().then(() => {
      isReady = true;
      console.log("AI evaluation queue connected to Redis and ready");
    }).catch((err) => {
      isReady = false;
      console.warn("AI evaluation queue Redis connection error:", err.message);
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
  return true;
}

module.exports = {
  getQueue: () => aiEvaluationQueue,
  isQueueReady: () => isReady,
  isQueueAvailable,
  add: async (data, opts) => {
    if (aiEvaluationQueue) {
      return aiEvaluationQueue.add(data, opts);
    }
    return { id: `local_ai_job_${Date.now()}`, data };
  },
};
