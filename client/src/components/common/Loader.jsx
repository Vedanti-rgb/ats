import React from 'react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/5 border-t-orange-500"></div>
    </div>
  );
};

export default Loader;
