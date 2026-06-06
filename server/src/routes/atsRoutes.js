const express = require('express');
const router = express.Router();
const { upload, analyzeResume } = require('../controllers/atsController');

// POST /api/ats/analyze — accepts multipart/form-data with field "resume"
router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;
