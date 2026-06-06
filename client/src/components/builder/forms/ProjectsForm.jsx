import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import Input from '../../common/Input';
import { Plus, Trash2, FolderGit2 } from 'lucide-react';

const ProjectsForm = () => {
  const { currentResumeData, updateEntry, addEntry, removeEntry } = useResumeStore();
  const { projects } = currentResumeData;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-black flex items-center gap-2">
             <FolderGit2 size={20} className="text-orange-500" />
             Personal Projects
          </h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Portfolio highlights</p>
        </div>
        <button 
          onClick={() => addEntry('projects')}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-black text-white hover:bg-stone-800 transition-all active:scale-95"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {projects.map((item, index) => (
        <div key={item.id} className="relative rounded-[32px] border border-black/5 bg-stone-50/50 p-6 pt-10">
          {projects.length > 1 && (
            <button 
              onClick={() => removeEntry('projects', item.id)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input 
              label="Project Title" 
              placeholder="E-commerce App / AI Bot" 
              value={item.title}
              onChange={(e) => updateEntry('projects', item.id, 'title', e.target.value)}
            />
            <Input 
              label="Project Link (Optional)" 
              placeholder="github.com/username/project" 
              value={item.link}
              onChange={(e) => updateEntry('projects', item.id, 'link', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-sm font-bold text-stone-700 ml-1">Key Features / Description</label>
             <textarea 
               className="w-full rounded-[24px] border border-black/10 bg-white p-5 text-sm font-medium focus:border-orange-500 focus:outline-none transition-all min-h-[100px]"
               placeholder="Briefly describe the technologies used and what the project accomplishes..."
               value={item.description}
               onChange={(e) => updateEntry('projects', item.id, 'description', e.target.value)}
             />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsForm;
