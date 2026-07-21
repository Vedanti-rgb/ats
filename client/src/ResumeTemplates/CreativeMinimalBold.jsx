import React from 'react';

/**
 * Bold Creative Resume Template
 * High-impact dark theme aesthetics, bold neon pink/violet accents, geometric borders.
 */
const CreativeMinimalBold = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ZAKARY STORM",
      email: "zakary@motion.design",
      phone: "+1 (555) 890-1234",
      location: "Brooklyn, NY",
      linkedin: "linkedin.com/in/zakarystorm"
    },
    summary: "Lead Motion Designer & 3D Visual Artist specializing in immersive brand campaigns, concert visual staging, and interactive web experiences.",
    experience: [
      {
        id: 1,
        company: "Neon Lab Studios",
        position: "Lead Motion Designer",
        duration: "2021 - Present",
        description: "Direct 3D motion design and visual effects for international music tours and global brand launch events. Created 3D assets generating 15M+ views."
      },
      {
        id: 2,
        company: "Cybernetic Creative",
        position: "3D Generalist & Animator",
        duration: "2018 - 2021",
        description: "Built procedural 3D animations using Cinema4D, Houdini, and Unreal Engine."
      }
    ],
    education: [
      {
        id: 1,
        school: "School of Visual Arts (SVA)",
        degree: "B.F.A. in Computer Art & VFX",
        year: "2014 - 2018"
      }
    ],
    skills: ["3D Motion Design", "Cinema 4D & Octane", "Unreal Engine 5", "After Effects", "Procedural Animation", "VFX Staging"],
    projects: [
      {
        id: 1,
        title: "Immersive Stage Visual Concert Tour",
        description: "Designed 4K real-time generative stage visuals for arena concert tour."
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
    <div className="bg-stone-950 text-white font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Bold Neon Header */}
        <header className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-violet-600 p-8 rounded-3xl text-white shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-black/30 px-3 py-1 rounded-full text-pink-200">3D & Motion Artist</span>
            <h1 className="text-3xl font-black tracking-tight uppercase mt-3">{fullName}</h1>
          </div>
          <div className="text-right text-[10.5px] font-bold text-pink-100 space-y-0.5 bg-black/30 p-4 rounded-2xl">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Profile Card */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-md">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-400 mb-2">Creative Vision</h2>
            <p className="text-[11px] leading-relaxed text-stone-300 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience Card */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-md">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-fuchsia-400 border-b border-stone-800 pb-2 mb-4">
              {displayData?.isFresher ? 'Creative Internships' : 'Motion & VFX Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="border-b border-stone-800/80 pb-3 last:pb-0 last:border-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-white">{item.position}</h3>
                    <span className="text-[10px] font-black text-fuchsia-300 bg-stone-950 px-2.5 py-0.5 rounded-full border border-fuchsia-900/50">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-bold text-pink-400 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-300 font-normal whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Grid Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-md">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400 mb-3">
                Software & Arsenal
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2.5 py-1 bg-stone-950 text-pink-300 text-[10px] font-bold rounded-xl border border-stone-800">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education & Projects */}
          <div className="space-y-5">
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-md">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400 mb-2">Education</h2>
                <div className="space-y-2">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[12px] text-white">{edu.degree}</h3>
                      <div className="text-[10.5px] text-stone-400">{edu.school} ({edu.year})</div>
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

export default CreativeMinimalBold;
