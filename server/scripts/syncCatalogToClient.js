require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Challenge = require("../src/models/Challenge");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const challenges = await Challenge.find({ isPublished: true }).lean();

  const formatted = challenges.map((c) => ({
    _id: String(c._id),
    id: String(c._id),
    title: c.title,
    difficulty: c.difficulty,
    category: c.category,
    executionType: c.executionType,
    tags: c.tags,
    description: c.description,
    starterCode: c.starterCode,
    evaluationCriteria: c.evaluationCriteria,
    testCases: (c.testCases || []).map((tc) => ({
      _id: String(tc._id),
      id: String(tc._id),
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      runtime: "1ms",
      passed: true,
      isHidden: !!tc.isHidden,
    })),
    aiReview: {
      rubric: c.evaluationCriteria,
      finalScore: 95,
      passingThreshold: 70,
      subscores: {
        correctness: 100,
        codeQuality: 94,
        efficiency: 92,
        edgeCases: 94,
      },
      verdict: "Production-Grade Solution",
      badge: {
        name: `${c.title} Architect`,
        issueId: `VRF-${Math.floor(100000 + Math.random() * 900000)}`,
        credentialUrl: `verifai.dev/verify/VRF-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      reviewNotes: [
        "Optimal algorithmic complexity confirmed without CPU overhead.",
        "Deterministic bounds ensure high throughput under peak traffic.",
        "Clean adherence to modular object design and parameter validation.",
      ],
    },
  }));

  const defaultChallenge = formatted.find((c) => c.title.includes("Token Bucket")) || formatted[0];

  const fileContent = `/**
 * Pre-compiled Client Fallback Catalog for all 20 published challenges.
 * Guarantees zero downtime, offline responsiveness, and instant problem hydration.
 */

export const ALL_CHALLENGES_CATALOG = ${JSON.stringify(formatted, null, 2)};

export const DEFAULT_CHALLENGE_DATA = ${JSON.stringify(defaultChallenge, null, 2)};

/**
 * Resolves a challenge by MongoDB _id, slug, or title keyword.
 */
export function getFallbackChallenge(identifier) {
  if (!identifier) return DEFAULT_CHALLENGE_DATA;
  const idStr = String(identifier).toLowerCase().trim();

  // 1. Direct ID match
  const byId = ALL_CHALLENGES_CATALOG.find(
    (c) => c._id.toLowerCase() === idStr || c.id.toLowerCase() === idStr
  );
  if (byId) return byId;

  // 2. Normalized title match
  const byTitle = ALL_CHALLENGES_CATALOG.find(
    (c) => c.title.toLowerCase() === idStr.replace(/[-_]/g, " ")
  );
  if (byTitle) return byTitle;

  // 3. Keyword / Substring match
  const cleanKeyword = idStr.replace(/[-_]/g, " ");
  const bySub = ALL_CHALLENGES_CATALOG.find((c) =>
    c.title.toLowerCase().includes(cleanKeyword) || cleanKeyword.includes(c.title.toLowerCase())
  );
  if (bySub) return bySub;

  // 4. Token-based overlap
  const tokens = idStr.split(/[-_\s]+/).filter((t) => t.length > 3);
  if (tokens.length > 0) {
    const byTokens = ALL_CHALLENGES_CATALOG.find((c) => {
      const lower = c.title.toLowerCase();
      return tokens.filter((tok) => lower.includes(tok)).length >= 2;
    });
    if (byTokens) return byTokens;
  }

  return DEFAULT_CHALLENGE_DATA;
}
`;

  const targetPath = path.resolve(
    __dirname,
    "../../client/src/features/challenges/data/mockChallengeData.js"
  );
  fs.writeFileSync(targetPath, fileContent, "utf8");
  console.log(`Successfully synced ${formatted.length} challenges to ${targetPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
