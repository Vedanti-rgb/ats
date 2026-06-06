import React, { useState } from 'react';
import Modal from '../common/Modal';
import { generateCustomTemplate } from '../../services/groqService';
import { Sparkles, Loader2, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import useResumeStore from '../../store/useResumeStore';
import { useNavigate } from 'react-router-dom';

const SuggestTemplateModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Prompt, 2: Loading, 3: Success
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setTemplate, resetResume, setAiThemeConfig } = useResumeStore();

  const handleGenerate = async () => {
    if (!prompt || prompt.length < 5) {
      setError('Please provide a slightly more detailed description.');
      return;
    }
    setError('');
    setStep(2);
    
    try {
      // The AI acts as a rendering engine returning CSS JSON
      const customTheme = await generateCustomTemplate(prompt);
      setResult(customTheme);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to generate a custom template. Please try again.');
      setStep(1);
    }
  };

  const handleApplyTemplate = () => {
    if (result) {
      resetResume();
      // Set the AI generated config into the store
      setAiThemeConfig(result);
      // Set the template ID to trigger the AI Generative Master Component
      setTemplate('ai-custom');
      onClose();
      navigate('/builder');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Template Generator">
      
      {/* STEP 1: Text Prompt */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-stone-500 font-medium">
            Describe your ideal resume format, preferred colors, and your target industry. 
            Our AI will dynamically generate a 1-of-1 Canva-tier custom template just for you.
          </p>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2 block">Your Prompt</label>
              <div className="relative">
                <textarea 
                  placeholder="e.g. 'I am a Medical Doctor. I want a purely clinical white and teal layout with a clean side column.'" 
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 font-medium text-stone-700 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
                <Wand2 className="absolute right-4 bottom-4 text-orange-400 opacity-50" size={24} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
               <span onClick={() => setPrompt("A strict Dark Mode monospace format for a Senior Software Engineer.")} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 cursor-pointer rounded-lg text-xs font-bold text-stone-500 transition-colors">Software Engineer</span>
               <span onClick={() => setPrompt("A vibrant, bright purple and orange modern layout for a UI/UX Designer.")} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 cursor-pointer rounded-lg text-xs font-bold text-stone-500 transition-colors">UI Designer</span>
               <span onClick={() => setPrompt("A dense, formal, heavily text-based serif format for a legal professional.")} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 cursor-pointer rounded-lg text-xs font-bold text-stone-500 transition-colors">Lawyer</span>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full py-4 mt-6 bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-xl"
          >
            <Sparkles size={18} />
            Generate Unique Design
          </button>
        </div>
      )}

      {/* STEP 2: Loading State */}
      {step === 2 && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-30 rounded-full animate-pulse" />
            <Loader2 className="animate-spin text-orange-500 relative z-10" size={48} />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">Manufacturing Blueprint</h3>
            <p className="text-sm font-medium text-stone-500 mt-2 max-w-[280px] mx-auto">
              Our AI is mapping CSS properties, hex colors, and structural layouts to match your description perfectly...
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Result State */}
      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 text-orange-600 p-4 rounded-full shadow-lg shadow-orange-500/20">
              <CheckCircle2 size={40} />
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 bg-stone-100 text-stone-500">
              Generation Complete
            </div>
            
            <h3 className="text-2xl font-black text-black mb-2">
              {result.themeName || 'Custom Masterpiece'}
            </h3>
            
            <div className="flex items-center justify-center gap-2 mb-6">
               <div className="flex -space-x-2">
                 <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: result.primaryColor }} />
                 <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: result.secondaryColor }} />
                 <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: result.backgroundColor }} />
               </div>
               <span className="font-bold text-[11px] text-stone-400 uppercase tracking-widest ml-2">{result.layout}</span>
            </div>
            
            <div className={`border rounded-2xl p-6 text-left relative overflow-hidden`} style={{ backgroundColor: result.backgroundColor, borderColor: result.secondaryColor }}>
              <Sparkles className="absolute -top-2 -right-2 opacity-10" size={64} style={{ color: result.primaryColor }} />
              <h4 className={`text-lg font-black mb-2 ${result.fontFamily}`} style={{ color: result.primaryColor }}>Preview Visualization</h4>
              <p className={`text-sm font-medium leading-relaxed ${result.fontFamily}`} style={{ color: result.textColor || result.secondaryColor }}>
                This template has been successfully generated mapping to {result.fontFamily} targeting a {result.layout} structure.
              </p>
            </div>
          </div>

          <button 
            onClick={handleApplyTemplate}
            className="w-full py-4 mt-2 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg active:scale-95"
          >
            Apply My Masterpiece
            <ChevronRight size={18} />
          </button>
          
          <button 
            onClick={() => setStep(1)}
            className="w-full py-3 text-stone-400 font-bold text-sm hover:text-black transition-colors"
          >
            Generate another concept
          </button>
        </div>
      )}

    </Modal>
  );
};

export default SuggestTemplateModal;
