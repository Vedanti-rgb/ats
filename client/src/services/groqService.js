/**
 * Groq AI Service
 * Calls the Groq API directly from the browser to generate ATS-optimized
 * resume content based on the user's data + a target job description.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Core helper — sends a prompt to Groq and returns parsed JSON.
 */
async function callGroq(systemPrompt, userPrompt) {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not set. Please add your key to client/.env.local');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error('Empty response from Groq');

  return JSON.parse(raw);
}

/**
 * generateAIResume
 * Takes the user's resume data + a job description and returns a fully
 * ATS-optimized version. The AI rewrites: summary, experience bullet points,
 * project descriptions, and suggests skills to add.
 *
 * @param {Object} resumeData  - current resume state
 * @param {string} jobDescription - raw text of the target job posting
 * @returns {Object} { personalInfo, experience, internships, projects, skills, suggestedSkills, atsScore, missingKeywords }
 */
export async function generateAIResume(resumeData, jobDescription) {
  const systemPrompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.
Your job is to rewrite the user's resume content to be perfectly optimized for the provided job description.
Rules:
- Use strong action verbs and quantified achievements where possible
- Naturally weave in keywords from the job description
- Keep all bullet points concise (1-2 lines max)
- NEVER invent fake companies, titles, dates, or credentials
- Only improve the WRITING of what the user has already provided
- Return ONLY valid JSON, no markdown, no extra text`;

  const userPrompt = `JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "<keep original>",
    "email": "<keep original>",
    "phone": "<keep original>",
    "linkedin": "<keep original>",
    "location": "<keep original>",
    "summary": "<rewrite: 3-4 sentences, ATS-optimized, use JD keywords, first person>",
  },
  "experience": [
    {
      "id": "<keep original id>",
      "company": "<keep original>",
      "position": "<keep original>",
      "duration": "<keep original>",
      "description": "<rewrite as 3-4 bullet points starting with •, each on new line, use strong action verbs, mirror JD keywords>"
    }
  ],
  "internships": [
    {
      "id": "<keep original id>",
      "company": "<keep original>",
      "position": "<keep original>",
      "duration": "<keep original>",
      "description": "<rewrite as 2-3 bullet points starting with •, each on new line>"
    }
  ],
  "projects": [
    {
      "id": "<keep original id>",
      "title": "<keep original>",
      "link": "<keep original>",
      "description": "<rewrite: highlight tech stack, impact, relevance to JD>"
    }
  ],
  "skills": [<enhanced skills array combining existing skills + relevant JD skills the user likely has>],
  "suggestedSkills": [<5-8 skills from JD the user should add if they have them>],
  "atsScore": <integer 0-100 estimating ATS match after optimization>,
  "missingKeywords": [<top 5 keywords from JD not found in the resume>],
  "improvements": "<2-sentence summary of main changes made>"
}`;

  return await callGroq(systemPrompt, userPrompt);
}

/**
 * analyzeATSScore
 * Quickly analyses the resume vs JD without rewriting content.
 * Returns score + keyword breakdown for the live ATS meter.
 *
 * @param {Object} resumeData
 * @param {string} jobDescription
 * @returns {Object} { atsScore, matchedKeywords, missingKeywords, suggestions }
 */
export async function analyzeATSScore(resumeData, jobDescription) {
  const systemPrompt = `You are an ATS (Applicant Tracking System) analysis engine. 
Analyze the resume vs job description and return ONLY valid JSON.`;

  const userPrompt = `JOB DESCRIPTION: ${jobDescription}

RESUME SKILLS: ${JSON.stringify(resumeData.skills)}
RESUME SUMMARY: ${resumeData.personalInfo?.summary || ''}
RESUME EXPERIENCE: ${JSON.stringify((resumeData.experience || []).map(e => e.description))}

Return JSON:
{
  "atsScore": <integer 0-100>,
  "matchedKeywords": [<up to 10 keywords from JD found in resume>],
  "missingKeywords": [<up to 8 important keywords from JD missing from resume>],
  "suggestions": [<3 short actionable tips to improve the score>]
}`;

  return await callGroq(systemPrompt, userPrompt);
}

/**
 * suggestTemplate
 * Uses AI to analyze a user's industry, role, and experience level and maps it 
 * to the most appropriate resume template ID based on modern design standards 
 * (e.g. Canva's industry-to-aesthetic taxonomy).
 * 
 * Available templates: 'classic', 'modern', 'creative', 'ocean', 'ats-alice', 'ats-isabelle', 'executive'
 * 
 * @param {string} role - The user's target job role
 * @param {string} industry - The user's target industry
 * @param {string} experience - e.g., 'Fresher', 'Mid-Level', 'Senior', 'Executive'
 * @returns {Object} { suggestedTemplateId, reason, persona }
 */
export async function suggestTemplate(role, industry, experience) {
  const systemPrompt = `You are an expert career consultant and Resume Design Specialist. 
Your goal is to suggest the absolute perfect Resume Template for a job seeker based on their field, similar to how Canva suggests designs based on search intents.

The ONLY valid template IDs you can choose from are:
- "classic" (TRADITIONAL: Good for conservative fields like Law, Banking, Government)
- "modern" (SLEEK: Good for SaaS, Tech, Marketing, Startups)
- "creative" (VIBRANT: Good for Design, Media, Arts, Fashion)
- "ocean" (BLUE-TONE CALM: Good for Healthcare, Education, Non-profits)
- "ats-alice" (STRICT ATS: Good for massive enterprise applications relying on Workday/Taleo)
- "ats-isabelle" (MODERN ATS: Good for data-heavy roles like engineering, science)
- "executive" (PREMIUM: Good for C-suite, Directors, VPs, 10+ years experience)

Return ONLY valid JSON. Keep the justification under 3 sentences.`;

  const userPrompt = `ROLE: ${role}
INDUSTRY: ${industry}
EXPERIENCE LEVEL: ${experience}

Return JSON:
{
  "suggestedTemplateId": "<MUST BE EXACTLY ONE OF: classic, modern, creative, ocean, ats-alice, ats-isabelle, executive>",
  "reason": "<A compelling 2-sentence explanation telling the user why this template is perfect for their specific role and industry standards>",
  "persona": "<e.g. The Corporate Strategist, The Bold Innovator, The Tech Operator>"
}`;

  return await callGroq(systemPrompt, userPrompt);
}

/**
 * generateCustomTemplate
 * Generates an entirely unique, abstract visual resume template schema
 * replicating the granularity of an expansive graphics engine (like Canva).
 * 
 * @param {string} prompt - The user's creative prompt (e.g., "A crazy pink UI designer resume")
 * @returns {Object} JSON schema dictating CSS properties safely
 */
export async function generateCustomTemplate(prompt) {
  const systemPrompt = `You are a Master FAANG-tier UI/UX Resume Designer acting as a Generative Rendering Engine.
The user will describe their dream resume aesthetic / their profession. You must map their prompt to a rigid CSS-compatible JSON Blueprint based ONLY on elite, top-2% premium open-source resume styling (like LaTeX or premium Google Docs templates).

Constraints:
- \`fontFamily\`: Must be exactly "font-sans" (Inter/Roboto), "font-serif" (Merriweather/Times), or "font-mono".
- \`layout\`: Must be exactly "faang-standard" (strict single-column, bottom borders), "google-elegant" (subtle tints, highly tracked names), "latex-academic" (dense typography, no borders), or "modern-split" (left-axis dates).
- \`primaryColor\`: A valid hex code representing the accent color (MUST be extremely professional, e.g. Navy #1e3a8a, Teal #0f766e, or Black #000000). Avoid bright neon or garish colors.
- \`secondaryColor\`: Valid hex code for borders/subtext. Usually #475569 or #64748b.
- \`backgroundColor\`: MUST BE strictly #ffffff (White) or #fafaf9 (Off-white). Never dark or heavily colored backgrounds.
- \`textColor\`: Main text color, MUST be strictly #000000 or very dark gray #1c1917.

Return strictly this JSON structure, with no markdown formatting around it:
{
  "themeName": "<Creative name of this theme>",
  "fontFamily": "...",
  "layout": "...",
  "primaryColor": "...",
  "secondaryColor": "...",
  "backgroundColor": "...",
  "textColor": "..."
}`;

  const userPrompt = `Generate a highly professional resume template based on this exact description/profession: "${prompt}"`;

  return await callGroq(systemPrompt, userPrompt);
}
