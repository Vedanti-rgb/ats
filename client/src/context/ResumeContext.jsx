/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const initialState = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      location: '',
      summary: '',
    },
    education: [{ id: 1, school: '', degree: '', year: '', location: '' }],
    experience: [{ id: 2, company: '', position: '', duration: '', description: '' }],
    internships: [{ id: 3, company: '', position: '', duration: '', description: '' }],
    projects: [{ id: 4, title: '', description: '', link: '' }],
    isFresher: false,
    profileLocked: false,
    isAdmin: false,
    enabledSections: {
      education: true,
      experience: true,
      internships: false,
      skills: true,
      projects: true,
      summary: true,
    },
    selectedTemplate: 'classic',
  };

  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('current_resume_v1');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('current_resume_v1', JSON.stringify(resumeData));
  }, [resumeData]);

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setLoading(true);
        try {
          const { getUserProfile } = await import('../services/authService');
          const profile = await getUserProfile();
          if (profile) {
            setResumeData(prev => ({
              ...prev,
              personalInfo: {
                fullName: profile.name || prev.personalInfo.fullName,
                email: profile.email || prev.personalInfo.email,
                phone: profile.phone || prev.personalInfo.phone,
                linkedin: profile.linkedin || prev.personalInfo.linkedin,
                location: profile.location || prev.personalInfo.location,
                summary: profile.summary || prev.personalInfo.summary,
              },
              education: profile.education?.length > 0 ? profile.education.map(e => ({ ...e, id: e._id || Date.now() })) : prev.education,
              experience: profile.experience?.length > 0 ? profile.experience.map(e => ({ ...e, id: e._id || Date.now() })) : prev.experience,
              internships: profile.internships?.length > 0 ? profile.internships.map(e => ({ ...e, id: e._id || Date.now() })) : prev.internships,
              skills: profile.skills?.length > 0 ? profile.skills : prev.skills,
              projects: profile.projects?.length > 0 ? profile.projects.map(p => ({ ...p, id: p._id || Date.now() })) : prev.projects,
              profileLocked: profile.profileLocked,
              isAdmin: profile.isAdmin,
            }));
          }
        } catch (error) {
          console.error('Failed to sync profile from backend:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

  // Sync with backend
  const syncProfileWithBackend = async (overrideData = null) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const { updateUserProfile } = await import('../services/authService');

      const profileToSync = {
        name: overrideData?.fullName || resumeData.personalInfo.fullName,
        email: overrideData?.email || resumeData.personalInfo.email,
        phone: overrideData?.phone || resumeData.personalInfo.phone,
        linkedin: overrideData?.linkedin || resumeData.personalInfo.linkedin,
        location: overrideData?.location || resumeData.personalInfo.location,
        summary: overrideData?.summary || resumeData.personalInfo.summary,
        education: resumeData.education,
        experience: resumeData.experience,
        internships: resumeData.internships,
        skills: resumeData.skills,
        projects: resumeData.projects,
        profileLocked: overrideData?.profileLocked !== undefined ? overrideData.profileLocked : resumeData.profileLocked,
      };

      const updatedProfile = await updateUserProfile(profileToSync);

      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          fullName: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          linkedin: updatedProfile.linkedin,
          location: updatedProfile.location,
          summary: updatedProfile.summary,
        },
        education: (updatedProfile.education || []).map(e => ({ ...e, id: e._id || e.id || Date.now() })),
        experience: (updatedProfile.experience || []).map(e => ({ ...e, id: e._id || e.id || Date.now() })),
        internships: (updatedProfile.internships || []).map(e => ({ ...e, id: e._id || e.id || Date.now() })),
        skills: updatedProfile.skills || [],
        projects: (updatedProfile.projects || []).map(p => ({ ...p, id: p._id || p.id || Date.now() })),
        profileLocked: updatedProfile.profileLocked || false,
        isAdmin: updatedProfile.isAdmin || false,
      }));

      return updatedProfile;
    } finally {
      setLoading(false);
    }
  };

  // Update logic
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSectionToggle = (section, value) => {
    setResumeData(prev => ({
      ...prev,
      enabledSections: { ...prev.enabledSections, [section]: value }
    }));
  };

  const setFresherMode = (value) => {
    setResumeData(prev => ({
      ...prev,
      isFresher: value,
      enabledSections: {
        ...prev.enabledSections,
        experience: !value,
        internships: value
      }
    }));
  };

  const addEntry = (section) => {
    const newEntry = section === 'skills' ? '' : { id: Date.now() };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry]
    }));
  };

  const removeEntry = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const updateEntry = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      setResumeData,
      updatePersonalInfo,
      updateSectionToggle,
      setFresherMode,
      addEntry,
      removeEntry,
      updateEntry,
      loading,
      syncProfileWithBackend,
      setSelectedTemplate: (id) => setResumeData(prev => ({ ...prev, selectedTemplate: id })),
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
