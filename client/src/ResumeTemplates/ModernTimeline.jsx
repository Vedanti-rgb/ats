import React from 'react';

/**
 * Modern Timeline Resume Template
 * Features a dynamic timeline axis on the left side connecting 
 * professional experience nodes, paired with clean modern typography.
 */
const ModernTimeline = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "LIAM Vance",
      email: "liam.vance@devops.com",
      phone: "+1 (555) 789-4561",
      location: "Denver, CO",
      linkedin: "linkedin.com/in/liamvance"
    },
    summary: "Senior DevOps & Infrastructure Engineer with 8+ years automating cloud environments, orchestrating Kubernetes clusters, and strengthening CI/CD pipelines.",
    experience: [
      {
        id: 1,
        company: "CloudScale Technologies",
        position: "Lead Infrastructure Architect",
        duration: "2021 - Present",
        description: "Architected multi-region AWS EKS Kubernetes infrastructure. Reduced deployment downtime to zero through rolling blue-green deployments."
      },
      {
        id: 2,
        company: "Summit Systems",
        position: "Senior DevOps Engineer",
        duration: "2018 - 2021",
        description: "Automated infrastructure provisioning using Terraform and Ansible. Streamlined build times by 60% across 20+ microservices."
      }
    ],
    education: [
      {
        id: 1,
        school: "Colorado State University",
        degree: "B.S. in Computer Information Systems",
        year: "2014 - 2018"
      }
    ],
    skills: ["Kubernetes & Docker", "AWS & Terraform", "CI/CD (GitHub Actions)", "Python & Bash Scripting", "Prometheus & Grafana", "Security & Compliance"],
    projects: [
      {
        id: 1,
        title: "Automated Infrastructure Recovery Framework",
        description: "Built disaster recovery failover automation reducing recovery time objective (RTO) from 4 hours to under 3 minutes."
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
    <div className="bg-white text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between">
      <div>
        {/* Modern Header Banner */}
        <header className="border-b-2 border-cyan-600 pb-6 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">{fullName}</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mt-1">DevOps & Infrastructure Architect</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-slate-600 space-y-0.5">
            {personalInfo.email && <div className="font-semibold text-slate-900">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 mb-2">System Profile</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Timeline Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-4">
              {displayData?.isFresher ? 'Internship Timeline' : 'Career Timeline'}
            </h2>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-600/30">
              {experienceList.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline Node Bullet */}
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white border-2 border-cyan-600 shadow-sm" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Dual Columns */}
        <div className="grid grid-cols-2 gap-8 pt-2">
          {/* Projects */}
          {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-3">
                Key Deliverables
              </h2>
              <div className="space-y-3">
                {displayData.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-[12px] text-slate-900">{proj.title}</h3>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills & Education */}
          <div className="space-y-5">
            {/* Skills */}
            {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-2.5">
                  Technical Stack
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {displayData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2 mb-2.5">
                  Education
                </h2>
                <div className="space-y-2">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[11.5px] text-slate-900">{edu.degree}</h3>
                      <div className="text-[10.5px] text-slate-500">{edu.school} ({edu.year})</div>
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

export default ModernTimeline;
