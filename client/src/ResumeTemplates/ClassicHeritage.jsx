import React from 'react';

/**
 * Heritage Classic Resume Template
 * Traditional double-framed header box, dark bronze serif headers, ivy league resume style.
 */
const ClassicHeritage = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "BEATRICE W. FAIRFAX",
      email: "b.fairfax@heritage.edu",
      phone: "+1 (555) 876-1234",
      location: "Cambridge, MA",
      linkedin: "linkedin.com/in/beatricefairfax"
    },
    summary: "Senior Historical Researcher & Archivist with 10+ years specializing in manuscript conservation, archival curation, and historical monograph publication.",
    experience: [
      {
        id: 1,
        company: "New England Historical Society",
        position: "Principal Curator & Senior Archivist",
        duration: "2018 - Present",
        description: "Curate rare manuscript collections dating from 17th to 19th centuries. Secured $1.5M in federal conservation grants."
      },
      {
        id: 2,
        company: "Cambridge University Press",
        position: "Associate Editor",
        duration: "2014 - 2018",
        description: "Managed peer-review editorial process for academic journals in early American history."
      }
    ],
    education: [
      {
        id: 1,
        school: "Harvard University",
        degree: "Ph.D. in American History",
        year: "2009 - 2014"
      }
    ],
    skills: ["Archival Conservation", "Rare Manuscript Curation", "Paleography", "Grant Writing", "Academic Editing", "Digital Humanities"],
    projects: [
      {
        id: 1,
        title: "Colonial Correspondence Digitization",
        description: "Directed cross-institutional initiative digitizing 15,000+ historical manuscripts for public research access."
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
        {/* Double Framed Header Box */}
        <header className="border-4 border-double border-amber-950 p-6 text-center mb-6">
          <h1 className="text-3xl font-normal tracking-wider uppercase text-amber-950">{fullName}</h1>
          <p className="text-xs italic text-stone-600 mt-1 font-serif">Historical Researcher & Senior Curator</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 text-[10.5px] font-sans text-stone-600 mt-3 pt-2 border-t border-stone-200">
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Profile */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b-2 border-amber-950/20 pb-1 mb-2">
              Biographical Profile
            </h2>
            <p className="text-[11px] leading-relaxed text-stone-800 font-serif italic whitespace-pre-wrap">{displayData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b-2 border-amber-950/20 pb-1 mb-3">
              {displayData?.isFresher ? 'Academic Internships' : 'Curatorial & Professional Experience'}
            </h2>
            <div className="space-y-4">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-sans">
                    <h3 className="font-bold text-[13px] text-stone-900">{item.company}</h3>
                    <span className="text-[11px] font-medium text-stone-500">{item.duration}</span>
                  </div>
                  <div className="text-[11.5px] font-bold text-amber-950 font-serif mb-1">{item.position}</div>
                  <p className="text-[10.5px] leading-relaxed text-stone-800 font-serif whitespace-pre-wrap">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b-2 border-amber-950/20 pb-1 mb-3">
              Research Initiatives & Publications
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

        {/* Bottom Dual Columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b-2 border-amber-950/20 pb-1 mb-3">
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

          {/* Skills */}
          {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-950 font-sans border-b-2 border-amber-950/20 pb-1 mb-3">
                Specializations
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

export default ClassicHeritage;
