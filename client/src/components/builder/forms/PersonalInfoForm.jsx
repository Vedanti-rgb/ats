import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import Input from '../../common/Input';

const PersonalInfoForm = () => {
  const { currentResumeData, updateResumeData } = useResumeStore();
  const { personalInfo } = currentResumeData;

  const handleChange = (e) => {
    updateResumeData('personalInfo', e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Full Name" 
          name="fullName" 
          placeholder="John Doe" 
          value={personalInfo.fullName}
          onChange={handleChange}
        />
        <Input 
          label="Email Address" 
          name="email" 
          type="email" 
          placeholder="john@example.com" 
          value={personalInfo.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Phone Number" 
          name="phone" 
          placeholder="+1 234 567 890" 
          value={personalInfo.phone}
          onChange={handleChange}
        />
        <Input 
          label="LinkedIn Profile" 
          name="linkedin" 
          placeholder="linkedin.com/in/johndoe" 
          value={personalInfo.linkedin}
          onChange={handleChange}
        />
      </div>

      <Input 
        label="Location" 
        name="location" 
        placeholder="New York, USA" 
        value={personalInfo.location}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-stone-700 ml-1">Professional Summary</label>
        <textarea 
          name="summary"
          className="w-full rounded-[24px] border border-black/10 bg-white p-5 text-sm font-medium focus:border-orange-500 focus:outline-none transition-all min-h-[120px]"
          placeholder="Briefly describe your professional background and key achievements..."
          value={personalInfo.summary}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
