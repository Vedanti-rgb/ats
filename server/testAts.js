/**
 * Test Suite for deterministic and role-aware ATS engine.
 * Run with: node testAts.js
 */

require('dotenv').config(); // Load environment variables if any
const { scoreResumeVsJD } = require('./src/services/atsScoringEngine');

// Mock Data Analysts Profile
const resumeDataAnalyst = {
  personalInfo: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    summary: 'Detail-oriented Data Analyst with 2 years of experience analyzing complex datasets.'
  },
  skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Pandas', 'NumPy'],
  experience: [
    {
      company: 'DataCorp',
      position: 'Junior Data Analyst',
      duration: '2024 - Present',
      description: '• Extracted and analyzed large datasets using SQL and Excel.\n• Built dashboards in Tableau to visualize business metrics.'
    }
  ],
  projects: [
    {
      title: 'Customer Segmentation Project',
      description: 'Analyzed customer churn using Python, Pandas, and NumPy. Achieved 25% churn reduction.',
      link: 'github.com/janedoe/churn'
    }
  ],
  education: [
    {
      school: 'State University',
      degree: 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
      year: '2023'
    }
  ],
  certifications: ['Tableau Desktop Specialist']
};

// Mock Job Descriptions
const jdDataAnalyst = `
We are looking for a Data Analyst to join our team. 
Required Skills: SQL, Excel, Power BI, Tableau, Statistics.
Preferred Skills: Python, Pandas.
Experience: At least 1 year of experience required.
Education: Bachelor's degree.
`;

const jdBackendDev = `
We are seeking a Backend Developer to build scalable systems.
Required Skills: Java, Spring Boot, REST APIs, Docker, PostgreSQL, Kubernetes.
Preferred Skills: AWS, MongoDB.
Experience: Minimum 3 years of experience.
Education: Master's degree required.
`;

// Mock Perfect Resume mapping exactly what JD requires to test the upper limit
const perfectResume = {
  personalInfo: {
    fullName: 'Perfect Candidate',
    email: 'perfect@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/perfect',
    github: 'github.com/perfect',
    summary: 'A highly qualified professional with years of expert industry achievements.'
  },
  skills: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Python', 'Pandas'],
  experience: [
    {
      company: 'GreatCorp',
      position: 'Senior Analyst',
      duration: '2021 - 2026',
      description: '• Delivered 15% revenue growth by building dashboards.\n• Guided 5 analysts using SQL and Python.'
    }
  ],
  projects: [
    {
      title: 'Analytics Automation',
      description: 'Automated extraction pipelines using Pandas, resulting in 40 hours saved weekly.',
      link: 'github.com/perfect/auto'
    }
  ],
  education: [
    {
      school: 'Ivy University',
      degree: 'BACHELOR OF SCIENCE',
      year: '2020'
    }
  ],
  certifications: ['AWS Certified']
};

async function runTests() {
  console.log('====================================================');
  console.log('STARTING DETERMINISTIC ATS SCORING ENGINE TEST SUITE');
  console.log('====================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: DETERMINISM
    // ----------------------------------------------------
    console.log('TEST 1: Determinism check (Same input must produce the same score)...');
    const resultDA1 = await scoreResumeVsJD(resumeDataAnalyst, jdDataAnalyst);
    const resultDA2 = await scoreResumeVsJD(resumeDataAnalyst, jdDataAnalyst);

    console.log(`- Run 1 Score: ${resultDA1.atsScore}`);
    console.log(`- Run 2 Score: ${resultDA2.atsScore}`);

    if (resultDA1.atsScore === resultDA2.atsScore) {
      console.log('  [PASS] Scores are perfectly deterministic and identical.\n');
    } else {
      throw new Error('[FAIL] Determinism failed! Scores are different.');
    }

    // ----------------------------------------------------
    // TEST 2: ROLE AWARENESS / NO HALLUCINATIONS
    // ----------------------------------------------------
    console.log('TEST 2: Role Awareness & Missing Keyword relevance...');
    console.log(`- Detected Job Family: ${resultDA1.jobFamily}`);
    console.log(`- Missing Keywords:`, resultDA1.missingKeywords);

    const irrelevantTech = ['java', 'spring boot', 'kubernetes', 'react', 'javascript', 'docker'];
    const hasIrrelevant = resultDA1.missingKeywords.some(kw =>
      irrelevantTech.includes(kw.toLowerCase())
    );

    if (hasIrrelevant) {
      throw new Error('[FAIL] Irrelevant technologies (e.g. Java, Kubernetes) were flagged as missing on a Data Analyst resume!');
    } else {
      console.log('  [PASS] No irrelevant developer technologies flagged as missing. Highly role-aware.\n');
    }

    // ----------------------------------------------------
    // TEST 3: SCORE RELEVANCE / JD CHANGE SENSITIVITY
    // ----------------------------------------------------
    console.log('TEST 3: Score sensitivity to JD changes (Cross-role match should score lower)...');
    const resultCross = await scoreResumeVsJD(resumeDataAnalyst, jdBackendDev);
    console.log(`- Data Analyst vs Data Analyst JD Score: ${resultDA1.atsScore}`);
    console.log(`- Data Analyst vs Backend Developer JD Score: ${resultCross.atsScore}`);

    if (resultCross.atsScore < resultDA1.atsScore - 20) {
      console.log('  [PASS] Score dropped appropriately for mismatched job description.\n');
    } else {
      throw new Error('[FAIL] Score did not drop significantly for mismatched role!');
    }

    // ----------------------------------------------------
    // TEST 4: EXPLAINABILITY & TRANSPARENCY OF DEDUCTIONS
    // ----------------------------------------------------
    console.log('TEST 4: Explainability check...');

    const categories = resultDA1.categoryScores;
    let sum = 0;
    console.log('- Category Breakdown:');
    for (const [name, cat] of Object.entries(categories)) {
      console.log(`  * ${name}: ${cat.score} / ${cat.max} (Deducted: ${cat.deducted})`);
      if (cat.reasons && cat.reasons.length > 0) {
        cat.reasons.forEach(r => console.log(`    -> Deduction Reason: ${r}`));
      }
      sum += cat.score;
    }

    console.log(`- Summed Raw Points: ${sum}, Scaled ATS Score: ${resultDA1.atsScore}% (${resultDA1.matchLabel})`);

    if (resultDA1.atsScore <= 87) {
      console.log('  [PASS] Score is fully explainable and within limits.\n');
    } else {
      throw new Error('[FAIL] Score exceeded 87% limit!');
    }

    // ----------------------------------------------------
    // TEST 5: FORMATTING AUDIT DEDUCTIONS
    // ----------------------------------------------------
    console.log('TEST 5: Formatting Audit Deductions...');
    const messyResume = {
      personalInfo: {
        name: 'Jane Messy'
      },
      skills: ['Excel'],
      experience: [
        {
          company: 'NoNameCorp',
          position: 'Data Entry',
          duration: '1 yr',
          description: 'Just typed some letters and did not use bullets'
        }
      ],
      projects: [],
      education: []
    };

    const messyResult = await scoreResumeVsJD(messyResume, jdDataAnalyst);
    console.log(`- Clean Resume Formatting Score: ${resultDA1.categoryScores['Formatting'].score}/5`);
    console.log(`- Messy Resume Formatting Score: ${messyResult.categoryScores['Formatting'].score}/5`);
    console.log(`- Messy Resume Formatting Issues:`, messyResult.formattingIssues);

    if (messyResult.categoryScores['Formatting'].score < resultDA1.categoryScores['Formatting'].score) {
      console.log('  [PASS] Formatting analyzer successfully audited and deducted points for issues.\n');
    } else {
      throw new Error('[FAIL] Messy resume did not receive a formatting score deduction!');
    }

    // ----------------------------------------------------
    // TEST 6: NATURAL UPPER LIMIT OF 87%
    // ----------------------------------------------------
    console.log('TEST 6: Upper limit verification (A perfect resume must receive between 83% and 87%)...');
    const perfectResult = await scoreResumeVsJD(perfectResume, jdDataAnalyst);
    console.log(`- Perfect Resume Score: ${perfectResult.atsScore}% (${perfectResult.matchLabel})`);

    console.log('- Perfect Resume Category Breakdown:');
    for (const [name, cat] of Object.entries(perfectResult.categoryScores)) {
      console.log(`  * ${name}: ${cat.score} / ${cat.max} (Deducted: ${cat.deducted})`);
      if (cat.reasons && cat.reasons.length > 0) {
        cat.reasons.forEach(r => console.log(`    -> Deduction Reason: ${r}`));
      }
    }

    if (perfectResult.atsScore >= 83 && perfectResult.atsScore <= 87) {
      console.log(`  [PASS] Perfect resume scored ${perfectResult.atsScore}%, adhering to strict range (83% - 87%).\n`);
    } else {
      throw new Error(`[FAIL] Perfect resume scored ${perfectResult.atsScore}%! Expected range 83%-87%.`);
    }

    // ----------------------------------------------------
    // TEST 7: MISSING JOB DESCRIPTION ERROR
    // ----------------------------------------------------
    console.log('TEST 7: Missing Job Description verification...');
    try {
      await scoreResumeVsJD(resumeDataAnalyst, '');
      throw new Error('[FAIL] Failed to throw error when Job Description was empty!');
    } catch (jdErr) {
      if (jdErr.message.includes('Job Description is required')) {
        console.log('  [PASS] Successfully threw error when Job Description was missing/empty.\n');
      } else {
        throw jdErr;
      }
    }

    console.log('====================================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY! ENGINE IS READY.');
    console.log('====================================================');

  } catch (error) {
    console.error('\n[TEST ERROR]:', error.message);
    process.exit(1);
  }
}

runTests();
