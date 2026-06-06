import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/resume';

// Helper to get token from localStorage (assuming it's stored there)
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11);
};

const initialState = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        location: '',
        summary: '',
    },
    education: [{ id: generateId(), school: '', degree: '', year: '', location: '' }],
    experience: [{ id: generateId(), company: '', position: '', duration: '', description: '' }],
    internships: [{ id: generateId(), company: '', position: '', duration: '', description: '' }],
    skills: [],
    projects: [{ id: generateId(), title: '', description: '', link: '' }],
    isFresher: false,
    enabledSections: {
        education: true,
        experience: true,
        internships: false,
        skills: true,
        projects: true,
        summary: true,
    },
    // AI Related fields
    jobDescription: '',
    isAIGenerating: false,
    atsScore: null,
    missingKeywords: [],
    matchedKeywords: [],
    suggestedSkills: [],
    aiImprovements: '',
};

const useResumeStore = create((set, get) => ({
    // State
    currentResumeId: null,
    selectedTemplate: 'classic',
    currentResumeData: initialState,
    resumeList: [],
    isSaving: false,
    isLoading: false,
    error: null,
    aiThemeConfig: null,

    // Actions
    setAiThemeConfig: (config) => set({ aiThemeConfig: config }),
    setTemplate: (templateId) => set({ selectedTemplate: templateId }),
    
    setResumeData: (data) => set((state) => ({
        currentResumeData: typeof data === 'function' ? data(state.currentResumeData) : data
    })),

    // AI Actions
    updateJobDescription: (desc) => set((state) => ({
        currentResumeData: { ...state.currentResumeData, jobDescription: desc }
    })),

    setAIGenerating: (val) => set((state) => ({
        currentResumeData: { ...state.currentResumeData, isAIGenerating: val }
    })),

    applyAIResume: (data) => set((state) => ({
        currentResumeData: {
            ...state.currentResumeData,
            personalInfo: {
                ...state.currentResumeData.personalInfo,
                summary: data.personalInfo.summary
            },
            experience: data.experience || state.currentResumeData.experience,
            internships: data.internships || state.currentResumeData.internships,
            projects: data.projects || state.currentResumeData.projects,
            skills: data.skills || state.currentResumeData.skills,
            suggestedSkills: data.suggestedSkills || [],
            atsScore: data.atsScore,
            missingKeywords: data.missingKeywords || [],
            aiImprovements: data.improvements || '',
            isAIGenerating: false
        }
    })),

    applyATSAnalysis: (data) => set((state) => ({
        currentResumeData: {
            ...state.currentResumeData,
            atsScore: data.atsScore,
            matchedKeywords: data.matchedKeywords || [],
            missingKeywords: data.missingKeywords || [],
            aiImprovements: data.suggestions?.join(' ') || '',
            isAIGenerating: false
        }
    })),

    updateResumeData: (section, field, value) => set((state) => {
        const newData = { ...state.currentResumeData };
        if (section === 'personalInfo') {
            newData.personalInfo = { ...newData.personalInfo, [field]: value };
        } else if (Array.isArray(newData[section])) {
            newData[section] = newData[section].map(item => 
                item.id === field ? { ...item, [value.name]: value.val } : item
            );
        } else if (section === 'enabledSections') {
            newData.enabledSections = { ...newData.enabledSections, [field]: value };
        }
        return { currentResumeData: newData };
    }),

    // Backend Synchronisation
    fetchResumes: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(API_BASE_URL, { headers: getAuthHeader() });
            set({ resumeList: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    loadResume: (resume) => {
        set({
            currentResumeId: resume._id,
            selectedTemplate: resume.template || resume.templateId || 'classic',
            currentResumeData: {
                ...initialState,
                ...resume,
                personalInfo: {
                    fullName: resume.personalInfo?.name || '',
                    email: resume.personalInfo?.email || '',
                    phone: resume.personalInfo?.phone || '',
                    linkedin: resume.personalInfo?.linkedin || '',
                    location: resume.personalInfo?.location || '',
                    summary: resume.summary || '',
                },
                // Merge other arrays if they exist in the root or in a sub-object
                experience: resume.experience || [],
                education: resume.education || [],
                projects: resume.projects || [],
                skills: resume.skills || [],
                atsScore: resume.atsScore || null,
            },
            error: null
        });
    },

    saveResume: async () => {
        const { currentResumeId, selectedTemplate, currentResumeData } = get();
        set({ isSaving: true });

        // Structured payload for the new schema
        const payload = {
            title: currentResumeData.personalInfo.fullName ? `${currentResumeData.personalInfo.fullName}'s Resume` : 'My Resume',
            template: selectedTemplate,
            personalInfo: {
                name: currentResumeData.personalInfo.fullName,
                email: currentResumeData.personalInfo.email,
                phone: currentResumeData.personalInfo.phone,
                linkedin: currentResumeData.personalInfo.linkedin,
            },
            summary: currentResumeData.personalInfo.summary,
            skills: currentResumeData.skills,
            education: currentResumeData.education,
            experience: currentResumeData.isFresher ? [] : currentResumeData.experience,
            projects: currentResumeData.projects,
            atsScore: currentResumeData.atsScore,
        };

        try {
            let response;
            if (currentResumeId) {
                // Update
                response = await axios.put(`${API_BASE_URL}/${currentResumeId}`, payload, { headers: getAuthHeader() });
            } else {
                // Create
                response = await axios.post(API_BASE_URL, payload, { headers: getAuthHeader() });
                set({ currentResumeId: response.data._id });
            }
            
            // Refresh list
            get().fetchResumes();
            set({ isSaving: false, error: null });
            return response.data;
        } catch (error) {
            set({ isSaving: false, error: error.message });
            throw error;
        }
    },

    deleteResume: async (id) => {
        try {
            // Optimistic UI update
            set((state) => ({
                resumeList: state.resumeList.filter(r => r._id !== id)
            }));
            await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeader() });
            get().fetchResumes(); // Ensure sync
        } catch (error) {
            set({ error: error.message });
            get().fetchResumes(); // Rollback if failed
        }
    },

    updateEntry: (section, id, field, value) => set((state) => ({
        currentResumeData: {
            ...state.currentResumeData,
            [section]: state.currentResumeData[section].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }
    })),

    addEntry: (section) => set((state) => {
        const newEntry = section === 'skills' ? '' : { id: generateId() };
        return {
            currentResumeData: {
                ...state.currentResumeData,
                [section]: [...state.currentResumeData[section], newEntry]
            }
        };
    }),

    removeEntry: (section, id) => set((state) => ({
        currentResumeData: {
            ...state.currentResumeData,
            [section]: state.currentResumeData[section].filter(item => item.id !== id)
        }
    })),

    setFresherMode: (value) => set((state) => ({
        currentResumeData: {
            ...state.currentResumeData,
            isFresher: value,
            enabledSections: {
                ...state.currentResumeData.enabledSections,
                experience: !value,
                internships: value
            }
        }
    })),

    resetResume: () => set({
        currentResumeId: null,
        selectedTemplate: 'classic',
        currentResumeData: initialState,
        aiThemeConfig: null,
        error: null
    })
}));


export default useResumeStore;
