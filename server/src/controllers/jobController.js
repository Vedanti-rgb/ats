const Job = require('../models/Job');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all jobs (populated with applicants)
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({})
    .populate('applicants', 'name email phone location')
    .sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, salary, description, requirements } = req.body;

  if (!title || !company || !location || !description) {
    res.status(400);
    throw new Error('Please add all required fields: title, company, location, description');
  }

  const requirementsArray = Array.isArray(requirements) 
    ? requirements 
    : requirements ? requirements.split(',').map(r => r.trim()) : [];

  const job = await Job.create({
    title,
    company,
    location,
    salary: salary || 'Competitive',
    description,
    requirements: requirementsArray,
    applicants: [],
    postedBy: req.user.id,
  });

  res.status(201).json(job);
});

// @desc    Apply to/Choose a job posting
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if candidate already applied/chose this job
  const alreadyApplied = job.applicants.includes(req.user.id);
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied/chosen this job');
  }

  job.applicants.push(req.user.id);
  await job.save();

  res.status(200).json({ message: 'Successfully applied to job', jobId: job._id });
});

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();
  res.json({ message: 'Job posting deleted successfully', id: req.params.id });
});

module.exports = {
  getJobs,
  createJob,
  applyToJob,
  deleteJob,
};
