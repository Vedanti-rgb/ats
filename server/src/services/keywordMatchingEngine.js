/**
 * Keyword Matching Engine Service
 * Handles text normalization, stop words, singular/plurals, abbreviations, synonyms,
 * and deterministic word-boundary keyword matching.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
  'just', 'should', 'now', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'having', 'do', 'does', 'did', 'doing', 'as', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
]);

const ABBREVIATIONS = {
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'js': 'javascript',
  'ts': 'typescript',
  'aws': 'amazon web services',
  'gcp': 'google cloud platform',
  'dl': 'deep learning',
  'nlp': 'natural language processing',
  'sql': 'structured query language',
  'k8s': 'kubernetes',
  'ci/cd': 'continuous integration continuous deployment',
  'cicd': 'continuous integration continuous deployment',
  'rest': 'representational state transfer',
  'api': 'application programming interface',
  'qa': 'quality assurance',
  'db': 'database',
  'bi': 'business intelligence',
  'ui': 'user interface',
  'ux': 'user experience'
};

const SYNONYMS = {
  'reactjs': 'react',
  'react.js': 'react',
  'nodejs': 'node.js',
  'node': 'node.js',
  'postgres': 'postgresql',
  'mongodb': 'mongo',
  'spring': 'spring boot',
  'rails': 'ruby on rails',
  'nextjs': 'next.js',
  'vuejs': 'vue',
  'expressjs': 'express',
  'dockerization': 'docker',
  'containerization': 'docker',
  'powerbi': 'power bi'
};

/**
 * Normalizes a word or short phrase by removing standard punctuation,
 * applying synonyms, abbreviations, and singularization.
 */
function normalizeToken(token) {
  if (!token) return '';
  let clean = token.toLowerCase().trim();

  // Strip starting/ending punctuation, but keep internal chars like . , + # - /
  clean = clean.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, '');

  if (STOP_WORDS.has(clean)) return '';

  // Check abbreviation
  if (ABBREVIATIONS[clean]) {
    clean = ABBREVIATIONS[clean];
  }

  // Check synonym
  if (SYNONYMS[clean]) {
    clean = SYNONYMS[clean];
  }

  // Basic singularization
  if (clean.endsWith('ies') && clean.length > 3) {
    clean = clean.slice(0, -3) + 'y'; // e.g. queries -> query
  } else if (clean.endsWith('es') && !clean.endsWith('ss') && clean.length > 3) {
    clean = clean.slice(0, -2); // e.g. databases -> database
  } else if (clean.endsWith('s') && !clean.endsWith('ss') && !clean.endsWith('u') && clean.length > 2) {
    clean = clean.slice(0, -1); // e.g. apis -> api, skills -> skill
  }

  return clean;
}

/**
 * Normalizes a full text block into a searchable string, expanding synonyms and abbreviations.
 */
function normalizeText(text) {
  if (!text) return '';
  // Split by whitespace and punctuation, keeping special chars attached to tokens
  const words = text.toLowerCase().split(/[\s,()\[\]{}";!?]+/);
  const normalizedWords = words.map(w => normalizeToken(w)).filter(Boolean);
  return normalizedWords.join(' ');
}

/**
 * Checks if a normalized keyword matches inside a normalized text with word boundary constraints.
 * Special characters like +, #, . are protected.
 */
function isKeywordMatched(text, keyword) {
  const normText = normalizeText(text);
  const normKeyword = normalizeText(keyword);

  if (!normText || !normKeyword) return false;

  // Exact substring check first
  const idx = normText.indexOf(normKeyword);
  if (idx === -1) return false;

  // Verify boundaries in normalized text
  const prevChar = idx > 0 ? normText[idx - 1] : ' ';
  const nextChar = idx + normKeyword.length < normText.length ? normText[idx + normKeyword.length] : ' ';

  // Boundaries in normalized text should be spaces (since words are joined by space)
  const isLeftValid = prevChar === ' ';
  const isRightValid = nextChar === ' ';

  return isLeftValid && isRightValid;
}

/**
 * Finds where in the resume a keyword was matched.
 */
function matchKeywordLocation(resume, keyword) {
  const locations = [];

  // Check Skills
  const skillsText = resume.skills.join(' ');
  if (isKeywordMatched(skillsText, keyword)) {
    locations.push('Skills');
  }

  // Check Experience
  const experienceText = resume.experience.map(e => `${e.company} ${e.position} ${e.description}`).join(' ');
  if (isKeywordMatched(experienceText, keyword)) {
    locations.push('Experience');
  }

  // Check Projects
  const projectsText = resume.projects.map(p => `${p.title} ${p.description}`).join(' ');
  if (isKeywordMatched(projectsText, keyword)) {
    locations.push('Projects');
  }

  // Check Education
  const educationText = resume.education.map(e => `${e.school} ${e.degree}`).join(' ');
  if (isKeywordMatched(educationText, keyword)) {
    locations.push('Education');
  }

  // Check Summary
  if (isKeywordMatched(resume.personalInfo?.summary || '', keyword)) {
    locations.push('Summary');
  }

  return locations;
}

/**
 * Main matching engine function.
 * Matches resume against JD required/preferred skills and role context.
 */
function matchKeywords(resume, jdInfo) {
  const matchedKeywords = [];
  const missingKeywords = [];
  const partialMatches = [];

  // Combine required and preferred skills
  const allJdKeywords = Array.from(new Set([...jdInfo.requiredSkills, ...jdInfo.preferredSkills]));

  for (const keyword of allJdKeywords) {
    const locations = matchKeywordLocation(resume, keyword);

    if (locations.length > 0) {
      matchedKeywords.push({
        keyword,
        foundIn: locations,
        type: jdInfo.preferredSkills.includes(keyword) ? 'preferred' : 'required'
      });
    } else {
      // Check for partial match (e.g. "Data Visualization" -> check if "Data" or "Visualization" matched)
      const keywordTokens = keyword.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
      let partialFound = false;
      let matchedTokens = [];

      if (keywordTokens.length > 1) {
        for (const token of keywordTokens) {
          const tokenLocs = matchKeywordLocation(resume, token);
          if (tokenLocs.length > 0) {
            partialFound = true;
            matchedTokens.push(token);
          }
        }
      }

      if (partialFound) {
        partialMatches.push({
          keyword,
          matchedParts: matchedTokens,
          type: jdInfo.preferredSkills.includes(keyword) ? 'preferred' : 'required'
        });
      } else {
        missingKeywords.push({
          keyword,
          type: jdInfo.preferredSkills.includes(keyword) ? 'preferred' : 'required'
        });
      }
    }
  }

  // Match percentage calculation
  const totalKeywords = allJdKeywords.length;
  const matchedCount = matchedKeywords.length + (partialMatches.length * 0.5); // partial match counts as 50%
  const matchedPercentage = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 100;

  return {
    matchedKeywords,
    missingKeywords,
    partialMatches,
    matchedPercentage
  };
}

module.exports = {
  normalizeToken,
  normalizeText,
  isKeywordMatched,
  matchKeywords
};
