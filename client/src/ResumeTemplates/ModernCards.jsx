import React from 'react';

/**
 * Modern Cards Resume Template
 * Features soft modular card containers separating header, experience, 
 * skills, and projects into a contemporary app-like aesthetic.
 */
const ModernCards = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ETHAN T. RAMIREZ",
      email: "ethan.r@producttech.com",
      phone: "+1 (555) 321-9876",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/ethanramirez"
    },
    summary: "Senior Technical Product Manager leading cross-functional teams in building machine-learning powered SaaS tools and high-concurrency cloud infrastructure.",
    experience: [
      {
        id: 1,
        company: "Nexus AI Systems",
        position: "Senior Technical Product Manager",
        duration: "2021 - Present",
        description: "Direct enterprise AI product roadmap. Increased monthly active user engagement by 40% through automated workflow triggers."
      },
      {
        id: 2,
        company: "CloudCore Labs",
        position: "Product Owner",
        duration: "2018 - 2021",
        description: "Managed sprint backlogs and API integration deliverables for developer platform tools."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Texas at Austin",
        degree: "B.S. in Computer Science",
        year: "2014 - 2018"
      }
    ],
    skills: ["Product Roadmap", "AI Integration", "Agile & Scrum", "API Architecture", "SQL & Analytics", "Stakeholder Alignment"],
    projects: [
      {
        id: 1,
        title: "Automated ML Workflow Engine",
        description: "SaaS platform feature enabling zero-code machine learning pipeline orchestration."
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
    <div className="bg-slate-100 text-slate-800 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between text-left">
      <div className="space-y-5">
        {/* Header Card */}
        <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Product Leadership</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase mt-2">{fullName}</h1>
          </div>
          <div className="text-right text-[10px] font-medium text-slate-600 space-y-0.5 border-l border-slate-200 pl-6">
            {personalInfo.email && <div className="font-bold text-slate-900">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="text-blue-600 font-bold">{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary Card */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1.5">Executive Profile</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience Card */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid Bottom Cards */}
        <div className="grid grid-cols-2 gap-5">
          {/* Skills Card */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md border border-slate-200/80">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education & Projects Card */}
          <div className="space-y-5">
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Education
                </h2>
                <div className="space-y-2">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[11.5px] text-slate-900">{edu.degree}</h3>
                      <div className="text-[10.5px] text-slate-500 font-medium">{edu.school} ({edu.year})</div>
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

export default ModernCards;
