/**
 * LLM Service
 * Communicates with the Groq API to generate qualitative feedback.
 * Has a robust fallback mechanism to guarantee service continuity if Groq fails or is not configured.
 */

async function callGroqBackend(systemPrompt, userPrompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here' || GROQ_API_KEY.trim() === '') {
    const err = new Error('GROQ_API_KEY is not set or invalid in backend .env');
    err.isAiError = true;
    throw err;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const rawError = new Error(err?.error?.message || `Groq API status ${response.status}`);
      rawError.status = response.status;
      rawError.payload = err;
      throw rawError;
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Empty response from Groq');

    return JSON.parse(raw);
  } catch (err) {
    const sanitizedError = new Error('AI analysis is temporarily unavailable. Please try again in a minute.');
    sanitizedError.isAiError = true;
    sanitizedError.originalError = err;
    throw sanitizedError;
  }
}

async function optimizeResumeBackend(resumeData, jobDescription) {
  const systemPrompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.
Your job is to rewrite the user's resume content to be perfectly optimized for the provided job description.
Rules:
- Use strong action verbs and quantified achievements where possible
- Naturally weave in keywords from the job description
- ONLY use keywords and technologies that EXPLICITLY appear in the provided Job Description. Do NOT add unrelated technologies (e.g. do NOT add React, Node.js, Java, Android unless they explicitly appear in the Job Description).
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
    "summary": "<rewrite: 3-4 sentences, ATS-optimized, use JD keywords, first person>"
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
  "improvements": "<2-sentence summary of main changes made>"
}`;

  return await callGroqBackend(systemPrompt, userPrompt);
}

async function suggestTemplateBackend(role, industry, experience) {
  const systemPrompt = `You are an expert career consultant and Resume Design Specialist. 
Your goal is to suggest the absolute perfect Resume Template for a job seeker based on their field, similar to how Canva suggests designs based on search intents.

The ONLY valid template IDs you can choose from are:
- "executive", "prof-consultant", "prof-corporate", "prof-premium" (PROFESSIONAL: C-suite, Consulting, Operations, Finance)
- "classic", "classic-new", "classic-minimal", "classic-elegant" (CLASSIC: Traditional, Law, Academia, Banking)
- "modern", "modern-split", "modern-grid", "modern-timeline" (MODERN: Tech, Product, SaaS, Engineering)
- "creative", "ocean", "creative-designer", "creative-colorblock" (CREATIVE: Design, Media, Arts, Marketing)
- "ats-alice", "ats-isabelle", "ats-compact", "ats-executive" (ATS FRIENDLY: Mass enterprise applications, Workday, Taleo)

Return ONLY valid JSON. Keep the justification under 3 sentences.`;

  const userPrompt = `ROLE: ${role}
INDUSTRY: ${industry}
EXPERIENCE LEVEL: ${experience}

Return JSON:
{
  "suggestedTemplateId": "<MUST BE EXACTLY ONE OF THE VALID TEMPLATE IDs LISTED>",
  "reason": "<A compelling 2-sentence explanation telling the user why this template is perfect for their specific role and industry standards>",
  "persona": "<e.g. The Corporate Strategist, The Bold Innovator, The Tech Operator>"
}`;

  return await callGroqBackend(systemPrompt, userPrompt);
}

async function generateCustomTemplateBackend(prompt) {
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

  return await callGroqBackend(systemPrompt, userPrompt);
}

/**
 * Generates suggestions, strengths, and weaknesses from the deterministic report data.
 */
async function generateFeedback(analysisDetails) {
  const {
    jobFamily,
    matchedKeywords,
    missingKeywords,
    formattingIssues,
    experienceInfo,
    educationInfo
  } = analysisDetails;

  const systemPrompt = `You are an expert career consultant and resume critic.
Analyze the candidate's resume status against the target role requirements and provide qualitative feedback.
You must return ONLY a JSON object with this exact structure:
{
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"]
}

Rules:
1. Provide exactly 3 actionable, highly personalized improvement suggestions.
2. List 2 to 3 key strengths of the resume (e.g. matched technologies, degree, years of experience).
3. List 2 to 3 key weaknesses of the resume (e.g. missing critical tools, formatting issues).
4. NEVER calculate, invent, or mention scores, percentage matches, or numeric weights. The score is handled separately.
5. Return ONLY valid, parseable JSON. No conversational text around it.`;

  const userPrompt = `ROLE CONTEXT: Target role is ${jobFamily}.
DETERMINISTIC ANALYSIS BREAKDOWN:
- Matched Keywords: ${matchedKeywords.slice(0, 10).join(', ')}
- Missing Keywords: ${missingKeywords.slice(0, 10).join(', ')}
- Formatting Issues Detected: ${formattingIssues.slice(0, 5).join(', ')}
- Candidate Experience: ${experienceInfo || 'Not detailed'}
- Candidate Education: ${educationInfo || 'Not detailed'}

Please analyze the above details and generate suggestions, strengths, and weaknesses.`;

  try {
    const aiResponse = await callGroqBackend(systemPrompt, userPrompt);
    return {
      suggestions: aiResponse.suggestions || [],
      strengths: aiResponse.strengths || [],
      weaknesses: aiResponse.weaknesses || []
    };
  } catch (error) {
    console.warn('Groq LLM feedback failed. Utilizing local fallback parser:', error.message);
    return generateLocalFallbackFeedback(analysisDetails);
  }
}

/**
 * Hard deterministic fallback logic if Groq fails or is not configured.
 */
function generateLocalFallbackFeedback(details) {
  const suggestions = [];
  const strengths = [];
  const weaknesses = [];

  // Generate Suggestions
  if (details.missingKeywords.length > 0) {
    suggestions.push(`Incorporate missing keywords relevant to ${details.jobFamily}: ${details.missingKeywords.slice(0, 3).join(', ')}.`);
  } else {
    suggestions.push(`Highlight complex projects where you applied your primary skills.`);
  }

  if (details.formattingIssues.length > 0) {
    suggestions.push(`Resolve formatting issue: ${details.formattingIssues[0]}.`);
  } else {
    suggestions.push(`Keep bullet descriptions concise and quantify results.`);
  }

  suggestions.push(`Tailor your professional summary to highlight accomplishments matching the ${details.jobFamily} requirements.`);

  // Generate Strengths
  if (details.matchedKeywords.length >= 5) {
    strengths.push(`Strong keyword alignment with core skills like ${details.matchedKeywords.slice(0, 3).join(', ')}.`);
  } else if (details.matchedKeywords.length > 0) {
    strengths.push(`Good foundation in basic tools like ${details.matchedKeywords.slice(0, 2).join(', ')}.`);
  } else {
    strengths.push('Clean layout section headings detected.');
  }

  if (details.educationInfo) {
    strengths.push(`Educational credentials verified (${details.educationInfo}).`);
  }

  // Generate Weaknesses
  if (details.missingKeywords.length > 0) {
    weaknesses.push(`Missing key target technologies: ${details.missingKeywords.slice(0, 3).join(', ')}.`);
  }
  if (details.formattingIssues.length > 0) {
    weaknesses.push(`Formatting issues found: ${details.formattingIssues.slice(0, 2).join(', ')}.`);
  } else {
    weaknesses.push('Could incorporate more action verbs in job descriptions.');
  }

  return {
    suggestions: suggestions.slice(0, 3),
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3)
  };
}

module.exports = {
  generateFeedback,
  optimizeResumeBackend,
  suggestTemplateBackend,
  generateCustomTemplateBackend
};
