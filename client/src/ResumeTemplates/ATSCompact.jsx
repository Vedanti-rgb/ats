import React from 'react';

/**
 * Compact ATS Resume Template
 * Engineered for maximum data density, 100% machine-readable text flow, 
 * tight standard margins, and clear section hierarchy designed for ATS scanners like Workday & Taleo.
 */
const ATSCompact = ({ data }) => {
  const isDemo = !data?.personalInfo?.name && !data?.personalInfo?.fullName;

  const displayData = isDemo ? {
    personalInfo: {
      name: "ROBERT H. CHEN",
      email: "robert.chen@email.com",
      phone: "(555) 019-2834",
      location: "San Jose, CA",
      linkedin: "linkedin.com/in/robertchen"
    },
    summary: "Systems Engineer with 8+ years experience designing high-availability enterprise networks, managing Linux server clusters, and automating cloud security protocols.",
    experience: [
      {
        id: 1,
        company: "Enterprise Network Systems Inc.",
        position: "Senior Infrastructure Engineer",
        duration: "2020 - Present",
        description: "Administer 500+ RHEL servers across global datacenters. Configured BGP routing protocols and Cisco ASA firewalls, maintaining 99.999% uptime SLA."
      },
      {
        id: 2,
        company: "DataCloud Solutions LLC",
        position: "Network Administrator",
        duration: "2016 - 2020",
        description: "Deployed VMware vSphere virtualization clusters. Managed DNS, DHCP, Active Directory, and automated bash deployment scripts."
      }
    ],
    education: [
      {
        id: 1,
        school: "San Jose State University",
        degree: "Bachelor of Science in Computer Engineering",
        year: "2012 - 2016"
      }
    ],
    skills: ["Linux (RHEL, Ubuntu)", "Cisco Networking (CCNP)", "VMware vSphere", "Python & Bash", "AWS Cloud Architecture", "Network Security & Firewalls"],
    projects: [
      {
        id: 1,
        title: "Zero-Trust Network Security Implementation",
        description: "Architected identity-aware proxy network architecture across all corporate endpoints."
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
  const fullName = personalInfo?.name || personalInfo?.fullName || "FIRST LAST";
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);

  return (
    <div className="bg-white text-black font-sans w-full aspect-[1/1.4142] shadow-2xl origin-top mx-auto overflow-hidden p-8 flex flex-col justify-between text-left leading-normal">
      <div>
        {/* Strict ATS Plain Header */}
        <header className="text-center border-b border-black pb-3 mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wide mb-1">{fullName}</h1>
          <div className="text-[11px] font-normal text-black flex flex-wrap justify-center gap-x-2">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.location && personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>|</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.linkedin && <span>|</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
        </header>

        {/* Summary */}
        {displayData?.enabledSections?.summary && displayData?.summary && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Professional Summary</h2>
            <p className="text-[10.5px] leading-snug whitespace-pre-wrap text-black">{displayData.summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        {displayData?.enabledSections?.skills && displayData?.skills?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Technical Skills</h2>
            <p className="text-[10.5px] leading-snug text-black">
              <span className="font-bold">Core Competencies: </span>
              {displayData.skills.join(", ")}
            </p>
          </section>
        )}

        {/* Experience */}
        {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wider">
              {displayData?.isFresher ? 'Internship Experience' : 'Professional Experience'}
            </h2>
            <div className="space-y-3">
              {experienceList.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline font-bold text-[11px]">
                    <span>{item.company}</span>
                    <span>{item.duration}</span>
                  </div>
                  <div className="text-[10.5px] font-semibold italic mb-1">{item.position}</div>
                  <p className="text-[10px] leading-relaxed whitespace-pre-wrap text-black">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Technical Projects</h2>
            <div className="space-y-2">
              {displayData.projects.map((proj) => (
                <div key={proj.id}>
                  <span className="text-[10.5px] font-bold">{proj.title}: </span>
                  <span className="text-[10px] leading-snug whitespace-pre-wrap">{proj.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-1.5 tracking-wider">Education</h2>
            <div className="space-y-2">
              {displayData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-[10.5px]">
                  <div>
                    <span className="font-bold">{edu.school}</span> – <span className="italic">{edu.degree}</span>
                  </div>
                  <span className="font-medium">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ATSCompact;
