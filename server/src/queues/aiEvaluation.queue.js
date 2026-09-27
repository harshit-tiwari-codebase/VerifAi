const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

let aiEvaluationQueue;

if (REDIS_URL) {
  try {
    aiEvaluationQueue = new Queue("aiEvaluation", REDIS_URL, {
      redis: {
        tls: REDIS_URL.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
      },
    });
    aiEvaluationQueue.on("error", (err) => {
      console.warn("AiEvaluationQueue Redis warning (falling back to in-process execution):", err.message);
    });
  } catch (err) {
    console.warn("Failed to initialize AiEvaluation Bull Queue, using in-memory runner:", err.message);
  }
}

if (!aiEvaluationQueue) {
  // Safe mock queue when Redis is not present
  aiEvaluationQueue = {
    add: async () => {},
    process: () => {},
    on: () => {},
  };
}

module.exports = aiEvaluationQueue;