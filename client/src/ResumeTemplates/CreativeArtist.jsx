import React from 'react';

/**
 * Creative Artist Resume Template
 * Coral/amber theme, artistic top banner, expressive typography, designed for art directors and media creators.
 */
const CreativeArtist = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "CHLOE BENNETT",
      email: "chloe@artstudio.com",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles, CA",
      linkedin: "linkedin.com/in/chloebennettart"
    },
    summary: "Senior Art Director & Illustrator with 8+ years executing visual storytelling for global entertainment studios, publishing houses, and advertising agencies.",
    experience: [
      {
        id: 1,
        company: "Starlight Creative Studios",
        position: "Senior Art Director",
        duration: "2020 - Present",
        description: "Direct visual development teams for animated feature projects. Spearheaded concept art pipelines resulting in 3 industry awards."
      },
      {
        id: 2,
        company: "Vibrant Media Labs",
        position: "Concept Artist & Illustrator",
        duration: "2016 - 2020",
        description: "Created keyframe illustrations, character designs, and digital matte paintings for commercial client campaigns."
      }
    ],
    education: [
      {
        id: 1,
        school: "ArtCenter College of Design",
        degree: "B.F.A. in Illustration",
        year: "2012 - 2016"
      }
    ],
    skills: ["Art Direction", "Concept Art", "Digital Illustration", "Photoshop & Procreate", "Visual Storyboarding", "Character Design"],
    projects: [
      {
        id: 1,
        title: "Animated Short Visual Development",
        description: "Created end-to-end visual bible and color script for award-winning independent short film."
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
    <div className="bg-stone-50 text-slate-900 font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between text-left">
      <div className="space-y-6">
        {/* Artistic Coral Header */}
        <header className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-black/20 px-3 py-1 rounded-full text-orange-100">Art & Visual Media</span>
            <h1 className="text-3xl font-black tracking-tight uppercase mt-3">{fullName}</h1>
            <p className="text-xs font-semibold text-orange-100 mt-1">Senior Art Director & Illustrator</p>
          </div>
          <div className="text-right text-[10.5px] font-medium text-orange-100 space-y-1 bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          </div>
        </header>

        {/* Artist Statement */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 mb-2">Artist Statement</h2>
            <p className="text-[11px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              {displayData?.isFresher ? 'Art Internships' : 'Creative Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id} className="relative pl-4 border-l-2 border-orange-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">{item.position}</h3>
                    <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">{item.duration}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 mb-1.5">{item.company}</div>
                  <p className="text-[10.5px] leading-relaxed text-slate-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Dual Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                Creative Toolkit
              </h2>
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-50 text-orange-900 text-[10px] font-bold rounded-full border border-orange-100">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education & Projects */}
          <div className="space-y-6">
            {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
              <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
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

export default CreativeArtist;
