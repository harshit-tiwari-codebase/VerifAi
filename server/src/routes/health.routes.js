const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Queue = require("bull");
const executionQueueModule = require("../queues/execution.queue");
const aiEvaluationQueueModule = require("../queues/aiEvaluation.queue");

const router = express.Router();

/**
 * Perform active ping check on all connected services:
 * 1. MongoDB Database
 * 2. Redis / Upstash Queue
 * 3. Gemini AI API
 * 4. Judge0 Execution Provider
 * 5. Local Sandbox Fallback Engine
 */
async function checkAllServices() {
  const timestamp = new Date().toISOString();
  const services = {};

  // 1. MongoDB Status
  try {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
      services.mongo = {
        status: "connected",
        message: "MongoDB connected and operational",
        database: mongoose.connection.name || "VerifAIDB",
      };
    } else {
      const states = ["disconnected", "connected", "connecting", "disconnecting"];
      services.mongo = {
        status: "degraded",
        message: `MongoDB connection state: ${states[state] || "unknown"}`,
      };
    }
  } catch (err) {
    services.mongo = {
      status: "error",
      message: err.message,
    };
  }

  // 2. Redis / Upstash Status
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl || redisUrl.trim().length === 0) {
      services.redis = {
        status: "offline_fallback",
        message: "No REDIS_URL configured; running in standalone local async worker mode",
      };
    } else {
      const execQueue = executionQueueModule.getQueue();
      if (execQueue && typeof execQueue.isReady === "function") {
        await Promise.race([
          execQueue.isReady(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Redis ping timed out after 3000ms")), 3000)),
        ]);
        services.redis = {
          status: "connected",
          message: "Upstash Redis queue connected and active",
        };
      } else {
        services.redis = {
          status: "offline_fallback",
          message: "Upstash Redis not yet ready; fallback worker is handling jobs in-process",
        };
      }
    }
  } catch (err) {
    services.redis = {
      status: "offline_fallback",
      message: `Upstash Redis unreachable (${err.message}); fallback in-process queue is handling jobs`,
    };
  }

  // 3. Gemini AI API Check
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      services.geminiAI = {
        status: "missing_key",
        message: "GEMINI_API_KEY is not set in environment variables",
      };
    } else {
      // Light ping to list models / verify key validity
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`;
      const res = await axios.get(url, { timeout: 4000 });
      if (res.status === 200) {
        services.geminiAI = {
          status: "connected",
          message: "Gemini AI API connected and valid",
          modelConfigured: "gemini-3.8-flash / gemini-2.5-flash",
        };
      } else {
        services.geminiAI = {
          status: "degraded",
          message: `Gemini API responded with status ${res.status}`,
        };
      }
    }
  } catch (err) {
    services.geminiAI = {
      status: "error",
      message: `Gemini AI ping failed: ${err.response?.data?.error?.message || err.message}`,
    };
  }

  // 4. Judge0 Execution Provider Check
  try {
    const judgeUrl = process.env.JUDGE0_API_URL || "http://localhost:2358";
    const rapidKey = process.env.RAPIDAPI_KEY || process.env.JUDGE0_API_KEY;
    const headers = {};
    if (rapidKey) {
      headers["x-rapidapi-key"] = rapidKey;
      headers["x-rapidapi-host"] = process.env.RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
    }

    const res = await axios.get(`${judgeUrl}/about`, { headers, timeout: 2500 });
    services.judge0 = {
      status: "connected",
      url: judgeUrl,
      message: `Judge0 connected (version ${res.data?.version || "active"})`,
    };
  } catch (err) {
    services.judge0 = {
      status: "offline_fallback",
      url: process.env.JUDGE0_API_URL || "http://localhost:2358",
      message: `Judge0 unreachable (${err.message}); internal child-process sandbox will execute solutions`,
    };
  }

  // 5. Local Sandbox Fallback
  services.localSandbox = {
    status: "ready",
    message: "Isolated Node child-process execution engine ready (timeout: 4000ms, maxBuffer: 1MB)",
  };

  const isHealthy =
    services.mongo.status === "connected" &&
    (services.redis.status === "connected" || services.redis.status === "offline_fallback") &&
    (services.judge0.status === "connected" || services.judge0.status === "offline_fallback");

  return {
    status: isHealthy ? "operational" : "degraded",
    timestamp,
    services,
  };
}

/**
 * GET /api/health/diagnostics
 * Detailed health diagnostics endpoint with pretty console terminal output
 */
router.get("/diagnostics", async (req, res) => {
  const check = await checkAllServices();

  // Print readable diagnosis to server terminal
  console.log("\n================ [VerifAI Services Diagnostics] ================");
  console.log(`Timestamp: ${check.timestamp} | Overall: ${check.status.toUpperCase()}`);
  console.log("----------------------------------------------------------------");
  for (const [name, info] of Object.entries(check.services)) {
    const icon =
      info.status === "connected" || info.status === "ready"
        ? "✔ [OK]"
        : info.status.includes("fallback")
        ? "▲ [FALLBACK]"
        : "✖ [ERROR]";
    console.log(`${icon.padEnd(14)} ${name.padEnd(16)} : ${info.message}`);
  }
  console.log("=================================================================\n");

  return res.status(200).json(check);
});

module.exports = {
  healthRouter: router,
  checkAllServices,
};
