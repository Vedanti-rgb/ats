import React from 'react';

/**
 * Professional Global Leader Resume Template
 * Deep navy top banner, cross-border initiative focus, structured corporate layout.
 */
const ProfessionalGlobal = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "SOPHIA MARTINEZ",
      email: "s.martinez@globalexec.com",
      phone: "+1 (555) 789-0123",
      location: "Miami, FL",
      linkedin: "linkedin.com/in/sophiamartinezexec"
    },
    summary: "Global Managing Director with 14+ years experience expanding multinational tech enterprises across LATAM, EMEA, and North America. Proven record driving multi-million dollar revenue pipelines.",
    experience: [
      {
        id: 1,
        company: "Global Growth Enterprise",
        position: "Managing Director - International",
        duration: "2019 - Present",
        description: "Direct international market expansion initiatives generating $45M in new ARR. Oversaw regional offices in London, Sao Paulo, and Miami."
      },
      {
        id: 2,
        company: "Americas Tech Group",
        position: "VP of Business Development",
        duration: "2014 - 2019",
        description: "Negotiated strategic distribution partnerships across 12 countries in Latin America."
      }
    ],
    education: [
      {
        id: 1,
        school: "Georgetown University (McDonough)",
        degree: "B.S. in International Business",
        year: "2010 - 2014"
      }
    ],
    skills: ["International Expansion", "Cross-Border Partnerships", "Revenue Growth Strategy", "Multi-Cultural Leadership", "Joint Ventures", "P&L Accountability"],
    projects: [
      {
        id: 1,
        title: "LATAM Market Penetration Program",
        description: "Established local subsidiary operations achieving break-even within 8 months of launch."
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
    <div className="bg-white text-slate-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden flex flex-col justify-between">
      <div>
        {/* Deep Navy Header Banner */}
        <header className="bg-blue-950 text-white p-8 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-blue-900 px-3 py-1 rounded-full text-blue-200">Global Executive</span>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase mt-2">{fullName}</h1>
          </div>
          <div className="text-right text-[10.5px] font-medium text-blue-100 space-y-0.5 border-l border-blue-800 pl-6">
            {personalInfo.email && <div className="font-bold text-white">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Summary */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section className="bg-blue-50/50 p-4 rounded-xl border-l-4 border-blue-950">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-950 mb-1">Executive Profile</h2>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
            </section>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
              {/* Experience */}
              {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-950/10 pb-1.5 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-950" />
                    {displayData?.isFresher ? 'Executive Internships' : 'Professional Leadership'}
                  </h2>
                  <div className="space-y-4">
                    {experienceList.map((item) => (
                      <div key={item.id} className="relative pl-3 border-l-2 border-blue-900/20">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                          <span className="text-[10px] font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded">{item.duration}</span>
                        </div>
                        <div className="text-[11px] font-bold text-blue-900 mb-1">{item.company}</div>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-950/10 pb-1.5 mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-950" />
                    Global Initiatives
                  </h2>
                  <div className="space-y-3">
                    {displayData.projects.map((proj) => (
                      <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                        <h3 className="font-bold text-[12px] text-slate-900">{proj.title}</h3>
                        <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-span-4 space-y-6">
              {/* Skills */}
              {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-950/10 pb-1 mb-3">
                    Core Competencies
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    {displayData.skills.map((skill, index) => (
                      <div key={index} className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-blue-950 border-b-2 border-blue-950/10 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {displayData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-[11.5px] text-slate-900 leading-tight">{edu.degree}</h3>
                        <div className="text-[10.5px] text-slate-600 font-medium mt-0.5">{edu.school}</div>
                        <div className="text-[9.5px] font-bold text-blue-900 mt-0.5">{edu.year}</div>
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

export default ProfessionalGlobal;
