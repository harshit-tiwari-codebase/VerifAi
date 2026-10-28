const axios = require("axios");

async function testSubmit() {
  const code = `class CurrencyCalculator {
  static sumAmounts(amounts = []) {
    if (!Array.isArray(amounts) || amounts.length === 0) {
      return "0.00";
    }
    let totalCents = 0;
    for (const amt of amounts) {
      if (typeof amt !== "number" || isNaN(amt)) continue;
      const cents = Math.round((amt + Number.EPSILON) * 100);
      totalCents += cents;
    }
    return (totalCents / 100).toFixed(2);
  }

  solve(input) {
    if (!input || !Array.isArray(input.amounts)) {
      return "0.00";
    }
    return CurrencyCalculator.sumAmounts(input.amounts);
  }
}

if (typeof module !== "undefined") {
  module.exports = { CurrencyCalculator, Solution: CurrencyCalculator };
}`;

  try {
    const runRes = await axios.post(
      "http://localhost:3000/api/challenges/6ab5308f4a6089fdfec33df4/run",
      {
        challengeId: "6ab5308f4a6089fdfec33df4",
        code,
        language: "javascript",
      }
    );
    console.log("Run Tests Success:", runRes.data.success);
    console.log("Run Test Cases Count:", runRes.data.testCases.length);

    const res = await axios.post(
      "http://localhost:3000/api/challenges/6ab5308f4a6089fdfec33df4/submit",
      {
        challengeId: "6ab5308f4a6089fdfec33df4",
        code,
        language: "javascript",
      }
    );
    console.log("Submit Success! Score:", res.data.score);
    console.log("Status:", res.data.status);
    console.log("Evaluation Final Score:", res.data.evaluation?.finalScore);
  } catch (err) {
    console.error("Failed:", err.message, err.response?.data);
  }
}

testSubmit();
