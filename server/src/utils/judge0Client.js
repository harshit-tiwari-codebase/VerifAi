const axios = require("axios");

const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

// language + versionIndex, JDoodle ke official docs ke hisaab se (reasonably recent, stable versions)
const LANGUAGE_CONFIG = {
  javascript: { language: "nodejs", versionIndex: "5" },   // NodeJS 20.9.0
  python: { language: "python3", versionIndex: "5" },      // Python 3.11.5
  python3: { language: "python3", versionIndex: "5" },
  cpp: { language: "cpp", versionIndex: "5" },              // GCC 11.1.0
  "c++": { language: "cpp", versionIndex: "5" },
  java: { language: "java", versionIndex: "4" },            // JDK 17.0.1
  c: { language: "c", versionIndex: "5" },                  // GCC 11.1.0
};

const runCode = async ({ code, language, stdin }) => {
  const config = LANGUAGE_CONFIG[language.toLowerCase()];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const response = await axios.post(JDOODLE_URL, {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: code,
    stdin: stdin || "",
    language: config.language,
    versionIndex: config.versionIndex,
  });

  return response.data; // { output, statusCode, memory, cpuTime, error? }
};

module.exports = { runCode, LANGUAGE_CONFIG };