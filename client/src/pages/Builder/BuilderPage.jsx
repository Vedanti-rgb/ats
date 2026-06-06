import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/useResumeStore';
import PreviewSection from '../../components/builder/PreviewSection';
import AIPanel from '../../components/builder/AIPanel';
import PersonalInfoForm from '../../components/builder/forms/PersonalInfoForm';
import EducationForm from '../../components/builder/forms/EducationForm';
import ExperienceForm from '../../components/builder/forms/ExperienceForm';
import InternshipForm from '../../components/builder/forms/InternshipForm';
import SkillsForm from '../../components/builder/forms/SkillsForm';
import ProjectsForm from '../../components/builder/forms/ProjectsForm';
import {
  Download,
  Save,
  Settings2,
  Eye,
  EyeOff,
  Layout,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  GraduationCap,
  Briefcase,
  User,
  Brain,
} from 'lucide-react';

// ─── Section Nav Items ─────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Settings2 },
  { id: 'projects', label: 'Projects', icon: Zap },
];

// ─── Toast ─────────────────────────────────────────────────────────────────

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <AlertCircle size={16} />,
    info: <Loader2 size={16} className="animate-spin" />,
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl max-w-sm animate-in slide-in-from-bottom-4 duration-300 ${styles[toast.type]}`}>
      {icons[toast.type]}
      <p className="text-sm font-semibold flex-1">{toast.message}</p>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 ml-2">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Toggle Item ───────────────────────────────────────────────────────────

const ToggleItem = ({ label, checked, onChange, icon: Icon }) => (
  <label className="flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-stone-50/50 hover:bg-white transition-all cursor-pointer group">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={18} className="text-stone-400 group-hover:text-orange-500 transition-colors" />}
      <span className="text-sm font-bold text-stone-600 group-hover:text-black">{label}</span>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-5 w-5 accent-orange-500 rounded-lg cursor-pointer"
    />
  </label>
);

// ─── Section Title ──────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const SectionTitle = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="text-lg font-black text-black leading-tight">{title}</h3>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{subtitle}</p>
    </div>
  </div>
);

// ─── Main Builder Content ──────────────────────────────────────────────────

const BuilderContent = () => {
  const { 
    currentResumeId,
    currentResumeData, 
    updateResumeData, 
    setFresherMode, 
    setTemplate, 
    selectedTemplate,
    saveResume,
    isSaving,
    error
  } = useResumeStore();
  const navigate = useNavigate();
  
  const { isFresher, enabledSections } = currentResumeData;

  const [toast, setToast] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  }, []);

  // Sync error from store to toast
  useEffect(() => {
    if (error) {
        showToast(error, 'error');
    }
  }, [error, showToast]);

  // ─── PDF Download ────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    const elementId = 'resume-preview-content';
    const element = document.getElementById(elementId);
    
    if (!element) {
      showToast('Preview not found. Please try again.', 'error');
      return;
    }

    setIsDownloading(true);
    showToast('Generating PDF…', 'info');

    try {
      const { downloadAsPDF } = await import('../../utils/pdfGenerator');
      const name = currentResumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume';
      const success = await downloadAsPDF(elementId, `${name}_Resume.pdf`);

      if (success) {
        showToast('PDF downloaded successfully!', 'success');
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (err) {
      console.error('PDF Error:', err);
      showToast('PDF generation failed. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Save Draft to Backend ────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    showToast('Saving draft…', 'info');
    try {
      await saveResume(false);
      showToast('Draft saved successfully! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch {
      // Error handled by useEffect above
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-black/5 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <Layout size={18} />
          </div>
          <div>
            <h2 className="text-base font-black text-black leading-tight">Resume Builder</h2>
            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">AI-Powered · ATS Ready</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Template Switcher */}
          <select
            className="rounded-xl border border-black/5 bg-stone-50 px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer hover:bg-white transition-colors"
            value={selectedTemplate}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="classic">📄 Professional Classic</option>
            <option value="modern">✨ Modern Minimal</option>
            <option value="ats-alice">🏢 Minimalist ATS</option>
            <option value="ats-isabelle">👔 Modern ATS</option>
            <option value="executive">🏢 Executive Premium</option>
            <option value="creative">🎨 Emerald Modern</option>
            <option value="ocean">🌊 Ocean Blueprint</option>
          </select>

          {/* Save Draft */}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black hover:bg-stone-50 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>

          {/* Take Test (Only if Resume ID exists) */}
          {currentResumeId && (
            <button
              onClick={() => navigate(`/test/${currentResumeId}`)}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
            >
              <Brain size={14} />
              Take Test
            </button>
          )}

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/25"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Download PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Left: Form Area ──────────────────────────────────────────── */}
        <div className={`w-full lg:w-[55%] xl:w-[48%] h-full overflow-y-auto scrollbar-hide border-r border-black/5 px-6 lg:px-10 py-8 ${showPreviewMobile ? 'hidden lg:block' : 'block'}`}>

          {/* AI Panel — always at top */}
          <AIPanel />

          {/* Smart Controls */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={15} className="text-orange-500" />
              <h3 className="text-xs font-black text-black uppercase tracking-widest">Smart Controls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleItem
                label="Are you a fresher?"
                checked={isFresher}
                onChange={setFresherMode}
                icon={Eye}
              />
              <ToggleItem
                label="Show Summary"
                checked={enabledSections.summary}
                onChange={(val) => updateResumeData('enabledSections', 'summary', val)}
                icon={Settings2}
              />
              <ToggleItem
                label="Show Projects"
                checked={enabledSections.projects}
                onChange={(val) => updateResumeData('enabledSections', 'projects', val)}
                icon={Settings2}
              />
              <ToggleItem
                label="Show Skills"
                checked={enabledSections.skills}
                onChange={(val) => updateResumeData('enabledSections', 'skills', val)}
                icon={Settings2}
              />
            </div>
          </section>

          {/* Form Sections */}
          <div className="space-y-14">
            <section id="section-personal">
              <SectionTitle title="Personal Information" subtitle="Contact & profile" icon={User} />
              <PersonalInfoForm />
            </section>

            <section id="section-education">
              <SectionTitle title="Education" subtitle="Academic background" icon={GraduationCap} />
              <EducationForm />
            </section>

            <section id="section-experience">
              {!isFresher ? (
                <>
                  <SectionTitle title="Work Experience" subtitle="Professional history" icon={Briefcase} />
                  <ExperienceForm />
                </>
              ) : (
                <>
                  <SectionTitle title="Internships" subtitle="Training & internships" icon={Briefcase} />
                  <InternshipForm />
                </>
              )}
            </section>

            <section id="section-skills">
              <SkillsForm />
            </section>

            <section id="section-projects">
              <ProjectsForm />
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-16 pb-8 pt-8 border-t border-black/5 text-center">
            <p className="text-stone-400 text-xs font-medium">
              ✓ Auto-saved to account · All data stays private
            </p>
          </div>
        </div>

        {/* ── Right: Live Preview ───────────────────────────────────────── */}
        <div className={`${showPreviewMobile ? 'block absolute inset-0 z-40 bg-white' : 'hidden lg:block'} flex-1 h-full shadow-inner bg-stone-100 overflow-hidden`}>
          <PreviewSection />
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowPreviewMobile(!showPreviewMobile);
          }}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border border-slate-700 hover:scale-105 active:scale-95 transition-transform"
        >
          {showPreviewMobile ? (
            <><EyeOff size={18}/> Back to Editor</>
          ) : (
            <><Eye size={18}/> View Live Resume</>
          )}
        </button>
      </div>
    </div>
  );
};

const BuilderPage = () => {
  return (
    <BuilderContent />
  );
};

export default BuilderPage;
