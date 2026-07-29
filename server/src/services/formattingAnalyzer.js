/**
 * Formatting Analyzer Service
 * Evaluates the resume formatting and readability, listing issues and deducting points.
 */

/**
 * Calculates a formatting score (0-100) and compiles a list of issues/deductions.
 */
function analyzeFormatting(resume, jobFamily) {
  let score = 100;
  const issues = [];

  const personalInfo = resume.personalInfo || {};
  const isTechnicalRole = ['Software Engineer', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile Developer', 'Data Scientist'].includes(jobFamily);

  // 1. Contact Information
  if (!personalInfo.email) {
    score -= 20;
    issues.push('Missing email address under contact information.');
  }
  if (!personalInfo.phone) {
    score -= 20;
    issues.push('Missing phone number under contact information.');
  }
  if (!personalInfo.linkedin) {
    score -= 10;
    issues.push('Missing LinkedIn profile link.');
  }
  if (isTechnicalRole && !personalInfo.github) {
    score -= 10;
    issues.push('Missing GitHub profile link (highly recommended for technical roles).');
  }

  // 2. Headings and Completeness
  const missingSections = [];
  if (!personalInfo.summary && !resume.summary) missingSections.push('Summary/Objective');
  if (!resume.skills || resume.skills.length === 0) missingSections.push('Skills');
  if (!resume.experience || resume.experience.length === 0) missingSections.push('Work Experience');
  if (!resume.education || resume.education.length === 0) missingSections.push('Education');

  if (missingSections.length > 0) {
    const deduction = missingSections.length * 10;
    score -= deduction;
    issues.push(`Missing key section headings: ${missingSections.join(', ')}.`);
  }

  // 3. Bullet Consistency
  // Bullet characters: •, -, *, ◦, ‣, ▪
  const bulletRegex = /^[\s\t]*[•\-*◦‣▪]/;
  let totalDescLines = 0;
  let bulletLines = 0;

  const checkBullets = (text) => {
    if (!text) return;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    totalDescLines += lines.length;
    lines.forEach(l => {
      if (bulletRegex.test(l)) {
        bulletLines++;
      }
    });
  };

  if (resume.experience) {
    resume.experience.forEach(exp => checkBullets(exp.description));
  }
  if (resume.projects) {
    resume.projects.forEach(proj => checkBullets(proj.description));
  }

  if (totalDescLines > 0) {
    const bulletRatio = bulletLines / totalDescLines;
    // If there is bullet usage, but it is inconsistent (e.g. between 10% and 90%)
    if (bulletRatio > 0.05 && bulletRatio < 0.85) {
      score -= 10;
      issues.push('Inconsistent bullet point usage. Standardize on bullet points for descriptions.');
    } else if (bulletRatio <= 0.05 && totalDescLines > 3) {
      score -= 15;
      issues.push('Work descriptions lack clear bullet points. Use standard bullet symbols for readability.');
    }
  }

  // 4. Emojis, graphics, and special characters
  // Match common emoji ranges and grid/drawing characters
  const emojiRegex = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g;
  const gridCharsRegex = /[│─┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬█░▒▓■□▲▼◆◇●○]/g;

  let hasEmojis = false;
  let hasGrids = false;

  const checkSpecialChars = (text) => {
    if (!text) return;
    if (emojiRegex.test(text)) hasEmojis = true;
    if (gridCharsRegex.test(text)) hasGrids = true;
  };

  // Inspect summary, skills, experience, projects
  checkSpecialChars(personalInfo.summary || '');
  if (resume.skills) resume.skills.forEach(s => checkSpecialChars(s));
  if (resume.experience) resume.experience.forEach(e => checkSpecialChars(e.description));
  if (resume.projects) resume.projects.forEach(p => checkSpecialChars(p.description));

  if (hasEmojis) {
    score -= 5;
    issues.push('Contains emojis. Remove decorative icons as they can cause text parsing issues in standard ATS systems.');
  }
  if (hasGrids) {
    score -= 10;
    issues.push('Contains text-based grids, dividers, or table borders. Use simple vertical flow templates.');
  }

  // 5. Readability & Sentence Length
  let sentenceCount = 0;
  let wordCount = 0;
  let longSentences = 0;

  const checkReadability = (text) => {
    if (!text) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const sentences = cleanText.split(/[.!?\n]+/).filter(Boolean);
    sentenceCount += sentences.length;

    sentences.forEach(s => {
      const words = s.split(/\s+/).filter(Boolean);
      wordCount += words.length;
      if (words.length > 25) {
        longSentences++;
      }
    });
  };

  checkReadability(personalInfo.summary || '');
  if (resume.experience) resume.experience.forEach(e => checkReadability(e.description));
  if (resume.projects) resume.projects.forEach(p => checkReadability(p.description));

  if (sentenceCount > 0) {
    const avgSentenceLength = wordCount / sentenceCount;
    if (avgSentenceLength > 20 || (longSentences / sentenceCount) > 0.25) {
      score -= 5;
      issues.push('Contains very long sentences. Aim for concise, under 20-word accomplishments.');
    }
  }

  // 6. Resume Length (Word Count)
  if (wordCount > 0) {
    if (wordCount < 150) {
      score -= 15;
      issues.push('Resume is too brief (less than 150 words). Provide more detailed achievements.');
    } else if (wordCount > 1000) {
      score -= 10;
      issues.push('Resume is too long (over 1000 words). Try to condense it to a clean 1-2 page structure.');
    }
  }

  return {
    score: Math.max(0, Math.min(score, 100)),
    issues
  };
}

module.exports = { analyzeFormatting };
