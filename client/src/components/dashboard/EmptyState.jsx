import React from 'react';
import { FilePlus, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[56px] border border-black/[0.03] bg-stone-50/50 py-20 px-8 text-center relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full" />
      
      <div className="relative mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-2xl shadow-black/[0.03] border border-black/[0.05] transition-transform duration-500 group-hover:scale-110">
          <FilePlus size={40} className="text-orange-500" />
        </div>
        <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
          <Sparkles size={18} />
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-black tracking-tight max-w-md">
        Start building Resume with <span className="text-orange-500">Get Resume AI</span>
      </h3>
      <p className="mx-auto mt-4 max-w-sm font-semibold text-stone-400 leading-relaxed text-sm">
        Your professional journey begins here. Create a high-quality, ATS-friendly resume in just a few minutes.
      </p>
      
      <Button onClick={onCreateClick} className="mt-10 px-12 py-4 flex items-center gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all">
        <FilePlus size={20} />
        <span className="font-bold">Start Building</span>
      </Button>
    </div>
  );
};

export default EmptyState;
