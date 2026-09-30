const { body, param } = require("express-validator");

const createSubmissionValidator = [
  body("challengeId")
    .notEmpty()
    .withMessage("challengeId is required")
    .isMongoId()
    .withMessage("challengeId must be a valid MongoDB ObjectId"),
  body("code")
    .isString()
    .withMessage("Code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Code cannot be empty")
    .isLength({ max: 20000 })
    .withMessage("Code must not exceed 20000 characters"),
  body("language")
    .optional()
    .isIn(["javascript", "python", "java", "cpp"])
    .withMessage("Language must be one of: javascript, python, java, cpp"),
];

const submissionIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Submission id must be a valid MongoDB ObjectId"),
];

module.exports = { createSubmissionValidator, submissionIdValidator };