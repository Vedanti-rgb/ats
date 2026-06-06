const Resume = require('../models/Resume');
const { calculateATSScore } = require('../services/atsService');

// @desc    Get all user resumes
// @route   GET /api/resume
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    if (resume.userId.toString() !== req.user.id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.json(resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resume
// @route   POST /api/resume
// @access  Private
const createResume = async (req, res, next) => {
  try {
    if (!req.body.title) {
      res.status(400);
      throw new Error('Please add a title');
    }

    // Ensure nested structures are arrays to avoid crashes
    const sanitizedBody = {
      ...req.body,
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      education: Array.isArray(req.body.education) ? req.body.education : [],
      experience: Array.isArray(req.body.experience) ? req.body.experience : [],
      projects: Array.isArray(req.body.projects) ? req.body.projects : [],
    };

    // Calculate ATS Score before saving
    const atsScore = calculateATSScore(sanitizedBody);

    const resume = await Resume.create({
      ...sanitizedBody,
      userId: req.user.id,
      atsScore,
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    if (resume.userId.toString() !== req.user.id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Ensure nested structures are arrays
    const sanitizedBody = {
      ...req.body,
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      education: Array.isArray(req.body.education) ? req.body.education : [],
      experience: Array.isArray(req.body.experience) ? req.body.experience : [],
      projects: Array.isArray(req.body.projects) ? req.body.projects : [],
    };

    // Recalculate ATS Score on update
    const atsScore = calculateATSScore(sanitizedBody);

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      { ...sanitizedBody, atsScore },
      { new: true, runValidators: true }
    );

    res.json(updatedResume);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    if (resume.userId.toString() !== req.user.id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await resume.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};

