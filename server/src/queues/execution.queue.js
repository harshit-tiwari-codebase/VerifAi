const Queue = require("bull");
const REDIS_URL = require("../config/redisConfig");

const executionQueue = new Queue("execution", REDIS_URL, {
  redis: {
    tls: { rejectUnauthorized: false },
  },
});

module.exports = executionQueue;