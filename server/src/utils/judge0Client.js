const axios = require("axios");

const JUDGE0_BASE_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.JUDGE0_API_KEY;
const RAPIDAPI_HOST =
  process.env.RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";

const LANGUAGE_IDS = {
  javascript: 93, // Node.js 18.15.0 (or 63 for 12.14.0)
  python: 92, // Python 3.11.2
  cpp: 54, // C++ (GCC 9.2.0)
  java: 91, // Java (OpenJDK 17.0.6)
};

/**
 * Common headers for Judge0 requests
 */
function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (RAPIDAPI_KEY) {
    headers["x-rapidapi-key"] = RAPIDAPI_KEY;
    headers["x-rapidapi-host"] = RAPIDAPI_HOST;
  }
  return headers;
}

/**
 * Submit a batch of code executions to Judge0
 */
async function submitBatch(submissions) {
  const url = `${JUDGE0_BASE_URL}/submissions/batch?base64_encoded=false`;
  const response = await axios.post(
    url,
    { submissions },
    {
      headers: getHeaders(),
      timeout: 10000,
    }
  );
  return response.data; // Array of { token }
}

/**
 * Poll a batch of submission tokens until completion or timeout
 */
async function pollBatch(tokens, maxWaitMs = 15000) {
  const url = `${JUDGE0_BASE_URL}/submissions/batch?tokens=${tokens.join(
    ","
  )}&base64_encoded=false&fields=token,status_id,status,stdout,stderr,compile_output,time,memory`;

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const response = await axios.get(url, {
      headers: getHeaders(),
      timeout: 10000,
    });

    const results = response.data?.submissions || response.data || [];
    // Status 1 (In Queue) or 2 (Processing) mean still pending
    const allDone = results.every((r) => r.status_id > 2);
    if (allDone) {
      return results;
    }
    // Wait 500ms before next poll
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Polling Judge0 batch timed out");
}

module.exports = {
  submitBatch,
  pollBatch,
  LANGUAGE_IDS,
  JUDGE0_BASE_URL,
};