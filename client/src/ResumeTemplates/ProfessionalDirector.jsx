import React from 'react';

/**
 * Professional Director Resume Template
 * Charcoal header band, metric highlight ribbon, bold corporate hierarchy, 
 * built for senior directors and department leaders.
 */
const ProfessionalDirector = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "RICHARD E. STERLING",
      email: "richard.sterling@director.com",
      phone: "+1 (555) 345-9876",
      location: "Atlanta, GA",
      linkedin: "linkedin.com/in/rsterling"
    },
    summary: "Senior Director of Global Operations with 12+ years directing multi-site logistics, driving P&L profitability, and deploying enterprise ERP infrastructures.",
    experience: [
      {
        id: 1,
        company: "Apex Global Logistics",
        position: "Senior Director of Operations",
        duration: "2020 - Present",
        description: "Direct 350+ personnel across 8 distribution centers. Increased operational efficiency by 24% and reduced overhead expenses by $5.4M."
      },
      {
        id: 2,
        company: "Vanguard Supply Chain Inc",
        position: "Regional Operations Director",
        duration: "2015 - 2020",
        description: "Spearheaded regional facility consolidation and implemented lean Six Sigma continuous improvement programs."
      }
    ],
    education: [
      {
        id: 1,
        school: "Emory University (Goizueta)",
        degree: "Executive MBA",
        year: "2013 - 2015"
      }
    ],
    skills: ["Operations Leadership", "P&L Optimization", "Supply Chain Architecture", "Lean Six Sigma", "ERP Implementations", "Change Management"],
    projects: [
      {
        id: 1,
        title: "Enterprise Logistics Automation",
        description: "Led $10M facility automation initiative improving package throughput by 40%."
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
        {/* Charcoal Header Banner */}
        <header className="bg-slate-900 text-white p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{fullName}</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase mt-1">Senior Operations Director</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-slate-300 space-y-0.5 border-l border-slate-700 pl-6">
            {personalInfo.email && <div className="text-white font-bold">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Highlights Banner */}
        <div className="bg-amber-500 text-slate-950 px-8 py-2.5 flex justify-between items-center text-[10.5px] font-black uppercase tracking-wider">
          <span>P&L Management</span>
          <span>•</span>
          <span>Global Logistics</span>
          <span>•</span>
          <span>Enterprise ERP</span>
          <span>•</span>
          <span>Team Leadership</span>
        </div>

        <div className="p-8 space-y-6">
          {/* Executive Profile */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section className="bg-slate-50 p-4 rounded-xl border-l-4 border-slate-900">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-1">Director Summary</h2>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
            </section>
          )}

          {/* Main Content & Sidebar Grid */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
              {/* Experience */}
              {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                    {displayData?.isFresher ? 'Director Internships' : 'Leadership Experience'}
                  </h2>
                  <div className="space-y-4">
                    {experienceList.map((item) => (
                      <div key={item.id} className="relative pl-3 border-l-2 border-slate-200">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">{item.duration}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 mb-1">{item.company}</div>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1.5 mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                    Key Initiatives
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
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">
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
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {displayData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-[11.5px] text-slate-900 leading-tight">{edu.degree}</h3>
                        <div className="text-[10.5px] text-slate-600 font-medium mt-0.5">{edu.school}</div>
                        <div className="text-[9.5px] font-bold text-amber-700 mt-0.5">{edu.year}</div>
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

export default ProfessionalDirector;
