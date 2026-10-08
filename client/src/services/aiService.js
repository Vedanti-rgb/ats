/**
 * Neutral AI Service
 * Communicates with the backend endpoints to perform ATS optimizations,
 * scoring, and template suggestions, securing the API provider details.
 */

const API_BASE_URL = `${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005'}/api/ats`;

const optimizeCache = new Map();
const scoreCache = new Map();

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
  return JSON.stringify(content);
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errBody = {};
    try {
      errBody = await response.json();
    } catch (_) {}
    
    // Check for rate limit or AI provider error
    if (errBody?.error === 'AI_SERVICE_TEMPORARILY_UNAVAILABLE' || response.status === 503) {
      throw new Error('AI analysis is temporarily unavailable. Please try again after a short while.');
    }
    throw new Error(errBody?.message || 'AI service error occurred. Please try again later.');
  }
  return await response.json();
}

/**
 * generateAIResume
 * Calls the backend optimizer. Uses client-side cache if inputs match.
 */
export async function generateAIResume(resumeData, jobDescription, forceRegenerate = false) {
  const fingerprint = getFingerprint(resumeData, jobDescription);
  
  if (!forceRegenerate && optimizeCache.has(fingerprint)) {
    console.log('Serving client-cached optimized resume.');
    return optimizeCache.get(fingerprint);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/optimize-builder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resumeData, jobDescription, forceRegenerate }),
    });

    const result = await handleResponse(response);
    optimizeCache.set(fingerprint, result);
    return result;
  } catch (err) {
    console.error('generateAIResume error:', err);
    throw new Error('AI analysis is temporarily unavailable. Please try again after a short while.');
  }
}

/**
 * analyzeATSScore
 * Calls the backend ATS scoring engine. Uses client-side cache if inputs match.
 */
export async function analyzeATSScore(resumeData, jobDescription, forceRegenerate = false) {
  const fingerprint = getFingerprint(resumeData, jobDescription);

  if (!forceRegenerate && scoreCache.has(fingerprint)) {
    console.log('Serving client-cached ATS score.');
    return scoreCache.get(fingerprint);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze-builder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resumeData, jobDescription, forceRegenerate }),
    });

    const result = await handleResponse(response);
    scoreCache.set(fingerprint, result);
    return result;
  } catch (err) {
    console.error('analyzeATSScore error:', err);
    throw new Error('AI analysis is temporarily unavailable. Please try again after a short while.');
  }
}

/**
 * suggestTemplate
 * Calls the backend template suggester.
 */
export async function suggestTemplate(role, industry, experience) {
  try {
    const response = await fetch(`${API_BASE_URL}/suggest-template`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role, industry, experience }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.error('suggestTemplate error:', err);
    throw new Error('AI analysis is temporarily unavailable. Please try again after a short while.');
  }
}

/**
 * generateCustomTemplate
 * Calls the backend custom CSS template generator.
 */
export async function generateCustomTemplate(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-custom-template`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt }),
    });

    return await handleResponse(response);
  } catch (err) {
    console.error('generateCustomTemplate error:', err);
    throw new Error('AI analysis is temporarily unavailable. Please try again after a short while.');
  }
}
