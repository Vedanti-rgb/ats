import React from 'react';

/**
 * Minimal Pro ATS Resume Template
 * Ultra clean single column text flow with precise font weights for max parser accuracy.
 */
const ATSMinimalPro = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "SARAH E. PARKER",
      email: "sarah.parker@email.com",
      phone: "(555) 432-1098",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/sarahparker"
    },
    summary: "Financial Analyst with 6+ years experience evaluating investment portfolios, conducting equity valuations, and preparing quarterly executive reports.",
    experience: [
      {
        id: 1,
        company: "Boston Financial Advisory",
        position: "Senior Financial Analyst",
        duration: "2021 - Present",
        description: "Analyze $800M equity portfolio performance. Prepared financial modeling forecasts improving quarterly projection accuracy by 25%."
      },
      {
        id: 2,
        company: "Heritage Capital Management",
        position: "Junior Analyst",
        duration: "2018 - 2021",
        description: "Conducted market research and performed DCF valuation modeling for mid-market corporate clients."
      }
    ],
    education: [
      {
        id: 1,
        school: "Boston College",
        degree: "Bachelor of Science in Finance",
        year: "2014 - 2018"
      }
    ],
    skills: ["Financial Valuation", "DCF Modeling", "Bloomberg Terminal", "Excel Financial Functions", "Equity Research", "Portfolio Analytics"],
    projects: [
      {
        id: 1,
        title: "Automated Valuation Model Framework",
        description: "Created standardized Excel valuation template adopted across financial analysis department."
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
        {/* Clean Header */}
        <header className="border-b border-black pb-3 mb-4 text-center">
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

        {/* Core Competencies */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Key Competencies</h2>
            <p className="text-[10.5px] leading-snug text-black">
              {displayData.skills.join(" • ")}
            </p>
          </section>
        )}

        {/* Work Experience */}
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
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Representative Projects</h2>
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

export default ATSMinimalPro;
