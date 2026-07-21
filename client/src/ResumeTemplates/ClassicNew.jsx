import React from 'react';

/**
 * New Classic Resume Template
 * Refined serif typography, elegant left-aligned header, 
 * clean horizontal dividers, and timeless academic/corporate structure.
 */
const ClassicNew = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "Arthur Pendelton",
      email: "a.pendelton@ivy.edu",
      phone: "+1 (555) 321-6547",
      location: "Philadelphia, PA",
      linkedin: "linkedin.com/in/arthurpendelton"
    },
    summary: "Accomplished Financial Analyst and Economic Researcher with 7+ years evaluating equity markets, conducting quantitative risk analysis, and preparing institutional investor reports.",
    experience: [
      {
        id: 1,
        company: "Keystone Wealth Management",
        position: "Senior Financial Analyst",
        duration: "2020 - Present",
        description: "Manage portfolio analytics for $1.2B institutional equity fund. Developed automated DCF valuation models improving research productivity by 35%."
      },
      {
        id: 2,
        company: "Heritage Capital Group",
        position: "Research Associate",
        duration: "2017 - 2020",
        description: "Co-authored quarterly macroeconomic outlook papers. Conducted rigorous regression analysis on fixed-income yield curves."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Pennsylvania (Wharton)",
        degree: "B.S. in Economics & Finance",
        year: "2013 - 2017"
      }
    ],
    skills: ["Financial Modeling", "Equity Valuation", "Python for Finance", "Bloomberg Terminal", "Econometrics", "Asset Allocation"],
    projects: [
      {
        id: 1,
        title: "Quantitative Risk Assessment Engine",
        description: "Created proprietary Monte Carlo simulation model for portfolio downside volatility estimation."
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
        {/* Left-Aligned Elegant Header */}
        <header className="border-b-2 border-stone-800 pb-5 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-normal tracking-tight text-stone-900 font-serif">{fullName}</h1>
            <p className="text-xs italic text-stone-600 mt-1 font-serif">Senior Financial Analyst & Economic Researcher</p>
          </div>
          <div className="text-right text-[10.5px] font-sans text-stone-600 space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-800 italic font-serif whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
              {displayData?.isFresher ? 'Internships' : 'Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-[13px] text-stone-900">{item.company}</h3>
                    <span className="text-[11px] font-medium text-stone-600 italic">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] italic text-stone-700 font-serif mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
              Research & Projects
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

        {/* Education */}
        {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {displayData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline font-sans">
                  <div>
                    <h3 className="font-bold text-[12.5px] text-stone-900">{edu.school}</h3>
                    <div className="text-[11px] font-serif italic text-stone-700">{edu.degree}</div>
                  </div>
                  <span className="text-[11px] font-medium text-stone-600">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-2">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-serif text-stone-800">
              {displayData.skills.map((skill, index) => (
                <span key={index}>• {skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicNew;
