const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

const aiEvaluationQueue = new Queue("aiEvaluation", REDIS_URL, {
  redis: {
    tls: { rejectUnauthorized: false },
  },
});

module.exports = aiEvaluationQueue;