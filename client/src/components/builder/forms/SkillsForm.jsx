import React, { useState } from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { Plus, X, Award } from 'lucide-react';

const SkillsForm = () => {
  const { currentResumeData, setResumeData } = useResumeStore();
  const { skills } = currentResumeData;
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
             <Award size={20} className="text-orange-500" />
             Technical Skills
          </h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">What you're good at</p>
        </div>
      </div>

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input 
          type="text"
          className="flex-1 rounded-2xl border border-black/10 bg-white p-4 text-sm font-medium focus:border-orange-500 focus:outline-none transition-all"
          placeholder="e.g. React.js, Python, Figma..."
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
        />
        <button 
          type="submit"
          className="flex aspect-square h-14 items-center justify-center rounded-2xl bg-black text-white hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-black/5"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {skills.map((skill, index) => (
          <div 
            key={index}
            className="group flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-50/50 px-4 py-2 text-sm font-bold text-orange-600 transition-all hover:border-orange-500"
          >
            {skill}
            <button 
              onClick={() => removeSkill(skill)}
              className="rounded-full p-0.5 hover:bg-orange-500 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm font-medium text-stone-400 italic">No skills added yet. Type above and press Enter.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
