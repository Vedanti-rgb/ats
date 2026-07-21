const express = require('express');
const router = express.Router();
const {
  upload,
  analyzeResume,
  analyzeStructuredResume,
  optimizeStructuredResume,
  suggestTemplate,
  generateCustomTemplate
} = require('../controllers/atsController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ats/analyze — accepts multipart/form-data with field "resume" and optional "jobDescription"
router.post('/analyze', upload.single('resume'), analyzeResume);

// POST /api/ats/analyze-builder — accepts JSON with { resumeData, jobDescription }
router.post('/analyze-builder', protect, analyzeStructuredResume);

// POST /api/ats/optimize-builder — accepts JSON with { resumeData, jobDescription }
router.post('/optimize-builder', protect, optimizeStructuredResume);

// POST /api/ats/suggest-template — accepts JSON with { role, industry, experience }
router.post('/suggest-template', protect, suggestTemplate);

// POST /api/ats/generate-custom-template — accepts JSON with { prompt }
router.post('/generate-custom-template', protect, generateCustomTemplate);

module.exports = router;
