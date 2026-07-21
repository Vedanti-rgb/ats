const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Company = require('../models/Company');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');
const fs = require('fs');

// ─── ELIGIBILITY CHECK HELPER ──────────────────────────────────────────────
const checkEligibility = (user, job) => {
  const reasons = [];

  if (job.min10thPercentage && (user.percent10th || 0) < job.min10thPercentage) {
    reasons.push(`10th Percentage (${user.percent10th || 0}%) is below minimum required (${job.min10thPercentage}%)`);
  }
  if (job.min12thPercentage && (user.percent12th || 0) < job.min12thPercentage) {
    reasons.push(`12th Percentage (${user.percent12th || 0}%) is below minimum required (${job.min12thPercentage}%)`);
  }
  if (job.minGraduationPercentage && (user.percentGraduation || 0) < job.minGraduationPercentage) {
    reasons.push(`Graduation Percentage (${user.percentGraduation || 0}%) is below minimum required (${job.minGraduationPercentage}%)`);
  }
  if (job.minCGPA && (user.cgpa || 0) < job.minCGPA) {
    reasons.push(`CGPA (${user.cgpa || 0}) is below minimum required (${job.minCGPA})`);
  }

  // Backlogs check
  if (job.backlogsAllowed === 'No' && (user.backlogs || 0) > 0) {
    reasons.push(`No active/total backlogs are allowed (Current: ${user.backlogs || 0})`);
  } else if (job.backlogsAllowed === 'Yes' && job.maxBacklogs !== undefined && (user.backlogs || 0) > job.maxBacklogs) {
    reasons.push(`Number of backlogs (${user.backlogs || 0}) exceeds maximum allowed (${job.maxBacklogs})`);
  }

  // Branches check
  if (job.eligibleBranches && job.eligibleBranches.length > 0) {
    const userBranchTrimmed = (user.branch || '').trim().toLowerCase();
    const isBranchEligible = job.eligibleBranches.some(b => b.trim().toLowerCase() === userBranchTrimmed);
    if (!isBranchEligible) {
      reasons.push(`Branch '${user.branch || 'N/A'}' is not eligible (Eligible: ${job.eligibleBranches.join(', ')})`);
    }
  }

  // Passing year check
  if (job.passingYear && user.passingYear && user.passingYear !== job.passingYear) {
    reasons.push(`Graduation passing year (${user.passingYear}) does not match required year (${job.passingYear})`);
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
};

// @desc    Get all jobs (populated with applicants, computing eligibility for the user)
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 });

  let user = null;
  if (req.user && !req.user.isAdmin) {
    user = await User.findById(req.user._id);
  }

  const processedJobs = jobs.map(job => {
    const jobObj = job.toObject();
    if (user) {
      const eligibility = checkEligibility(user, job);
      jobObj.eligible = eligibility.eligible;
      jobObj.eligibilityReasons = eligibility.reasons;
    } else {
      jobObj.eligible = true;
      jobObj.eligibilityReasons = [];
    }
    return jobObj;
  });

  res.json(processedJobs);
});

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private/VerifiedCompanyOrAdmin
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    salary,
    description,
    requirements,
    employmentType,
    experienceRequired,
    deadline,
    vacancies,
    min10thPercentage,
    min12thPercentage,
    minGraduationPercentage,
    minCGPA,
    backlogsAllowed,
    maxBacklogs,
    eligibleBranches,
    passingYear
  } = req.body;

  if (!title || !company || !location || !description) {
    res.status(400);
    throw new Error('Please add all required fields: title, company, location, description');
  }

  const requirementsArray = Array.isArray(requirements) 
    ? requirements 
    : requirements ? requirements.split(',').map(r => r.trim()).filter(Boolean) : [];

  const branchesArray = Array.isArray(eligibleBranches)
    ? eligibleBranches
    : eligibleBranches ? eligibleBranches.split(',').map(b => b.trim()).filter(Boolean) : [];

  const job = await Job.create({
    title,
    company,
    location,
    salary: salary || 'Competitive',
    description,
    requirements: requirementsArray,
    employmentType: employmentType || 'Full-time',
    experienceRequired: experienceRequired || '',
    deadline: deadline || null,
    vacancies: Number(vacancies) || 1,
    min10thPercentage: Number(min10thPercentage) || 0,
    min12thPercentage: Number(min12thPercentage) || 0,
    minGraduationPercentage: Number(minGraduationPercentage) || 0,
    minCGPA: Number(minCGPA) || 0,
    backlogsAllowed: backlogsAllowed || 'Yes',
    maxBacklogs: Number(maxBacklogs) || 0,
    eligibleBranches: branchesArray,
    passingYear: passingYear ? Number(passingYear) : null,
    applicants: [],
    postedBy: req.user.id,
  });

  res.status(201).json(job);
});

// @desc    Apply to a job posting (with resume selection or PDF upload)
// @route   POST /api/jobs/:id/apply
// @access  Private
// Body (multipart/form-data):
//   resumeId  (string)  — use existing Builder resume
//   resumeFile (file)   — upload new PDF
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // 1. Prevent duplicate applications
  const existingApp = await Application.findOne({ job: job._id, user: req.user._id });
  const alreadyApplied = job.applicants.includes(req.user._id) || existingApp;
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  // 2. Eligibility Check
  const user = await User.findById(req.user._id);
  const eligibility = checkEligibility(user, job);
  if (!eligibility.eligible) {
    res.status(400);
    throw new Error(`Eligibility check failed: ${eligibility.reasons.join('. ')}`);
  }

  // 3. Determine resume source and details
  let resumePdf = '';
  let resumeFileName = '';
  let resumeSource = 'Builder';
  let resumeJsonSnapshot = null;

  if (req.file) {
    // Option 2: Uploaded PDF
    resumePdf = `/uploads/resumes/${req.file.filename}`;
    resumeFileName = req.file.originalname;
    resumeSource = 'Upload';
    resumeJsonSnapshot = null; // No JSON for uploaded PDFs
  } else if (req.body.resumeId) {
    // Option 1: Builder resume selected by ID
    const resume = await Resume.findById(req.body.resumeId);
    if (!resume || resume.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Resume not found or unauthorized');
    }
    resumePdf = `/api/resume/${resume._id}`;
    resumeFileName = resume.title || 'Resume.pdf';
    resumeSource = 'Builder';
    resumeJsonSnapshot = resume.toObject();
  } else {
    // Fallback: try to pick the most recent Builder resume
    const resume = await Resume.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
    if (!resume) {
      res.status(400);
      throw new Error('Please select a resume or upload a PDF to apply.');
    }
    resumePdf = `/api/resume/${resume._id}`;
    resumeFileName = resume.title || 'Resume.pdf';
    resumeSource = 'Builder';
    resumeJsonSnapshot = resume.toObject();
  }

  // 4. Get the company record for this job poster (for access-control)
  const companyRecord = await Company.findOne({ user: job.postedBy });

  // 5. Save the Application
  const application = await Application.create({
    job: job._id,
    user: req.user._id,
    company: companyRecord?._id || null,
    resumePdf,
    resumeFileName,
    resumeSource,
    resumeJson: resumeJsonSnapshot,
    applicantDetails: {
      name: user.name,
      email: user.email,
      phone: user.phone || resumeJsonSnapshot?.personalInfo?.phone || '',
    },
    status: 'Applied',
    eligibilityStatus: 'Eligible',
  });

  // 6. Keep job model applicants array in sync
  job.applicants.push(req.user._id);
  await job.save();

  res.status(200).json({ 
    message: 'Successfully applied to job', 
    jobId: job._id,
    applicationId: application._id 
  });
});

// @desc    Serve the exact resume PDF for a specific application (company-only access)
// @route   GET /api/jobs/applications/:appId/resume-file
// @access  Private (company that owns the job only)
const getApplicationResumePDF = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.appId).populate('job');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Security: only the company that owns the job or an admin may download
  const job = application.job;
  if (job.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access this resume');
  }

  if (application.resumeSource === 'Upload' && application.resumePdf) {
    // Serve the uploaded PDF file directly
    const filePath = path.join(__dirname, '../../', application.resumePdf);
    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Resume file not found on server');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${application.resumeFileName || 'resume.pdf'}"`);
    return fs.createReadStream(filePath).pipe(res);
  }

  // For Builder resumes, return the JSON snapshot for client-side rendering
  res.json({
    resumeSource: application.resumeSource,
    resumeJson: application.resumeJson,
    resumeFileName: application.resumeFileName,
    applicantDetails: application.applicantDetails,
  });
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

  // Admin or the owner can delete
  if (job.postedBy.toString() !== req.user.id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  // Delete all corresponding applications and their uploaded resume files
  const applications = await Application.find({ job: job._id });
  for (const app of applications) {
    if (app.resumeSource === 'Upload' && app.resumePdf) {
      const filePath = path.join(__dirname, '../../', app.resumePdf);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
  await Application.deleteMany({ job: job._id });

  await job.deleteOne();
  res.json({ message: 'Job posting deleted successfully', id: req.params.id });
});

// @desc    Get jobs posted by the logged-in recruiter/company
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private
const getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

// @desc    Get all applications/applicants for a specific job
// @route   GET /api/jobs/:id/applicants
// @access  Private
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Recruiter must own the job or be admin
  if (job.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  const applications = await Application.find({ job: req.params.id })
    .populate('user', 'name email phone percent10th percent12th percentGraduation cgpa backlogs branch passingYear')
    .sort({ createdAt: -1 });

  res.json(applications);
});

// @desc    Update application recruitment status (Shortlist/Reject/etc.)
// @route   PUT /api/jobs/applications/:id/status
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Interview Scheduled', 'Selected'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid application status');
  }

  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('user', 'name email');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if recruiter is owner of the job or admin
  if (application.job.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update status for this application');
  }

  let emailWarning = null;

  if (status === 'Shortlisted') {
    if (application.status === 'Shortlisted') {
      res.status(400);
      throw new Error('Candidate has already been shortlisted');
    }

    application.shortlistedAt = new Date();
    application.shortlistedBy = req.user._id;

    // Create in-app notification
    const Notification = require('../models/Notification');
    await Notification.create({
      user: application.user._id,
      title: 'Application Shortlisted',
      message: `Congratulations! You have been shortlisted by ${application.job.company} for ${application.job.title}.`
    });

    // Send email notification
    if (!application.emailSent) {
      try {
        const { sendShortlistEmail } = require('../services/emailService');
        await sendShortlistEmail({
          candidateName: application.user.name,
          candidateEmail: application.user.email,
          jobTitle: application.job.title,
          companyName: application.job.company
        });
        application.emailSent = true;
        application.emailSentAt = new Date();
      } catch (err) {
        console.error('Failed to send shortlist email notification:', err);
        emailWarning = 'Candidate shortlisted but automated email notification failed to send.';
      }
    }
  }

  application.status = status;
  await application.save();

  res.json({
    message: emailWarning || `Application status updated to ${status}`,
    warning: emailWarning,
    application
  });
});

// @desc    Get dashboard metrics / stats for recruiter's company
// @route   GET /api/jobs/applications/stats
// @access  Private
const getCompanyStats = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id });
  const jobIds = jobs.map(j => j._id);

  const totalJobs = jobs.length;
  const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
  const pendingApplications = await Application.countDocuments({ job: { $in: jobIds }, status: 'Applied' });
  const shortlistedCandidates = await Application.countDocuments({ job: { $in: jobIds }, status: 'Shortlisted' });
  const rejectedCandidates = await Application.countDocuments({ job: { $in: jobIds }, status: 'Rejected' });

  res.json({
    totalJobs,
    totalApplications,
    pendingApplications,
    shortlistedCandidates,
    rejectedCandidates
  });
});

// @desc    Get applications of logged-in candidate
// @route   GET /api/jobs/candidate/my-applications
// @access  Private
const getCandidateApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate('job', 'title company location description')
    .sort({ createdAt: -1 });
  res.json(applications);
});

module.exports = {
  getJobs,
  createJob,
  applyToJob,
  deleteJob,
  getRecruiterJobs,
  getJobApplicants,
  updateApplicationStatus,
  getCompanyStats,
  getApplicationResumePDF,
  getCandidateApplications,
};
