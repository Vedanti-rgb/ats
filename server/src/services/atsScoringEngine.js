/**
 * ATS Scoring Engine
 * Adapter that normalises both structured resume objects and raw text strings
 * into the unified response shape expected by atsController.js.
 *
 * The controller calls: scoreResumeVsJD(resumeDataOrText, jobDescription)
 */

const { analyzeResumeText, calculateATSScore } = require('./atsService');

// ─── Job-family keyword map ───────────────────────────────────────────────────
const JOB_FAMILY_KEYWORDS = {
  'Software Engineering': ['javascript', 'python', 'react', 'node', 'java', 'typescript', 'git', 'api', 'docker', 'aws', 'sql', 'mongodb'],
  'Data Science': ['python', 'machine learning', 'data analysis', 'sql', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'statistics', 'r'],
  'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'linux', 'terraform', 'jenkins', 'git', 'ansible'],
  'Design': ['figma', 'ui', 'ux', 'sketch', 'adobe', 'wireframe', 'prototyping', 'user research', 'design system'],
  'Management': ['project management', 'agile', 'scrum', 'team leadership', 'stakeholder', 'roadmap', 'kpi', 'budget'],
  'General': ['communication', 'problem solving', 'teamwork', 'leadership', 'analytical', 'organization'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectJobFamily(text) {
  const lower = text.toLowerCase();
  let bestFamily = 'General';
  let bestCount = 0;
  for (const [family, keywords] of Object.entries(JOB_FAMILY_KEYWORDS)) {
    const count = keywords.filter(kw => lower.includes(kw)).length;
    if (count > bestCount) {
      bestCount = count;
      bestFamily = family;
    }
  }
  return bestFamily;
}

function extractTextFromStructured(resumeData) {
  const parts = [];

  const pi = resumeData.personalInfo || {};
  if (pi.name) parts.push(pi.name);
  if (pi.email) parts.push(pi.email);
  if (pi.phone) parts.push(pi.phone);
  if (pi.location) parts.push(pi.location);
  if (pi.linkedin) parts.push(pi.linkedin);

  if (resumeData.summary) parts.push(resumeData.summary);

  (resumeData.skills || []).forEach(s => parts.push(s));

  (resumeData.experience || []).forEach(e => {
    if (e.company) parts.push(e.company);
    if (e.position) parts.push(e.position);
    if (e.duration) parts.push(e.duration);
    if (e.description) parts.push(e.description);
  });

  (resumeData.internships || []).forEach(i => {
    if (i.company) parts.push(i.company);
    if (i.position) parts.push(i.position);
    if (i.duration) parts.push(i.duration);
    if (i.description) parts.push(i.description);
  });

  (resumeData.education || []).forEach(e => {
    if (e.school) parts.push(e.school);
    if (e.degree) parts.push(e.degree);
    if (e.year) parts.push(String(e.year));
    if (e.location) parts.push(e.location);
  });

  (resumeData.projects || []).forEach(p => {
    if (p.title) parts.push(p.title);
    if (p.description) parts.push(p.description);
    if (p.link) parts.push(p.link);
  });

  return parts.join(' ');
}

function scoreAgainstJD(resumeText, jdText) {
  if (!jdText || jdText.trim().length < 10) return { matchedJD: [], missingJD: [] };
  const lower = resumeText.toLowerCase();
  // Extract meaningful words from JD (3+ chars, not common stop words)
  const STOP = new Set(['the','and','for','are','you','with','that','this','from','have','will','your','our','their','can','been','all','more','its','but','not','any','has','was','were','they','also','each','such','into','over','than','then','when','who','him','her','his','she','they','out','one','what','which','how','use','via','per','get']);
  const jdWords = [...new Set(
    jdText.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOP.has(w))
  )];
  const matchedJD = jdWords.filter(w => lower.includes(w));
  const missingJD = jdWords.filter(w => !lower.includes(w)).slice(0, 10);
  return { matchedJD, missingJD };
}

// ─── Main exported function ──────────────────────────────────────────────────

/**
 * scoreResumeVsJD
 * @param {object|string} resumeDataOrText - Structured resume object or raw text string
 * @param {string} jobDescription          - Optional JD text
 * @returns {object} Unified scoring result
 */
async function scoreResumeVsJD(resumeDataOrText, jobDescription = '') {
  const isStructured = typeof resumeDataOrText === 'object' && resumeDataOrText !== null;

  // ── 1. Convert to plain text ──────────────────────────────────────────────
  const resumeText = isStructured
    ? extractTextFromStructured(resumeDataOrText)
    : String(resumeDataOrText);

  // ── 2. Run the base scoring engine ────────────────────────────────────────
  const baseResult = analyzeResumeText(resumeText);

  // ── 3. If structured data is provided, also use the structured scorer ─────
  let structuredBonus = 0;
  if (isStructured) {
    structuredBonus = calculateATSScore(resumeDataOrText);
  }

  // Blend the two scores (70% text analysis, 30% structured scoring if available)
  const blendedScore = isStructured
    ? Math.round(baseResult.score * 0.7 + structuredBonus * 0.3)
    : baseResult.score;

  const finalScore = Math.min(100, Math.max(0, blendedScore));

  // ── 4. JD keyword matching (bonus layer) ─────────────────────────────────
  const { matchedJD, missingJD } = scoreAgainstJD(resumeText, jobDescription);

  // ── 5. Job-family detection ───────────────────────────────────────────────
  const combinedText = resumeText + ' ' + jobDescription;
  const jobFamily = detectJobFamily(combinedText);

  // ── 6. Build matched / missing keywords from base result ─────────────────
  const allKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'git', 'api',
    'agile', 'scrum', 'docker', 'kubernetes', 'aws', 'azure', 'ci/cd',
    'typescript', 'html', 'css', 'mongodb', 'postgresql', 'rest', 'graphql',
    'team leadership', 'project management', 'communication', 'problem solving',
    'data analysis', 'machine learning', 'testing', 'debugging',
    'system design', 'microservices', 'linux',
  ];
  const lower = resumeText.toLowerCase();
  const matchedKeywords = [...new Set([
    ...allKeywords.filter(kw => lower.includes(kw)),
    ...matchedJD,
  ])].slice(0, 15);
  const missingKeywords = [...new Set([
    ...baseResult.missingKeywords,
    ...missingJD,
  ])].slice(0, 10);

  // ── 7. Build category scores in the shape the controller expects ──────────
  const categoryScores = {};
  for (const [category, data] of Object.entries(baseResult.breakdown)) {
    categoryScores[category] = {
      score: data.score,
      max: data.max,
      status: data.status,
    };
  }
  // Add JD-specific categories if a JD was supplied
  if (jobDescription.trim().length > 10) {
    const jdMatchPct = matchedJD.length > 0
      ? Math.round((matchedJD.length / (matchedJD.length + missingJD.length)) * 100)
      : 0;
    categoryScores['Required Skills Match'] = { score: Math.round(jdMatchPct * 0.3), max: 30, status: jdMatchPct >= 70 ? 'good' : jdMatchPct >= 40 ? 'warn' : 'bad' };
    categoryScores['Preferred Skills Match'] = { score: Math.round(jdMatchPct * 0.25), max: 25, status: jdMatchPct >= 70 ? 'good' : 'warn' };
    categoryScores['Experience Match'] = { score: baseResult.breakdown['Experience Relevance']?.score || 0, max: 15, status: 'warn' };
    categoryScores['Education Match'] = { score: baseResult.breakdown['Education Match']?.score || 0, max: 10, status: 'warn' };
    categoryScores['Formatting / Readability'] = { score: baseResult.breakdown['Formatting & Parsing']?.score || 0, max: 5, status: 'good' };
    categoryScores['Resume Completeness'] = { score: baseResult.breakdown['Section Completeness']?.score || 0, max: 5, status: 'good' };
  }

  // ── 8. Build suggestions / strengths / weaknesses ─────────────────────────
  const suggestions = baseResult.recommendations || [];
  if (missingJD.length > 0) {
    suggestions.unshift(`Add JD-specific keywords to improve match: ${missingJD.slice(0, 4).join(', ')}.`);
  }

  const resumeStrengths = matchedKeywords.length > 0
    ? [`Strong alignment in: ${matchedKeywords.slice(0, 4).join(', ')}.`]
    : ['Clean resume structure detected.'];

  const resumeWeaknesses = missingKeywords.length > 0
    ? [`Missing important keywords: ${missingKeywords.slice(0, 4).join(', ')}.`]
    : [];

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const partialMatches = matchedJD.slice(0, 5);
  const keywordMatchPercentage = allKeywords.length > 0
    ? Math.round((matchedKeywords.length / allKeywords.length) * 100)
    : 0;

  const formattingIssues = [];
  if (wordCount < 200) formattingIssues.push('Resume appears too short — add more detail.');
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) {
    formattingIssues.push('No email address detected.');
  }

  return {
    atsScore: finalScore,
    score: finalScore,
    label: finalScore >= 80 ? 'Excellent' : finalScore >= 60 ? 'Good' : finalScore >= 40 ? 'Average' : 'Needs Work',
    breakdown: baseResult.breakdown,
    categoryScores,
    matchedKeywords,
    missingKeywords,
    partialMatches,
    keywordMatchPercentage,
    formattingIssues,
    resumeStrengths,
    resumeWeaknesses,
    suggestions,
    jobFamily,
    wordCount,
    recommendations: suggestions,
  };
}

module.exports = { scoreResumeVsJD };
