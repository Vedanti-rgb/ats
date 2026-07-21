import React from 'react';

/**
 * Creative Magazine Resume Template
 * Editorial magazine layout with bold pull-quote summary and modern aesthetic.
 */
const CreativeMagazine = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "JULIAN ROSS",
      email: "julian.ross@editorial.com",
      phone: "+1 (555) 789-2345",
      location: "New York, NY",
      linkedin: "linkedin.com/in/julianrosseditorial"
    },
    summary: "Senior Editor & Culture Journalist with 9+ years directing editorial strategies, authoring long-form feature cover stories, and launching digital publication platforms.",
    experience: [
      {
        id: 1,
        company: "Metropolis Cultural Magazine",
        position: "Senior Features Editor",
        duration: "2020 - Present",
        description: "Direct monthly cultural feature section. Commissioned and edited stories reaching 2M+ digital subscribers monthly."
      },
      {
        id: 2,
        company: "Beacon Media Publishing",
        position: "Staff Writer & Columnist",
        duration: "2016 - 2020",
        description: "Authored weekly columns on digital trends, architecture, and contemporary design movements."
      }
    ],
    education: [
      {
        id: 1,
        school: "Columbia University Graduate School of Journalism",
        degree: "M.S. in Journalism",
        year: "2014 - 2016"
      }
    ],
    skills: ["Editorial Strategy", "Long-Form Journalism", "Content Curation", "Digital Publishing", "Copy Editing", "Interviewing"],
    projects: [
      {
        id: 1,
        title: "Digital Culture Investigative Series",
        description: "Authored 5-part investigative series awarded the National Magazine Feature Award."
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
    <div className="bg-stone-100 text-stone-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Magazine Masthead Header */}
        <header className="border-b-4 border-black pb-6 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 block mb-2">Editorial Portfolio</span>
          <h1 className="text-4xl font-black tracking-tight uppercase text-black font-serif">{fullName}</h1>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-[11px] font-medium text-stone-600 mt-3 pt-3 border-t border-stone-300">
            {personalInfo.email && <span className="font-bold text-black">{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Editorial Pull-Quote Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm relative">
            <span className="text-5xl font-serif text-amber-500 absolute top-2 left-4 opacity-30 leading-none">“</span>
            <p className="text-[12px] leading-relaxed text-stone-800 font-serif italic relative z-10 pl-4 whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Two Column Editorial Body */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-6">
            {/* Experience */}
            {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1.5 mb-4">
                  {displayData?.isFresher ? 'Editorial Internships' : 'Editorial & Writing Experience'}
                </h2>
                <div className="space-y-4">
                  {experienceList.map((item) => (
                    <div key={item.id} className="border-b border-stone-200 pb-3 last:border-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[13px] text-black">{item.position}</h3>
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{item.duration}</span>
                      </div>
                      <div className="text-[11px] font-bold text-amber-800 font-serif mb-1">{item.company}</div>
                      <p className="text-[10.5px] leading-relaxed text-stone-700 font-serif whitespace-pre-wrap">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1.5 mb-3">
                  Featured Publications & Series
                </h2>
                <div className="space-y-3">
                  {displayData.projects.map((proj) => (
                    <div key={proj.id} className="bg-white p-3 rounded-xl border border-stone-200">
                      <h3 className="font-bold text-[12px] text-black">{proj.title}</h3>
                      <p className="text-[10.5px] text-stone-700 font-serif mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
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
                <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-3">
                  Specializations
                </h2>
                <div className="flex flex-col gap-1.5">
                  {displayData.skills.map((skill, index) => (
                    <div key={index} className="text-[10.5px] font-semibold text-stone-800 bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-serif">
                      • {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[11.5px] text-black">{edu.degree}</h3>
                      <div className="text-[10.5px] text-stone-600 font-serif italic mt-0.5">{edu.school}</div>
                      <div className="text-[9.5px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">{edu.year}</div>
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

export default CreativeMagazine;
