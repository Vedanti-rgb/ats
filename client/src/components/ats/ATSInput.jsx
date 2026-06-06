import React from 'react';
import Button from '../common/Button';
import { FileUp } from 'lucide-react';

const ATSInput = () => {
  return (
    <div className="flex flex-col items-center gap-6 p-10 rounded-[40px] border-2 border-dashed border-black/5 bg-stone-50/50 hover:border-orange-500/20 transition-all group">
      <div className="p-5 rounded-full bg-white shadow-sm border border-black/5 group-hover:scale-110 transition-transform">
        <FileUp size={40} className="text-orange-500" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-black mb-2">Check your ATS Score</h3>
        <p className="text-stone-500 text-sm max-w-[240px]">Upload your resume (PDF or DOCX) to analyze it for ATS optimization.</p>
      </div>
      <Button className="w-full">Upload Resume</Button>
    </div>
  );
};

export default ATSInput;
