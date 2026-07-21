import React from 'react';

/**
 * Modern Tech Resume Template
 * Dark indigo top banner, tech stack pill tags, modern clean columns tailored for software architects.
 */
const ModernTech = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ALEXANDER VAUGHN",
      email: "a.vaughn@cloudarch.io",
      phone: "+1 (555) 987-1234",
      location: "Seattle, WA",
      linkedin: "linkedin.com/in/alexandervaughn"
    },
    summary: "Principal Cloud Architect with 11+ years designing fault-tolerant AWS microservices, Kubernetes orchestration platforms, and multi-tenant SaaS architectures.",
    experience: [
      {
        id: 1,
        company: "Apex Cloud Infrastructure",
        position: "Principal Cloud Architect",
        duration: "2020 - Present",
        description: "Architected multi-region AWS infrastructure supporting 10M+ daily active API requests with 99.99% availability."
      },
      {
        id: 2,
        company: "Seattle Software Labs",
        position: "Senior Systems Engineer",
        duration: "2016 - 2020",
        description: "Led containerization migration of legacy monolith applications to Docker and Kubernetes."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Washington",
        degree: "M.S. in Computer Science",
        year: "2014 - 2016"
      }
    ],
    skills: ["AWS & Cloud Architecture", "Kubernetes & Docker", "Go & Python", "Terraform & IaC", "Microservices & gRPC", "CI/CD Pipelines"],
    projects: [
      {
        id: 1,
        title: "Distributed Service Mesh Architecture",
        description: "Deployed Istio service mesh improving inter-service security encryption and observability."
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
    <div className="bg-white text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden flex flex-col justify-between text-left">
      <div>
        {/* Dark Indigo Banner Header */}
        <header className="bg-indigo-950 text-white p-8 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-indigo-900 px-3 py-1 rounded-full text-indigo-300">Cloud Architecture</span>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase mt-3">{fullName}</h1>
          </div>
          <div className="text-right text-[10.5px] font-medium text-indigo-200 space-y-0.5 border-l border-indigo-800 pl-6">
            {personalInfo.email && <div className="font-bold text-white">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Summary */}
          {displayData?.enabledSections?.summary && displayData?.summary && (
            <section className="bg-indigo-50/50 p-4 rounded-xl border-l-4 border-indigo-900">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 mb-1">Architecture Summary</h2>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
            </section>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
              {/* Experience */}
              {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
                <section>
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-900/10 pb-1.5 mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900" />
                    {displayData?.isFresher ? 'Tech Internships' : 'Engineering Experience'}
                  </h2>
                  <div className="space-y-4">
                    {experienceList.map((item) => (
                      <div key={item.id} className="relative pl-3 border-l-2 border-indigo-200">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full">{item.duration}</span>
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
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-900/10 pb-1.5 mb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900" />
                    Key Architecture Projects
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
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-900/10 pb-1 mb-3">
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {displayData.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-950 border border-indigo-100 rounded text-[9.5px] font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-900/10 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {displayData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-[11.5px] text-slate-900 leading-tight">{edu.degree}</h3>
                        <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">{edu.school}</div>
                        <div className="text-[9.5px] font-bold text-indigo-800 mt-0.5">{edu.year}</div>
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

export default ModernTech;
