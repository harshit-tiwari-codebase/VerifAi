const { body, param } = require("express-validator");

const createSubmissionValidator = [
  body("challengeId")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Invalid challengeId"),
  body("code").notEmpty().withMessage("Code is required"),
  body("language").optional().isString().withMessage("Language must be a string"),
];

const submissionIdValidator = [
  param("id").notEmpty().withMessage("Invalid submission id"),
];

module.exports = { createSubmissionValidator, submissionIdValidator };