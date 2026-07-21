import React from 'react';

/**
 * Elegant Classic Resume Template
 * Timeless elegance featuring burgundy accents, refined double-line header, 
 * classic serif typography, and balanced layout symmetry.
 */
const ClassicElegant = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "VICTORIA MONTGOMERY",
      email: "v.montgomery@lawfirm.com",
      phone: "+1 (555) 654-3210",
      location: "Washington, DC",
      linkedin: "linkedin.com/in/victoriamontgomery"
    },
    summary: "Senior Corporate Attorney & Compliance Officer with 10+ years advising global entities on regulatory compliance, contract negotiation, and corporate governance.",
    experience: [
      {
        id: 1,
        company: "Montgomery & Associates LLP",
        position: "Senior Corporate Counsel",
        duration: "2019 - Present",
        description: "Lead corporate transactions and cross-border regulatory compliance filings. Successfully negotiated multi-year vendor contracts valued in excess of $80M."
      },
      {
        id: 2,
        company: "Capitol Legal Partners",
        position: "Associate Attorney",
        duration: "2014 - 2019",
        description: "Drafted complex commercial agreements and conducted thorough due diligence for corporate acquisitions."
      }
    ],
    education: [
      {
        id: 1,
        school: "Georgetown University Law Center",
        degree: "Juris Doctor (J.D.)",
        year: "2011 - 2014"
      }
    ],
    skills: ["Corporate Law", "Regulatory Compliance", "Contract Negotiation", "Mergers & Acquisitions", "Risk Mitigation", "Intellectual Property"],
    projects: [
      {
        id: 1,
        title: "International Regulatory Compliance Framework",
        description: "Developed comprehensive GDPR & ESG compliance manual adopted by 12 client multinationals."
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
    <div className="bg-white text-stone-900 font-serif w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between">
      <div>
        {/* Double-line Framed Header */}
        <header className="text-center border-t-2 border-b-2 border-amber-950/80 py-4 mb-6">
          <h1 className="text-3xl font-normal tracking-wider uppercase text-amber-950">{fullName}</h1>
          <p className="text-xs italic text-stone-600 mt-1 font-sans tracking-widest uppercase">Corporate Attorney & Compliance Officer</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-[10.5px] font-sans text-stone-600 mt-3 pt-2 border-t border-stone-200">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Executive Profile */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b border-amber-950/20 pb-1 mb-2">
              Professional Profile
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-800 font-serif italic whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b border-amber-950/20 pb-1 mb-3">
              {displayData?.isFresher ? 'Legal Internships' : 'Legal & Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-[13px] text-stone-900">{item.company}</h3>
                    <span className="text-[11px] font-medium text-stone-500">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-amber-900 font-serif mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Case Highlights */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b border-amber-950/20 pb-1 mb-3">
              Representative Matters & Initiatives
            </h2>
            <div className="space-y-3">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[12px] text-stone-900 font-sans">{proj.title}</h3>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Practice Areas */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b border-amber-950/20 pb-1 mb-3">
                Education & Admissions
              </h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[12px] text-stone-900 font-sans">{edu.school}</h3>
                    <div className="text-[11px] font-serif italic text-stone-700">{edu.degree}</div>
                    <div className="text-[10px] font-sans text-stone-500 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Practice Areas */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b border-amber-950/20 pb-1 mb-3">
                Practice Areas
              </h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-serif text-stone-800">
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

export default ClassicElegant;
