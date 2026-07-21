import React from 'react';

/**
 * Formal Executive Classic Resume Template
 * Crisp monochrome serif typography with bold underline section titles and wide margins.
 */
const ClassicFormal = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ELEANOR V. VANDERBILT",
      email: "eleanor.vanderbilt@formal.com",
      phone: "+1 (555) 543-2109",
      location: "New York, NY",
      linkedin: "linkedin.com/in/eleanorvanderbilt"
    },
    summary: "Distinguished Corporate Governance Officer & Managing Partner with 15+ years overseeing institutional compliance, board relations, and enterprise strategic risk management.",
    experience: [
      {
        id: 1,
        company: "Vanderbilt & Partners Advisory",
        position: "Managing Partner",
        duration: "2018 - Present",
        description: "Advise Fortune 250 boards on corporate governance, SEC regulatory disclosures, and shareholder relations."
      },
      {
        id: 2,
        company: "Empire Financial Group",
        position: "Chief Compliance Officer",
        duration: "2012 - 2018",
        description: "Directed global regulatory compliance division across North American and European markets."
      }
    ],
    education: [
      {
        id: 1,
        school: "Columbia Law School",
        degree: "Juris Doctor (J.D.)",
        year: "2009 - 2012"
      }
    ],
    skills: ["Corporate Governance", "Board Relations", "SEC Compliance", "Risk Mitigation", "Mergers & Acquisitions", "Institutional Advisory"],
    projects: [
      {
        id: 1,
        title: "Enterprise ESG Governance Framework",
        description: "Implemented comprehensive ESG reporting architecture adopted across 20 subsidiary business units."
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
    <div className="bg-white text-black font-serif w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-12 flex flex-col justify-between">
      <div>
        {/* Formal Header */}
        <header className="border-b-2 border-black pb-5 mb-6 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-black mb-2">{fullName}</h1>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-xs font-sans text-stone-700 font-medium">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Executive Profile */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black font-sans border-b border-black pb-1 mb-2">
              EXECUTIVE STATEMENT
            </h2>
            <p className="text-[11px] leading-relaxed text-black font-serif whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black font-sans border-b border-black pb-1 mb-3">
              {displayData?.isFresher ? 'PROFESSIONAL INTERNSHIPS' : 'EXECUTIVE EXPERIENCE'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-[13px] text-black">{item.company}</h3>
                    <span className="text-[11px] font-medium text-stone-600">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-bold italic text-black font-serif mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-black font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-black font-sans border-b border-black pb-1 mb-3">
              SIGNIFICANT MATTERS & INITIATIVES
            </h2>
            <div className="space-y-3">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[12px] text-black font-sans">{proj.title}</h3>
                  <p className="text-[10.5px] leading-relaxed text-black font-serif mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Dual Columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-black font-sans border-b border-black pb-1 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[12px] text-black font-sans">{edu.school}</h3>
                    <div className="text-[11px] font-serif italic text-stone-800">{edu.degree}</div>
                    <div className="text-[10px] font-sans text-stone-600 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Competencies */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-black font-sans border-b border-black pb-1 mb-3">
                CORE COMPETENCIES
              </h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-serif text-black">
                {displayData.skills.map((skill, index) => (
                  <span key={index}>• {skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicFormal;
