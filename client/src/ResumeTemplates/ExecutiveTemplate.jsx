import React from 'react';

/**
 * Executive Resume Template
 * A premium, sophisticated design for experienced professionals.
 * Features a dynamic sidebar-like header feel, structured grid layouts,
 * and high-contrast typography.
 */
const ExecutiveTemplate = ({ data }) => {
  const isDemo = !data?.personalInfo?.name;

  const displayData = isDemo ? {
    personalInfo: {
      name: "JONATHAN DOE",
      email: "jonathan.doe@example.com",
      phone: "+1 (555) 000-1234",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe"
    },
    summary: "Strategic and innovative Senior Executive with 10+ years of leadership experience. Proven capacity to scale infrastructures, direct cross-functional teams, and drive multimilllion-dollar revenue growth.",
    experience: [
      {
        id: 1,
        company: "Global Tech Innovations",
        position: "Vice President of Engineering",
        duration: "2019 - Present",
        description: "Spearheaded the complete digital transformation of enterprise platforms. Grew engineering organization from 20 to 150+ members. Reduced cloud infrastructure costs by 35% annually."
      },
      {
        id: 2,
        company: "Nexus Enterprises",
        position: "Director of Software Architecture",
        duration: "2015 - 2019",
        description: "Led the migration from monolithic to microservices architecture. Improved system uptime to 99.99%. Deployed advanced data pipelines capable of processing 10TB+ daily."
      }
    ],
    education: [
      {
        id: 1,
        school: "Stanford University",
        degree: "M.S. in Computer Science",
        year: "2013 - 2015"
      }
    ],
    skills: ["Strategic Planning", "Cloud Architecture", "P&L Management", "Agile Leadership", "System Design", "Enterprise Solutions"],
    projects: [
      {
        id: 1,
        title: "Project Phoenix - Core Rewrite",
        description: "Directed a $5M strategic rewrite of the core product suite, resolving technical debt and increasing market share by 20% in the first quarter post-launch."
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

  return (
    <div className="bg-white text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden animate-in-up">
      {/* Header Banner */}
      <header className="bg-slate-900 text-white px-[6%] py-8 flex items-center justify-between">
        <div className="w-2/3">
          <h1 className="text-4xl font-black uppercase tracking-wider text-slate-100">{displayData?.personalInfo?.name}</h1>
          <p className="text-sm font-semibold tracking-widest text-orange-400 mt-1 uppercase">Executive Profile</p>
        </div>
        <div className="w-1/3 text-right text-[10px] space-y-1 font-medium text-slate-300">
          {displayData?.personalInfo?.email && <p>{displayData.personalInfo.email}</p>}
          {displayData?.personalInfo?.phone && <p>{displayData.personalInfo.phone}</p>}
          {displayData?.personalInfo?.location && <p>{displayData.personalInfo.location}</p>}
          {displayData?.personalInfo?.linkedin && <p>{displayData.personalInfo.linkedin}</p>}
        </div>
      </header>

      <div className="px-[6%] py-6">
        {/* Summary Section */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <p className="text-[12px] leading-relaxed font-medium text-slate-600 border-l-4 border-orange-500 pl-4">{displayData.summary}</p>
          </section>
        )}

        <div className="flex gap-8">
          {/* Main Column */}
          <div className="w-2/3">
            {/* Experience Section */}
            {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
              <section className="mb-8">
                <h2 className="text-[13px] font-black uppercase tracking-widest text-slate-800 mb-4 border-b border-slate-200 pb-1">
                  {displayData?.isFresher ? 'Internships' : 'Professional Experience'}
                </h2>
                <div className="space-y-5">
                  {(displayData?.isFresher ? displayData?.internships : displayData?.experience)?.map((entry) => (
                    <div key={entry.id} className="relative pl-4 border-l-2 border-slate-100">
                      <div className="absolute w-2 h-2 rounded-full bg-slate-300 -left-[5px] top-1.5" />
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[14px] text-slate-900">{entry.position}</h3>
                        <span className="text-[10px] font-bold text-orange-500 tracking-wider bg-orange-50 px-2 py-0.5 rounded">{entry.duration}</span>
                      </div>
                      <div className="text-[12px] font-semibold text-slate-500 mb-2">{entry.company}</div>
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-600">{entry.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-[13px] font-black uppercase tracking-widest text-slate-800 mb-4 border-b border-slate-200 pb-1">Key Initiatives & Projects</h2>
                <div className="space-y-4">
                  {displayData.projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <h3 className="font-bold text-[13px] text-slate-900 mb-1">{proj.title}</h3>
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap text-slate-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Side Column */}
          <div className="w-1/3 space-y-8">
            {/* Skills Section */}
            {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
              <section>
                <h2 className="text-[13px] font-black uppercase tracking-widest text-slate-800 mb-4 border-b border-slate-200 pb-1">Core Competencies</h2>
                <div className="flex flex-col gap-2">
                  {displayData.skills.map((skill, index) => (
                    <div key={index} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section>
                <h2 className="text-[13px] font-black uppercase tracking-widest text-slate-800 mb-4 border-b border-slate-200 pb-1">Education</h2>
                <div className="space-y-4">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[12px] text-slate-900">{edu.degree}</h3>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5">{edu.school}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{edu.year}</div>
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

export default ExecutiveTemplate;
