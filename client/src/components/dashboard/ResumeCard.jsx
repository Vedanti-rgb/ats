/* eslint-disable react-hooks/static-components */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/useResumeStore';
import ClassicTemplate from '../../ResumeTemplates/ClassicTemplate';
import ModernTemplate from '../../ResumeTemplates/ModernTemplate';
import { AliceTemplate, IsabelleTemplate } from '../../ResumeTemplates/ATSResumeTemplete';
import { OceanTemplate, EmeraldTemplate } from '../../ResumeTemplates/CreativeTemplete';
import { FileEdit, Trash2, Download, MoreVertical, Calendar, Loader2, Brain } from 'lucide-react';
import { downloadAsPDF } from '../../utils/pdfGenerator';

const getTemplateComponent = (templateId) => {
  switch (templateId) {
    case 'modern':
      return ModernTemplate;
    case 'ats-alice':
      return AliceTemplate;
    case 'ats-isabelle':
      return IsabelleTemplate;
    case 'creative':
    case 'emerald':
      return EmeraldTemplate;
    case 'ocean':
      return OceanTemplate;
    case 'classic':
    default:
      return ClassicTemplate;
  }
};

const ResumeCard = ({ resume }) => {
  const { _id, title, updatedAt, template = 'classic' } = resume;
  const navigate = useNavigate();
  const { loadResume, deleteResume } = useResumeStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const SelectedTemplate = getTemplateComponent(template);

  // Map structured resume data to template format
  const mappedData = {
    personalInfo: {
      name: resume.personalInfo?.name || '',
      email: resume.personalInfo?.email || '',
      phone: resume.personalInfo?.phone || '',
      linkedin: resume.personalInfo?.linkedin || '',
      location: resume.personalInfo?.location || '',
    },
    summary: resume.summary || '',
    education: resume.education || [],
    experience: resume.experience || [],
    internships: resume.internships || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    isFresher: resume.isFresher ?? false, // Check if this field exists or needs deriving
    enabledSections: resume.enabledSections || { education: true, experience: true, summary: true, skills: true, projects: true },
    selectedTemplate: template
  };

  const handleEdit = () => {
    loadResume(resume);
    navigate('/builder');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(_id);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const elementId = `pdf-capture-${_id}`;
    const fileName = `${title || 'resume'}_Resume.pdf`;
    
    // Wait for hidden element to be in DOM (it's always there but hidden)
    setTimeout(async () => {
      await downloadAsPDF(elementId, fileName);
      setIsDownloading(false);
    }, 100);
  };

  // Format date
  const lastUpdated = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group relative w-64 flex-shrink-0 flex flex-col rounded-[32px] border border-black/[0.05] bg-white p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:border-orange-500/10">
      
      {/* Hidden high-res container for PDF capture */}
      <div className="fixed -left-[9999px] top-0">
        <div id={`pdf-capture-${_id}`} className="w-[800px] bg-white">
          <SelectedTemplate data={mappedData} />
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-start justify-between mb-3 px-1">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-bold text-black tracking-tight group-hover:text-orange-500 transition-colors duration-300">
            {title || 'Untitled Resume'}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-stone-400">
            <Calendar size={10} className="shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {lastUpdated}
            </span>
          </div>
        </div>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-300 transition-all hover:bg-stone-50 hover:text-black">
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Visual Preview Area */}
      <div className="relative mb-4 aspect-[1/1.4142] overflow-hidden rounded-[20px] bg-stone-50/50 border border-black/[0.03] transition-all duration-500 group-hover:bg-orange-50/20 group-hover:border-orange-500/5">
        
        {/* Template Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[8px] font-black uppercase tracking-widest text-stone-500 shadow-sm">
            {template}
          </span>
        </div>

        {/* Dynamic Template Preview - Scaled Down */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] flex-shrink-0 origin-center scale-[0.38] transition-transform duration-700 group-hover:scale-[0.40]">
            <div className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden border border-black/[0.02]">
               <SelectedTemplate 
                 data={mappedData} 
               />
            </div>
          </div>
        </div>
        
        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      
      {/* Action Row */}
      <div className="flex items-center gap-2 px-0.5">
        <button 
          onClick={handleEdit}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-black py-3 text-[11px] font-bold text-white shadow-xl shadow-black/5 transition-all duration-300 hover:bg-stone-800 hover:shadow-orange-500/10 active:scale-95"
        >
          <FileEdit size={14} />
          <span>Edit</span>
        </button>
        
        <button 
          onClick={() => navigate(`/test/${_id}`)}
          title="Take AI Interview"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-black/[0.05] text-stone-600 shadow-sm transition-all duration-300 hover:border-blue-500/20 hover:text-blue-500 hover:bg-blue-50/50 active:scale-90"
        >
          <Brain size={18} />
        </button>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download PDF"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-black/[0.05] text-stone-600 shadow-sm transition-all duration-300 hover:border-orange-500/20 hover:text-orange-500 hover:bg-orange-50/50 active:scale-90 disabled:opacity-50"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
        
        <button 
          onClick={handleDelete}
          title="Delete Resume"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-black/[0.05] text-stone-400 shadow-sm transition-all duration-300 hover:border-red-100 hover:text-red-500 hover:bg-red-50/50 active:scale-90"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};


export default ResumeCard;
