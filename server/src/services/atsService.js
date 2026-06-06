/**
 * ATS Scoring Service
 * Analyzes resume data (structured) OR raw text (from uploaded file).
 */

// ─── 1. Structured Data Scorer (used by createResume / updateResume) ───────────
const calculateATSScore = (resumeData) => {
  let score = 0;
  const weights = {
    personalInfo: 15,
    summary: 10,
    skills: 20,
    experience: 25,
    education: 15,
    projects: 15,
  };

  if (resumeData.personalInfo && resumeData.personalInfo.email && resumeData.personalInfo.name) {
    score += weights.personalInfo;
  }
  if (resumeData.summary && resumeData.summary.length > 50) {
    score += weights.summary;
  }
  if (resumeData.skills && resumeData.skills.length >= 5) {
    score += weights.skills;
  } else if (resumeData.skills && resumeData.skills.length > 0) {
    score += weights.skills / 2;
  }
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += weights.experience;
  }
  if (resumeData.education && resumeData.education.length > 0) {
    score += weights.education;
  }
  if (resumeData.projects && resumeData.projects.length > 0) {
    score += weights.projects;
  }
  if (resumeData.skills && resumeData.skills.length > 10) {
    score += 5;
  }

  return Math.min(score, 100);
};

// ─── 2. Text-Based Scorer (used by ATS file upload route) ────────────────────

const ACTION_VERBS = [
  'achieved', 'built', 'created', 'designed', 'developed', 'engineered',
  'established', 'implemented', 'improved', 'increased', 'launched', 'led',
  'managed', 'optimized', 'reduced', 'spearheaded', 'streamlined', 'delivered',
  'coordinated', 'analyzed', 'collaborated', 'automated', 'deployed', 'maintained',
];

const COMMON_KEYWORDS = [
  'javascript', 'python', 'java', 'react', 'node', 'sql', 'git', 'api',
  'agile', 'scrum', 'docker', 'kubernetes', 'aws', 'azure', 'ci/cd',
  'typescript', 'html', 'css', 'mongodb', 'postgresql', 'rest', 'graphql',
  'team leadership', 'project management', 'communication', 'problem solving',
  'data analysis', 'machine learning', 'testing', 'debugging', 'unit testing',
  'system design', 'scalability', 'microservices', 'linux',
];

const analyzeResumeText = (text) => {
  const lower = text.toLowerCase();
  const breakdown = {};
  let score = 0;

  // 1. Keyword Match (Max 60 pts)
  // Check how many of COMMON_KEYWORDS fall inside. Max out at 12 keywords for 60 points (12 * 5).
  const foundKeywords = COMMON_KEYWORDS.filter(kw => lower.includes(kw));
  const keywordScore = Math.min(foundKeywords.length * 5, 60);
  breakdown['Keyword Match'] = { score: keywordScore, max: 60, status: keywordScore >= 45 ? 'good' : keywordScore > 20 ? 'warn' : 'bad' };
  score += keywordScore;

  // 2. Skills Relevance (Max 15 pts)
  const hasSkillsSection = /skills|technologies|tech stack|competencies/i.test(text);
  const skillsScore = hasSkillsSection ? 15 : 0;
  breakdown['Skills Relevance'] = { score: skillsScore, max: 15, status: hasSkillsSection ? 'good' : 'bad' };
  score += skillsScore;

  // 3. Experience Relevance (Max 10 pts)
  const hasExperience = /experience|employment|work history|positions?|internship/i.test(text);
  const foundVerbs = ACTION_VERBS.filter(v => lower.includes(v));
  const expBaseScore = hasExperience ? 5 : 0;
  const expVerbScore = Math.min(foundVerbs.length, 5); 
  const experienceScore = expBaseScore + expVerbScore;
  breakdown['Experience Relevance'] = { score: experienceScore, max: 10, status: experienceScore >= 8 ? 'good' : experienceScore >= 5 ? 'warn' : 'bad' };
  score += experienceScore;

  // 4. Education Match (Max 5 pts)
  const hasEducation = /education|degree|university|college|bachelor|master|b\.?tech|m\.?tech|b\.?sc|diploma/i.test(text);
  const eduScore = hasEducation ? 5 : 0;
  breakdown['Education Match'] = { score: eduScore, max: 5, status: hasEducation ? 'good' : 'bad' };
  score += eduScore;

  // 5. Formatting & Parsing (Max 5 pts)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const formattingScore = wordCount > 200 ? 5 : 0;
  breakdown['Formatting & Parsing'] = { score: formattingScore, max: 5, status: formattingScore === 5 ? 'good' : 'bad' };
  score += formattingScore;

  // 6. Section Completeness (Max 5 pts)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(text);
  const hasSummary = /summary|objective|profile|about me/i.test(text);
  let completenessScore = 0;
  if(hasEmail) completenessScore += 2;
  if(hasPhone) completenessScore += 2;
  if(hasSummary) completenessScore += 1;
  breakdown['Section Completeness'] = { score: completenessScore, max: 5, status: completenessScore === 5 ? 'good' : completenessScore >= 2 ? 'warn' : 'bad' };
  score += completenessScore;

  // Missing Keywords
  const missingKeywords = COMMON_KEYWORDS.filter(kw => !lower.includes(kw)).slice(0, 8);

  // Recommendations
  const recommendations = [];
  if (keywordScore < 45) recommendations.push('Incorporate more industry-standard keywords related to your target job.');
  if (!hasSkillsSection) recommendations.push('Include a dedicated Skills or Technologies section.');
  if (experienceScore < 8) recommendations.push('Add stronger action verbs to your Work Experience descriptions.');
  if (!hasEducation) recommendations.push('Include your educational background and qualifications.');
  if (formattingScore < 5) recommendations.push('Your resume is too short. Try to add more detailed bullet points.');
  if (completenessScore < 5) recommendations.push('Make sure you have contact info (email/phone) and a professional summary.');

  const finalScore = Math.min(Math.round(score), 100);

  return {
    score: finalScore,
    label: finalScore >= 80 ? 'Excellent' : finalScore >= 60 ? 'Good' : finalScore >= 40 ? 'Average' : 'Needs Work',
    breakdown,
    missingKeywords,
    recommendations,
    wordCount,
  };
};

module.exports = { calculateATSScore, analyzeResumeText };
