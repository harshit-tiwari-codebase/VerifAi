const mongoose = require("mongoose");

const testCaseResultSchema = new mongoose.Schema(
  {
    testCaseId: { type: mongoose.Schema.Types.ObjectId },
    passed: { type: Boolean, required: true },
    isHidden: { type: Boolean, default: false },
    statusDescription: { type: String },
    time: { type: String },
    memory: { type: Number },
    actualOutput: { type: String },
    expectedOutput: { type: String },
    stdout: { type: String },
    stderr: { type: String },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true, index: true },
    code: { type: String, required: true, maxlength: 20000 },
    language: { type: String, required: true, enum: ["javascript", "python", "java", "cpp"] },

    status: {
      type: String,
      enum: [
        "queued",
        "executing",
        "compilation_error",
        "runtime_error",
        "timeout",
        "provider_unavailable",
        "evaluating",
        "ai_evaluation_failed",
        "completed",
        "failed",
      ],
      default: "queued",
      index: true,
    },

    scoreVersion: { type: String, default: "v1" },

    executionResult: {
      testResults: [testCaseResultSchema],
      compileOutput: String,
      passedCount: Number,
      totalCount: Number,
      requiredPassedCount: Number,
      requiredTotalCount: Number,
    },

    aiEvaluation: {
      codeQuality: Number,
      efficiency: Number,
      edgeCases: Number,
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      evaluatorVersion: String,
      validated: Boolean,
    },

    finalScore: Number,
    badgeEligible: Boolean,
    badgeIssued: { type: Boolean, default: false },

    errorCode: String,
    errorMessage: String,

    telemetry: {
      keystrokeCount: Number,
      timeSpentSeconds: Number,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, challenge: 1, createdAt: -1 });

// Backward compatibility virtuals
submissionSchema.virtual("userId").get(function () {
  return this.user;
});
submissionSchema.virtual("challengeId").get(function () {
  return this.challenge;
});

module.exports = mongoose.model("Submission", submissionSchema);