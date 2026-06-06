import React from "react";
import { User, GraduationCap, Briefcase, Award, Monitor, Phone, Mail, MapPin } from "lucide-react";

// ==========================================
// DEMO DATA FOR PREVIEW
// ==========================================
const DEMO_DATA = {
  personalInfo: {
    fullName: "ALEXANDER PIERCE",
    name: "ALEXANDER PIERCE",
    email: "alex.pierce@design.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    linkedin: "https://linkedin.com/in/alexpierce",
    title: "Senior UX/UI Designer & Creative Director"
  },
  summary: "Award-winning Creative Director with over 10 years of experience in digital product design. Specialized in creating high-impact visual identities and seamless user experiences for Fortune 500 companies. Passionate about merging aesthetics with functionality.",
  experience: [
    {
      id: 1,
      company: "Stellar Digital Studio",
      position: "Creative Director",
      duration: "2020 - Present",
      location: "New York, NY",
      description: "Overseeing all creative output for a 20-person design team. Spearheaded the redesign of a major fintech app, resulting in a 200% increase in user engagement."
    },
    {
      id: 2,
      company: "Vibrant Media Group",
      position: "Senior UI Designer",
      duration: "2016 - 2020",
      location: "Brooklyn, NY",
      description: "Designed multi-platform design systems that streamlined production across 5 international offices. Led the visual strategy for over 40 successful client launches."
    }
  ],
  education: [
    {
      id: 1,
      school: "Rhode Island School of Design",
      degree: "B.F.A. in Graphic Design",
      year: "2012 - 2016",
      location: "Providence, RI"
    }
  ],
  skills: ["UI/UX Design", "Product Strategy", "Design Systems", "Figma & Adobe CC", "Motion Graphics", "Branding", "Art Direction", "User Research"],
  projects: [
    {
      id: 1,
      title: "Lumina Brand Identity",
      year: "2023",
      description: "A comprehensive rebranding project for a sustainable energy startup, including logo, website, and marketing collateral."
    }
  ],
  enabledSections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true
  }
};

// ==========================================
// VARIANT 1: Ocean Blueprint (Deep Slate & Sky Blue)
// Highly professional, elegant dual-tone creative template
// ==========================================
export const OceanTemplate = ({ data }) => {
  const isDemo = !data?.personalInfo?.fullName && !data?.personalInfo?.name;
  const displayData = isDemo ? DEMO_DATA : data;

  const personalInfo = displayData?.personalInfo || {};
  const summary = personalInfo?.summary || displayData?.summary || "";
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);
  const educationList = displayData?.education || [];
  const skillsList = displayData?.skills || [];
  const projectsList = displayData?.projects || [];

  const nameParts = (personalInfo?.fullName || personalInfo?.name || "Professional Name").split(" ");
  const firstName = nameParts[0] || "Jane";
  const lastName = nameParts.slice(1).join(" ") || "Doe";

  // Safe fixed styling
  const containerStyle = { maxWidth: '850px', minHeight: '1100px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' };

  return (
    <div className="bg-white w-full flex mx-auto overflow-hidden font-sans box-border" style={containerStyle}>

      {/* LEFT COLUMN: Deep Slate with Sky Blue Accents */}
      <div className="w-1/3 bg-slate-900 text-slate-100 flex flex-col items-center pt-16 pb-10 px-8 relative">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        {/* Avatar */}
        <div className="w-40 h-40 rounded-full border-4 border-slate-700 bg-slate-800 p-1 mb-8 shadow-2xl relative z-10 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center border-2 border-sky-400 border-opacity-50">
            <User size={56} className="text-sky-300" strokeWidth={1.5} />
          </div>
        </div>

        {/* Contact Module */}
        <div className="w-full relative z-10 mb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-5 border-b border-slate-700 pb-2">Contact</h3>
          <div className="flex flex-col gap-4 text-sm font-medium">
            {personalInfo?.email && (
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-sky-400"><Mail size={16} /></div>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-sky-400"><Phone size={16} /></div>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-sky-400"><MapPin size={16} /></div>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.linkedin && (
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-sky-400 font-bold text-[10px]">in</div>
                <span className="break-all">{personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Module */}
        {skillsList.length > 0 && (
          <div className="w-full relative z-10 mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-5 border-b border-slate-700 pb-2">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs font-semibold text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education Module */}
        {educationList.length > 0 && (
          <div className="w-full relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-5 border-b border-slate-700 pb-2">Education</h3>
            <div className="flex flex-col gap-5 text-sm">
              {educationList.map((edu, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-700">
                  <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-slate-900"></div>
                  <h4 className="font-bold text-slate-100">{edu.degree || edu.course}</h4>
                  <p className="text-sky-300 font-medium text-xs mt-1">{edu.school || edu.institution}</p>
                  <p className="text-slate-400 text-xs mt-1 italic">{edu.year || edu.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: White with Slate/Sky details */}
      <div className="w-2/3 bg-slate-50 relative">

        {/* Header Ribbon */}
        <div className="bg-slate-100 w-full pt-16 pb-12 px-12 border-b border-slate-200 relative overflow-hidden">
          {/* Subtle Decorative Arch */}
          <div className="absolute -right-16 -top-16 w-64 h-64 border-8 border-sky-100 rounded-full opacity-50"></div>

          <h1 className="text-5xl font-black uppercase tracking-tight text-slate-800 leading-none relative z-10">
            {firstName} <br />
            <span className="text-sky-600">{lastName}</span>
          </h1>
          {personalInfo?.title && (
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-500 relative z-10">
              {personalInfo.title}
            </p>
          )}
        </div>

        <div className="px-12 py-10 flex flex-col gap-10">

          {/* Professional Profile */}
          {summary && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <User size={24} className="text-sky-500" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Profile</h2>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experienceList.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-sky-500" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Experience</h2>
              </div>
              <div className="flex flex-col gap-6">
                {experienceList.map((job, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-slate-800">{job.position || job.title}</h3>
                      <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold">
                        {job.duration || job.year}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-sky-600 mb-3 uppercase tracking-wide">
                      {job.company} {job.location ? `— ${job.location}` : ""}
                    </h4>
                    {job.description && (
                      <ul className="list-disc list-outside ml-4 mt-2 text-sm text-slate-600 font-medium space-y-1.5 marker:text-sky-300">
                        {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                          <li key={i}>{desc.replace(/^- /, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projectsList.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Monitor size={24} className="text-sky-500" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {projectsList.map((proj, i) => (
                  <div key={i} className="border-l-4 border-sky-400 bg-white p-5 rounded-r-xl shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-base font-bold text-slate-800">{proj.title}</h3>
                      <span className="text-xs text-slate-400 font-semibold">{proj.year}</span>
                    </div>
                    {proj.description && (
                      <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

// ==========================================
// VARIANT 2: Emerald Modern (Stone, Emerald & White)
// Bold layout, strong hierarchy, refreshing modern look
// ==========================================
export const EmeraldTemplate = ({ data }) => {
  const isDemo = !data?.personalInfo?.fullName && !data?.personalInfo?.name;
  const displayData = isDemo ? DEMO_DATA : data;

  const personalInfo = displayData?.personalInfo || {};
  const summary = personalInfo?.summary || displayData?.summary || "";
  const experienceList = displayData?.isFresher ? (displayData?.internships || []) : (displayData?.experience || []);
  const educationList = displayData?.education || [];
  const skillsList = displayData?.skills || [];
  const projectsList = displayData?.projects || [];

  const nameParts = (personalInfo?.fullName || personalInfo?.name || "Professional Name").split(" ");
  const firstName = nameParts[0] || "Jane";
  const lastName = nameParts.slice(1).join(" ") || "Doe";

  // Safe fixed styling
  const containerStyle = { maxWidth: '850px', minHeight: '1100px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' };

  return (
    <div className="bg-stone-50 w-full flex flex-col mx-auto font-sans box-border relative overflow-hidden" style={containerStyle}>
      {/* Decorative Emerald Accent Top */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-bl-full -z-10 opacity-20 blur-3xl"></div>

      {/* HEADER: Full width bold header */}
      <div className="w-full bg-stone-900 text-stone-50 py-12 px-14 flex items-center justify-between border-b-8 border-emerald-500">
        <div className="flex-1">
          <h1 className="text-5xl font-black uppercase tracking-tight mb-2">
            {firstName} <span className="text-emerald-400">{lastName}</span>
          </h1>
          <p className="text-sm uppercase tracking-widest font-bold text-stone-400">
            {personalInfo?.title || "Professional Designation"}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-right text-xs font-semibold text-stone-300 border-l border-stone-700 pl-6">
          {personalInfo?.email && <p className="flex justify-end items-center gap-2"><span className="text-emerald-400">EMAIL</span> {personalInfo.email}</p>}
          {personalInfo?.phone && <p className="flex justify-end items-center gap-2"><span className="text-emerald-400">PHONE</span> {personalInfo.phone}</p>}
          {personalInfo?.location && <p className="flex justify-end items-center gap-2"><span className="text-emerald-400">LOCATION</span> {personalInfo.location}</p>}
          {personalInfo?.linkedin && <p className="flex justify-end items-center gap-2"><span className="text-emerald-400">LINKEDIN</span> {personalInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</p>}
        </div>
      </div>

      <div className="flex flex-1 p-10 gap-10 bg-white shadow-xl mx-8 my-8 rounded-2xl relative z-10 border border-stone-200">

        {/* MAIN COLUMN (Experience & Projects) */}
        <div className="flex-1 border-r border-stone-200 pr-10">

          {summary && (
            <div className="mb-8">
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><User size={16} /></span>
                Profile Summary
              </h2>
              <p className="text-sm font-medium text-stone-600 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {experienceList.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><Briefcase size={16} /></span>
                Experience
              </h2>
              <div className="flex flex-col gap-6">
                {experienceList.map((job, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-extrabold text-stone-800">{job.position || job.title}</h3>
                      <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded">{job.duration || job.year}</span>
                    </div>
                    <h4 className="text-sm font-bold text-emerald-600 mb-2 uppercase">{job.company}</h4>
                    {job.description && (
                      <p className="text-sm text-stone-600 font-medium whitespace-pre-wrap leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projectsList.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><Award size={16} /></span>
                Projects
              </h2>
              <div className="flex flex-col gap-4">
                {projectsList.map((proj, i) => (
                  <div key={i} className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h3 className="text-sm font-extrabold text-stone-800 mb-1">{proj.title} <span className="text-xs font-bold text-stone-400 ml-2">{proj.year}</span></h3>
                    {proj.description && (
                      <p className="text-xs text-stone-600 font-medium leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDE COLUMN (Education & Skills) */}
        <div className="w-1/3 flex flex-col gap-8">

          {educationList.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><GraduationCap size={16} /></span>
                Education
              </h2>
              <div className="flex flex-col gap-5">
                {educationList.map((edu, i) => (
                  <div key={i} className="bg-stone-50 p-4 rounded-xl border-l-4 border-emerald-500">
                    <h3 className="text-sm font-bold text-stone-900 leading-tight mb-1">{edu.school || edu.institution}</h3>
                    <p className="text-xs font-bold text-emerald-600 mb-1">{edu.degree || edu.course}</p>
                    <p className="text-xs font-semibold text-stone-400">{edu.year || edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillsList.length > 0 && (
            <div>
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><Monitor size={16} /></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, i) => (
                  <span key={i} className="bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-bold px-3 py-2 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================
const CreativeTemplate = ({ data, variant = 'yellow' }) => {
  // We map the incoming variants to the newly created gorgeous layouts
  if (variant === 'red') {
    return <OceanTemplate data={data} />;
  }
  return <EmeraldTemplate data={data} />;
};

export default CreativeTemplate;
