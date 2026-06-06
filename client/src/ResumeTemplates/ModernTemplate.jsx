import React from 'react';

/**
 * Modern ATS-Friendly Resume Template
 * Two-column layout with a sleek professional look.
 */
const ModernTemplate = ({ data }) => {
    // If no data is provided or sections are empty, use demo content
    const isDemo = !data?.personalInfo?.name;

    const displayData = isDemo ? {
        personalInfo: {
            name: "ALEXANDER RIVERA",
            email: "alexander.r@example.com",
            phone: "+1 (555) 987-6543",
            location: "New York, NY",
        },
        summary: "Senior UX/UI Designer with a passion for creating intuitive and aesthetically pleasing digital experiences. 6+ years of expertise in user research, wireframing, and high-fidelity prototyping. Expert in translating complex requirements into simple, user-centric solutions.",
        experience: [
            {
                id: 1,
                company: "Creative Pulse Studio",
                position: "Senior Product Designer",
                duration: "2020 - Present",
                description: "Leading the design for mobile-first financial apps. Facilitated weekly design sprints and user testing sessions, resulting in a 25% increase in user retention. Standardized the design system across all product lines."
            },
            {
                id: 2,
                company: "Vibrant Tech",
                position: "Visual Designer",
                duration: "2017 - 2020",
                description: "Created marketing assets and web interfaces for enterprise clients. Collaborated closely with developers to ensure pixel-perfect implementation of designs using CSS and React components."
            }
        ],
        education: [
            {
                id: 1,
                school: "Rhode Island School of Design",
                degree: "B.F.A. in Graphic Design",
                year: "2013 - 2017"
            }
        ],
        skills: ["Figma & Adobe XD", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "React Native", "Interaction Design", "Branding"],
        projects: [
            {
                id: 1,
                title: "EcoTrack Mobile App",
                description: "End-to-end design of a sustainability tracking app. Reached 50k+ downloads within the first 3 months of launch."
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

    return (
        <div className="bg-white text-stone-800 font-sans w-full aspect-[1/1.4142] shadow-2xl flex mx-auto origin-top overflow-hidden text-left">
            {/* Sidebar - Left Column */}
            <aside className="w-1/3 p-8 border-r flex flex-col gap-8" style={{ backgroundColor: '#fafaf9', borderColor: '#f5f5f4' }}>
                <div className="flex flex-col gap-2">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#ea580c' }}>
                        {displayData?.personalInfo?.name?.charAt(0) || 'U'}
                    </div>
                    <h1 className="text-lg font-bold leading-tight mt-2">{displayData?.personalInfo?.name || 'Your Name'}</h1>
                    <p className="text-[9px] font-semibold uppercase tracking-widest leading-none" style={{ color: '#a8a29e' }}>Professional Profile</p>
                </div>

                <section className="flex flex-col gap-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#ea580c' }}>Contact</h2>
                    <div className="flex flex-col gap-2 text-[10px]">
                        <p className="flex flex-col">
                            <span className="font-medium" style={{ color: '#a8a29e' }}>Email</span>
                            <span className="break-all">{displayData?.personalInfo?.email}</span>
                        </p>
                        <p className="flex flex-col">
                            <span className="font-medium" style={{ color: '#a8a29e' }}>Phone</span>
                            <span>{displayData?.personalInfo?.phone}</span>
                        </p>
                        <p className="flex flex-col">
                            <span className="font-medium" style={{ color: '#a8a29e' }}>Location</span>
                            <span>{displayData?.personalInfo?.location}</span>
                        </p>
                    </div>
                </section>

                <section className="flex flex-col gap-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#ea580c' }}>Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {displayData?.skills?.map((skill, index) => (
                            <span key={`${skill}-${index}`} className="px-1.5 py-0.5 bg-white border rounded text-[9px] font-medium" style={{ borderColor: '#e7e5e4', color: '#57534e' }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            </aside>

            {/* Main Content - Right Column */}
            <main className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                {/* Summary Section */}
                {displayData?.enabledSections?.summary && displayData?.summary && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#ea580c' }}>
                            Summary
                            <div className="h-[1px] flex-1" style={{ backgroundColor: '#f5f5f4' }} />
                        </h2>
                        <p className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: '#78716c' }}>
                            {displayData.summary}
                        </p>
                    </section>
                )}

                {/* Work Experience Section */}
                {((!displayData?.isFresher && displayData?.enabledSections?.experience) || (displayData?.isFresher && displayData?.enabledSections?.internships)) && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#ea580c' }}>
                            {displayData?.isFresher ? 'Internships' : 'Experience'}
                            <div className="h-[1px] flex-1" style={{ backgroundColor: '#f5f5f4' }} />
                        </h2>
                        <div className="flex flex-col gap-4">
                            {(displayData?.isFresher ? displayData?.internships : displayData?.experience)?.map((entry, index) => (
                                <div key={entry.id || index} className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-xs font-bold">{entry.company}</h3>
                                        <span className="text-[9px] font-medium" style={{ color: '#a8a29e' }}>{entry.duration}</span>
                                    </div>
                                    <p className="text-[10px] font-medium" style={{ color: '#57534e' }}>{entry.position}</p>
                                    <p className="text-[9.5px] mt-0.5 leading-relaxed whitespace-pre-wrap line-clamp-3" style={{ color: '#78716c' }}>{entry.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section */}
                {displayData?.enabledSections?.projects && displayData?.projects?.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#ea580c' }}>
                            Projects
                            <div className="h-[1px] flex-1" style={{ backgroundColor: '#f5f5f4' }} />
                        </h2>
                        <div className="flex flex-col gap-3">
                            {displayData.projects.map((proj, index) => (
                                <div key={proj.id || index} className="flex flex-col gap-0.5">
                                    <h3 className="text-xs font-bold">{proj.title}</h3>
                                    <p className="text-[9.5px] leading-relaxed whitespace-pre-wrap" style={{ color: '#78716c' }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {displayData?.enabledSections?.education && displayData?.education?.length > 0 && (
                    <section className="flex flex-col gap-3">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3" style={{ color: '#ea580c' }}>
                            Education
                            <div className="h-[1px] flex-1" style={{ backgroundColor: '#f5f5f4' }} />
                        </h2>
                        <div className="flex flex-col gap-3">
                            {displayData.education.map((edu, index) => (
                                <div key={edu.id || index} className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-xs font-bold">{edu.school}</h3>
                                        <span className="text-[9px] font-medium" style={{ color: '#a8a29e' }}>{edu.year}</span>
                                    </div>
                                    <p className="text-[10px] font-medium" style={{ color: '#57534e' }}>{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
};

export default ModernTemplate;
