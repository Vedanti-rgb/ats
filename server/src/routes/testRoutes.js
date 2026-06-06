const express = require('express');
const router = express.Router();
const {
  generateTest,
  submitTest,
  getTests,
} = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

// All test routes require authentication
router.use(protect);

// Generate a test for a resume
router.post('/generate/:resumeId', generateTest);

// Submit answers for a test
router.post('/submit/:testId', submitTest);

// Get test history for a resume
router.get('/history/:resumeId', getTests);

module.exports = router;
