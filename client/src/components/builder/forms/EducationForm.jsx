import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import Input from '../../common/Input';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const { currentResumeData, updateEntry, addEntry, removeEntry } = useResumeStore();
  const { education } = currentResumeData;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-black">Education</h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Academic background</p>
        </div>
        <button 
          onClick={() => addEntry('education')}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-black text-white hover:bg-stone-800 transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Education
        </button>
      </div>

      {education.map((item, index) => (
        <div key={item.id} className="relative rounded-[32px] border border-black/5 bg-stone-50/50 p-6 pt-10">
          {education.length > 1 && (
            <button 
              onClick={() => removeEntry('education', item.id)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input 
              label="School / University" 
              placeholder="Harvard University" 
              value={item.school}
              onChange={(e) => updateEntry('education', item.id, 'school', e.target.value)}
            />
            <Input 
              label="Degree / Major" 
              placeholder="Bachelor of Science in Computer Science" 
              value={item.degree}
              onChange={(e) => updateEntry('education', item.id, 'degree', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Year Range" 
              placeholder="2018 - 2022" 
              value={item.year}
              onChange={(e) => updateEntry('education', item.id, 'year', e.target.value)}
            />
            <Input 
              label="Location" 
              placeholder="Cambridge, MA" 
              value={item.location}
              onChange={(e) => updateEntry('education', item.id, 'location', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;
