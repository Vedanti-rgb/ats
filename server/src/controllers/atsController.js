const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const { analyzeResumeText } = require('../services/atsService');

// ─── Multer config (memory storage, 10 MB limit) ─────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_TYPE'), false);
    }
  },
});

// ─── @desc    Analyze uploaded resume file for ATS score
// ─── @route   POST /api/ats/analyze
// ─── @access  Public (no auth needed for scan page)
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please attach a PDF or DOCX file.' });
    }

    let text = '';

    if (req.file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      // DOCX
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    }

    if (!text || text.trim().length < 30) {
      return res.status(422).json({
        message: 'Could not extract readable text from this file. Make sure it is not an image-based PDF.',
      });
    }

    const analysis = analyzeResumeText(text);
    
    // Save to database asynchronously (don't block the request if it fails)
    try {
      await require('../models/AtsScan').create({
        userId: req.user ? req.user._id : null,
        filename: req.file.originalname,
        score: analysis.score,
        label: analysis.label,
        missingKeywords: analysis.missingKeywords,
        recommendations: analysis.recommendations,
      });
    } catch (dbErr) {
      console.error('Failed to save ATS scan to DB:', dbErr);
    }

    return res.json(analysis);

  } catch (err) {
    if (err.message === 'INVALID_TYPE') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a PDF or DOCX file.' });
    }
    console.error('ATS analysis error:', err);
    return res.status(500).json({ message: 'Failed to analyze resume. Please try again.' });
  }
};

module.exports = { upload, analyzeResume };
