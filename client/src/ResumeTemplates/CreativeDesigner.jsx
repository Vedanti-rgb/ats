import React from 'react';

/**
 * Creative Designer Resume Template
 * Vibrant purple/indigo header gradient, pill skill tags, 
 * sleek geometric cards, and dynamic visual hierarchy built for creative roles.
 */
const CreativeDesigner = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "MAYA LIN",
      email: "maya.design@studio.com",
      phone: "+1 (555) 901-2345",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/mayalindesign"
    },
    summary: "Senior Brand & Product Designer with 7+ years craft experience crafting memorable brand identities, interactive digital UI systems, and viral social campaign assets.",
    experience: [
      {
        id: 1,
        company: "Vibrant Studio Co",
        position: "Lead UI/UX Designer",
        duration: "2021 - Present",
        description: "Direct end-to-end visual design systems for fintech and consumer mobile applications. Led redesign increasing user conversion rates by 32%."
      },
      {
        id: 2,
        company: "Pixel & Craft Agency",
        position: "Brand Designer",
        duration: "2018 - 2021",
        description: "Created comprehensive brand identity suites including logo guidelines, typography systems, and marketing collateral for high-growth startups."
      }
    ],
    education: [
      {
        id: 1,
        school: "California College of the Arts (CCA)",
        degree: "B.F.A. in Interaction Design",
        year: "2014 - 2018"
      }
    ],
    skills: ["UI/UX Design", "Figma & Adobe CC", "Design Systems", "Brand Identity", "Motion Graphics", "Wireframing & Prototyping"],
    projects: [
      {
        id: 1,
        title: "Fintech Mobile Design System 2.0",
        description: "Created scalable component library with over 200+ accessible components adopted by 15 enterprise product teams."
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
    <div className="bg-stone-50 text-slate-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Top Header Card */}
        <header className="bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-white p-8 rounded-3xl shadow-lg shadow-purple-900/10 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full text-purple-100">Creative Portfolio</span>
            <h1 className="text-3xl font-black tracking-tight uppercase mt-3">{fullName}</h1>
            <p className="text-xs font-semibold text-purple-200 mt-1">Lead UI/UX & Brand Designer</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-purple-100 space-y-1 bg-black/15 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-700 mb-2">Design Philosophy</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              {displayData?.isFresher ? 'Design Internships' : 'Experience Highlights'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="relative pl-4 border-l-2 border-purple-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-50 text-purple-900 text-[10px] font-bold rounded-full border border-purple-100">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education & Projects */}
          <div className="space-y-6">
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Education
                </h2>
                <div className="space-y-2">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[12px] text-slate-900">{edu.degree}</h3>
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

export default CreativeDesigner;
