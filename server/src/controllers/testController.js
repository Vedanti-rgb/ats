const Test = require('../models/Test');
const Resume = require('../models/Resume');

// Helper to call Groq from Backend
async function callGroqBackend(systemPrompt, userPrompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not set in backend .env');
  }

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
      temperature: 0.6,
      max_tokens: 2000,
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

// Generate new test questions based on resume
const generateTest = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.id; // From auth middleware

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const systemPrompt = `You are an expert technical interviewer and recruiter. 
Your goal is to generate exactly 15 tailored interview questions based strictly on a candidate's resume (skills, experience, projects).
You must categorize each question as follows:
- Exactly 10 questions must be of type 'Technical & Aptitude' (assessing coding, conceptual engineering, maths, system architecture, or logical reasoning).
- Exactly 5 questions must be of type 'Behavioral & Scenario' (assessing dynamic project management, conflict handling, team collaboration, or case studies).
Return exactly in this JSON format ONLY (Ensure it is valid JSON):
{
  "questions": [
    { "id": "q1", "text": "Question text here...", "type": "Technical & Aptitude" },
    { "id": "q2", "text": "Question text here...", "type": "Technical & Aptitude" },
    ...
    { "id": "q15", "text": "Question text here...", "type": "Behavioral & Scenario" }
  ]
}`;

    const userPrompt = `CANDIDATE RESUME: 
Skills: ${resume.skills.join(', ')}
Experience: ${JSON.stringify(resume.experience)}
Projects: ${JSON.stringify(resume.projects)}

Generate exactly 15 tailored questions based on this profile: 10 Technical & Aptitude questions, and 5 Behavioral & Scenario questions. Ensure high-fidelity.`;

    const generated = await callGroqBackend(systemPrompt, userPrompt);
    if (!generated.questions || !Array.isArray(generated.questions)) {
      throw new Error('Failed to parse questions from AI response');
    }

    // Save to Database securely
    const test = await Test.create({
      userId,
      resumeId,
      questions: generated.questions,
      answers: [],
      status: 'pending',
    });

    res.status(201).json({
      message: 'Test generated successfully',
      test: {
        _id: test._id,
        questions: test.questions,
        status: test.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Evaluate user's answers against the questions
const submitTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { answers, tabSwitchesCount, fullscreenExitsCount, proctoringLogs, cheatingDetected } = req.body;
    const userId = req.user.id;

    const test = await Test.findOne({ _id: testId, userId });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.status === 'completed') {
      return res.status(400).json({ message: 'Test already submitted' });
    }

    const resume = await Resume.findOne({ _id: test.resumeId, userId });

    const systemPrompt = `You are a strict but fair technical interviewer grading a candidate's test responses.
You will be given the candidate's resume context, the questions asked, the candidate's answers, and proctoring metrics.
Evaluate the answers based on correctness, depth of understanding, and relevance.

PROCTORING & SECURITY AUDIT RULES:
You are also provided with the security metrics from the browser:
- Tab Switches Count: ${tabSwitchesCount || 0}
- Fullscreen Exits Count: ${fullscreenExitsCount || 0}
- Integrity Flag (cheatingDetected): ${cheatingDetected ? 'SUSPECTED' : 'CLEAR'}
If the Tab Switches count is 3 or more, or if cheating is suspected, you MUST:
1. Moderate the final score: cap the maximum possible score at 85 out of 100 (never award a score higher than 85, even if all answers are perfect).
2. Explicitly include a gentle but clear "Security & Integrity Note" paragraph in the feedback highlighting that tab switching or loss of window focus was detected.

Return strictly in this JSON format ONLY:
{
  "score": <integer from 0 to 100 representing overall performance>,
  "feedback": "<detailed feedback of 3-5 sentences providing constructive feedback, including the Integrity Audit statement if cheating was detected>"
}`;

    const userPrompt = `CANDIDATE RESUME CONTEXT:
Skills: ${resume?.skills.join(', ')}
Experience: ${JSON.stringify(resume?.experience)}

TEST Q&A:
${test.questions.map((q) => {
      const ans = answers.find(a => a.questionId === q.id)?.answerText || 'No answer provided';
      return 'Q (' + q.type + '): ' + q.text + '\nA: ' + ans;
    }).join('\n\n')}

PROCTORING LOGS:
${(proctoringLogs || []).join('\n')}

Analyze and return the score and feedback as JSON.`;

    const evaluation = await callGroqBackend(systemPrompt, userPrompt);

    // Update test with score, feedback, and proctoring stats
    test.answers = answers;
    test.score = Math.max(0, Math.min(100, parseInt(evaluation.score) || 0));
    test.feedback = evaluation.feedback;

    test.tabSwitchesCount = tabSwitchesCount || 0;
    test.fullscreenExitsCount = fullscreenExitsCount || 0;
    test.proctoringLogs = proctoringLogs || [];
    test.cheatingDetected = cheatingDetected || (tabSwitchesCount >= 3) || false;
    test.status = 'completed';
    await test.save();

    res.status(200).json({
      message: 'Test evaluated successfully',
      score: test.score,
      feedback: test.feedback,
      test: test,
    });
  } catch (error) {
    next(error);
  }
};

// Get Test History for a specific resume
const getTests = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.id;

    const tests = await Test.find({ resumeId, userId }).sort({ createdAt: -1 });
    res.status(200).json(tests);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTest,
  submitTest,
  getTests,
};
