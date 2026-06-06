import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import useResumeStore from '../../store/useResumeStore';
import { 
  Check, 
  MousePointer2, 
  Layout, 
  Palette, 
  Sparkles
} from 'lucide-react';

// Import Templates for Previews
import ClassicTemplate from '../../ResumeTemplates/ClassicTemplate';
import ModernTemplate from '../../ResumeTemplates/ModernTemplate';
import { AliceTemplate, IsabelleTemplate } from '../../ResumeTemplates/ATSResumeTemplete';
import { OceanTemplate, EmeraldTemplate } from '../../ResumeTemplates/CreativeTemplete';
import SuggestTemplateModal from '../../components/templates/SuggestTemplateModal';

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { selectedTemplate, setTemplate, resetResume } = useResumeStore();
  const [isSuggestOpen, setIsSuggestOpen] = React.useState(false);

  const templates = [
    { 
      id: 'classic', 
      name: 'Professional Classic',
      desc: 'Clean, traditional layout perfect for corporate roles and executive positions.',
      category: 'Professional',
      color: '#000000',
      component: ClassicTemplate
    },
    { 
      id: 'modern', 
      name: 'Modern Minimal',
      desc: 'A sleek, two-column high-contrast design with generous whitespace.',
      category: 'Modern',
      color: '#f97316',
      component: ModernTemplate
    },
    { 
      id: 'creative', 
      name: 'Creative Portfolio',
      desc: 'Bold colors and dynamic spacing to showcase your creative flair.',
      category: 'Creative',
      color: '#dc2626',
      component: EmeraldTemplate // Default creative
    },
    { 
      id: 'ocean', 
      name: 'Ocean Blueprint',
      desc: 'Deep slate and sky blue professional dual-tone layout.',
      category: 'Creative',
      color: '#0ea5e9',
      component: OceanTemplate
    },
    { 
      id: 'ats-alice', 
      name: 'Minimalist ATS',
      desc: 'Highly parseable classical text flow, guaranteed to pass standard screening software.',
      category: 'ATS Friendly',
      color: '#475569',
      component: AliceTemplate
    },
    { 
      id: 'ats-isabelle', 
      name: 'Modern ATS',
      desc: 'Parser-safe modern format focused on clean lines and optimal data density.',
      category: 'ATS Friendly',
      color: '#2563eb',
      component: IsabelleTemplate
    }
  ];

  const handleSelect = (id) => {
    resetResume();
    setTemplate(id);
    navigate('/builder');
  };

  // Group templates by their category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div className="flex bg-white min-h-screen overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-20 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Layout size={24} />
              </div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-[0.2em]">Design Gallery</span>
            </div>
            <h1 className="text-5xl font-black text-black tracking-tight mb-4 leading-tight">
              Select Your <span className="text-orange-500">Resume Identity</span>
            </h1>
            <p className="text-xl text-stone-500 max-w-2xl font-medium leading-relaxed">
              Choose a template that best matches your professional personality. 
              Each one is ATS-optimized and designed to make you stand out.
            </p>
          </header>

          {/* Render grouped sections */}
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-20">
               <h2 className="text-3xl font-black text-black mb-1 border-b-2 border-stone-100 pb-3 uppercase tracking-wider">{category}</h2>
               <p className="text-stone-500 mb-8 font-medium">Explore standard {category.toLowerCase()} formats designed for maximum impact.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                 {categoryTemplates.map((temp) => (
                   <div 
                     key={temp.id}
                     onClick={() => handleSelect(temp.id)}
                     className={`group relative flex flex-col bg-white rounded-[40px] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer border-2 ${
                       selectedTemplate === temp.id ? 'border-orange-500' : 'border-stone-100 shadow-sm'
                     }`}
                   >
                     {/* Template Preview (Similar to TemplateCard.jsx) */}
                     <div className="relative mb-6 aspect-[1/1.4142] overflow-hidden rounded-[32px] border-2 border-black/[0.03] bg-stone-50 transition-all duration-500 group-hover:border-orange-500/20 group-hover:bg-orange-50/20">
                       <div className="absolute inset-0 flex items-center justify-center p-4">
                         <div className="w-[500px] flex-shrink-0 origin-center scale-[0.4] transition-transform duration-700 group-hover:scale-[0.42]">
                           <div className="shadow-2xl rounded-sm overflow-hidden border border-black/5">
                             <temp.component data={{}} />
                           </div>
                         </div>
                       </div>

                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                       
                       {/* Active Indicator */}
                       {selectedTemplate === temp.id && (
                         <div className="absolute top-6 right-6 h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl z-20 animate-in zoom-in-50 duration-300">
                           <Check size={20} strokeWidth={4} />
                         </div>
                       )}
                     </div>
     
                     {/* Template Info */}
                     <div className="px-2">
                       <div className="flex items-center gap-3 mb-3">
                         <span className="px-3 py-1 bg-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400 rounded-lg group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                           {temp.category}
                         </span>
                         <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: temp.color }} />
                       </div>
                       
                       <h3 className="text-xl font-black text-black mb-2 group-hover:text-orange-600 transition-colors">{temp.name}</h3>
                       <p className="text-stone-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                         {temp.desc}
                       </p>
     
                       <div className="flex items-center gap-3 mt-auto">
                         <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-2xl text-[11px] font-black shadow-lg shadow-black/10 group-hover:bg-orange-500 group-hover:shadow-orange-500/30 transition-all duration-300">
                           <MousePointer2 size={14} />
                           Use Template
                         </button>
                         <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-stone-400 hover:text-orange-500 transition-colors group-hover:bg-white">
                           <Sparkles size={16} />
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}

          <section className="mt-12 p-12 bg-black rounded-[48px] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[120px] rounded-full translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tight mb-4">Can't decide on a style?</h2>
                <p className="text-stone-400 font-medium">
                  Try our AI-powered template generator that analyzes your industry and roles to find the perfect professional aesthetic for you.
                </p>
              </div>
              <button 
                onClick={() => setIsSuggestOpen(true)}
                className="px-10 py-5 bg-white text-black rounded-3xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                 <Palette size={20} />
                 Suggest a Template
              </button>
            </div>
          </section>
        </div>
      </main>

      <SuggestTemplateModal 
        isOpen={isSuggestOpen} 
        onClose={() => setIsSuggestOpen(false)} 
      />
    </div>
  );
};

export default TemplatesPage;
