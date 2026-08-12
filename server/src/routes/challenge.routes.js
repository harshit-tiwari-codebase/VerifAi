const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challenge.controller");

const { verifyAccessToken, requireRole } = require("../middlewares/authMiddleware");
const optionalAuth = require("../middlewares/optionalAuth");
const validateRequest = require("../middlewares/validateRequest");
const {
  createChallengeValidator,
  updateChallengeValidator,
  listChallengesValidator,
  challengeIdValidator,
} = require("../validators/challenge.validator");

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many requests, try again later" },
});

router.post(
  "/",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  createChallengeValidator,
  validateRequest,
  createChallenge
);

router.get("/", listChallengesValidator, validateRequest, getChallenges);

router.get("/:id", challengeIdValidator, validateRequest, optionalAuth, getChallengeById);

router.put(
  "/:id",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  challengeIdValidator,
  updateChallengeValidator,
  validateRequest,
  updateChallenge
);

router.delete(
  "/:id",
  verifyAccessToken,
  requireRole("mentor", "admin"),
  writeLimiter,
  challengeIdValidator,
  validateRequest,
  deleteChallenge
);

module.exports = router;