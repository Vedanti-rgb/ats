import React from 'react';

/**
 * Creative Color Block Resume Template
 * Distinct vibrant color block sections separating header, profile, 
 * experience, and competencies into an unforgettable visual resume.
 */
const CreativeColorBlock = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "LEO STRATTON",
      email: "leo.s@creative.com",
      phone: "+1 (555) 678-9012",
      location: "Austin, TX",
      linkedin: "linkedin.com/in/leostratton"
    },
    summary: "Dynamic Content Strategist & Creative Producer with 6+ years spearheading viral video campaigns, brand copy architectures, and multi-channel marketing campaigns.",
    experience: [
      {
        id: 1,
        company: "Spectrum Creative Media",
        position: "Senior Creative Producer",
        duration: "2021 - Present",
        description: "Oversee end-to-end video production for tech and lifestyle brands. Campaigns generated 25M+ organic impressions across TikTok and YouTube."
      },
      {
        id: 2,
        company: "Bold Narrative Agency",
        position: "Copywriter & Campaign Strategist",
        duration: "2018 - 2021",
        description: "Crafted brand messaging guidelines and social media copy frameworks for 20+ consumer product launches."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Texas at Austin",
        degree: "B.S. in Advertising & Media",
        year: "2014 - 2018"
      }
    ],
    skills: ["Content Strategy", "Creative Direction", "Video Production", "Copywriting", "Social Media Analytics", "Brand Storytelling"],
    projects: [
      {
        id: 1,
        title: "Viral Eco-Launch Campaign",
        description: "Produced interactive digital campaign generating 100k+ email signups in 14 days."
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
    <div className="bg-stone-900 text-stone-100 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Header Block */}
        <header className="bg-rose-500 text-white p-8 rounded-3xl flex justify-between items-center shadow-lg">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-black/20 px-3 py-1 rounded-full text-rose-100">Creative Producer</span>
            <h1 className="text-3xl font-black tracking-tight uppercase mt-3">{fullName}</h1>
          </div>
          <div className="text-right text-[10.5px] font-bold text-rose-100 space-y-0.5 bg-black/20 p-4 rounded-2xl">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Summary Block */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-amber-400 text-stone-950 p-6 rounded-3xl shadow-md">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 mb-2">Manifesto & Summary</h2>
            <p className="text-[11px] leading-relaxed font-bold whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience Block */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-stone-800 text-stone-100 p-6 rounded-3xl border border-stone-700 shadow-md">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-rose-400 border-b border-stone-700 pb-2 mb-4">
              {displayData?.isFresher ? 'Creative Internships' : 'Production Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="border-b border-stone-700/60 pb-3 last:pb-0 last:border-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-white">{item.position}</h3>
                    <span className="text-[10px] font-black text-amber-400 bg-stone-900 px-2.5 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-bold text-rose-300 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-300 font-normal whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Dual Blocks */}
        <div className="grid grid-cols-2 gap-5">
          {/* Skills Block */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="bg-emerald-500 text-stone-950 p-5 rounded-3xl shadow-md">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-stone-950 mb-3">
                Skillset & Arsenal
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-2.5 py-1 bg-stone-950 text-emerald-300 text-[10px] font-bold rounded-xl">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education & Projects Block */}
          <div className="space-y-5">
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-indigo-600 text-white p-5 rounded-3xl shadow-md">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Education</h2>
                <div className="space-y-2">
                  {displayData.education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-[12px] text-white">{edu.degree}</h3>
                      <div className="text-[10.5px] text-indigo-200">{edu.school} ({edu.year})</div>
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

export default CreativeColorBlock;
