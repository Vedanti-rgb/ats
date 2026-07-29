/**
 * Resume Builder ATS Scoring Engine
 * Dedicated isolated service that computes ATS scores for the Resume Builder.
 * 
 * Rules:
 * - Requires a non-empty Job Description.
 * - Score is strictly capped at 87% (perfect match receiving 83-87%).
 * - Explainable 6-category breakdown (Keyword Match 35, Required Skills 25, Experience 15, Education 10, Projects 5, Formatting 5).
 * - 100% deterministic score calculation.
 * - Missing skills = [JD Skills] - [Resume Skills].
 */

const { parseResume } = require('../utils/resumeParser');
const { parseBuilderJD } = require('../utils/builderJdParser');
const { matchKeywords, isKeywordMatched } = require('./keywordMatchingEngine');
const { analyzeFormatting } = require('./formattingAnalyzer');
const { generateFeedback } = require('./llmService');

function containsQuantifiedMetrics(text) {
  if (!text) return false;
  return /%|\$|\b\d+\s*\+?|\b\d+x\b/i.test(text);
}

function countWordOccurrences(text, word) {
  if (!text || !word) return 0;
  const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function calculateCandidateExperienceYears(experienceList) {
  if (!experienceList || experienceList.length === 0) return 0;
  let totalYears = 0;
  const currentYear = new Date().getFullYear();

  for (const exp of experienceList) {
    const duration = (exp.duration || '').toLowerCase().trim();
    if (!duration) continue;

    const directMatch = duration.match(/(\d+(?:\.\d+)?)\s*(?:year|yr)s?/);
    if (directMatch) {
      totalYears += parseFloat(directMatch[1]);
      continue;
    }

    const rangeMatch = duration.match(/\b((?:19|20)\d{2})\b\s*(?:-|to|until)\s*\b((?:19|20)\d{2})\b/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (end >= start) totalYears += (end - start);
      continue;
    }

    const presentMatch = duration.match(/\b((?:19|20)\d{2})\b\s*(?:-|to|until)?\s*(?:present|current|now|active)/);
    if (presentMatch) {
      const start = parseInt(presentMatch[1], 10);
      totalYears += Math.max(0, currentYear - start);
      continue;
    }
  }

  return Math.round(totalYears * 10) / 10;
}

function getCandidateDegreeLevel(educationList) {
  if (!educationList || educationList.length === 0) return 0;
  const { DEGREES } = require('../utils/resumeParser');
  let maxLevel = 0;

  for (const edu of educationList) {
    const deg = (edu.degree || '').toLowerCase();
    for (const d of DEGREES) {
      if (d.names.some(name => deg.includes(name))) {
        if (d.level > maxLevel) maxLevel = d.level;
      }
    }
  }

  return maxLevel;
}

async function scoreBuilderResumeVsJD(resumeInput, jdInputText) {
  // 1. Require Job Description
  if (!jdInputText || !jdInputText.trim()) {
    throw new Error('Job Description is required to calculate ATS compatibility.');
  }

  // 2. Parse Inputs
  const resume = parseResume(resumeInput);
  const jd = parseBuilderJD(jdInputText);

  // 3. Run Keyword Matching & Formatting Analysis
  const keywordAnalysis = matchKeywords(resume, jd);
  const formattingAnalysis = analyzeFormatting(resume, jd.jobFamily);

  const categoryBreakdown = {};

  // --- 1. Keyword Match (Max 35 pts) ---
  const matchedKwCount = keywordAnalysis.matchedKeywords.length + (keywordAnalysis.partialMatches.length * 0.5);
  const totalKwCount = keywordAnalysis.matchedKeywords.length + keywordAnalysis.missingKeywords.length + keywordAnalysis.partialMatches.length;
  const kwMatchRatio = totalKwCount > 0 ? (matchedKwCount / totalKwCount) : 0.5;
  let keywordMatchScore = Math.round(kwMatchRatio * 35 * 10) / 10;
  const kwDeductions = [];
  if (keywordAnalysis.missingKeywords.length > 0) {
    kwDeductions.push(`Missing ${keywordAnalysis.missingKeywords.length} target keyword(s) explicitly found in job description.`);
  }

  categoryBreakdown['Keyword Match'] = {
    score: keywordMatchScore,
    max: 35,
    deducted: Math.round((35 - keywordMatchScore) * 10) / 10,
    reasons: kwDeductions
  };

  // --- 2. Required Skills (Max 25 pts) ---
  let reqScore = 25;
  const reqDeductions = [];

  if (jd.requiredSkills.length > 0) {
    const matchedReq = keywordAnalysis.matchedKeywords.filter(k => k.type === 'required').length;
    const partialReq = keywordAnalysis.partialMatches.filter(k => k.type === 'required').length;
    const matchRatio = (matchedReq + (partialReq * 0.5)) / jd.requiredSkills.length;
    reqScore = matchRatio * 25;

    const missingReqCount = jd.requiredSkills.length - matchedReq;
    if (missingReqCount > 0) {
      reqDeductions.push(`Missing ${missingReqCount} required technology keyword(s) explicitly requested in the job description.`);
    }
  } else {
    reqScore = resume.skills.length > 0 ? 25 : 15;
    if (resume.skills.length === 0) {
      reqDeductions.push(`No technical skills detected in the resume skills section.`);
    }
  }

  let stuffingDeduction = 0;
  if (resume.skills.length > 25) {
    stuffingDeduction += 3;
    reqDeductions.push(`Keyword stuffing warning: Too many skills listed in skills section (${resume.skills.length}). Keep skills list focused.`);
  }

  const fullText = `${resume.personalInfo?.summary || ''} ${resume.experience.map(e => e.description).join(' ')} ${resume.projects.map(p => p.description).join(' ')}`.toLowerCase();
  let highlyRepeatedWord = '';
  for (const skill of resume.skills) {
    if (skill.length > 3) {
      const count = countWordOccurrences(fullText, skill);
      if (count > 6) {
        highlyRepeatedWord = skill;
        stuffingDeduction += 2;
        break;
      }
    }
  }
  if (highlyRepeatedWord) {
    reqDeductions.push(`Keyword stuffing warning: Excessive repetition of the keyword "${highlyRepeatedWord}" across sections.`);
  }

  reqScore = Math.max(0, reqScore - stuffingDeduction);
  reqScore = Math.round(reqScore * 10) / 10;

  categoryBreakdown['Required Skills'] = {
    score: reqScore,
    max: 25,
    deducted: Math.round((25 - reqScore) * 10) / 10,
    reasons: reqDeductions
  };

  // --- 3. Experience (Max 15 pts) ---
  const candidateYrs = calculateCandidateExperienceYears(resume.experience);
  const requiredYrs = jd.experienceYears;
  let experienceScore = 15;
  const expDeductions = [];

  if (requiredYrs > 0) {
    if (candidateYrs >= requiredYrs) {
      experienceScore = 15;
    } else {
      const baseRatioScore = (candidateYrs / requiredYrs) * 15;
      experienceScore = Math.max(0, baseRatioScore - 2);
      expDeductions.push(`Experience mismatch: Candidate has ${candidateYrs} years of experience, but target job requires at least ${requiredYrs} years.`);
    }
  } else {
    if (resume.experience.length === 0) {
      experienceScore = 6;
      expDeductions.push(`No work experience entries found.`);
    } else if (candidateYrs < 1) {
      experienceScore = 10;
      expDeductions.push(`Candidate has less than 1 year of total work experience.`);
    }
  }

  const expDescriptions = resume.experience.map(e => e.description).join(' ');
  if (resume.experience.length > 0 && !containsQuantifiedMetrics(expDescriptions)) {
    experienceScore = Math.max(0, experienceScore - 2);
    expDeductions.push('Missing quantified achievements in work experience.');
  }

  experienceScore = Math.round(experienceScore * 10) / 10;
  categoryBreakdown['Experience'] = {
    score: experienceScore,
    max: 15,
    deducted: Math.round((15 - experienceScore) * 10) / 10,
    reasons: expDeductions
  };

  // --- 4. Education (Max 10 pts) ---
  const candidateEduLevel = getCandidateDegreeLevel(resume.education);
  const requiredEduLevel = jd.educationLevel;
  let educationScore = 10;
  const eduDeductions = [];

  if (requiredEduLevel > 0) {
    if (candidateEduLevel >= requiredEduLevel) {
      educationScore = 10;
    } else if (candidateEduLevel > 0) {
      educationScore = 6;
      eduDeductions.push(`Education mismatch: Candidate's highest degree level is below required level (${jd.educationText}).`);
    } else {
      educationScore = 2;
      eduDeductions.push(`Missing required education degree: Role requires ${jd.educationText}.`);
    }
  } else {
    if (candidateEduLevel === 0) {
      if (resume.education.length > 0) {
        educationScore = 7;
        eduDeductions.push('Could not verify standard degree level from education text.');
      } else {
        educationScore = 3;
        eduDeductions.push('No education history entries detected in resume.');
      }
    }
  }

  educationScore = Math.round(educationScore * 10) / 10;
  categoryBreakdown['Education'] = {
    score: educationScore,
    max: 10,
    deducted: Math.round((10 - educationScore) * 10) / 10,
    reasons: eduDeductions
  };

  // --- 5. Projects (Max 5 pts) ---
  let projectsScore = 5;
  const projDeductions = [];

  if (!resume.projects || resume.projects.length === 0) {
    projectsScore = 0;
    projDeductions.push('No projects section or entries found.');
  } else {
    let relevantProjects = 0;
    const jdKeywords = [...jd.requiredSkills, ...jd.preferredSkills];

    if (jdKeywords.length > 0) {
      resume.projects.forEach(proj => {
        const projText = `${proj.title} ${proj.description}`.toLowerCase();
        const hasKeyword = jdKeywords.some(kw => isKeywordMatched(projText, kw));
        if (hasKeyword) relevantProjects++;
      });

      if (relevantProjects === 0) {
        projectsScore = 2;
        projDeductions.push('Unrelated projects: None of the projects mention key technologies required in job description.');
      } else {
        const ratioScore = (relevantProjects / resume.projects.length) * 5;
        projectsScore = ratioScore;
        const irrelevantCount = resume.projects.length - relevantProjects;
        if (irrelevantCount > 0) {
          projDeductions.push(`${irrelevantCount} out of ${resume.projects.length} project(s) lack matching technologies.`);
        }
      }
    }
  }

  projectsScore = Math.round(projectsScore * 10) / 10;
  categoryBreakdown['Projects'] = {
    score: projectsScore,
    max: 5,
    deducted: Math.round((5 - projectsScore) * 10) / 10,
    reasons: projDeductions
  };

  // --- 6. Formatting (Max 5 pts) ---
  let formatScore = 5;
  const formatDeductions = [];

  if (formattingAnalysis.score === 100) {
    formatScore = 5;
  } else if (formattingAnalysis.score >= 90) {
    formatScore = 4;
  } else if (formattingAnalysis.score >= 70) {
    formatScore = 3;
  } else if (formattingAnalysis.score >= 50) {
    formatScore = 2;
  } else {
    formatScore = 1;
  }

  formattingAnalysis.issues.forEach(issue => {
    formatDeductions.push(`Layout Audit: ${issue}`);
  });

  categoryBreakdown['Formatting'] = {
    score: formatScore,
    max: 5,
    deducted: Math.round((5 - formatScore) * 10) / 10,
    reasons: formatDeductions
  };

  // 5. Final Score Calculation (Max 87%)
  const calculatedSum = keywordMatchScore + reqScore + experienceScore + educationScore + projectsScore + formatScore; // Max sum = 95
  const scaledScore = Math.round((calculatedSum / 95) * 87);
  const finalScore = Math.max(0, Math.min(scaledScore, 87)); // Hard cap at 87%

  const getMatchLabel = (score) => {
    if (score >= 83) return 'Excellent Match';
    if (score >= 71) return 'Strong Match';
    if (score >= 56) return 'Good Match';
    if (score >= 36) return 'Average Match';
    return 'Weak Match';
  };

  // 6. Gather Info for Groq Feedback
  const expSummary = resume.experience.map(e => `${e.position} at ${e.company} (${e.duration})`).join('; ');
  const eduSummary = resume.education.map(e => `${e.degree} from ${e.school}`).join('; ');

  const matchedKeywordsList = keywordAnalysis.matchedKeywords.map(k => k.keyword);
  const missingKeywordsList = keywordAnalysis.missingKeywords.map(k => k.keyword);

  const feedbackReport = await generateFeedback({
    jobFamily: jd.jobFamily,
    matchedKeywords: matchedKeywordsList,
    missingKeywords: missingKeywordsList,
    formattingIssues: formattingAnalysis.issues,
    experienceInfo: expSummary,
    educationInfo: eduSummary
  });

  return {
    atsScore: finalScore,
    matchLabel: getMatchLabel(finalScore),
    categoryScores: categoryBreakdown,
    matchedKeywords: matchedKeywordsList,
    missingKeywords: missingKeywordsList,
    partialMatches: keywordAnalysis.partialMatches.map(k => k.keyword),
    keywordMatchPercentage: keywordAnalysis.matchedPercentage,
    formattingIssues: formattingAnalysis.issues,
    resumeStrengths: feedbackReport.strengths,
    resumeWeaknesses: feedbackReport.weaknesses,
    suggestions: feedbackReport.suggestions,
    jobFamily: jd.jobFamily
  };
}

module.exports = { scoreBuilderResumeVsJD };
