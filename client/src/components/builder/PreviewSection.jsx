import React, { useMemo } from 'react';
import useResumeStore from '../../store/useResumeStore';
import ClassicTemplate from '../../ResumeTemplates/ClassicTemplate';
import ModernTemplate from '../../ResumeTemplates/ModernTemplate';
import { AliceTemplate, IsabelleTemplate } from '../../ResumeTemplates/ATSResumeTemplete';
import { OceanTemplate, EmeraldTemplate } from '../../ResumeTemplates/CreativeTemplete';
import ExecutiveTemplate from '../../ResumeTemplates/ExecutiveTemplate';
import ProfessionalConsultant from '../../ResumeTemplates/ProfessionalConsultant';
import ProfessionalCorporate from '../../ResumeTemplates/ProfessionalCorporate';
import ProfessionalPremium from '../../ResumeTemplates/ProfessionalPremium';
import ProfessionalDirector from '../../ResumeTemplates/ProfessionalDirector';
import ProfessionalFinance from '../../ResumeTemplates/ProfessionalFinance';
import ProfessionalGlobal from '../../ResumeTemplates/ProfessionalGlobal';
import ClassicNew from '../../ResumeTemplates/ClassicNew';
import ClassicMinimal from '../../ResumeTemplates/ClassicMinimal';
import ClassicElegant from '../../ResumeTemplates/ClassicElegant';
import ClassicHeritage from '../../ResumeTemplates/ClassicHeritage';
import ClassicScholarly from '../../ResumeTemplates/ClassicScholarly';
import ClassicFormal from '../../ResumeTemplates/ClassicFormal';
import ModernSplit from '../../ResumeTemplates/ModernSplit';
import ModernGrid from '../../ResumeTemplates/ModernGrid';
import ModernTimeline from '../../ResumeTemplates/ModernTimeline';
import ModernMinimalist from '../../ResumeTemplates/ModernMinimalist';
import ModernCards from '../../ResumeTemplates/ModernCards';
import ModernTech from '../../ResumeTemplates/ModernTech';
import CreativeDesigner from '../../ResumeTemplates/CreativeDesigner';
import CreativeColorBlock from '../../ResumeTemplates/CreativeColorBlock';
import CreativeArtist from '../../ResumeTemplates/CreativeArtist';
import CreativeMagazine from '../../ResumeTemplates/CreativeMagazine';
import CreativeMinimalBold from '../../ResumeTemplates/CreativeMinimalBold';
import ATSCompact from '../../ResumeTemplates/ATSCompact';
import ATSExecutive from '../../ResumeTemplates/ATSExecutive';
import ATSStandardClean from '../../ResumeTemplates/ATSStandardClean';
import ATSTechnical from '../../ResumeTemplates/ATSTechnical';
import ATSMinimalPro from '../../ResumeTemplates/ATSMinimalPro';
import AIGeneratedTemplate from '../../ResumeTemplates/AIGeneratedTemplate';

// ─── Placeholder values shown in preview while the user hasn't filled a field ─────
// These keep the template layout visible and populated at all times.
// Real user data always takes priority over placeholders.

const PLACEHOLDER_PERSONAL = {
    name: 'Your Full Name',
    email: 'your.email@example.com',
    phone: '+1 (555) 000-0000',
    location: 'City, Country',
    linkedin: '',
};

const PLACEHOLDER_SUMMARY =
    'Motivated professional with a passion for excellence. ' +
    'Committed to delivering high-quality results and continuously growing my skill set. ' +
    'Ready to contribute meaningfully to a forward-thinking team.';

const PLACEHOLDER_EXPERIENCE = [
    {
        id: 'ph-exp-1',
        company: 'Your Company Name',
        position: 'Your Job Title',
        duration: 'Month Year – Present',
        description:
            'Describe your key responsibilities and achievements here. ' +
            'Focus on impact, quantified results, and technologies used.',
    },
];

const PLACEHOLDER_INTERNSHIP = [
    {
        id: 'ph-int-1',
        company: 'Internship Company',
        position: 'Intern – Department',
        duration: 'Month Year – Month Year',
        description: 'Describe what you worked on, what you learned, and the impact you made.',
    },
];

const PLACEHOLDER_EDUCATION = [
    {
        id: 'ph-edu-1',
        school: 'University / College Name',
        degree: 'Bachelor of Science in Your Major',
        year: '20XX – 20XX',
        location: 'City, Country',
    },
];

const PLACEHOLDER_SKILLS = [
    'Core Skill 1',
    'Core Skill 2',
    'Core Skill 3',
    'Core Skill 4',
];

const PLACEHOLDER_PROJECTS = [
    {
        id: 'ph-proj-1',
        title: 'Your Project Name',
        description:
            'Briefly describe what this project does, technologies used, ' +
            'and the problem it solves or the impact it had.',
        link: '',
    },
];

/**
 * Merges real user resume data with placeholder values so that the template
 * layout never collapses while the user is still filling in the form.
 *
 * Rules:
 *  - If a text field is empty → use placeholder text (keeps sections visible)
 *  - If an array is empty → use placeholder array entries (keeps sections visible)
 *  - If an array entry has an empty key field → replace that entry with a placeholder
 *    (so the user sees a structured row, not a blank row)
 *  - Real data always takes priority: non-empty user values are NEVER overwritten
 */
const buildLivePreviewData = (resumeData) => {
    const pi = resumeData.personalInfo || {};

    // ── Personal Info ──────────────────────────────────────────────────────────
    const personalInfo = {
        name: pi.fullName?.trim() || PLACEHOLDER_PERSONAL.name,
        email: pi.email?.trim() || PLACEHOLDER_PERSONAL.email,
        phone: pi.phone?.trim() || PLACEHOLDER_PERSONAL.phone,
        location: pi.location?.trim() || PLACEHOLDER_PERSONAL.location,
        linkedin: pi.linkedin?.trim() || PLACEHOLDER_PERSONAL.linkedin,
    };

    // ── Summary ────────────────────────────────────────────────────────────────
    const summary = pi.summary?.trim() || PLACEHOLDER_SUMMARY;

    // ── Experience ─────────────────────────────────────────────────────────────
    const rawExp = resumeData.experience || [];
    const hasRealExp = rawExp.some(
        (e) => e.company?.trim() || e.position?.trim() || e.description?.trim()
    );
    const experience = hasRealExp
        ? rawExp.map((e) => ({
              ...e,
              company: e.company?.trim() || 'Company Name',
              position: e.position?.trim() || 'Job Title',
              duration: e.duration?.trim() || 'Duration',
              description: e.description?.trim() || 'Add your responsibilities and achievements here.',
          }))
        : PLACEHOLDER_EXPERIENCE;

    // ── Internships ────────────────────────────────────────────────────────────
    const rawInt = resumeData.internships || [];
    const hasRealInt = rawInt.some(
        (e) => e.company?.trim() || e.position?.trim() || e.description?.trim()
    );
    const internships = hasRealInt
        ? rawInt.map((e) => ({
              ...e,
              company: e.company?.trim() || 'Company Name',
              position: e.position?.trim() || 'Intern Title',
              duration: e.duration?.trim() || 'Duration',
              description: e.description?.trim() || 'Add your internship responsibilities here.',
          }))
        : PLACEHOLDER_INTERNSHIP;

    // ── Education ──────────────────────────────────────────────────────────────
    const rawEdu = resumeData.education || [];
    const hasRealEdu = rawEdu.some(
        (e) => e.school?.trim() || e.degree?.trim()
    );
    const education = hasRealEdu
        ? rawEdu.map((e) => ({
              ...e,
              school: e.school?.trim() || 'School / University',
              degree: e.degree?.trim() || 'Degree & Major',
              year: e.year?.trim() || 'Year',
              location: e.location?.trim() || '',
          }))
        : PLACEHOLDER_EDUCATION;

    // ── Skills ─────────────────────────────────────────────────────────────────
    const skills =
        resumeData.skills?.length > 0 ? resumeData.skills : PLACEHOLDER_SKILLS;

    // ── Projects ───────────────────────────────────────────────────────────────
    const rawProj = resumeData.projects || [];
    const hasRealProj = rawProj.some(
        (p) => p.title?.trim() || p.description?.trim()
    );
    const projects = hasRealProj
        ? rawProj.map((p) => ({
              ...p,
              title: p.title?.trim() || 'Project Name',
              description: p.description?.trim() || 'Describe your project here.',
              link: p.link?.trim() || '',
          }))
        : PLACEHOLDER_PROJECTS;

    return {
        personalInfo,
        summary,
        experience,
        internships,
        education,
        skills,
        projects,
        isFresher: resumeData.isFresher || false,
        enabledSections: resumeData.enabledSections || {
            summary: true,
            experience: true,
            internships: false,
            skills: true,
            projects: true,
            education: true,
        },
    };
};

// ─── Template Map ─────────────────────────────────────────────────────────────
// Mapping from template ID → component. Adding a new template only requires
// an entry here — no other code changes needed.

const TEMPLATE_MAP = {
    modern: ModernTemplate,
    'modern-split': ModernSplit,
    'modern-grid': ModernGrid,
    'modern-timeline': ModernTimeline,
    'modern-minimalist': ModernMinimalist,
    'modern-cards': ModernCards,
    'modern-tech': ModernTech,
    'ats-alice': AliceTemplate,
    'ats-isabelle': IsabelleTemplate,
    'ats-compact': ATSCompact,
    'ats-executive': ATSExecutive,
    'ats-standard-clean': ATSStandardClean,
    'ats-technical': ATSTechnical,
    'ats-minimal-pro': ATSMinimalPro,
    executive: ExecutiveTemplate,
    'prof-consultant': ProfessionalConsultant,
    'prof-corporate': ProfessionalCorporate,
    'prof-premium': ProfessionalPremium,
    'prof-director': ProfessionalDirector,
    'prof-finance': ProfessionalFinance,
    'prof-global': ProfessionalGlobal,
    'classic-new': ClassicNew,
    'classic-minimal': ClassicMinimal,
    'classic-elegant': ClassicElegant,
    'classic-heritage': ClassicHeritage,
    'classic-scholarly': ClassicScholarly,
    'classic-formal': ClassicFormal,
    creative: EmeraldTemplate,
    emerald: EmeraldTemplate,
    ocean: OceanTemplate,
    'creative-designer': CreativeDesigner,
    'creative-colorblock': CreativeColorBlock,
    'creative-artist': CreativeArtist,
    'creative-magazine': CreativeMagazine,
    'creative-minimal-bold': CreativeMinimalBold,
    classic: ClassicTemplate,
};

// ─── Preview Section Component ───────────────────────────────────────────────

const PreviewSection = () => {
    const { currentResumeData, selectedTemplate, aiThemeConfig } = useResumeStore();

    /**
     * Build the merged preview data. This is memoised so it only recalculates
     * when currentResumeData actually changes, preventing unnecessary re-renders
     * of the (potentially expensive) template components.
     */
    const previewData = useMemo(
        () => buildLivePreviewData(currentResumeData),
        [currentResumeData]
    );

    // ── Render the selected template ──────────────────────────────────────────
    const renderTemplate = () => {
        if (selectedTemplate === 'ai-custom') {
            return <AIGeneratedTemplate data={previewData} themeConfig={aiThemeConfig} />;
        }

        const TemplateComponent = TEMPLATE_MAP[selectedTemplate] ?? ClassicTemplate;
        return <TemplateComponent data={previewData} />;
    };

    return (
        <div className="h-full w-full bg-stone-100 p-8 flex justify-center overflow-y-auto scrollbar-hide">
            <div
                id="resume-preview-content"
                className="w-full max-w-[800px] transition-all bg-white shadow-2xl origin-top"
            >
                {renderTemplate()}
            </div>
        </div>
    );
};

export default PreviewSection;