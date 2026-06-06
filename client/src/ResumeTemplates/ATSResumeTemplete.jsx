import React from "react";

// ==========================================
// DEMO DATA FOR PREVIEW
// ==========================================
const DEMO_DATA = {
  personalInfo: {
    fullName: "JONATHAN DOE",
    name: "JONATHAN DOE",
    email: "jonathan.doe@example.com",
    phone: "+1 (555) 000-1234",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johndoe",
    title: "Senior Software Engineer"
  },
  summary: "Senior Software Engineer with 8+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-quality software solutions in fast-paced environments.",
  experience: [
    {
      id: 1,
      company: "Tech Global Solutions",
      position: "Lead Software Architect",
      duration: "2021 - Present",
      location: "San Francisco, CA",
      description: "Leading the development of a flagship SaaS platform using Microservices architecture. Reduced system latency by 40% through intensive code optimization and implementing Redis caching strategies."
    },
    {
      id: 2,
      company: "InnoSoft Systems",
      position: "Senior Full Stack Developer",
      duration: "2018 - 2021",
      location: "Oakland, CA",
      description: "Developed and maintained multiple high-traffic client websites. Mentored junior developers and implemented standardized CI/CD pipelines using GitHub Actions."
    }
  ],
  education: [
    {
      id: 1,
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      year: "2014 - 2018",
      location: "Berkeley, CA"
    }
  ],
  skills: ["JavaScript (ES6+)", "React & Redux", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "System Design"],
  projects: [
    {
      id: 1,
      title: "E-Commerce AI Engine",
      year: "2023",
      description: "Built a recommendation engine that increased conversion rates by 15% using collaborative filtering algorithms."
    }
  ],
  enabledSections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true
  }
};

// ==========================================
// VARIANT 1: Jake's Latex Template (Classic ATS)
// Based on: Jake Gutierrez's popular LaTeX template
// ==========================================
const SectionHeading = ({ children }) => (
  <div className="mb-2 mt-4">
    <h2 className="text-lg font-bold text-black font-serif uppercase tracking-normal" style={{ fontSize: '15px' }}>
      {children}
    </h2>
    <div className="w-full bg-black mt-0.5" style={{ height: '1.5px' }}></div>
  </div>
);

export const AliceTemplate = ({ data }) => {
  const isDemo = !data?.personalInfo?.fullName && !data?.personalInfo?.name;
  const displayData = isDemo ? DEMO_DATA : data;

  const personalInfo = displayData?.personalInfo || {};
  const summary = personalInfo?.summary || displayData?.summary || "";
  
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);
  const educationList = displayData?.education || [];
  const skillsList = displayData?.skills || [];
  const projectsList = displayData?.projects || [];

  const fullName = personalInfo?.fullName || personalInfo?.name || "First Last";

  return (
    <div className="bg-white text-black shadow-2xl mx-auto box-border" style={{ maxWidth: '850px', minHeight: '1100px', padding: '0.6in 0.5in', fontFamily: '"Times New Roman", Times, serif' }}>
      
      {/* HEADER */}
      <div className="text-center mb-5">
        <h1 className="font-bold uppercase" style={{ fontSize: '32px', marginBottom: '8px', lineHeight: '1' }}>
          {fullName}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm font-normal text-black" style={{ fontSize: '13px' }}>
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.phone && personalInfo?.email && <span className="mx-1">|</span>}
          {personalInfo?.email && (
            <a href={`mailto:${personalInfo.email}`} className="text-black no-underline hover:underline">
              {personalInfo.email}
            </a>
          )}
          {(personalInfo?.phone || personalInfo?.email) && personalInfo?.linkedin && <span className="mx-1">|</span>}
          {personalInfo?.linkedin && (
            <a href={personalInfo.linkedin} className="text-black no-underline hover:underline">
              {personalInfo.linkedin.replace(/^https?:\/\//, '')}
            </a>
          )}
          {(personalInfo?.phone || personalInfo?.email || personalInfo?.linkedin) && personalInfo?.location && <span className="mx-1">|</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <section>
          <SectionHeading>Summary</SectionHeading>
          <p className="text-justify font-normal" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {summary}
          </p>
        </section>
      )}

      {/* EDUCATION */}
      {educationList.length > 0 && (
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-3">
            {educationList.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-start" style={{ lineHeight: '1.2' }}>
                  <span className="font-bold" style={{ fontSize: '14px' }}>{edu.school || edu.institution || "University Name"}</span>
                  <span className="font-normal" style={{ fontSize: '13px' }}>{edu.year || edu.duration || "Aug. 2018 -- May 2022"}</span>
                </div>
                <div className="flex justify-between items-start mt-1" style={{ lineHeight: '1.2' }}>
                  <span className="italic" style={{ fontSize: '13px' }}>{edu.degree || edu.course || "Degree Name"}</span>
                  <span className="font-normal" style={{ fontSize: '13px' }}>{edu.location || ""}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experienceList.length > 0 && (
        <section>
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-4">
            {experienceList.map((job, index) => (
              <div key={job.id || index}>
                <div className="flex justify-between items-start" style={{ lineHeight: '1.2' }}>
                  <span className="font-bold" style={{ fontSize: '14px' }}>{job.company || "Company Name"}</span>
                  <span className="font-normal" style={{ fontSize: '13px' }}>{job.duration || job.year || "May 2020 -- August 2020"}</span>
                </div>
                <div className="flex justify-between items-start mt-0.5" style={{ lineHeight: '1.2' }}>
                  <span className="italic" style={{ fontSize: '13px' }}>{job.position || job.title || "Position Title"}</span>
                  <span className="italic" style={{ fontSize: '13px' }}>{job.location || ""}</span>
                </div>
                {job.description && (
                  <ul className="list-disc list-outside ml-5 mt-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                      <li key={i} className="pl-1 mb-1">{desc.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projectsList.length > 0 && (
        <section>
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-3">
            {projectsList.map((proj, index) => (
              <div key={proj.id || index}>
                <div className="flex justify-between items-start" style={{ lineHeight: '1.2' }}>
                  <span className="font-bold" style={{ fontSize: '14px' }}>{proj.title || "Project Name"}</span>
                  {proj.year && <span className="font-normal" style={{ fontSize: '13px' }}>{proj.year}</span>}
                </div>
                {proj.description && (
                  <ul className="list-disc list-outside ml-5 mt-2" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {proj.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                      <li key={i} className="pl-1 mb-1">{desc.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNICAL SKILLS */}
      {skillsList.length > 0 && (
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <ul className="list-none ml-2" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            <li className="flex flex-wrap gap-1">
              <span className="font-bold">Skills:</span>
              <span>{skillsList.join(", ")}</span>
            </li>
          </ul>
        </section>
      )}
      
    </div>
  );
};


// ==========================================
// VARIANT 2: Isabelle Template (Modern Elegant ATS)
// ==========================================
export const IsabelleTemplate = ({ data }) => {
  const isDemo = !data?.personalInfo?.fullName && !data?.personalInfo?.name;
  const displayData = isDemo ? DEMO_DATA : data;

  const personalInfo = displayData?.personalInfo || {};
  const summary = personalInfo?.summary || displayData?.summary || "";
  
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);
  const educationList = displayData?.education || [];
  const skillsList = displayData?.skills || [];
  const projectsList = displayData?.projects || [];

  return (
    <div className="bg-white p-12 sm:p-14 text-stone-800 font-sans shadow-2xl mx-auto box-border relative overflow-hidden" style={{ maxWidth: '850px', minHeight: '1050px' }}>
      
      {/* Subtle modern corner accent */}
      <div className="absolute top-0 right-0 h-64 bg-indigo-50 rounded-bl-full -z-10" style={{ width: '18rem' }}></div>
      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-50 -z-10"></div>

      <header className="mb-10 pb-6 border-b-2 border-stone-100 relative">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2 text-indigo-900">
          {personalInfo?.fullName || personalInfo?.name || "Isabelle Todd"}
        </h1>
        <p className="text-lg font-bold text-stone-400 tracking-widest uppercase mb-5">
          {personalInfo?.title || "Professional Title"}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-stone-500">
          {personalInfo?.phone && <span className="flex items-center gap-2"><span className="text-indigo-900">●</span> {personalInfo.phone}</span>}
          {personalInfo?.email && <span className="flex items-center gap-2"><span className="text-indigo-900">●</span> {personalInfo.email}</span>}
          {personalInfo?.linkedin && <span className="flex items-center gap-2"><span className="text-indigo-900">●</span> {personalInfo.linkedin}</span>}
          {personalInfo?.location && <span className="flex items-center gap-2"><span className="text-indigo-900">●</span> {personalInfo.location}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-8">
          <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-indigo-900 flex items-center gap-4">
            Profile
            <div className="flex-1 h-px bg-indigo-100"></div>
          </h2>
          <p className="text-sm text-stone-600 font-medium whitespace-pre-wrap" style={{ lineHeight: '1.8' }}>{summary}</p>
        </section>
      )}

      {experienceList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black mb-6 uppercase tracking-widest text-indigo-900 flex items-center gap-4">
            {displayData?.isFresher ? "Internships" : "Experience"}
            <div className="flex-1 h-px bg-indigo-100"></div>
          </h2>
          <div className="space-y-8">
            {experienceList.map((job, index) => (
              <div key={job.id || index} className="relative pl-5 border-l-2 border-stone-100 hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-base font-extrabold text-stone-900">{job.position || job.title || "Job Title"}</h3>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded uppercase tracking-wider">{job.duration || job.year}</span>
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <p className="text-sm font-bold text-stone-500">{job.company || "Company Name"}</p>
                  <p className="text-xs font-semibold text-stone-400">{job.location}</p>
                </div>
                {job.description && (
                  <ul className="list-disc list-outside ml-4 text-sm font-medium text-stone-600 space-y-2 marker:text-indigo-300" style={{ lineHeight: '1.7' }}>
                    {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                      <li key={i}>{desc.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projectsList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-black mb-6 uppercase tracking-widest text-indigo-900 flex items-center gap-4">
            Projects
            <div className="flex-1 h-px bg-indigo-100"></div>
          </h2>
          <div className="space-y-6">
            {projectsList.map((proj, index) => (
              <div key={proj.id || index} className="pl-5 border-l-2 border-stone-100 hover:border-indigo-200 transition-colors">
                <h3 className="text-base font-extrabold text-stone-900">{proj.title || "Project Name"}</h3>
                {proj.description && <p className="text-sm text-stone-600 font-medium mt-2 whitespace-pre-wrap" style={{ lineHeight: '1.7' }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10">
        {educationList.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-black mb-6 uppercase tracking-widest text-indigo-900 flex items-center gap-4">
              Education
              <div className="flex-1 h-px bg-indigo-100"></div>
            </h2>
            <div className="space-y-6">
              {educationList.map((edu, index) => (
                <div key={edu.id || index} className="pl-5 border-l-2 border-stone-100">
                  <h3 className="text-sm font-extrabold text-stone-900 leading-tight">{edu.degree || edu.course || "Degree Name"}</h3>
                  <p className="text-sm font-bold text-stone-500 mt-2">{edu.school || edu.institution}</p>
                  <p className="text-xs font-bold text-indigo-500 mt-2 uppercase tracking-wider">{edu.year || edu.duration}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skillsList.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-black mb-6 uppercase tracking-widest text-indigo-900 flex items-center gap-4">
              Skills
              <div className="flex-1 h-px bg-indigo-100"></div>
            </h2>
            <div className="flex flex-col gap-3">
              {skillsList.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 text-sm font-bold text-stone-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
    </div>
  );
};


// ==========================================
// MAIN COMPONENT (Defaults to Alice Template)
// ==========================================
const ATSResumeTemplate = ({ data, variant = 'alice' }) => {
  // If you ever want to toggle between them, you can pass variant="isabelle" or "alice"
  if (variant === 'isabelle') {
    return <IsabelleTemplate data={data} />;
  }
  return <AliceTemplate data={data} />;
};

export default ATSResumeTemplate;

