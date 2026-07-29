/**
 * Resume Parser Utility
 * Sanitizes structured builder data or extracts sections from raw text using deterministic regex/heuristics.
 */

// Common email, phone, and link patterns
const EMAIL_REGEX = /[\w.-]+@[\w.-]+\.\w{2,}/i;
const PHONE_REGEX = /(\+?\d[\d\s\-().]{7,}\d)/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[\w\-]+/i;
const GITHUB_REGEX = /github\.com\/[\w\-]+/i;

// Predefined degrees to recognize from text
const DEGREES = [
  { level: 4, names: ['phd', 'p.h.d', 'doctor of philosophy', 'doctorate'] },
  { level: 3, names: ['master', 'm.s', 'm.s.', 'm.t.c', 'm.tech', 'mtech', 'mba', 'm.b.a', 'm.sc', 'msc'] },
  { level: 2, names: ['bachelor', 'b.s', 'b.s.', 'b.tech', 'btech', 'b.sc', 'bsc', 'b.a', 'ba'] },
  { level: 1, names: ['diploma', 'associate degree', 'associate'] }
];

/**
 * Standardizes structured builder resume data.
 */
function normalizeStructured(data) {
  const result = {
    personalInfo: {
      fullName: data.personalInfo?.name || data.personalInfo?.fullName || '',
      email: data.personalInfo?.email || '',
      phone: data.personalInfo?.phone || '',
      linkedin: data.personalInfo?.linkedin || '',
      github: data.personalInfo?.github || '',
      location: data.personalInfo?.location || '',
      summary: data.summary || data.personalInfo?.summary || ''
    },
    skills: Array.isArray(data.skills) ? data.skills.filter(Boolean) : [],
    experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      duration: exp.duration || '',
      description: exp.description || ''
    })) : [],
    projects: Array.isArray(data.projects) ? data.projects.map(proj => ({
      title: proj.title || '',
      description: proj.description || '',
      link: proj.link || ''
    })) : [],
    education: Array.isArray(data.education) ? data.education.map(edu => ({
      school: edu.school || '',
      degree: edu.degree || '',
      year: edu.year || '',
      location: edu.location || ''
    })) : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.filter(Boolean)
      : (typeof data.certifications === 'string' ? [data.certifications] : [])
  };

  // Auto-fill github / linkedin from personalInfo text if not separately filled
  if (!result.personalInfo.github && result.personalInfo.summary) {
    const ghMatch = result.personalInfo.summary.match(GITHUB_REGEX);
    if (ghMatch) result.personalInfo.github = 'https://' + ghMatch[0];
  }
  if (!result.personalInfo.linkedin && result.personalInfo.summary) {
    const liMatch = result.personalInfo.summary.match(LINKEDIN_REGEX);
    if (liMatch) result.personalInfo.linkedin = 'https://' + liMatch[0];
  }

  return result;
}

/**
 * Parses raw text into the structured format.
 */
function parseRawText(text) {
  if (!text) text = '';

  const lines = text.split('\n');
  const normalizedText = text.toLowerCase();

  // 1. Extract contact info
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const liMatch = text.match(LINKEDIN_REGEX);
  const ghMatch = text.match(GITHUB_REGEX);

  const email = emailMatch ? emailMatch[0].trim() : '';
  const phone = phoneMatch ? phoneMatch[0].trim() : '';
  const linkedin = liMatch ? 'https://' + liMatch[0].trim() : '';
  const github = ghMatch ? 'https://' + ghMatch[0].trim() : '';

  // Attempt to parse Name (usually in the first 2-3 lines, excluding empty space/contact info)
  let fullName = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 3 && !line.includes('@') && !line.includes('/') && !line.match(/\d/)) {
      fullName = line;
      break;
    }
  }

  // 2. Identify sections by headers
  const sections = {
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: ''
  };

  const headerPatterns = [
    { key: 'skills', regex: /^(?:skills|technologies|technical skills|skills & expertise|tech stack|key skills|skills and tools)\b/i },
    { key: 'experience', regex: /^(?:experience|work experience|employment history|work history|professional experience|employment)\b/i },
    { key: 'education', regex: /^(?:education|academic background|credentials|qualifications|academic history)\b/i },
    { key: 'projects', regex: /^(?:projects|academic projects|key projects|personal projects)\b/i },
    { key: 'certifications', regex: /^(?:certifications|certificates|licenses|professional certifications)\b/i },
    { key: 'summary', regex: /^(?:summary|professional summary|about me|profile|objective|career objective)\b/i }
  ];

  let currentKey = 'summary'; // start scanning header/summary
  let currentBlock = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line matches a header pattern
    let matchedHeader = false;
    for (const pattern of headerPatterns) {
      if (pattern.regex.test(line) && line.length < 40) {
        // Save current block
        if (currentKey) {
          sections[currentKey] += (sections[currentKey] ? '\n' : '') + currentBlock.join('\n');
        }
        currentKey = pattern.key;
        currentBlock = [];
        matchedHeader = true;
        break;
      }
    }

    if (!matchedHeader) {
      currentBlock.push(lines[i]);
    }
  }
  // Flush last block
  if (currentKey && currentBlock.length > 0) {
    sections[currentKey] += (sections[currentKey] ? '\n' : '') + currentBlock.join('\n');
  }

  // 3. Post-process sections
  // --- Skills ---
  // Split by commas, newlines, vertical bars, or bullets
  let skillsList = [];
  if (sections.skills) {
    const rawSkills = sections.skills.split(/[,\n|••\t]/);
    skillsList = rawSkills
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 40 && !/^(and|with|tools|technologies)$/i.test(s));
  }

  // --- Education ---
  const educationList = [];
  if (sections.education) {
    // Detect degrees and schools
    const eduLines = sections.education.split('\n').map(l => l.trim()).filter(Boolean);
    let currentEdu = null;

    for (const line of eduLines) {
      let degreeFound = null;
      let matchedDegreeName = '';

      for (const d of DEGREES) {
        for (const name of d.names) {
          if (line.toLowerCase().includes(name)) {
            degreeFound = name;
            matchedDegreeName = name.toUpperCase();
            break;
          }
        }
        if (degreeFound) break;
      }

      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : '';

      if (degreeFound || line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('school')) {
        if (currentEdu) educationList.push(currentEdu);

        currentEdu = {
          school: line.toLowerCase().includes('university') || line.toLowerCase().includes('college') ? line : 'Institution',
          degree: matchedDegreeName || 'Degree/Certificate',
          year: year || '',
          location: ''
        };
      } else if (currentEdu) {
        // Append extra details to previous entry
        if (year && !currentEdu.year) currentEdu.year = year;
        if (line.length > 5 && line.length < 100) {
          if (currentEdu.school === 'Institution') currentEdu.school = line;
          else currentEdu.degree += ` - ${line}`;
        }
      }
    }
    if (currentEdu) educationList.push(currentEdu);
  }

  // --- Experience ---
  const experienceList = [];
  if (sections.experience) {
    const expLines = sections.experience.split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp = null;

    for (const line of expLines) {
      // Look for indicators of a new experience entry: e.g. bullet points vs title/company line
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);

      if (!isBullet && (line.length > 5 && line.length < 80 && (yearMatch || line.includes('|') || line.includes(',') || line.match(/engineer|developer|analyst|manager|consultant|intern|specialist/i)))) {
        if (currentExp) experienceList.push(currentExp);
        currentExp = {
          company: line.split(/[,|]/)[1]?.trim() || line,
          position: line.split(/[,|]/)[0]?.trim() || 'Role',
          duration: yearMatch ? yearMatch[0] : '',
          description: ''
        };
      } else if (currentExp) {
        // Append bullet/description details
        currentExp.description += (currentExp.description ? '\n' : '') + line;
      }
    }
    if (currentExp) experienceList.push(currentExp);
  }

  // --- Projects ---
  const projectsList = [];
  if (sections.projects) {
    const projLines = sections.projects.split('\n').map(l => l.trim()).filter(Boolean);
    let currentProj = null;

    for (const line of projLines) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (!isBullet && line.length > 3 && line.length < 60 && !line.includes('@')) {
        if (currentProj) projectsList.push(currentProj);
        currentProj = {
          title: line,
          description: '',
          link: ''
        };
      } else if (currentProj) {
        const gh = line.match(GITHUB_REGEX);
        if (gh) currentProj.link = 'https://' + gh[0];
        currentProj.description += (currentProj.description ? '\n' : '') + line;
      }
    }
    if (currentProj) projectsList.push(currentProj);
  }

  // --- Certifications ---
  let certificationsList = [];
  if (sections.certifications) {
    certificationsList = sections.certifications
      .split('\n')
      .map(c => c.trim().replace(/^[-•*]\s*/, ''))
      .filter(c => c.length > 3 && c.length < 100);
  }

  return {
    personalInfo: {
      fullName: fullName || 'Candidate Name',
      email,
      phone,
      linkedin,
      github,
      location: '',
      summary: sections.summary.trim()
    },
    skills: skillsList,
    experience: experienceList,
    projects: projectsList,
    education: educationList,
    certifications: certificationsList
  };
}

/**
 * Main parse entrypoint
 */
function parseResume(input) {
  if (typeof input === 'string') {
    return parseRawText(input);
  }
  return normalizeStructured(input);
}

module.exports = { parseResume, DEGREES };
