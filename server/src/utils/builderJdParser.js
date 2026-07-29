/**
 * Resume Builder Job Description Parser Utility
 * Dedicated parser for the Resume Builder ATS workflow.
 */

const TECH_DICTIONARY = {
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'go', 'golang',
    'rust', 'php', 'html', 'css', 'sql', 'r', 'scala', 'swift', 'kotlin', 'objective-c', 'perl', 'bash'
  ],
  databases: [
    'postgresql', 'postgres', 'mysql', 'sqlite', 'mongodb', 'mongo', 'redis', 'oracle',
    'sql server', 'cassandra', 'dynamodb', 'mariadb', 'firebase', 'elasticsearch', 'dynamo', 'hive', 'redshift'
  ],
  frameworks: [
    'react', 'angular', 'vue', 'svelte', 'next\\.js', 'nextjs', 'express', 'spring boot', 'spring',
    'django', 'fastapi', 'flask', 'ruby on rails', 'rails', 'asp\\.net', 'net core', 'laravel',
    'symfony', 'flutter', 'react native', 'bootstrap', 'tailwind', 'pandas', 'numpy', 'scikit-learn',
    'scikit', 'tensorflow', 'pytorch', 'keras', 'nltk', 'spacy', 'scipy', 'opencv'
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'cloudflare', 'terraform',
    'docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'ansible', 'chef', 'puppet', 'linux',
    'git', 'github', 'gitlab', 'bitbucket', 'prometheus', 'grafana', 'elk'
  ],
  biTools: [
    'power bi', 'powerbi', 'tableau', 'looker', 'excel', 'qlik', 'google data studio', 'sas', 'spss', 'statistics',
    'etl', 'data cleaning', 'data visualization', 'data modeling', 'data warehousing', 'business intelligence'
  ],
  certifications: [
    'pmp', 'aws certified', 'cissp', 'scrum master', 'csm', 'safe', 'itil', 'gcp certified', 'ccna', 'pmp'
  ],
  softSkills: [
    'communication', 'leadership', 'collaboration', 'teamwork', 'problem solving', 'creativity',
    'critical thinking', 'time management', 'adaptability', 'mentorship', 'interpersonal',
    'agile', 'scrum', 'kanban', 'jira', 'confluence'
  ]
};

const JOB_FAMILIES = [
  {
    family: 'Data Analyst',
    keywords: ['data analyst', 'business analyst', 'bi analyst', 'reporting analyst', 'tableau', 'power bi', 'excel', 'data visualization']
  },
  {
    family: 'Backend Developer',
    keywords: ['backend', 'back-end', 'backend developer', 'java developer', 'spring boot', 'node.js', 'node developer', 'microservices', 'databases', 'rest api']
  },
  {
    family: 'Frontend Developer',
    keywords: ['frontend', 'front-end', 'frontend developer', 'react developer', 'javascript developer', 'css', 'html', 'ui/ux', 'react', 'angular', 'vue']
  },
  {
    family: 'DevOps Engineer',
    keywords: ['devops', 'site reliability', 'sre', 'cloud engineer', 'docker', 'kubernetes', 'terraform', 'aws', 'ci/cd', 'jenkins']
  },
  {
    family: 'Data Scientist',
    keywords: ['data scientist', 'machine learning', 'ml engineer', 'deep learning', 'nlp', 'data science', 'tensorflow', 'pytorch', 'scikit-learn']
  },
  {
    family: 'Product Manager',
    keywords: ['product manager', 'product owner', 'project manager', 'scrum master', 'agile', 'roadmap', 'backlog', 'jira']
  },
  {
    family: 'Mobile Developer',
    keywords: ['mobile developer', 'ios developer', 'android developer', 'swift', 'kotlin', 'flutter', 'react native', 'mobile app']
  },
  {
    family: 'Full Stack Developer',
    keywords: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean', 'software engineer', 'developer']
  }
];

function parseBuilderJD(text) {
  if (!text) {
    return {
      jobFamily: 'General/Software Engineer',
      requiredSkills: [],
      preferredSkills: [],
      languages: [],
      databases: [],
      frameworks: [],
      cloud: [],
      biTools: [],
      certifications: [],
      softSkills: [],
      experienceYears: 0,
      educationLevel: 0,
      educationText: 'Not specified'
    };
  }

  const normalized = text.toLowerCase();

  let detectedFamily = 'Full Stack Developer';
  let maxScore = 0;
  for (const familyInfo of JOB_FAMILIES) {
    let score = 0;
    for (const kw of familyInfo.keywords) {
      if (normalized.includes(kw)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      detectedFamily = familyInfo.family;
    }
  }

  const extractedSkills = new Set();
  const skillCategories = {
    languages: [],
    databases: [],
    frameworks: [],
    cloud: [],
    biTools: [],
    certifications: [],
    softSkills: []
  };

  for (const [category, list] of Object.entries(TECH_DICTIONARY)) {
    for (const pattern of list) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(text)) {
        let cleanName = pattern.replace('\\+', '+').replace('\\.', '.');
        if (cleanName === 'powerbi') cleanName = 'power bi';
        if (cleanName === 'nextjs') cleanName = 'next.js';
        if (cleanName === 'golang') cleanName = 'go';
        if (cleanName === 'postgres') cleanName = 'postgresql';
        if (cleanName === 'mongo') cleanName = 'mongodb';
        if (cleanName === 'k8s') cleanName = 'kubernetes';

        const capitalized = cleanName.split(' ')
          .map(w => {
            if (['aws', 'gcp', 'bi', 'db', 'sql', 'etl', 'rest', 'api', 'pmp', 'cissp', 'csm', 'safe', 'itil', 'ccna', 'sre', 'ci/cd', 'elk'].includes(w.toLowerCase())) {
              return w.toUpperCase();
            }
            if (w.toLowerCase() === 'next.js' || w.toLowerCase() === 'node.js') {
              return w.charAt(0).toUpperCase() + w.slice(1);
            }
            return w.charAt(0).toUpperCase() + w.slice(1);
          })
          .join(' ');

        extractedSkills.add(capitalized);
        skillCategories[category].push(capitalized);
      }
    }
  }

  const sentences = text.split(/[.!?\n]/).filter(s => s.trim().length > 0);
  const requiredSkills = new Set();
  const preferredSkills = new Set();

  const preferredWords = ['preferred', 'plus', 'bonus', 'nice to have', 'desired', 'optional', 'highly regarded', 'advantage', 'helpful'];

  for (const skill of extractedSkills) {
    let isPreferred = false;

    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(skill.toLowerCase())) {
        if (preferredWords.some(w => sentence.toLowerCase().includes(w))) {
          isPreferred = true;
          break;
        }
      }
    }

    if (isPreferred) {
      preferredSkills.add(skill);
    } else {
      requiredSkills.add(skill);
    }
  }

  if (requiredSkills.size === 0 && preferredSkills.size > 0) {
    preferredSkills.forEach(s => requiredSkills.add(s));
    preferredSkills.clear();
  }

  let experienceYears = 0;
  const expPatterns = [
    /(\d+)\s*(?:\+|-|to)?\s*(?:\d+)?\s*years?\s+(?:of\s+)?experience/i,
    /experience\s+(?:of\s+)?(\d+)\s*(?:\+|-|to)?\s*(?:\d+)?\s*years?/i,
    /minimum\s+(?:of\s+)?(\d+)\s*years?/i,
    /(\d+)\+?\s*yrs/i
  ];

  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes('experience') || sentence.toLowerCase().includes('yrs') || sentence.toLowerCase().includes('years')) {
      for (const regex of expPatterns) {
        const match = sentence.match(regex);
        if (match) {
          const yrs = parseInt(match[1], 10);
          if (yrs > experienceYears && yrs <= 15) {
            experienceYears = yrs;
          }
        }
      }
    }
  }

  let educationLevel = 0;
  let educationText = 'Not specified';

  if (normalized.includes('phd') || normalized.includes('ph.d') || normalized.includes('doctorate')) {
    educationLevel = 4;
    educationText = 'PhD';
  } else if (normalized.includes('master') || normalized.includes('m.s') || normalized.includes('m.tech') || normalized.includes('msc')) {
    educationLevel = 3;
    educationText = "Master's Degree";
  } else if (normalized.includes('bachelor') || normalized.includes('b.s') || normalized.includes('b.tech') || normalized.includes('degree in computer science') || normalized.includes('degree in engineering')) {
    educationLevel = 2;
    educationText = "Bachelor's Degree";
  }

  return {
    jobFamily: detectedFamily,
    requiredSkills: Array.from(requiredSkills),
    preferredSkills: Array.from(preferredSkills),
    languages: skillCategories.languages,
    databases: skillCategories.databases,
    frameworks: skillCategories.frameworks,
    cloud: skillCategories.cloud,
    biTools: skillCategories.biTools,
    certifications: skillCategories.certifications,
    softSkills: skillCategories.softSkills,
    experienceYears,
    educationLevel,
    educationText
  };
}

module.exports = { parseBuilderJD };
