import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content - Standardized "Medium" Size */}
      <div className="relative w-full max-w-[480px] rounded-[32px] border border-black/5 bg-white p-10 shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-black tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-50 text-stone-400 hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
