import React from 'react';

/**
 * Clean Standard ATS Resume Template
 * Strict single column flow, standard Arial/Sans font, zero graphics, 100% parser safe.
 */
const ATSStandardClean = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "JAMES A. TAYLOR",
      email: "james.taylor@email.com",
      phone: "(555) 234-5678",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/jamestaylor"
    },
    summary: "Project Manager with 7+ years experience directing software development lifecycles, managing cross-functional teams, and implementing agile methodologies.",
    experience: [
      {
        id: 1,
        company: "Apex Tech Solutions Inc.",
        position: "Senior Project Manager",
        duration: "2020 - Present",
        description: "Manage enterprise software development projects with budgets exceeding $4M. Led team of 18 developers and QA engineers."
      },
      {
        id: 2,
        company: "Midwest Software Group",
        position: "Agile Project Coordinator",
        duration: "2017 - 2020",
        description: "Facilitated daily sprint standups, sprint planning sessions, and retrospectives for 3 development squads."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Illinois Urbana-Champaign",
        degree: "Bachelor of Science in Business Administration",
        year: "2013 - 2017"
      }
    ],
    skills: ["Project Management (PMP)", "Agile & Scrum Methodologies", "Jira & Confluence", "Risk Assessment", "Budget Management", "Stakeholder Communication"],
    projects: [
      {
        id: 1,
        title: "Enterprise Portal Migration",
        description: "Directed migration of internal employee portal improving system response times by 30%."
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
        {/* Strict Plain Standard Header */}
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

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Professional Summary</h2>
            <p className="text-[10.5px] leading-snug whitespace-pre-wrap text-black">{displayData.summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Core Skills & Certifications</h2>
            <p className="text-[10.5px] leading-snug text-black">
              {displayData.skills.join(" • ")}
            </p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wider">
              {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
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
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Key Projects</h2>
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

export default ATSStandardClean;
