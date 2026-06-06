import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30',
    secondary: 'bg-white text-black border border-black/10 hover:bg-stone-50',
    outline: 'bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-50',
    ghost: 'bg-transparent text-stone-600 hover:bg-stone-50',
  };

  return (
    <button
      className={`rounded-2xl px-6 py-3 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
