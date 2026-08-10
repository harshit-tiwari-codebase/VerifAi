const Challenge = require("../models/Challenge");

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
      .map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput, _id: tc._id }));
  }

  delete challenge.referenceSolution;

  return challenge;
};


const createChallenge = async (req, res, next) => {
  try {
    const { title, description, difficulty, category, executionType, tags, testCases, starterCode, evaluationCriteria, referenceSolution } = req.body;

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

    return res.status(201).json({ message: "Challenge created", challenge });
  } catch (error) {
    next(error);
  }
};