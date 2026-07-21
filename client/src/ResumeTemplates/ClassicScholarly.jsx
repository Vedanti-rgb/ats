import React from 'react';

/**
 * Scholarly Classic Resume Template
 * Centered academic title, subtle horizontal rules, classic publication and research focus.
 */
const ClassicScholarly = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "DR. JULIAN VANE",
      email: "j.vane@university.edu",
      phone: "+1 (555) 432-8765",
      location: "Princeton, NJ",
      linkedin: "linkedin.com/in/julianvane"
    },
    summary: "Associate Professor & Quantum Computing Researcher with 9+ years directing physics labs, securing NSF grants, and publishing high-impact peer-reviewed papers.",
    experience: [
      {
        id: 1,
        company: "Princeton Department of Physics",
        position: "Associate Professor & Lab Director",
        duration: "2019 - Present",
        description: "Direct quantum optics research facility. Principal Investigator on $3.2M in competitive federal research grants. Mentored 12 doctoral candidates."
      },
      {
        id: 2,
        company: "Institute for Advanced Study",
        position: "Postdoctoral Research Fellow",
        duration: "2015 - 2019",
        description: "Authored 14 peer-reviewed manuscripts published in Physical Review Letters and Nature Physics."
      }
    ],
    education: [
      {
        id: 1,
        school: "Yale University",
        degree: "Ph.D. in Theoretical Physics",
        year: "2010 - 2015"
      }
    ],
    skills: ["Quantum Optics", "Federal Grant Administration", "Peer-Reviewed Publishing", "Computational Physics", "Lab Leadership", "Curriculum Design"],
    projects: [
      {
        id: 1,
        title: "Quantum Entanglement Simulation Engine",
        description: "Developed open-source theoretical physics simulation toolkit adopted by 30+ university research groups worldwide."
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
    <div className="bg-white text-stone-900 font-serif w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-10 flex flex-col justify-between">
      <div>
        {/* Centered Academic Header */}
        <header className="text-center border-b-2 border-stone-800 pb-5 mb-6">
          <h1 className="text-3xl font-normal tracking-wide uppercase text-stone-900 mb-1">{fullName}</h1>
          <p className="text-xs italic text-stone-600 font-serif mb-3">Associate Professor of Physics & Research Scientist</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-[10.5px] font-sans text-stone-600">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>•</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Abstract / Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-2">
              Research Profile & Overview
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-800 font-serif italic whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Academic Appointments */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
              {displayData?.isFresher ? 'Research Internships' : 'Academic Appointments & Research Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-[13px] text-stone-900">{item.company}</h3>
                    <span className="text-[11px] font-medium text-stone-500 italic">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] italic text-stone-800 font-serif mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications & Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
              Publications & Key Deliverables
            </h2>
            <div className="space-y-3">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-[12px] text-stone-900 font-sans">{proj.title}</h3>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif mt-0.5 whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {displayData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-[12px] text-stone-900 font-sans">{edu.school}</h3>
                    <div className="text-[11px] font-serif italic text-stone-700">{edu.degree}</div>
                    <div className="text-[10px] font-sans text-stone-500 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Expertise */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 font-sans border-b border-stone-300 pb-1 mb-3">
                Research Fields
              </h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-serif text-stone-800">
                {displayData.skills.map((skill, index) => (
                  <span key={index}>• {skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicScholarly;
