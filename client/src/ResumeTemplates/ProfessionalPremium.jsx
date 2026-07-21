import React from 'react';

/**
 * Premium Professional Resume Template
 * Elegant dual-column executive design with dark charcoal sidebar, 
 * rich copper accents, and high-impact visual balance.
 */
const ProfessionalPremium = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ELIZABETH MONROE",
      email: "elizabeth.monroe@executive.com",
      phone: "+1 (555) 789-0123",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/emonroe"
    },
    summary: "Dynamic Chief Technology Officer & VP of Engineering with 12+ years spearheading cloud architecture, AI integration, and high-growth engineering teams.",
    experience: [
      {
        id: 1,
        company: "Monroe Tech Ventures",
        position: "Chief Technology Officer",
        duration: "2020 - Present",
        description: "Scale AI infrastructure supporting 2M+ active daily queries. Managed 40+ principal engineers across 3 continents."
      },
      {
        id: 2,
        company: "Apex Systems Labs",
        position: "VP of Cloud Engineering",
        duration: "2016 - 2020",
        description: "Spearheaded enterprise cloud migration to AWS serverless framework. Reduced operational cost overhead by $3.2M annually."
      }
    ],
    education: [
      {
        id: 1,
        school: "MIT (Massachusetts Institute of Technology)",
        degree: "M.S. in Computer Science & Engineering",
        year: "2012 - 2016"
      }
    ],
    skills: ["Cloud Architecture", "Generative AI Solutions", "Engineering Management", "Kubernetes & DevOps", "Distributed Systems", "Tech Strategy"],
    projects: [
      {
        id: 1,
        title: "Autonomous ML Deployment Pipeline",
        description: "Architected end-to-end continuous model deployment pipeline reducing delivery latency from weeks to minutes."
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
    <div className="bg-white text-stone-800 font-sans w-full aspect-[1/1.4142] shadow-2xl flex mx-auto origin-top overflow-hidden text-left">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Initials & Name */}
          <div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-900 flex items-center justify-center font-black text-2xl mb-4 shadow-lg">
              {fullName.charAt(0)}
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase leading-tight">{fullName}</h1>
            <div className="h-0.5 w-12 bg-amber-500 my-2" />
            <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Executive & Tech Leader</p>
          </div>

          {/* Contact Details */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Contact</h2>
            <div className="space-y-2 text-[10px] text-slate-300 font-medium">
              {personalInfo.email && (
                <div>
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 font-bold">Email</div>
                  <div className="break-all">{personalInfo.email}</div>
                </div>
              )}
              {personalInfo.phone && (
                <div>
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 font-bold">Phone</div>
                  <div>{personalInfo.phone}</div>
                </div>
              )}
              {personalInfo.location && (
                <div>
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 font-bold">Location</div>
                  <div>{personalInfo.location}</div>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <div className="text-[8.5px] uppercase tracking-wider text-slate-500 font-bold">LinkedIn</div>
                  <div className="break-all">{personalInfo.linkedin}</div>
                </div>
              )}
            </div>
          </section>

          {/* Core Competencies */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-slate-800">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Expertise</h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-800 border border-slate-700/80 rounded text-[9.5px] font-medium text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer Accent */}
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          Confidential Portfolio
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-8 flex flex-col justify-between overflow-hidden">
        <div className="space-y-6">
          {/* Executive Profile Summary */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60 relative">
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-amber-500 text-slate-900 text-[8.5px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Executive Profile
              </div>
              <p className="text-[11px] leading-relaxed text-stone-700 font-medium mt-1 whitespace-pre-wrap">{displayData.summary}</p>
            </section>
          )}

          {/* Experience */}
          {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
            <section>
              <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-amber-500/30 pb-1 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900" />
                {displayData?.isFresher ? 'Internships' : 'Professional Leadership'}
              </h2>
              <div className="space-y-4">
                {experienceList.map((item) => (
                  <div key={item.id} className="relative pl-3 border-l-2 border-amber-500/40">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                      <span className="text-[10px] font-bold text-amber-700">{item.duration}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 mb-1">{item.company}</div>
                    <p className="text-[10.5px] leading-relaxed text-stone-600 whitespace-pre-wrap">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
            <section>
              <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-amber-500/30 pb-1 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900" />
                Key Deliverables
              </h2>
              <div className="space-y-3">
                {displayData.projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                    <h3 className="font-bold text-[12px] text-slate-900">{proj.title}</h3>
                    <p className="text-[10.5px] text-stone-600 mt-1 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-amber-500/30 pb-1 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900" />
                Education
              </h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-[12px] text-slate-900">{edu.degree}</h3>
                      <div className="text-[11px] text-stone-600">{edu.school}</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700">{edu.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfessionalPremium;
