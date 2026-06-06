import React from 'react';

// eslint-disable-next-line no-unused-vars
const ServiceCard = ({ title, desc, icon: Icon }) => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[40px] border border-black/[0.05] bg-white p-8 transition-all hover:shadow-xl hover:shadow-black/5 group">
      <div className="rounded-2xl bg-stone-50 p-4 transition-colors group-hover:bg-orange-50">
        <Icon size={24} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
      </div>
      <div>
        <h4 className="text-lg font-bold text-black mb-1">{title}</h4>
        <p className="text-sm font-semibold text-stone-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
