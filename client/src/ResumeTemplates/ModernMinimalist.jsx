import React from 'react';

/**
 * Modern Minimalist Resume Template
 * Ultra clean modern design with generous whitespace, crisp sans-serif hierarchy, 
 * subtle orange left vertical accents, built for digital professionals.
 */
const ModernMinimalist = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "SOPHIE CHEN",
      email: "sophie.chen@minimal.design",
      phone: "+1 (555) 678-1234",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/sophiechen"
    },
    summary: "Senior Product Designer specializing in minimalist mobile user interfaces, micro-interactions, and accessible web design systems.",
    experience: [
      {
        id: 1,
        company: "Minimalist Studio",
        position: "Lead Product Designer",
        duration: "2021 - Present",
        description: "Direct mobile interface design for wellness applications. Standardized design tokens across iOS and Android platforms."
      },
      {
        id: 2,
        company: "Aura Creative Tech",
        position: "UI/UX Specialist",
        duration: "2018 - 2021",
        description: "Conducted qualitative usability testing and created high-fidelity interactive Figma prototypes."
      }
    ],
    education: [
      {
        id: 1,
        school: "Stanford University",
        degree: "B.S. in Design & Human-Computer Interaction",
        year: "2014 - 2018"
      }
    ],
    skills: ["Figma Systems", "UI Architecture", "Design Tokens", "User Research", "Prototyping", "Design Accessibility"],
    projects: [
      {
        id: 1,
        title: "Aura Design Token Library",
        description: "Open-source cross-platform UI system adopted by 20,000+ developers."
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
    <div className="bg-white text-stone-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-12 flex flex-col justify-between text-left">
      <div className="space-y-8">
        {/* Header */}
        <header className="border-b border-stone-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black uppercase">{fullName}</h1>
            <p className="text-xs font-bold tracking-[0.25em] text-orange-500 uppercase mt-1">Product & System Designer</p>
          </div>
          <div className="text-right text-[10px] font-medium text-stone-500 space-y-0.5">
            {personalInfo.email && <div className="font-bold text-black">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Profile */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="pl-4 border-l-2 border-orange-500">
            <h2 className="text-[9.5px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1">Overview</h2>
            <p className="text-[11px] leading-relaxed text-stone-600 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {displayData?.isFresher ? 'Design Internships' : 'Work Experience'}
            </h2>
            <div className="space-y-5 pl-3.5">
              {experienceList.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-black">{item.position}</h3>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-stone-500">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-600 pt-0.5 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid Bottom Row */}
        <div className="grid grid-cols-2 gap-8 pt-2">
          {/* Projects */}
          {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Featured Work
              </h2>
              <div className="space-y-3 pl-3.5">
                {displayData.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-[12px] text-black">{proj.title}</h3>
                    <p className="text-[10.5px] text-stone-600 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills & Education */}
          <div className="space-y-6">
            {/* Skills */}
            {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5 pl-3.5">
                  {displayData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-semibold rounded border border-stone-200/60">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section>
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-black mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Education
                </h2>
                <div className="space-y-2 pl-3.5">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[11.5px] text-black">{edu.degree}</h3>
                      <div className="text-[10.5px] text-stone-500">{edu.school} ({edu.year})</div>
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

export default ModernMinimalist;
