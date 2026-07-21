const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
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
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { verifiedCompanyOrAdmin } = require('../middleware/companyMiddleware');

// ─── MULTER FOR RESUME PDF UPLOADS ─────────────────────────────────────────
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/resumes');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${req.user?.id || 'user'}-${uniqueSuffix}.pdf`);
  },
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted for resume uploads.'));
    }
  },
});

// All job routes require user login
router.use(protect);

// Specific paths must be declared before parameter paths to avoid collisions
router.route('/recruiter/my-jobs').get(verifiedCompanyOrAdmin, getRecruiterJobs);
router.route('/applications/stats').get(verifiedCompanyOrAdmin, getCompanyStats);
router.route('/applications/:id/status').put(verifiedCompanyOrAdmin, updateApplicationStatus);
router.route('/applications/:appId/resume-file').get(verifiedCompanyOrAdmin, getApplicationResumePDF);
router.route('/candidate/my-applications').get(getCandidateApplications);

router.route('/')
  .get(getJobs)
  .post(verifiedCompanyOrAdmin, createJob);

router.route('/:id')
  .delete(deleteJob); // Modified: Allow owners to delete as well via controller

// Apply route with optional PDF file upload (single field: resumeFile)
router.route('/:id/apply').post(
  (req, res, next) => {
    resumeUpload.single('resumeFile')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  applyToJob
);

router.route('/:id/applicants')
  .get(verifiedCompanyOrAdmin, getJobApplicants);

module.exports = router;
