import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import Input from '../../common/Input';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const InternshipForm = () => {
  const { currentResumeData, updateEntry, addEntry, removeEntry } = useResumeStore();
  const { internships, isFresher } = currentResumeData;

  if (!isFresher) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
            <GraduationCap size={20} className="text-orange-500" />
            Internships
          </h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Practical training</p>
        </div>
        <button
          onClick={() => addEntry('internships')}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-black text-white hover:bg-stone-800 transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Internship
        </button>
      </div>

      {internships.map((item) => (
        <div key={item.id} className="relative rounded-[32px] border border-black/5 bg-stone-50/50 p-6 pt-10">
          {internships.length > 1 && (
            <button
              onClick={() => removeEntry('internships', item.id)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Company"
              placeholder="Microsoft / Startup"
              value={item.company}
              onChange={(e) => updateEntry('internships', item.id, 'company', e.target.value)}
            />
            <Input
              label="Internship Role"
              placeholder="Frontend Intern"
              value={item.position}
              onChange={(e) => updateEntry('internships', item.id, 'position', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Duration"
              placeholder="Jun 2023 - Aug 2023"
              value={item.duration}
              onChange={(e) => updateEntry('internships', item.id, 'duration', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-stone-700 ml-1">Key Responsibilities</label>
            <textarea
              className="w-full rounded-[24px] border border-black/10 bg-white p-5 text-sm font-medium focus:border-orange-500 focus:outline-none transition-all min-h-[100px]"
              placeholder="Briefly describe what you learned and achieved during this internship..."
              value={item.description}
              onChange={(e) => updateEntry('internships', item.id, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternshipForm;
