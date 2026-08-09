const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },
    expectedOutput: {
      type: String,
      required: true,
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
      enum: ["dsa", "bug-fix", "api-design", "schema-modeling", "system-design", "debugging"],
      required: true,
    },
    executionType: {
      type: String,
      enum: ["testcases", "review_only"],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => tags.map((t) => t.toLowerCase().trim()),
    },

    // sirf executionType: "testcases" waalo ke liye
    testCases: {
      type: [testCaseSchema],
      default: undefined,
      validate: {
        validator: function (arr) {
          if (this.executionType !== "testcases") return true; // dusre type pe check hi mat karo
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "A testcases challenge must contain at least one test case",
      },
    },
    starterCode: {
      type: String,
      default: "",
    },

    // sirf executionType: "review_only" waalo ke liye (bug-fix me bhi kaam aa sakta hai)
    evaluationCriteria: {
      type: String,
      validate: {
        validator: function (val) {
          if (this.executionType !== "review_only") return true;
          return !!val && val.trim().length > 0;
        },
        message: "A review_only challenge must have evaluation criteria",
      },
    },
    referenceSolution: {
      type: String,
      default: "", // hidden rahega response me, student ko kabhi nahi dikhega
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

module.exports = mongoose.model("Challenge", challengeSchema); 