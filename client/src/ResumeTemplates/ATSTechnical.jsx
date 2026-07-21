import React from 'react';

/**
 * Technical ATS Resume Template
 * Tailored for software developers and engineers with technical skills categories matrix.
 */
const ATSTechnical = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ANDREW M. KHOO",
      email: "andrew.khoo@dev.com",
      phone: "(555) 789-0123",
      location: "Seattle, WA",
      linkedin: "github.com/andrewkhoo"
    },
    summary: "Software Engineer with 6+ years experience building backend microservices, optimizing SQL databases, and deploying containerized applications on AWS cloud infrastructure.",
    experience: [
      {
        id: 1,
        company: "Pacific Software Systems",
        position: "Senior Backend Developer",
        duration: "2021 - Present",
        description: "Engineered high-concurrency RESTful APIs in Go and Python. Decreased database query execution latency by 40% via Redis caching strategies."
      },
      {
        id: 2,
        company: "Seattle Code Labs",
        position: "Software Developer",
        duration: "2018 - 2021",
        description: "Developed automated CI/CD pipelines using Jenkins and Docker. Maintained PostgreSQL database schemas and migrations."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Washington",
        degree: "Bachelor of Science in Computer Science",
        year: "2014 - 2018"
      }
    ],
    skills: ["Languages: Python, Go, Java, JavaScript, SQL", "Frameworks: Node.js, Express, Django, React", "Tools & Infrastructure: AWS, Docker, Kubernetes, Git, Redis, PostgreSQL"],
    projects: [
      {
        id: 1,
        title: "Distributed Task Queue Library",
        description: "Open-source asynchronous task processing queue implemented in Go with Redis backend."
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

  const personalInfo = displayData?.personalInfo || {};
  const fullName = personalInfo?.name || personalInfo?.fullName || "FIRST LAST";
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);

  return (
    <div className="bg-white text-black font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-9 flex flex-col justify-between text-left leading-normal">
      <div>
        {/* Technical Header */}
        <header className="text-center border-b border-black pb-3 mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wide mb-1">{fullName}</h1>
          <div className="text-[11px] font-normal text-black flex flex-wrap justify-center gap-x-2">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>|</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>|</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Technical Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Technical Summary</h2>
            <p className="text-[10.5px] leading-snug whitespace-pre-wrap text-black">{displayData.summary}</p>
          </section>
        )}

        {/* Technical Skills Matrix */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Technical Proficiencies</h2>
            <div className="text-[10.5px] leading-snug text-black space-y-1">
              {displayData.skills.map((skill, index) => (
                <div key={index}>• {skill}</div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wider">
              {displayData?.isFresher ? 'Software Internships' : 'Engineering Experience'}
            </h2>
            <div className="space-y-3">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-bold text-[11px]">
                    <span>{item.company}</span>
                    <span>{item.duration}</span>
                  </div>
                  <div className="text-[10.5px] font-semibold italic mb-1">{item.position}</div>
                  <p className="text-[10px] leading-relaxed whitespace-pre-wrap text-black">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Software Projects</h2>
            <div className="space-y-2">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <span className="text-[10.5px] font-bold">{proj.title}: </span>
                  <span className="text-[10px] leading-snug whitespace-pre-wrap">{proj.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Education</h2>
            <div className="space-y-2">
              {displayData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold">{edu.school}</span> – <span className="italic">{edu.degree}</span>
                  </div>
                  <span className="font-medium">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ATSTechnical;
