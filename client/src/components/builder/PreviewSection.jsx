import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import ClassicTemplate from '../../ResumeTemplates/ClassicTemplate';
import ModernTemplate from '../../ResumeTemplates/ModernTemplate';
import { AliceTemplate, IsabelleTemplate } from '../../ResumeTemplates/ATSResumeTemplete';
import { OceanTemplate, EmeraldTemplate } from '../../ResumeTemplates/CreativeTemplete';
import ExecutiveTemplate from '../../ResumeTemplates/ExecutiveTemplate';
import AIGeneratedTemplate from '../../ResumeTemplates/AIGeneratedTemplate';

const PreviewSection = () => {
    const { currentResumeData, selectedTemplate, aiThemeConfig } = useResumeStore();

    // The data is now flatter in the store, but templates might expect a specific structure.
    const mappedData = {
        personalInfo: {
            name: currentResumeData.personalInfo.fullName,
            email: currentResumeData.personalInfo.email,
            phone: currentResumeData.personalInfo.phone,
            linkedin: currentResumeData.personalInfo.linkedin,
            location: currentResumeData.personalInfo.location,
        },
        summary: currentResumeData.personalInfo.summary,
        education: currentResumeData.education,
        experience: currentResumeData.experience,
        internships: currentResumeData.internships,
        skills: currentResumeData.skills,
        projects: currentResumeData.projects,
        isFresher: currentResumeData.isFresher,
        enabledSections: currentResumeData.enabledSections,
    };

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'modern':
                return <ModernTemplate data={mappedData} />;
            case 'ats-alice':
                return <AliceTemplate data={mappedData} />;
            case 'ats-isabelle':
                return <IsabelleTemplate data={mappedData} />;
            case 'executive':
                return <ExecutiveTemplate data={mappedData} />;
            case 'ai-custom':
                return <AIGeneratedTemplate data={mappedData} themeConfig={aiThemeConfig} />;
            case 'creative':
            case 'emerald':
                return <EmeraldTemplate data={mappedData} />;
            case 'ocean':
                return <OceanTemplate data={mappedData} />;
            case 'classic':
            default:
                return <ClassicTemplate data={mappedData} />;
        }
    };

    return (
        <div className="h-full w-full bg-stone-100 p-8 flex justify-center overflow-y-auto scrollbar-hide">
            <div id="resume-preview-content" className="w-full max-w-[800px] transition-all bg-white shadow-2xl origin-top">
                {renderTemplate()}
            </div>
        </div>
    );
};

export default PreviewSection;
