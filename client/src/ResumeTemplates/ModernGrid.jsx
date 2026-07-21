import React from 'react';

/**
 * Modern Grid Resume Template
 * Features a modern hero contact banner card, crisp structural borders, 
 * and side-by-side modular grid blocks for maximum visual efficiency.
 */
const ModernGrid = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ALEXA BENNETT",
      email: "alexa.b@product.com",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/alexabennett"
    },
    summary: "Metrics-driven Senior Product Manager with 8+ years experience guiding cross-functional agile teams from concept to market expansion. Expert in roadmap execution and user analytics.",
    experience: [
      {
        id: 1,
        company: "Apex Product Labs",
        position: "Senior Product Manager",
        duration: "2020 - Present",
        description: "Spearheaded launch of flagship SaaS analytics dashboard, growing ARR by $4.5M in year one. Championed customer discovery user research interviews."
      },
      {
        id: 2,
        company: "Brightwave Tech",
        position: "Associate Product Manager",
        duration: "2017 - 2020",
        description: "Defined user stories and managed sprint backlogs for mobile app feature releases serving 1M+ active users."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Texas at Austin",
        degree: "B.S. in Computer Science",
        year: "2013 - 2017"
      }
    ],
    skills: ["Product Roadmap", "Agile & Scrum", "User Research", "SQL & Amplitude", "A/B Testing", "Feature Prioritization"],
    projects: [
      {
        id: 1,
        title: "AI-Powered Customer Onboarding Flow",
        description: "Redesigned registration funnel utilizing ML personalization, resulting in a 28% increase in conversion rates."
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
    <div className="bg-stone-50 text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Top Hero Contact Card */}
        <header className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">Product Leadership</span>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase mt-2">{fullName}</h1>
          </div>
          <div className="text-right text-[10px] font-medium text-slate-600 space-y-0.5 border-l border-stone-200 pl-6">
            {personalInfo.email && <div className="font-bold text-slate-900">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="text-teal-600 font-bold">{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary Card */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1.5">Executive Summary</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience Section Card */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="border-b border-stone-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid Bottom Row: Skills, Projects, Education */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills & Projects Left Column */}
          <div className="space-y-6">
            {/* Skills */}
            {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
              <section className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Core Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {displayData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-stone-100 text-slate-700 text-[10px] font-semibold rounded-md border border-stone-200/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Education & Projects Right Column */}
          <div className="space-y-6">
            {/* Education */}
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Education
                </h2>
                <div className="space-y-3">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[11.5px] text-slate-900 leading-tight">{edu.degree}</h3>
                      <div className="text-[10.5px] text-slate-500 font-medium">{edu.school}</div>
                      <div className="text-[9.5px] font-bold text-teal-600 mt-0.5">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
              <section className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Key Initiatives
                </h2>
                <div className="space-y-2">
                  {displayData.projects.map((proj) => (
                    <div key={proj.id}>
                      <h3 className="font-bold text-[11.5px] text-slate-900">{proj.title}</h3>
                      <p className="text-[10px] text-slate-600 leading-relaxed whitespace-pre-wrap mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernGrid;
