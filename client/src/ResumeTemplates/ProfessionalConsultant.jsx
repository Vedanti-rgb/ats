import React from 'react';

/**
 * Professional Business Consultant Resume Template
 * Features a sleek top dual-accent banner, key highlights box, 
 * structured multi-column flow, and high-readability corporate typography.
 */
const ProfessionalConsultant = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "SARAH JENNINGS",
      email: "sarah.jennings@consulting.com",
      phone: "+1 (555) 234-5678",
      location: "Chicago, IL",
      linkedin: "linkedin.com/in/sarahjennings"
    },
    summary: "Senior Management Consultant with 9+ years of experience steering digital transformation, operational restructuring, and enterprise strategic growth for Fortune 500 clients.",
    experience: [
      {
        id: 1,
        company: "Apex Strategy Group",
        position: "Principal Engagement Manager",
        duration: "2021 - Present",
        description: "Direct cross-functional consulting engagements for enterprise clients in tech and healthcare. Spearheaded organizational redesign resulting in $12M annual cost savings."
      },
      {
        id: 2,
        company: "Vanguard Partners",
        position: "Senior Business Analyst",
        duration: "2017 - 2021",
        description: "Conducted market entry analysis and financial modeling for M&A transactions exceeding $500M. Authored executive briefs for C-suite stakeholders."
      }
    ],
    education: [
      {
        id: 1,
        school: "Northwestern University (Kellogg)",
        degree: "MBA in Strategic Management",
        year: "2015 - 2017"
      }
    ],
    skills: ["Management Consulting", "M&A Integration", "Financial Modeling", "Change Management", "Stakeholder Relations", "Process Optimization"],
    projects: [
      {
        id: 1,
        title: "Global Supply Chain Optimization",
        description: "Redesigned logistics network for major retail client, improving delivery speed by 30% while decreasing carbon footprint."
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
    <div className="bg-white text-stone-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Accent Bar */}
        <div className="h-3 w-full bg-gradient-to-r from-blue-900 via-indigo-800 to-amber-500" />
        
        {/* Header */}
        <header className="px-10 pt-8 pb-6 border-b border-stone-200 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-blue-950 uppercase">{fullName}</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mt-1">Management Consultant & Strategist</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-stone-600 space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Content Body */}
        <div className="px-10 py-6 space-y-6">
          {/* Executive Summary */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section className="bg-stone-50 p-4 rounded-xl border-l-4 border-blue-900">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 mb-1">Executive Summary</h2>
              <p className="text-[11px] leading-relaxed text-stone-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-12 gap-8">
            {/* Main Column */}
            <div className="col-span-8 space-y-6">
              {/* Experience */}
              {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-900/10 pb-1.5 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
                  </h2>
                  <div className="space-y-4">
                    {experienceList.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-[13px] text-stone-900">{item.position}</h3>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{item.duration}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-blue-900 mb-1.5">{item.company}</div>
                        <p className="text-[10.5px] leading-relaxed text-stone-600 whitespace-pre-wrap">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Key Initiatives / Projects */}
              {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-900/10 pb-1.5 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    Key Projects & Initiatives
                  </h2>
                  <div className="space-y-3">
                    {displayData.projects.map((proj) => (
                      <div key={proj.id} className="border border-stone-100 p-3 rounded-lg bg-white shadow-sm">
                        <h3 className="font-bold text-[12px] text-stone-900">{proj.title}</h3>
                        <p className="text-[10px] text-stone-600 mt-1 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Side Column */}
            <div className="col-span-4 space-y-6">
              {/* Skills */}
              {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-900/10 pb-1 mb-3">
                    Competencies
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    {displayData.skills.map((skill, index) => (
                      <div key={index} className="text-[10px] font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded border border-stone-200/60">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-900/10 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {displayData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-[11.5px] text-stone-900 leading-tight">{edu.degree}</h3>
                        <div className="text-[10.5px] text-stone-600 font-medium mt-0.5">{edu.school}</div>
                        <div className="text-[9.5px] font-bold text-amber-600 mt-0.5">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalConsultant;
