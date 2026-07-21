import React from 'react';

/**
 * Minimal Classic Resume Template
 * Clean monochrome layout with generous margins, crisp typography, 
 * subtle uppercase section headers, and maximum clarity.
 */
const ClassicMinimal = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "BEATRICE CLAIRE",
      email: "beatrice.c@minimal.com",
      phone: "+1 (555) 876-5432",
      location: "Seattle, WA",
      linkedin: "linkedin.com/in/beatriceclaire"
    },
    summary: "Detail-oriented Operations Manager with 6+ years of experience streamlining business workflows, optimizing cross-departmental communications, and executing strategic initiatives.",
    experience: [
      {
        id: 1,
        company: "Cascade Logistics",
        position: "Operations Manager",
        duration: "2021 - Present",
        description: "Direct daily warehouse and fulfillment operations. Reduced shipping error rates from 4% to 0.2% while expanding daily output capacity."
      },
      {
        id: 2,
        company: "Pacific Horizons Inc",
        position: "Assistant Project Manager",
        duration: "2018 - 2021",
        description: "Coordinated cross-functional schedules and deliverables for 15+ commercial client projects simultaneously."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Washington",
        degree: "B.A. in Business Administration",
        year: "2014 - 2018"
      }
    ],
    skills: ["Operations Management", "Process Improvement", "Vendor Management", "Asana & Jira", "Data Analysis", "Team Leadership"],
    projects: [
      {
        id: 1,
        title: "Workflow Automation Standardization",
        description: "Implemented digital ticketing system across 4 regional offices, decreasing internal query response times by 50%."
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
  const fullName = personalInfo?.name || personalInfo?.fullName || "Your Name";
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);

  return (
    <div className="bg-white text-neutral-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-12 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-light tracking-[0.2em] text-neutral-900 uppercase mb-2">{fullName}</h1>
          <div className="flex flex-wrap items-center gap-x-3 text-[10px] tracking-widest uppercase font-medium text-neutral-400">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.email && <span>/</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.phone && <span>/</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section>
            <h2 className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">Profile</h2>
            <p className="text-[11px] leading-relaxed text-neutral-700 font-normal whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section>
            <h2 className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-4">
              {displayData?.isFresher ? 'Internships' : 'Experience'}
            </h2>
            <div className="space-y-5">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-[12.5px] text-neutral-900">{item.position}</h3>
                    <span className="text-[10px] text-neutral-400 font-medium">{item.duration}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-neutral-600 font-normal whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section>
            <h2 className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Projects</h2>
            <div className="space-y-3">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-semibold text-[12px] text-neutral-900">{proj.title}</h3>
                  <p className="text-[10.5px] text-neutral-600 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-2 gap-8 pt-2">
          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Education</h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-[11.5px] text-neutral-900">{edu.degree}</h3>
                    <div className="text-[10.5px] text-neutral-500">{edu.school}</div>
                    <div className="text-[9.5px] text-neutral-400 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <h2 className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">Capabilities</h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicMinimal;
