const mongoose = require("mongoose");

const testCaseResultSchema = new mongoose.Schema(
  {
    testCaseId: { type: mongoose.Schema.Types.ObjectId },
    passed: Boolean,
    actualOutput: String,
    expectedOutput: String,
    isHidden: Boolean,
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },

    code: { type: String, required: true },
    language: { type: String, required: true },

    status: {
      type: String,
      enum: ["queued", "running", "judge0_done", "ai_reviewing", "completed", "failed"],
      default: "queued",
    },

    judge0Result: {
      type: {
        overallPassed: Boolean,
        testCaseResults: [testCaseResultSchema],
        rawStderr: String,
      },
      default: undefined,
    },

    aiEvaluation: {
      type: {
        score: Number,
        strengths: [String],
        weaknesses: [String],
        suggestions: [String],
      },
      default: undefined,
    },

    badgeIssued: { type: Boolean, default: false },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, challengeId: 1 });

module.exports = mongoose.model("Submission", submissionSchema);