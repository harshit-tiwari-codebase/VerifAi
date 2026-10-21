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

    executionQueue.isReady().then(() => {
      isReady = true;
      console.log("Execution queue connected to Redis and ready");
    }).catch((err) => {
      isReady = false;
      console.warn("Execution queue Redis connection error:", err.message);
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
  return true;
}

module.exports = {
  getQueue: () => executionQueue,
  isQueueReady: () => isReady,
  isQueueAvailable,
  add: async (data, opts) => {
    if (executionQueue) {
      return executionQueue.add(data, opts);
    }
    return { id: `local_job_${Date.now()}`, data };
  },
};
