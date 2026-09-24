const { body, param } = require("express-validator");

const createSubmissionValidator = [
  body("challengeId").isMongoId().withMessage("Invalid challengeId"),
  body("code").notEmpty().withMessage("Code is required"),
  body("language").isString().notEmpty().withMessage("Language is required"),
];

const submissionIdValidator = [param("id").isMongoId().withMessage("Invalid submission id")];

module.exports = { createSubmissionValidator, submissionIdValidator };