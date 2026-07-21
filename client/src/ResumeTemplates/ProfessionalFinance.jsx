import React from 'react';

/**
 * Professional Finance Resume Template
 * Deep teal accents, structured financial competencies grid, authoritative corporate hierarchy.
 */
const ProfessionalFinance = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "CHARLES WINTHROP",
      email: "c.winthrop@capital.com",
      phone: "+1 (555) 234-8765",
      location: "New York, NY",
      linkedin: "linkedin.com/in/charleswinthrop"
    },
    summary: "Senior Investment Banking VP with 10+ years executing M&A transactions, debt restructuring, and quantitative financial analysis for global corporate clients.",
    experience: [
      {
        id: 1,
        company: "Wall Street Capital Group",
        position: "Vice President of Investment Banking",
        duration: "2019 - Present",
        description: "Led M&A advisory teams on tech sector transactions valued over $2.5B. Managed financial valuation modeling and due diligence audits."
      },
      {
        id: 2,
        company: "Manhattan Private Equity",
        position: "Senior Financial Associate",
        duration: "2015 - 2019",
        description: "Evaluated LBO investment opportunities and prepared detailed investment committee presentations."
      }
    ],
    education: [
      {
        id: 1,
        school: "Columbia Business School",
        degree: "MBA in Finance",
        year: "2013 - 2015"
      }
    ],
    skills: ["M&A Advisory", "LBO Valuation Modeling", "Capital Markets", "Financial Auditing", "Regulatory Compliance", "Risk Management"],
    projects: [
      {
        id: 1,
        title: "Cross-Border Acquisition Advisory",
        description: "Advised lead buyer on $850M cross-border telecom acquisition framework."
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
    <div className="bg-white text-slate-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="border-b-4 border-teal-900 pb-5 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-teal-950 uppercase">{fullName}</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-teal-700 uppercase mt-1">Investment Banking & Finance VP</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-slate-600 space-y-0.5">
            {personalInfo.email && <div className="font-bold text-teal-950">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6 bg-teal-50/60 p-4 rounded-xl border border-teal-100">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-900 mb-1">Executive Summary</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Core Financial Competencies */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-teal-950 border-b border-teal-200 pb-1 mb-2">
              Financial Competencies
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[10.5px] font-semibold text-slate-800">
              {displayData.skills.map((skill, index) => (
                <div key={index} className="bg-slate-50 p-2 rounded border border-slate-200/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-700 rounded-full" />
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-teal-950 border-b border-teal-200 pb-1 mb-3">
              {displayData?.isFresher ? 'Financial Internships' : 'Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.company}</h3>
                    <span className="text-[10.5px] font-bold text-teal-800">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-teal-900 mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Row: Projects & Education */}
        <div className="grid grid-cols-2 gap-6">
          {/* Projects */}
          {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-teal-950 border-b border-teal-200 pb-1 mb-2.5">
                Key Deals & Initiatives
              </h2>
              <div className="space-y-2">
                {displayData.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-[11.5px] text-slate-900">{proj.title}</h3>
                    <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-teal-950 border-b border-teal-200 pb-1 mb-2.5">
                Education
              </h2>
              <div className="space-y-2">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[11.5px] text-slate-900">{edu.degree}</h3>
                    <div className="text-[10.5px] text-slate-600">{edu.school} ({edu.year})</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFinance;
