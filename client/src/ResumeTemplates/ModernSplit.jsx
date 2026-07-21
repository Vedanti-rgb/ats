import React from 'react';

/**
 * Modern Split Resume Template
 * High-contrast split layout featuring a dark left column, 
 * bold typography, and sleek modern vertical structural lines.
 */
const ModernSplit = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "DANIEL KIM",
      email: "daniel.kim@tech.io",
      phone: "+1 (555) 432-1098",
      location: "San Jose, CA",
      linkedin: "linkedin.com/in/danielkimtech"
    },
    summary: "Innovative Full Stack Software Engineer specializing in scalable cloud applications, React ecosystem, and GraphQL APIs. Passionate about automated testing and clean architecture.",
    experience: [
      {
        id: 1,
        company: "NextGen Cloud Labs",
        position: "Senior Full Stack Engineer",
        duration: "2021 - Present",
        description: "Architected micro-frontend architecture for multi-tenant SaaS application serving 500k monthly active users. Reduced bundle sizes by 45%."
      },
      {
        id: 2,
        company: "Silicon Software Inc",
        position: "Frontend Developer",
        duration: "2018 - 2021",
        description: "Built responsive web dashboards using Next.js, TypeScript, and TailwindCSS. Integrated real-time WebSocket data feeds."
      }
    ],
    education: [
      {
        id: 1,
        school: "San Jose State University",
        degree: "B.S. in Software Engineering",
        year: "2014 - 2018"
      }
    ],
    skills: ["React & Next.js", "TypeScript", "Node.js & Express", "GraphQL", "AWS Lambda", "Docker & CI/CD", "PostgreSQL", "Jest & Cypress"],
    projects: [
      {
        id: 1,
        title: "Real-time Analytics Dashboard",
        description: "Open-source data visualization tool built with React and D3.js, gaining 1.2k GitHub stars."
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
    <div className="bg-white text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl flex mx-auto origin-top overflow-hidden text-left">
      {/* Dark Split Sidebar (40%) */}
      <aside className="w-[38%] bg-slate-950 text-white p-8 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          {/* Avatar / Name */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-indigo-600/30">
              {fullName.charAt(0)}
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase leading-tight">{fullName}</h1>
            <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mt-1">Full Stack Engineer</p>
          </div>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-slate-800/80">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</h2>
            <div className="space-y-2.5 text-[10px] text-slate-300 font-medium">
              {personalInfo.email && (
                <div>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">Email</span>
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">Phone</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">Location</span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">LinkedIn</span>
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="space-y-3 pt-4 border-t border-slate-800/80">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tech Stack</h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-[9.5px] font-medium text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* Main Content Area (62%) */}
      <main className="flex-1 p-8 flex flex-col justify-between overflow-hidden">
        <div className="space-y-6">
          {/* Summary */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                About Me
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap pl-3.5 border-l-2 border-slate-100">{displayData.summary}</p>
            </section>
          )}

          {/* Experience */}
          {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                {displayData?.isFresher ? 'Internship Experience' : 'Work Experience'}
              </h2>
              <div className="space-y-4 pl-3.5 border-l-2 border-indigo-100">
                {experienceList.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{item.duration}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">{item.company}</div>
                    <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                Featured Projects
              </h2>
              <div className="space-y-3 pl-3.5">
                {displayData.projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-[12px] text-slate-900">{proj.title}</h3>
                    <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                Education
              </h2>
              <div className="space-y-3 pl-3.5">
                {displayData.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-[12px] text-slate-900">{edu.degree}</h3>
                      <div className="text-[11px] text-slate-500">{edu.school}</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{edu.year}</span>
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

export default ModernSplit;
