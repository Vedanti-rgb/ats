import React from 'react';
import { MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useResumeStore from '../../store/useResumeStore';

// Import Templates for Previews
import ClassicTemplate from '../../ResumeTemplates/ClassicTemplate';
import ModernTemplate from '../../ResumeTemplates/ModernTemplate';
import { AliceTemplate, IsabelleTemplate } from '../../ResumeTemplates/ATSResumeTemplete';
import { OceanTemplate, EmeraldTemplate } from '../../ResumeTemplates/CreativeTemplete';

const TemplateCard = ({ name, templateId }) => {
  const { resetResume, setTemplate } = useResumeStore();
  const navigate = useNavigate();

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    'ats-alice': AliceTemplate,
    'ats-isabelle': IsabelleTemplate,
    creative: EmeraldTemplate,
    emerald: EmeraldTemplate,
    ocean: OceanTemplate,
  };

  const handleUseTemplate = () => {
    if (templateId) {
      resetResume();
      setTemplate(templateId);
      navigate('/builder');
    }
  };

  const SelectedTemplate = templates[templateId];

  return (
    <div className="group relative w-64 flex-shrink-0 flex flex-col rounded-[32px] border border-black/[0.12] bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/10">
      {/* Top: Name */}
      <div className="mb-4 px-1">
        <h4 className="text-base font-bold text-black group-hover:text-orange-600 transition-colors">
          {name}
        </h4>
      </div>

      {/* Middle: Preview */}
      <div className="relative mb-5 aspect-[1/1.4142] overflow-hidden rounded-2xl border-2 border-black/[0.05] bg-stone-50 transition-all duration-300 group-hover:border-orange-500/20 group-hover:bg-orange-50/20">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-[500px] flex-shrink-0 origin-center scale-[0.38] transition-transform duration-500 group-hover:scale-[0.40]">
            <div className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden border border-black/5">
              {SelectedTemplate ? (
                <SelectedTemplate data={{}} />
              ) : (
                <div className="bg-white aspect-[1/1.41] flex items-center justify-center text-stone-300 font-bold text-4xl">
                  {name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom: Use Template Button */}
      <div className="mt-auto">
        <button 
          onClick={handleUseTemplate}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 text-xs font-semibold text-white shadow-lg shadow-black/10 transition-all hover:bg-stone-800 hover:shadow-orange-500/20 active:scale-95"
        >
          <MousePointer2 size={14} />
          Use Template
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
