const { body, query, param } = require("express-validator");

const createChallengeValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, or hard"),

  body("category")
    .isIn([
      "dsa",
      "bug-fix",
      "api-design",
      "schema-modeling",
      "system-design",
      "debugging",
    ])
    .withMessage("Invalid category"),

  body("executionType")
    .isIn(["testcases", "review_only"])
    .withMessage(
      "Execution type must be either 'testcases' or 'review_only'"
    ),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),

  body("tags.*").optional().isString(),

  // Conditional validation for test cases
  body("testCases").custom((value, { req }) => {
    if (req.body.executionType === "testcases") {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(
          "At least one test case is required for a 'testcases' challenge"
        );
      }
    }

    return true;
  }),

  body("testCases.*.expectedOutput")
    .if((value, { req }) => req.body.executionType === "testcases")
    .notEmpty()
    .withMessage("Expected output is required for every test case"),

  // Conditional validation for review-only challenges
  body("evaluationCriteria").custom((value, { req }) => {
    if (req.body.executionType === "review_only") {
      if (!value || !value.trim()) {
        throw new Error(
          "Evaluation criteria is required for a 'review_only' challenge"
        );
      }
    }

    return true;
  }),
];




const updateChallengeValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description").optional().trim().notEmpty(),

  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"]),

  body("category")
    .optional()
    .isIn([
      "dsa",
      "bug-fix",
      "api-design",
      "schema-modeling",
      "system-design",
      "debugging",
    ]),

  body("executionType")
    .optional()
    .isIn(["testcases", "review_only"]),

  body("tags")
    .optional()
    .isArray(),

  body("testCases")
    .optional()
    .isArray({ min: 1 }),
];



const listChallengesValidator = [
  query("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"]),

  query("category")
    .optional()
    .isIn([
      "dsa",
      "bug-fix",
      "api-design",
      "schema-modeling",
      "system-design",
      "debugging",
    ]),

  query("tag")
    .optional()
    .isString(),

  query("search")
    .optional()
    .isString(),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .toInt(),
];

const challengeIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid challenge ID"),
];

module.exports = {
  createChallengeValidator,
  updateChallengeValidator,
  listChallengesValidator,
  challengeIdValidator,
};

