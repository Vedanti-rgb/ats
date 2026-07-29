const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const { scoreResumeVsJD } = require('../services/atsScoringEngine');
const { scoreBuilderResumeVsJD } = require('../services/builderAtsScoringEngine');
const crypto = require('crypto');
const {
  optimizeResumeBackend,
  suggestTemplateBackend,
  generateCustomTemplateBackend
} = require('../services/llmService');

const optimizeCache = new Map();
const analyzeCache = new Map();

function getFingerprint(resumeData, jobDescription) {
  const content = {
    personalInfo: resumeData?.personalInfo || {},
    experience: (resumeData?.experience || []).map(e => ({ company: e.company, position: e.position, duration: e.duration, description: e.description })),
    internships: (resumeData?.internships || []).map(e => ({ company: e.company, position: e.position, duration: e.duration, description: e.description })),
    projects: (resumeData?.projects || []).map(p => ({ title: p.title, description: p.description, link: p.link })),
    skills: resumeData?.skills || [],
    education: (resumeData?.education || []).map(ed => ({ school: ed.school, degree: ed.degree, year: ed.year, location: ed.location })),
    isFresher: resumeData?.isFresher,
    jobDescription: jobDescription || ''
  };
  const serialized = JSON.stringify(content);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

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

/**
 * Maps the new deterministic scoring engine results to the legacy UI schema
 * to ensure that the public landing page checker remains 100% backward-compatible.
 */
const mapScoringToLegacyResult = (analysis, wordCount) => {
  const breakdown = {};

  // 1. Keyword Match (Max 60 pts)
  const reqScore = analysis.categoryScores['Required Skills Match']?.score || 0;
  const prefScore = analysis.categoryScores['Preferred Skills Match']?.score || 0;
  const kwScore = Math.round((reqScore + prefScore) / 55 * 60);
  breakdown['Keyword Match'] = {
    score: Math.min(60, kwScore),
    max: 60,
    status: kwScore >= 45 ? 'good' : kwScore >= 20 ? 'warn' : 'bad'
  };

  // 2. Skills Relevance (Max 15 pts)
  const skillsScore = reqScore > 0 ? 15 : 0;
  breakdown['Skills Relevance'] = {
    score: skillsScore,
    max: 15,
    status: skillsScore === 15 ? 'good' : 'bad'
  };

  // 3. Experience Relevance (Max 10 pts)
  const expScore = Math.round((analysis.categoryScores['Experience Match']?.score || 0) / 15 * 10);
  breakdown['Experience Relevance'] = {
    score: Math.min(10, expScore),
    max: 10,
    status: expScore >= 8 ? 'good' : expScore >= 4 ? 'warn' : 'bad'
  };

  // 4. Education Match (Max 5 pts)
  const eduScore = Math.round((analysis.categoryScores['Education Match']?.score || 0) / 10 * 5);
  breakdown['Education Match'] = {
    score: Math.min(5, eduScore),
    max: 5,
    status: eduScore >= 4 ? 'good' : eduScore >= 2 ? 'warn' : 'bad'
  };

  // 5. Formatting & Parsing (Max 5 pts)
  const formatScore = Math.round((analysis.categoryScores['Formatting / Readability']?.score || 0) / 2 * 5);
  breakdown['Formatting & Parsing'] = {
    score: Math.min(5, formatScore),
    max: 5,
    status: formatScore >= 4 ? 'good' : 'bad'
  };

  // 6. Section Completeness (Max 5 pts)
  const completenessScore = Math.round((analysis.categoryScores['Resume Completeness']?.score || 0) / 3 * 5);
  breakdown['Section Completeness'] = {
    score: Math.min(5, completenessScore),
    max: 5,
    status: completenessScore >= 4 ? 'good' : completenessScore >= 2 ? 'warn' : 'bad'
  };

  return {
    score: analysis.atsScore,
    label: analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : analysis.atsScore >= 40 ? 'Average' : 'Needs Work',
    breakdown,
    missingKeywords: analysis.missingKeywords.slice(0, 8),
    recommendations: analysis.suggestions,
    wordCount
  };
};

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

    // Call the new deterministic scoring engine
    const jobDescription = req.body.jobDescription || '';
    const analysis = await scoreResumeVsJD(text, jobDescription);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    const legacyResponse = mapScoringToLegacyResult(analysis, wordCount);

    // Save to database asynchronously (don't block the request if it fails)
    try {
      await require('../models/AtsScan').create({
        userId: req.user ? req.user._id : null,
        filename: req.file.originalname,
        score: legacyResponse.score,
        label: legacyResponse.label,
        missingKeywords: legacyResponse.missingKeywords,
        recommendations: legacyResponse.recommendations,
      });
    } catch (dbErr) {
      console.error('Failed to save ATS scan to DB:', dbErr);
    }

    return res.json(legacyResponse);

  } catch (err) {
    if (err.message === 'INVALID_TYPE') {
      return res.status(400).json({ message: 'Invalid file type. Please upload a PDF or DOCX file.' });
    }
    console.error('ATS analysis error:', err);
    return res.status(500).json({ message: 'Failed to analyze resume. Please try again.' });
  }
};

const analyzeStructuredResume = async (req, res, next) => {
  try {
    const { resumeData, jobDescription, forceRegenerate } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'Missing resumeData' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Paste a Job Description to calculate ATS compatibility.' });
    }

    const fingerprint = getFingerprint(resumeData, jobDescription);
    if (!forceRegenerate && analyzeCache.has(fingerprint)) {
      console.log('Serving cached ATS score for fingerprint:', fingerprint);
      return res.json(analyzeCache.get(fingerprint));
    }

    const analysis = await scoreResumeVsJD(resumeData, jobDescription);
    const result = {
      atsScore: analysis.atsScore,
      matchLabel: analysis.matchLabel,
      categoryScores: analysis.categoryScores,
      matchedKeywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      partialMatches: analysis.partialMatches,
      keywordMatchPercentage: analysis.keywordMatchPercentage,
      formattingIssues: analysis.formattingIssues,
      resumeStrengths: analysis.resumeStrengths,
      resumeWeaknesses: analysis.resumeWeaknesses,
      suggestions: analysis.suggestions,
      jobFamily: analysis.jobFamily
    };

    analyzeCache.set(fingerprint, result);

    return res.json(result);
  } catch (error) {
    console.error('Structured resume analysis failed:', error);
    next(error);
  }
};

const optimizeStructuredResume = async (req, res, next) => {
  try {
    const { resumeData, jobDescription, forceRegenerate } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'Missing resumeData' });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Paste a Job Description to calculate ATS compatibility.' });
    }

    const fingerprint = getFingerprint(resumeData, jobDescription);
    if (!forceRegenerate && optimizeCache.has(fingerprint)) {
      console.log('Serving cached optimized resume for fingerprint:', fingerprint);
      return res.json(optimizeCache.get(fingerprint));
    }

    const optimized = await optimizeResumeBackend(resumeData, jobDescription);
    const scoringResult = await scoreResumeVsJD(optimized, jobDescription);

    optimized.atsScore = scoringResult.atsScore;
    optimized.matchLabel = scoringResult.matchLabel;
    optimized.categoryScores = scoringResult.categoryScores;
    optimized.missingKeywords = scoringResult.missingKeywords;
    optimized.matchedKeywords = scoringResult.matchedKeywords;
    optimized.suggestedSkills = scoringResult.suggestions;
    optimized.aiImprovements = scoringResult.suggestions?.join(' ') || '';

    optimizeCache.set(fingerprint, optimized);

    return res.json(optimized);
  } catch (error) {
    console.error('Structured resume optimization failed:', error);
    next(error);
  }
};

const suggestTemplate = async (req, res, next) => {
  try {
    const { role, industry, experience } = req.body;
    const result = await suggestTemplateBackend(role, industry, experience);
    return res.json(result);
  } catch (error) {
    console.error('Suggest template failed:', error);
    next(error);
  }
};

const generateCustomTemplate = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const result = await generateCustomTemplateBackend(prompt);
    return res.json(result);
  } catch (error) {
    console.error('Generate custom template failed:', error);
    next(error);
  }
};

module.exports = {
  upload,
  analyzeResume,
  analyzeStructuredResume,
  optimizeStructuredResume,
  suggestTemplate,
  generateCustomTemplate
};
