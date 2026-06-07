import React from 'react';
// import useResumeStore from '../store/useResumeStore';

/**
 * A Master Generative Engine that reads AI output JSON and maps it
 * dynamically to Tailwind CSS and Inline Styles.
 */
const AIGeneratedTemplate = ({ data, themeConfig }) => {
  // Use fallback data for preview if none provided
  const isDemo = !data?.personalInfo?.name;

  const displayData = isDemo ? {
    personalInfo: {
      name: "JONATHAN DOE",
      email: "jonathan.doe@example.com",
      phone: "+1 (555) 000-1234",
      location: "San Francisco, CA",
    },
    summary: "Senior Professional specializing in delivering high-impact solutions. Proven track record of leveraging modern frameworks and robust logic to scale operations. Adept at cross-functional leadership.",
    experience: [
      {
        id: 1,
        company: "Global Tech Innovations",
        position: "Senior Manager",
        duration: "2021 - Present",
        description: "Leading the development of flagship platforms. Reduced latency by 40% through strict optimizations."
      },
      {
        id: 2,
        company: "Synergy Solutions",
        position: "Lead Specialist",
        duration: "2018 - 2021",
        description: "Mentored teams of 15+. Delivered 3 major client projects ahead of schedule resulting in $2M revenue."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of California, Berkeley",
        degree: "B.S. in Advanced Sciences",
        year: "2014 - 2018"
      }
    ],
    skills: ["Strategic Planning", "Data Analysis", "Project Management", "Leadership", "Technical Writing", "AWS", "Agile"],
    projects: [
      {
        id: 1,
        title: "Enterprise Overhaul",
        description: "Built a recommendation engine that increased conversion rates by 15% using predictive modeling."
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

  // Provide extreme default fallbacks if AI theme is completely missing
  const activeTheme = themeConfig || {
    primaryColor: '#000000',
    secondaryColor: '#475569',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'font-sans',
    layout: 'single-column',
    borderRadius: 'rounded-none'
  };

  const {
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    fontFamily,
    layout,
    borderRadius
  } = activeTheme;

  // Render logic structured based on grid Layout
  const isSidebarLeft = layout === 'sidebar-left';
  const isSidebarRight = layout === 'sidebar-right';
  // const isSingleCol = layout === 'single-column';
  // Specific components mappings
  const renderHeader = (isSidebar) => (
    <div className={`mb-6 ${isSidebar ? '' : 'text-center border-b pb-4'}`} style={{ borderColor: isSidebar ? 'transparent' : secondaryColor }}>
      <h1 className={`text-3xl font-black uppercase tracking-widest leading-tight ${isSidebar ? 'mb-2' : 'mb-3'}`} style={{ color: isSidebar ? '#ffffff' : primaryColor }}>
        {displayData?.personalInfo?.name}
      </h1>
      <p className={`text-xs font-semibold ${isSidebar ? 'opacity-80' : ''}`} style={{ color: isSidebar ? '#ffffff' : secondaryColor }}>
        {displayData?.personalInfo?.email} <br className={isSidebar ? 'block' : 'hidden'} />
        {!isSidebar && ' | '}
        {displayData?.personalInfo?.phone} <br className={isSidebar ? 'block' : 'hidden'} />
        {!isSidebar && ' | '}
        {displayData?.personalInfo?.location}
      </p>
    </div>
  );

  const renderSectionHeader = (title, overrideColor) => (
    <h2 className={`text-sm font-black uppercase tracking-widest mb-3 border-b-2`} style={{ color: overrideColor || primaryColor, borderBottomColor: overrideColor || secondaryColor }}>
      {title}
    </h2>
  );

  const renderSummary = (overrideColor) => {
    if (!displayData?.enabledSections?.summary || !displayData?.summary) return null;
    return (
      <section className="mb-6">
        {renderSectionHeader('Summary', overrideColor)}
        <p className="text-[11px] leading-relaxed whitespace-pre-wrap font-medium" style={{ color: overrideColor || textColor }}>
          {displayData.summary}
        </p>
      </section>
    );
  };

  const renderExperience = () => {
    if ((!displayData?.isFresher && !displayData?.enabledSections?.experience) && (!displayData?.isFresher && !displayData?.enabledSections?.internships)) return null;
    const items = displayData?.isFresher ? displayData?.internships : displayData?.experience;
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-6">
        {renderSectionHeader(displayData?.isFresher ? 'Internships' : 'Experience')}
        <div className="space-y-4">
          {items.map((entry) => (
            <div key={entry.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-black text-[13px]" style={{ color: textColor }}>{entry.company}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm" style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>{entry.duration}</span>
              </div>
              <div className="text-[12px] font-bold mb-2 uppercase tracking-wide" style={{ color: secondaryColor }}>{entry.position}</div>
              <p className="text-[10px] leading-relaxed whitespace-pre-wrap font-medium" style={{ color: textColor }}>{entry.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = (overrideColor) => {
    if (!displayData?.enabledSections?.education || !displayData?.education?.length) return null;
    return (
      <section className="mb-6">
        {renderSectionHeader('Education', overrideColor)}
        <div className="space-y-3">
          {displayData.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-[12px]" style={{ color: overrideColor || textColor }}>{edu.school}</h3>
                <span className="text-[10px] font-bold opacity-80" style={{ color: overrideColor || primaryColor }}>{edu.year}</span>
              </div>
              <div className="text-[11px] opacity-90 italic" style={{ color: overrideColor || secondaryColor }}>{edu.degree}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = (overrideColor) => {
    if (!displayData?.enabledSections?.skills || !displayData?.skills?.length) return null;
    return (
      <section className="mb-6">
        {renderSectionHeader('Skills', overrideColor)}
        <div className="flex flex-wrap gap-2">
          {displayData.skills.map((skill, index) => (
            <span key={index} className={`text-[10px] font-bold px-2 py-1 ${borderRadius}`} style={{
              backgroundColor: overrideColor ? 'rgba(255,255,255,0.1)' : primaryColor + '15',
              color: overrideColor || primaryColor,
              border: overrideColor ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!displayData?.enabledSections?.projects || !displayData?.projects?.length) return null;
    return (
      <section className="mb-6">
        {renderSectionHeader('Projects')}
        <div className="space-y-3">
          {displayData.projects.map((proj) => (
            <div key={proj.id}>
              <h3 className="font-bold text-[12px] mb-1" style={{ color: textColor }}>{proj.title}</h3>
              <p className="text-[10px] leading-relaxed whitespace-pre-wrap font-medium" style={{ color: secondaryColor }}>{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // FULL LAYOUT RENDERING

  if (isSidebarLeft) {
    return (
      <div className={`w-full h-full min-h-screen grid grid-cols-3 ${fontFamily}`} style={{ backgroundColor: backgroundColor }}>
        <div className="col-span-1 p-8 h-full flex flex-col" style={{ backgroundColor: primaryColor }}>
          {renderHeader(true)}
          {renderSummary('#ffffff')}
          {renderSkills('#ffffff')}
          {renderEducation('#ffffff')}
        </div>
        <div className="col-span-2 p-8 bg-white h-full">
          {renderExperience()}
          {renderProjects()}
        </div>
      </div>
    );
  }

  if (isSidebarRight) {
    return (
      <div className={`w-full h-full min-h-screen grid grid-cols-3 ${fontFamily}`} style={{ backgroundColor: backgroundColor }}>
        <div className="col-span-2 p-8 h-full">
          {renderHeader(false)}
          {renderExperience()}
          {renderProjects()}
        </div>
        <div className="col-span-1 p-8 bg-stone-50 h-full border-l border-black/5" style={{ backgroundColor: secondaryColor + '10' }}>
          {renderSummary(textColor)}
          {renderSkills(textColor)}
          {renderEducation(textColor)}
        </div>
      </div>
    );
  }

  // DEFAULT: Single Column (Classic/Modern Hybrid depending on AI CSS)
  return (
    <div className={`w-full h-full min-h-screen p-10 ${fontFamily}`} style={{ backgroundColor: backgroundColor }}>
      {renderHeader(false)}
      {renderSummary()}
      {renderExperience()}
      {renderProjects()}
      {renderEducation()}
      {renderSkills()}
    </div>
  );
};

export default AIGeneratedTemplate;
