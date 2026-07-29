/**
 * ATS Scoring Engine
 * Conductor service that runs the parsers, keyword matching, and formatting analysis,
 * calculates the weighted deterministic score, and gets LLM feedback.
 * 
 * Weights are calibrated so that the natural upper limit is exactly 94.
 */

const { parseResume } = require('../utils/resumeParser');
const { parseJD } = require('../utils/jdParser');
const { matchKeywords, isKeywordMatched } = require('./keywordMatchingEngine');
const { analyzeFormatting } = require('./formattingAnalyzer');
const { generateFeedback } = require('./llmService');

// Helper to check if text contains numbers representing metrics/accomplishments
function containsQuantifiedMetrics(text) {
  if (!text) return false;
  // Match percentage, currency symbols, or numbers followed by +, or numbers > 5
  return /%|\$|\b\d+\s*\+?|\b\d+x\b/i.test(text);
}

// Helper to count word occurrences for keyword stuffing check
function countWordOccurrences(text, word) {
  if (!text || !word) return 0;
  const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Calculates candidate's total years of experience from resume entries.
 */
function calculateCandidateExperienceYears(experienceList) {
  if (!experienceList || experienceList.length === 0) return 0;

  let totalYears = 0;
  const currentYear = new Date().getFullYear();

  for (const exp of experienceList) {
    const duration = (exp.duration || '').toLowerCase().trim();
    if (!duration) continue;

    // 1. Direct match: e.g. "3 years", "5 yrs"
    const directMatch = duration.match(/(\d+(?:\.\d+)?)\s*(?:year|yr)s?/);
    if (directMatch) {
      totalYears += parseFloat(directMatch[1]);
      continue;
    }

    // 2. Year ranges: e.g. "2018 - 2021", "2019 to 2022"
    const rangeMatch = duration.match(/\b((?:19|20)\d{2})\b\s*(?:-|to|until)\s*\b((?:19|20)\d{2})\b/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (end >= start) {
        totalYears += (end - start);
      }
      continue;
    }

    // 3. Range with Present: e.g. "2021 - Present", "2022 - Current"
    const presentMatch = duration.match(/\b((?:19|20)\d{2})\b\s*(?:-|to|until)?\s*(?:present|current|now|active)/);
    if (presentMatch) {
      const start = parseInt(presentMatch[1], 10);
      totalYears += Math.max(0, currentYear - start);
      continue;
    }
  }

  return Math.round(totalYears * 10) / 10;
}

/**
 * Evaluates the candidate's degree level relative to DEGREES level numbers
 */
function getCandidateDegreeLevel(educationList) {
  if (!educationList || educationList.length === 0) return 0;

  const { DEGREES } = require('../utils/resumeParser');
  let maxLevel = 0;

  for (const edu of educationList) {
    const deg = (edu.degree || '').toLowerCase();
    for (const d of DEGREES) {
      if (d.names.some(name => deg.includes(name))) {
        if (d.level > maxLevel) {
          maxLevel = d.level;
        }
      }
    }
  }

  return maxLevel;
}

/**
 * Main score calculator
 */
async function scoreResumeVsJD(resumeInput, jdInputText) {
  // 1. Parse Inputs
  const resume = parseResume(resumeInput);
  const jd = parseJD(jdInputText);

  // 2. Run Keyword Matching
  const keywordAnalysis = matchKeywords(resume, jd);

  // 3. Run Formatting Analysis
  const formattingAnalysis = analyzeFormatting(resume, jd.jobFamily);

  const categoryBreakdown = {};

  // --- Required Skills Match (Max 37 pts) ---
  let reqScore = 37;
  const reqDeductions = [];

  if (jd.requiredSkills.length > 0) {
    const matchedReq = keywordAnalysis.matchedKeywords.filter(k => k.type === 'required').length;
    const partialReq = keywordAnalysis.partialMatches.filter(k => k.type === 'required').length;
    const matchRatio = (matchedReq + (partialReq * 0.5)) / jd.requiredSkills.length;
    reqScore = matchRatio * 37;

    const missingReqCount = jd.requiredSkills.length - matchedReq;
    if (missingReqCount > 0) {
      reqDeductions.push(`Missing ${missingReqCount} required technology keyword(s) explicitly requested in the job description.`);
    }
  } else {
    // If JD has no skills, compare against detected job family's fallback
    reqScore = resume.skills.length > 0 ? 37 : 20;
    if (resume.skills.length === 0) {
      reqDeductions.push(`No technical skills detected in the resume skills section.`);
    }
  }

  // Check Keyword Stuffing
  let stuffingDeduction = 0;
  if (resume.skills.length > 25) {
    stuffingDeduction += 5;
    reqDeductions.push(`Keyword stuffing warning: Too many skills listed in skills section (${resume.skills.length}). Keep skills list focused and high quality.`);
  }

  // Check excessive repetition of keywords in experience/projects
  const fullText = `${resume.personalInfo?.summary || ''} ${resume.experience.map(e => e.description).join(' ')} ${resume.projects.map(p => p.description).join(' ')}`.toLowerCase();
  let highlyRepeatedWord = '';
  for (const skill of resume.skills) {
    if (skill.length > 3) {
      const count = countWordOccurrences(fullText, skill);
      if (count > 6) {
        highlyRepeatedWord = skill;
        stuffingDeduction += 3;
        break;
      }
    }
  }
  if (highlyRepeatedWord) {
    stuffingDeduction += 3;
    reqDeductions.push(`Keyword stuffing warning: Excessive repetition of the keyword "${highlyRepeatedWord}" across sections. Focus on natural language descriptions.`);
  }

  reqScore = Math.max(0, reqScore - stuffingDeduction);
  reqScore = Math.round(reqScore * 10) / 10;

  categoryBreakdown['Required Skills Match'] = {
    score: reqScore,
    max: 37,
    deducted: Math.round((37 - reqScore) * 10) / 10,
    reasons: reqDeductions
  };

  // --- Preferred Skills Match (Max 13 pts) ---
  let preferredScore = 13;
  const prefDeductions = [];
  if (jd.preferredSkills.length > 0) {
    const matchedPref = keywordAnalysis.matchedKeywords.filter(k => k.type === 'preferred').length;
    const partialPref = keywordAnalysis.partialMatches.filter(k => k.type === 'preferred').length;
    const matchRatio = (matchedPref + (partialPref * 0.5)) / jd.preferredSkills.length;
    preferredScore = matchRatio * 13;
    const missingPrefCount = jd.preferredSkills.length - matchedPref;
    if (missingPrefCount > 0) {
      prefDeductions.push(`Missed ${missingPrefCount} preferred skills listed in job description.`);
    }
  } else {
    // If JD has no preferred skills, check if resume has at least 5 skills
    if (resume.skills.length < 5) {
      preferredScore = 8;
      prefDeductions.push(`Lacks preferred skills variety. Resume has fewer than 5 total skills.`);
    }
  }
  preferredScore = Math.round(preferredScore * 10) / 10;
  categoryBreakdown['Preferred Skills Match'] = {
    score: preferredScore,
    max: 13,
    deducted: Math.round((13 - preferredScore) * 10) / 10,
    reasons: prefDeductions
  };

  // --- Experience Match (Max 13 pts) ---
  const candidateYrs = calculateCandidateExperienceYears(resume.experience);
  const requiredYrs = jd.experienceYears;
  let experienceScore = 13;
  const expDeductions = [];

  if (requiredYrs > 0) {
    if (candidateYrs >= requiredYrs) {
      experienceScore = 13;
    } else {
      // Calculate mismatch score
      const baseRatioScore = (candidateYrs / requiredYrs) * 13;
      // Flat penalty for experience mismatch
      experienceScore = Math.max(0, baseRatioScore - 3);
      expDeductions.push(`Experience mismatch: Candidate has ${candidateYrs} years of experience, but target job requires at least ${requiredYrs} years.`);
    }
  } else {
    if (resume.experience.length === 0) {
      experienceScore = 5;
      expDeductions.push(`No work experience entries found. This is a critical gap for non-fresher postings.`);
    } else if (candidateYrs < 1) {
      experienceScore = 9;
      expDeductions.push(`Candidate has less than 1 year of total work experience.`);
    }
  }

  // Check quantified achievements in experience descriptions
  const expDescriptions = resume.experience.map(e => e.description).join(' ');
  if (resume.experience.length > 0 && !containsQuantifiedMetrics(expDescriptions)) {
    experienceScore = Math.max(0, experienceScore - 2);
    expDeductions.push('Missing quantified achievements in work experience. Highlight achievements with metrics (e.g. percentages, values, time saved).');
  }

  experienceScore = Math.round(experienceScore * 10) / 10;
  categoryBreakdown['Experience Match'] = {
    score: experienceScore,
    max: 13,
    deducted: Math.round((13 - experienceScore) * 10) / 10,
    reasons: expDeductions
  };

  // --- Projects Relevance (Max 10 pts) ---
  let projectsScore = 10;
  const projDeductions = [];

  if (!resume.projects || resume.projects.length === 0) {
    projectsScore = 0;
    projDeductions.push('No projects section or entries found. Relevant projects demonstrate hands-on application of skills.');
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
        projectsScore = 3;
        projDeductions.push('Unrelated projects: None of the projects mention key technologies required in the job description.');
      } else {
        const ratioScore = (relevantProjects / resume.projects.length) * 10;
        projectsScore = ratioScore;
        const irrelevantCount = resume.projects.length - relevantProjects;
        if (irrelevantCount > 0) {
          projDeductions.push(`${irrelevantCount} out of ${resume.projects.length} project(s) lack matching technologies or keywords from the job requirements.`);
        }
      }
    } else {
      // General projects scoring
      if (resume.projects.length === 1) {
        projectsScore = 6;
        projDeductions.push('Only 1 project listed. Provide 2-3 detailed projects for a stronger portfolio representation.');
      }
    }

    // Check quantified achievements in projects
    const projDescriptions = resume.projects.map(p => p.description).join(' ');
    if (!containsQuantifiedMetrics(projDescriptions)) {
      projectsScore = Math.max(0, projectsScore - 2);
      projDeductions.push('Missing quantified achievements in project descriptions. Use metrics/numbers to indicate impact.');
    }
  }

  projectsScore = Math.round(projectsScore * 10) / 10;
  categoryBreakdown['Projects Relevance'] = {
    score: projectsScore,
    max: 10,
    deducted: Math.round((10 - projectsScore) * 10) / 10,
    reasons: projDeductions
  };

  // --- Education Match (Max 10 pts) ---
  const candidateEduLevel = getCandidateDegreeLevel(resume.education);
  const requiredEduLevel = jd.educationLevel;
  let educationScore = 10;
  const eduDeductions = [];

  if (requiredEduLevel > 0) {
    if (candidateEduLevel >= requiredEduLevel) {
      educationScore = 10;
    } else if (candidateEduLevel > 0) {
      educationScore = 6;
      eduDeductions.push(`Education mismatch: Candidate's highest degree level is below the required level (${jd.educationText}).`);
    } else {
      educationScore = 2;
      eduDeductions.push(`Missing required education degree: Role requires a ${jd.educationText}.`);
    }
  } else {
    if (candidateEduLevel === 0) {
      if (resume.education.length > 0) {
        educationScore = 7;
        eduDeductions.push('Could not verify standard degree level (e.g. Bachelor, Master, PhD) from education text.');
      } else {
        educationScore = 3;
        eduDeductions.push('No education history entries detected in the resume.');
      }
    }
  }

  educationScore = Math.round(educationScore * 10) / 10;
  categoryBreakdown['Education Match'] = {
    score: educationScore,
    max: 10,
    deducted: Math.round((10 - educationScore) * 10) / 10,
    reasons: eduDeductions
  };

  // --- Certifications (Max 5 pts) ---
  let certScore = 5;
  const certDeductions = [];

  if (jd.certifications.length > 0) {
    let matchedCerts = 0;
    const certsText = (resume.certifications || []).join(' ').toLowerCase();
    jd.certifications.forEach(cert => {
      if (certsText.includes(cert.toLowerCase())) matchedCerts++;
    });

    if (matchedCerts > 0) {
      certScore = 5;
    } else {
      certScore = 1;
      certDeductions.push(`Missing required certification: None of the target certifications (${jd.certifications.join(', ')}) were found.`);
    }
  } else {
    if (!resume.certifications || resume.certifications.length === 0) {
      certScore = 3;
      certDeductions.push('No professional certifications listed. Relevant certifications increase resume authority.');
    }
  }

  certScore = Math.round(certScore * 10) / 10;
  categoryBreakdown['Certifications'] = {
    score: certScore,
    max: 5,
    deducted: Math.round((5 - certScore) * 10) / 10,
    reasons: certDeductions
  };

  // --- Resume Completeness (Max 4 pts) ---
  let completenessScore = 4;
  const completeDeductions = [];

  const checkSection = (field, weightVal, name) => {
    if (!field || (Array.isArray(field) && field.length === 0)) {
      completenessScore -= weightVal;
      completeDeductions.push(`Missing key resume section: "${name}".`);
    }
  };

  checkSection(resume.personalInfo?.email, 0.6, 'Email Address');
  checkSection(resume.personalInfo?.phone, 0.6, 'Phone Number');
  checkSection(resume.skills, 0.6, 'Skills Section');
  checkSection(resume.experience, 0.8, 'Experience Entries');
  checkSection(resume.education, 0.8, 'Education History');
  checkSection(resume.personalInfo?.summary || resume.summary, 0.6, 'Professional Summary');

  completenessScore = Math.round(completenessScore * 10) / 10;
  categoryBreakdown['Resume Completeness'] = {
    score: completenessScore,
    max: 4,
    deducted: Math.round((4 - completenessScore) * 10) / 10,
    reasons: completeDeductions
  };

  // --- Formatting / Readability (Max 2 pts) ---
  let formatScore = 2;
  const formatDeductions = [];

  if (formattingAnalysis.score === 100) {
    formatScore = 2;
  } else if (formattingAnalysis.score >= 90) {
    formatScore = 1.6;
  } else if (formattingAnalysis.score >= 70) {
    formatScore = 1.2;
  } else if (formattingAnalysis.score >= 50) {
    formatScore = 0.8;
  } else {
    formatScore = 0.4;
  }

  formattingAnalysis.issues.forEach(issue => {
    formatDeductions.push(`Layout Audit: ${issue}`);
  });

  categoryBreakdown['Formatting / Readability'] = {
    score: formatScore,
    max: 2,
    deducted: Math.round((2 - formatScore) * 10) / 10,
    reasons: formatDeductions
  };

  // 5. Final Score Calculation
  const calculatedSum = reqScore + preferredScore + experienceScore + projectsScore + educationScore + certScore + completenessScore + formatScore;
  const finalScore = Math.max(0, Math.min(Math.round(calculatedSum), 94)); // Upper limit is strictly 94

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

module.exports = { scoreResumeVsJD };
