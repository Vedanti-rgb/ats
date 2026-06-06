const express = require('express');
const router = express.Router();
const { getJobs, createJob, applyToJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All job routes require user login
router.use(protect);

router.route('/')
  .get(getJobs)
  .post(adminOnly, createJob);

router.route('/:id')
  .delete(adminOnly, deleteJob);

router.route('/:id/apply')
  .post(applyToJob);

module.exports = router;
