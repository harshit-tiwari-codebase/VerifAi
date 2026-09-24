const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const executionQueue = require("../queues/execution.queue");

const createSubmission = async (req, res, next) => {
  try {
    const { challengeId, code, language } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const submission = await Submission.create({
      userId: req.user.id,
      challengeId,
      code,
      language,
    });

    await executionQueue.add({ submissionId: submission._id.toString() });

    return res.status(201).json({
      message: "Submission received",
      submissionId: submission._id,
      status: submission.status,
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const isOwner = String(submission.userId) === String(req.user.id);
    const isPrivileged = ["mentor", "admin"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "Not authorized to view this submission" });
    }

    return res.status(200).json({ submission });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubmission, getSubmissionById };