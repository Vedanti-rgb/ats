import React from 'react';

/**
 * Professional Corporate Resume Template
 * Formal corporate structure with centered header, navy block headings, 
 * and authoritative executive styling.
 */
const ProfessionalCorporate = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "MARCUS V. STERLING",
      email: "m.sterling@corporate.com",
      phone: "+1 (555) 456-7890",
      location: "Dallas, TX",
      linkedin: "linkedin.com/in/marcussterling"
    },
    summary: "Senior Corporate Operations Director with proven expertise in global supply chain logistics, financial management, and multi-location team leadership.",
    experience: [
      {
        id: 1,
        company: "Sterling Financial Holdings",
        position: "Chief Operations Officer",
        duration: "2020 - Present",
        description: "Oversee operational strategy across 14 global offices. Increased gross profit margins by 18% through strategic workflow automation and vendor negotiations."
      },
      {
        id: 2,
        company: "Vanguard Global Logistics",
        position: "VP of Enterprise Operations",
        duration: "2016 - 2020",
        description: "Managed a departmental budget of $45M. Led enterprise resource planning (ERP) system deployment impacting 3,000+ employees worldwide."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Texas at Austin",
        degree: "B.B.A. in Finance & Operations",
        year: "2012 - 2016"
      }
    ],
    skills: ["Corporate Governance", "Supply Chain Architecture", "ERP Implementations", "P&L Optimization", "Risk Mitigation", "Executive Communications"],
    projects: [
      {
        id: 1,
        title: "Enterprise ERP System Migration",
        description: "Executed seamless transition to SAP S/4HANA across all regional divisions within scheduled timeframe."
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
        {/* Centered Header */}
        <header className="text-center border-b-2 border-slate-900 pb-6 mb-6">
          <h1 className="text-3xl font-black tracking-wider uppercase text-slate-900 mb-2">{fullName}</h1>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-xs font-semibold text-slate-600">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 mb-3">
              Executive Summary
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 px-1 whitespace-pre-wrap font-medium">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 mb-4">
              {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
            </div>
            <div className="space-y-4 px-1">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline border-b border-slate-100 pb-1 mb-1">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.company}</h3>
                    <span className="text-[10.5px] font-bold text-slate-500">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-blue-900 mb-1.5">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 mb-3">
              Corporate Initiatives & Projects
            </div>
            <div className="space-y-3 px-1">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[12px] text-slate-900">{proj.title}</h3>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Competencies & Education Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 mb-3">
                Core Competencies
              </div>
              <div className="grid grid-cols-1 gap-1 px-1">
                {displayData.skills.map((skill, index) => (
                  <div key={index} className="text-[10.5px] font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-blue-900 font-bold">▪</span> {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 mb-3">
                Education & Credentials
              </div>
              <div className="space-y-3 px-1">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[12px] text-slate-900">{edu.school}</h3>
                    <div className="text-[11px] text-slate-700 font-medium">{edu.degree}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{edu.year}</div>
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

export default ProfessionalCorporate;
