const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    call: { type: String, required: true },
    args: { type: [mongoose.Schema.Types.Mixed], default: [] },
    expected: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },
    expectedOutput: {
      type: String,
      required: function () {
        return !this.operations || this.operations.length === 0;
      },
    },
    setup: {
      constructorArgs: {
        type: [mongoose.Schema.Types.Mixed],
        default: undefined,
      },
    },
    operations: {
      type: [operationSchema],
      default: undefined,
    },
    weight: {
      type: Number,
      default: 1,
      min: 0,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    category: {
      type: String,
      enum: [
        "dsa",
        "bug-fix",
        "api-design",
        "schema-modeling",
        "system-design",
        "debugging",
      ],
      required: true,
    },
    executionType: {
      type: String,
      enum: ["both", "testcases", "review_only"],
      default: "both",
      required: true,
    },
    executionAdapter: {
      kind: {
        type: String,
        enum: ["function", "class-stateful", "class-stateless", "stdin-stdout"],
        default: "function",
        required: function () {
          return this.executionType === "testcases" || this.executionType === "both";
        },
      },
      entryPoint: { type: String, default: "Solution" },
      constructorArgs: [String],
      comparisonMode: {
        type: String,
        enum: ["exact", "numeric-tolerance", "unordered-array", "deep-equal-object"],
        default: "exact",
      },
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => tags.map((t) => t.toLowerCase().trim()),
    },

    // Used for "testcases" and "both" execution types
    testCases: {
      type: [testCaseSchema],
      default: undefined,
      validate: {
        validator: function (arr) {
          if (this.executionType === "review_only") return true;
          return Array.isArray(arr) && arr.length > 0;
        },
        message:
          "A challenge with automated tests must contain at least one test case",
      },
    },
    starterCode: {
      type: String,
      default: "",
    },

    // Used for "review_only" and "both" execution types
    evaluationCriteria: {
      type: String,
      validate: {
        validator: function (val) {
          if (this.executionType === "testcases") return true;
          return !!val && val.trim().length > 0;
        },
        message: "An AI review enabled challenge must have evaluation criteria",
      },
    },
    referenceSolution: {
      type: String,
      default: "", // hidden in public responses
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

challengeSchema.index({ title: "text" });
challengeSchema.index({ difficulty: 1 });
challengeSchema.index({ category: 1 });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ executionType: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);