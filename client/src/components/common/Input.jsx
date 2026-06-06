import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-stone-700 ml-1">
          {label}
        </label>
      )}
      <input
        className={`rounded-xl border border-black/10 bg-white px-4 py-3 text-black transition-all focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 outline-none w-full ${
          error ? 'border-red-500 focus:ring-red-500/10' : ''
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
};

export default Input;
