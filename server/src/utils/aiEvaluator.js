const axios = require("axios");

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

const buildPrompt = ({ code, language, criteria, judge0Result }) => `
You are a senior software engineer reviewing a candidate's code submission.

Language: ${language}

Evaluation criteria:
${criteria}

${judge0Result ? `Automated test results: ${judge0Result.overallPassed ? "All test cases passed" : "Some test cases failed"}` : ""}

Candidate's code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY a valid JSON object, no markdown fences, no extra text, in exactly this shape:
{
  "score": <number 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...]
}
`;

const stripFences = (text) => text.replace(/```json/gi, "").replace(/```/g, "").trim();

const evaluateSubmission = async ({ code, language, criteria, judge0Result }) => {
  const prompt = buildPrompt({ code, language, criteria, judge0Result });

  const response = await axios.post(
    GEMINI_URL,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" } }
  );

  const rawText = response.data.candidates[0].content.parts[0].text;
  const cleaned = stripFences(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("AI response could not be parsed as JSON: " + cleaned.slice(0, 300));
  }
};

module.exports = { evaluateSubmission };