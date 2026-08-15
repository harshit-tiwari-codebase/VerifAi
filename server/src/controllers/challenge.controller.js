const Challenge = require("../models/Challenge");

/**
 * Sanitize a challenge document for public consumption.
 *
 * - Owners and privileged roles (`mentor`, `admin`) receive the full document.
 * - Other users receive a reduced view: hidden test cases are stripped and
 *   the `referenceSolution` is removed to avoid leaking answers.
 *
 * @param {import('mongoose').Document|Object} challengeDoc - Mongoose document or plain object.
 * @param {Object} [reqUser] - Request user object (populated by auth middleware).
 * @param {string} reqUser.id - ID of the requesting user.
 * @param {string} reqUser.role - Role of the requesting user.
 * @returns {Object} Sanitized plain object safe to return in API responses.
 */
const sanitizeChallenge = (challengeDoc, reqUser) => {
  const challenge = challengeDoc.toObject();

  const isOwner = reqUser && String(challenge.createdBy) === String(reqUser.id);
  const isPrivileged = reqUser && ["mentor", "admin"].includes(reqUser.role);

  if (isOwner || isPrivileged) {
    return challenge;
  }

  if (challenge.testCases) {
    challenge.testCases = challenge.testCases
      .filter((tc) => !tc.isHidden)
      .map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        _id: tc._id,
      }));
  }

  delete challenge.referenceSolution;

  return challenge;
};

/**
 * Create a new challenge.
 *
 * @route   POST /api/challenges
 * @access  Private (authenticated users)
 *
 * @returns {201} { message, challenge } - Challenge created successfully.
 * @returns {400} { message } - Validation error or missing fields.
 * @returns {500} { message } - Unexpected server/database error.
 */
const createChallenge = async (req, res, next) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      executionType,
      tags,
      testCases,
      starterCode,
      evaluationCriteria,
      referenceSolution,
    } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      difficulty,
      category,
      executionType,
      tags,
      testCases,
      starterCode,
      evaluationCriteria,
      referenceSolution,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Challenge created",
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List published challenges with optional filtering and pagination.
 *
 * Notes:
 * - Drafts/unpublished challenges are not returned by this public endpoint.
 * - Use query parameters to filter by difficulty, category, tag, and text search.
 *
 * @route   GET /api/challenges
 * @access  Public
 *
 * @query {string} [difficulty]
 * @query {string} [category]
 * @query {string} [tag]
 * @query {string} [search]
 * @query {number} [page=1]
 * @query {number} [limit=10]
 *
 * @returns {200} { challenges, pagination } - Paginated list of challenges.
 * @returns {500} { message } - Unexpected server error.
 */
const getChallenges = async (req, res, next) => {
  try {
    const {
      difficulty,
      category,
      tag,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isPublished: true };

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (tag) filter.tags = tag.toLowerCase().trim();
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      Challenge.find(filter)
        .select("-testCases -referenceSolution -evaluationCriteria")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Challenge.countDocuments(filter),
    ]);

    return res.status(200).json({
      challenges,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single challenge by id.
 *
 * Visibility rules:
 * - Published challenges are visible to everyone.
 * - Unpublished (draft) challenges are visible only to the creator or to roles
 *   with elevated privileges (`mentor`, `admin`). All other requests receive
 *   a 404 to avoid information leakage.
 *
 * @route   GET /api/challenges/:id
 * @access  Public (optional auth supported)
 *
 * @returns {200} { challenge } - Sanitized challenge document.
 * @returns {404} { message } - Challenge not found or not visible to requester.
 * @returns {500} { message } - Unexpected server error.
 */
const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const isOwner =
      req.user && String(challenge.createdBy._id) === String(req.user.id);
    const isPrivileged =
      req.user && ["mentor", "admin"].includes(req.user.role);

    if (!challenge.isPublished && !isOwner && !isPrivileged) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    return res
      .status(200)
      .json({ challenge: sanitizeChallenge(challenge, req.user) });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing challenge.
 *
 * Permissions:
 * - Only the challenge creator or an `admin` may modify a challenge.
 *
 * @route   PUT /api/challenges/:id
 * @access  Private
 *
 * @returns {200} { message, challenge } - Challenge updated successfully.
 * @returns {403} { message } - Not authorized to edit the challenge.
 * @returns {404} { message } - Challenge not found.
 * @returns {500} { message } - Unexpected server error.
 */
const updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const isOwner = String(challenge.createdBy) === String(req.user.id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          message:
            "Only the challenge creator or admin can edit this challenge",
        });
    }

    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "category",
      "executionType",
      "tags",
      "testCases",
      "starterCode",
      "evaluationCriteria",
      "referenceSolution",
      "isPublished",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        challenge[field] = req.body[field];
      }
    });

    await challenge.save();

    return res.status(200).json({ message: "Challenge updated", challenge });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a challenge.
 *
 * Permissions:
 * - Only the challenge creator or an `admin` may delete a challenge.
 *
 * @route   DELETE /api/challenges/:id
 * @access  Private
 *
 * @returns {200} { message } - Challenge deleted successfully.
 * @returns {403} { message } - Not authorized to delete the challenge.
 * @returns {404} { message } - Challenge not found.
 * @returns {500} { message } - Unexpected server error.
 */
const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const isOwner = String(challenge.createdBy) === String(req.user.id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          message:
            "Only the challenge creator or admin can delete this challenge",
        });
    }

    await challenge.deleteOne();

    return res.status(200).json({ message: "Challenge deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};
