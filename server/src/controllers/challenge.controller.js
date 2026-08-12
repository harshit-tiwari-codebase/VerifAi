const Challenge = require("../models/Challenge");

const sanitizeChallenge = (challengeDoc, reqUser) => {
  const challenge = challengeDoc.toObject();

  const isOwner =
    reqUser && String(challenge.createdBy) === String(reqUser.id);

  const isPrivileged =
    reqUser && ["mentor", "admin"].includes(reqUser.role);

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

    const filter = {};

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

const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    return res.status(200).json({
      challenge: sanitizeChallenge(challenge, req.user),
    });
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    const isOwner =
      String(challenge.createdBy) === String(req.user.id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Only the challenge creator or admin can edit this challenge",
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

    return res.status(200).json({
      message: "Challenge updated",
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    const isOwner =
      String(challenge.createdBy) === String(req.user.id);

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "Only the challenge creator or admin can delete this challenge",
      });
    }

    await challenge.deleteOne();

    return res.status(200).json({
      message: "Challenge deleted",
    });
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