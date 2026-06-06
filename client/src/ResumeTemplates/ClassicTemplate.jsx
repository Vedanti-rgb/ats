import React from 'react';

/**
 * Classic ATS-Friendly Resume Template
 * Uses standard fonts, clear headings, and a single-column layout.
 */
const ClassicTemplate = ({ data }) => {
  // If no data is provided or sections are empty, use demo content
  const isDemo = !data?.personalInfo?.name;

  const displayData = isDemo ? {
    personalInfo: {
      name: "JONATHAN DOE",
      email: "jonathan.doe@example.com",
      phone: "+1 (555) 000-1234",
      location: "San Francisco, CA",
    },
    summary: "Senior Software Engineer with 8+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-quality software solutions in fast-paced environments.",
    experience: [
      {
        id: 1,
        company: "Tech Global Solutions",
        position: "Lead Software Architect",
        duration: "2021 - Present",
        description: "Leading the development of a flagship SaaS platform using Microservices architecture. Reduced system latency by 40% through intensive code optimization and implementing Redis caching strategies."
      },
      {
        id: 2,
        company: "InnoSoft Systems",
        position: "Senior Full Stack Developer",
        duration: "2018 - 2021",
        description: "Developed and maintained multiple high-traffic client websites. Mentored junior developers and implemented standardized CI/CD pipelines using GitHub Actions."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of California, Berkeley",
        degree: "B.S. in Computer Science",
        year: "2014 - 2018"
      }
    ],
    skills: ["JavaScript (ES6+)", "React & Redux", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "System Design"],
    projects: [
      {
        id: 1,
        title: "E-Commerce AI Engine",
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
  } : data;

  return (
    <div className="bg-white p-[5%] text-black font-serif w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden">
      <header className="text-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">{displayData?.personalInfo?.name}</h1>
        <p className="text-sm mt-2">
          {displayData?.personalInfo?.email} | {displayData?.personalInfo?.phone} | {displayData?.personalInfo?.location}
        </p>
      </header>

      {/* Summary Section */}
      {(displayData?.enabledSections?.summary) && displayData?.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black mb-2 uppercase tracking-widest">Summary</h2>
          <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#44403c' }}>{displayData.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black mb-3 uppercase tracking-widest">
            {displayData?.isFresher ? 'Internships' : 'Experience'}
          </h2>
          <div className="space-y-4">
            {(displayData?.isFresher ? displayData?.internships : displayData?.experience)?.map((entry) => (
              <div key={entry.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[13px]">{entry.company}</h3>
                  <span className="text-[11px] font-medium">{entry.duration}</span>
                </div>
                <div className="text-[12px] font-bold mb-1" style={{ color: '#57534e' }}>{entry.position}</div>
                <p className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: '#57534e' }}>{entry.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black mb-3 uppercase tracking-widest">Projects</h2>
          <div className="space-y-3">
            {displayData.projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="font-bold text-[13px]">{proj.title}</h3>
                <p className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: '#57534e' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black mb-3 uppercase tracking-widest">Education</h2>
          <div className="space-y-3">
            {displayData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[13px]">{edu.school}</h3>
                  <span className="text-[11px] font-medium">{edu.year}</span>
                </div>
                <div className="text-[11px] italic" style={{ color: '#57534e' }}>{edu.degree}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold border-b-2 border-black mb-2 uppercase tracking-widest">Skills</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {displayData.skills.map((skill, index) => (
              <span key={index} className="text-[11px] font-medium" style={{ color: '#44403c' }}>
                • {skill}
              </span>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ClassicTemplate;
