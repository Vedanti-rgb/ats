import React from 'react';

/**
 * ATS Executive Resume Template
 * Authoritative single-column executive structure optimized for enterprise ATS scanners.
 * Uses strict standard formatting, clear section breaks, and bold caps headers.
 */
const ATSExecutive = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "DAVID K. HARRISON",
      email: "david.harrison@exec.com",
      phone: "+1 (555) 901-4567",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/davidkharrison"
    },
    summary: "Senior Vice President of Global Supply Chain & Operations with 15+ years guiding Fortune 500 manufacturing logistics, vendor negotiations, and P&L optimization.",
    experience: [
      {
        id: 1,
        company: "Global Manufacturing Corp",
        position: "Senior Vice President of Operations",
        duration: "2019 - Present",
        description: "Direct global supply chain operations across 20 facilities in North America and Asia. Managed annual operating budget of $120M and team of 450+ employees."
      },
      {
        id: 2,
        company: "Apex Industrial Logistics",
        position: "Vice President of Supply Chain",
        duration: "2014 - 2019",
        description: "Restructured regional distribution network reducing freight delivery costs by 22% while improving order accuracy to 99.8%."
      }
    ],
    education: [
      {
        id: 1,
        school: "Northwestern University",
        degree: "Master of Business Administration (MBA)",
        year: "2012 - 2014"
      }
    ],
    skills: ["Global Supply Chain Management", "P&L Management & Budgeting", "Strategic Vendor Negotiations", "Operations Restructuring", "Lean Six Sigma", "ERP & SAP S/4HANA"],
    projects: [
      {
        id: 1,
        title: "Global SAP ERP Deployment",
        description: "Led cross-functional leadership team executing multi-country ERP system integration on time and $2M under budget."
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
    <div className="bg-white text-black font-serif w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between text-left">
      <div>
        {/* ATS Plain Executive Header */}
        <header className="border-b-2 border-black pb-4 mb-5">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1">{fullName}</h1>
          <div className="text-[11px] font-sans text-black flex flex-wrap gap-x-3 font-medium">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Executive Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold font-sans uppercase border-b border-black pb-0.5 mb-2 tracking-wider">EXECUTIVE PROFILE</h2>
            <p className="text-[11px] leading-relaxed font-serif whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Core Competencies */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold font-sans uppercase border-b border-black pb-0.5 mb-2 tracking-wider">CORE COMPETENCIES</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-serif">
              {displayData.skills.map((skill, index) => (
                <span key={index}>• {skill}</span>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold font-sans uppercase border-b border-black pb-0.5 mb-3 tracking-wider">
              {displayData?.isFresher ? 'INTERNSHIP EXPERIENCE' : 'PROFESSIONAL EXPERIENCE'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans font-bold text-[12px]">
                    <span>{item.company}</span>
                    <span className="font-normal">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-serif font-bold italic mb-1.5">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Initiatives / Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold font-sans uppercase border-b border-black pb-0.5 mb-2 tracking-wider">KEY INITIATIVES & PROJECTS</h2>
            <div className="space-y-3">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[11.5px] font-sans">{proj.title}</h3>
                  <p className="text-[10.5px] leading-relaxed font-serif mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold font-sans uppercase border-b border-black pb-0.5 mb-2 tracking-wider">EDUCATION</h2>
            <div className="space-y-2">
              {displayData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline font-sans text-[11px]">
                  <div>
                    <span className="font-bold">{edu.school}</span> – <span className="italic">{edu.degree}</span>
                  </div>
                  <span>{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ATSExecutive;
