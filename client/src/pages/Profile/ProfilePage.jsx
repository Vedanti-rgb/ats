import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  User,
  Settings,
  Search as Bell,
  User as Shield,
  Layout as Moon,
  Mail,
  Phone,
  MapPin,
  PlusCircle as Save,
  Layout as CreditCard,
  PlusCircle as Sparkles,
  Lock,
  CheckCircle,
  Info,
  Loader2,
  AlertCircle,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  X,
  Link
} from 'lucide-react';

import { isLiveSession } from '../../services/authService';

// --- Static Data ---
const TABS = [
  { id: 'profile', name: 'Profile Information', icon: User },
  { id: 'resume', name: 'Resume Data', icon: FileText },
  { id: 'settings', name: 'Preferences', icon: Settings },
  { id: 'billing', name: 'Subscription', icon: CreditCard },
];

// --- Sub-components (Defined outside to prevent focus loss) ---

const AddDataModal = ({ show, section, onClose, onSubmit }) => {
  if (!show) return null;
  
  const sectionTitles = {
    education: 'Education',
    experience: 'Work Experience',
    internships: 'Internship',
    projects: 'New Project'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-stone-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-black">Add {sectionTitles[section]}</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-stone-500 text-sm font-medium mb-8">
          Create a new entry for your {section}. You can fill in the details immediately after adding.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onSubmit} 
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 font-black uppercase tracking-widest text-xs"
          >
            Confirm & Add
          </Button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-stone-400 font-black uppercase tracking-widest text-[10px] hover:text-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ResumeDataSection = ({ resumeData, syncing, handleSync, openAddModal, handleRemove, updateEntry, setResumeData }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
      <div>
        <h3 className="text-2xl font-black text-black">Global Resume Data</h3>
        <p className="text-stone-500 text-sm font-medium">Manage your professional background used for AI resume generation.</p>
      </div>
      <Button
        onClick={() => handleSync()}
        disabled={syncing}
        className="flex items-center gap-2 px-8 py-3 bg-black hover:bg-stone-800 transition-all font-black uppercase tracking-widest text-xs"
      >
        {syncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {syncing ? 'Syncing...' : 'Save All Changes'}
      </Button>
    </div>

    <div className="grid grid-cols-1 gap-16">
      {/* Education */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><GraduationCap size={22} /></div>
            <h3 className="text-xl font-black text-black">Education</h3>
          </div>
          <button onClick={() => openAddModal('education')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase hover:bg-blue-100 transition-all">
            <Plus size={14} /> Add Education
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="p-6 bg-stone-50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative">
              <button onClick={() => handleRemove('education', edu.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
              <div className="space-y-3">
                <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none" value={edu.school} onChange={(e) => updateEntry('education', edu.id, 'school', e.target.value)} placeholder="University Name" />
                <input className="w-full bg-transparent text-xs font-bold text-stone-600 focus:outline-none" value={edu.degree} onChange={(e) => updateEntry('education', edu.id, 'degree', e.target.value)} placeholder="Degree / Field" />
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-stone-400">
                  <div className="flex items-center gap-1.5 flex-1"><MapPin size={12} /><input className="w-full bg-transparent focus:outline-none" value={edu.location} onChange={(e) => updateEntry('education', edu.id, 'location', e.target.value)} placeholder="Location" /></div>
                  <div className="flex items-center gap-1.5"><Settings size={12} /><input className="w-20 bg-transparent focus:outline-none text-right" value={edu.year} onChange={(e) => updateEntry('education', edu.id, 'year', e.target.value)} placeholder="Year" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><Briefcase size={22} /></div>
            <h3 className="text-xl font-black text-black">Work Experience</h3>
          </div>
          <button onClick={() => openAddModal('experience')} className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black uppercase hover:bg-orange-100 transition-all">
            <Plus size={14} /> Add Experience
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="p-6 bg-stone-50 rounded-3xl border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all group relative">
              <button onClick={() => handleRemove('experience', exp.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none" value={exp.company} onChange={(e) => updateEntry('experience', exp.id, 'company', e.target.value)} placeholder="Company" />
                <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none" value={exp.position} onChange={(e) => updateEntry('experience', exp.id, 'position', e.target.value)} placeholder="Position" />
              </div>
              <input className="w-full bg-transparent text-[11px] font-black text-stone-400 mb-2 focus:outline-none uppercase tracking-wider" value={exp.duration} onChange={(e) => updateEntry('experience', exp.id, 'duration', e.target.value)} placeholder="Duration" />
              <textarea className="w-full bg-transparent text-[11px] text-stone-500 focus:outline-none min-h-[60px] resize-none leading-relaxed" value={exp.description} onChange={(e) => updateEntry('experience', exp.id, 'description', e.target.value)} placeholder="Description..." />
            </div>
          ))}
        </div>
      </section>

      {/* Internships */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Award size={22} /></div>
            <h3 className="text-xl font-black text-black">Internships</h3>
          </div>
          <button onClick={() => openAddModal('internships')} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-black uppercase hover:bg-purple-100 transition-all">
            <Plus size={14} /> Add Internship
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.internships.map((intern) => (
            <div key={intern.id} className="p-6 bg-stone-50 rounded-3xl border border-transparent hover:border-purple-100 hover:bg-white hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative">
              <button onClick={() => handleRemove('internships', intern.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none" value={intern.company} onChange={(e) => updateEntry('internships', intern.id, 'company', e.target.value)} placeholder="Company" />
                <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none" value={intern.position} onChange={(e) => updateEntry('internships', intern.id, 'position', e.target.value)} placeholder="Position" />
              </div>
              <input className="w-full bg-transparent text-[11px] font-black text-stone-400 mb-2 focus:outline-none uppercase" value={intern.duration} onChange={(e) => updateEntry('internships', intern.id, 'duration', e.target.value)} placeholder="Duration" />
              <textarea className="w-full bg-transparent text-[11px] text-stone-500 focus:outline-none min-h-[40px] resize-none" value={intern.description} onChange={(e) => updateEntry('internships', intern.id, 'description', e.target.value)} placeholder="Description..." />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><Code size={22} /></div>
            <h3 className="text-xl font-black text-black">Core Skills</h3>
          </div>
          <input 
            className="px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold focus:outline-none focus:border-green-500 transition-all"
            placeholder="Type & Press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                const newSkills = [...resumeData.skills, e.target.value.trim()];
                setResumeData(prev => ({ ...prev, skills: newSkills }));
                e.target.value = '';
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {resumeData.skills.map((skill, idx) => (
            <span key={idx} className="px-5 py-2.5 bg-stone-50 text-stone-600 text-xs font-black rounded-2xl border border-stone-200 hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-3 group">
              {skill}
              <button onClick={() => setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }))} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><X size={12} /></button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl"><BookOpen size={22} /></div>
            <h3 className="text-xl font-black text-black">Projects</h3>
          </div>
          <button onClick={() => openAddModal('projects')} className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-black uppercase hover:bg-pink-100 transition-all">
            <Plus size={14} /> Add Project
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.projects.map((project) => (
            <div key={project.id} className="p-6 bg-stone-50 rounded-3xl border border-transparent hover:border-pink-100 hover:bg-white hover:shadow-xl hover:shadow-pink-500/5 transition-all group relative">
              <button onClick={() => handleRemove('projects', project.id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
              <input className="w-full bg-transparent text-sm font-black text-black focus:outline-none mb-1" value={project.title} onChange={(e) => updateEntry('projects', project.id, 'title', e.target.value)} placeholder="Project Title" />
              <textarea className="w-full bg-transparent text-[11px] text-stone-500 focus:outline-none mb-3 min-h-[50px] resize-none" value={project.description} onChange={(e) => updateEntry('projects', project.id, 'description', e.target.value)} placeholder="Description..." />
              <div className="flex items-center gap-2 text-pink-500"><Link size={12} /><input className="w-full bg-transparent text-[10px] font-black focus:outline-none" value={project.link} onChange={(e) => updateEntry('projects', project.id, 'link', e.target.value)} placeholder="Link (URL)" /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const ProfileSection = ({ resumeData, isLive, isLocked, syncing, handleSync, handleInfoChange, showSuccess, localError }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-2xl font-black text-black">Personal Details</h3>
          {isLive && <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live MongoDB</span>}
        </div>
        <p className="text-stone-500 text-sm font-medium mt-1">Update your global contact information used across all resumes.</p>
        {isLocked && <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl w-fit"><Lock size={13} className="text-orange-500" /><span className="text-xs font-bold text-orange-600">Identity fields are locked for security.</span></div>}
      </div>
      <Button onClick={() => handleSync()} disabled={syncing} className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 transition-all font-black uppercase tracking-widest text-xs">
        {syncing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {syncing ? 'Syncing...' : 'Save Changes'}
      </Button>
    </div>

    {resumeData.isAdmin && (
      <div className="flex items-center justify-between gap-4 px-6 py-5 bg-stone-950 rounded-3xl border border-orange-500/30 shadow-2xl animate-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-500"><Shield size={22} /></div>
          <div><p className="text-sm font-black text-white tracking-tight">Admin Privileges Active</p><p className="text-[11px] text-stone-400 font-bold uppercase">Toggle identity locks below</p></div>
        </div>
        <Button onClick={() => handleSync({ profileLocked: !resumeData.profileLocked })} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${resumeData.profileLocked ? 'bg-orange-500 text-white' : 'bg-white/5 text-stone-400'}`}>
          {resumeData.profileLocked ? 'Unlock Profile' : 'Lock Profile'}
        </Button>
      </div>
    )}

    {showSuccess && <div className="px-5 py-4 bg-green-50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 flex items-center gap-3"><CheckCircle size={20} className="text-green-500" /><span className="text-sm font-black text-green-800">Profile Synced Successfully!</span></div>}
    {localError && <div className="px-5 py-4 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-top-2 flex items-center gap-3"><AlertCircle size={20} className="text-red-500" /><span className="text-sm font-black text-red-800">{localError}</span></div>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(e) => handleInfoChange('fullName', e.target.value)} disabled={isLocked} placeholder="John Doe" className={isLocked ? 'opacity-80 bg-stone-50' : 'bg-white border-orange-100'} />
        <Input label="Email Address" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} placeholder="john@example.com" className="bg-white border-orange-100" />
        <Input label="Phone Number" value={resumeData.personalInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} disabled={isLocked} placeholder="+91 98765 43210" className={isLocked ? 'opacity-80 bg-stone-50' : 'bg-white border-orange-100'} />
      </div>
      <div className="space-y-6">
        <Input label="LinkedIn URL" value={resumeData.personalInfo.linkedin} onChange={(e) => handleInfoChange('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" className="bg-white border-orange-100" />
        <Input label="Current Location" value={resumeData.personalInfo.location} onChange={(e) => handleInfoChange('location', e.target.value)} placeholder="Mumbai, India" className="bg-white border-orange-100" />
        <div className="space-y-1.5"><label className="text-sm font-bold text-stone-700 ml-1">Professional Summary</label><textarea value={resumeData.personalInfo.summary} onChange={(e) => handleInfoChange('summary', e.target.value)} className="w-full h-32 p-4 rounded-2xl border border-orange-100 bg-white focus:ring-2 focus:ring-orange-500/20 text-sm font-bold resize-none transition-all outline-none" placeholder="Tell us about your background..." /></div>
      </div>
    </div>
  </div>
);

const SettingsSection = () => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) return JSON.parse(saved);
    return {
      pushNotifications: true,
      accountPrivacy: false,
      darkMode: false,
      emailSummaries: true
    };
  });

  const togglePref = (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    if (key === 'darkMode') {
      if (newPrefs[key]) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const prefList = [
    { key: 'pushNotifications', title: 'Push Notifications', desc: 'Real-time alerts about recruiter views.', icon: Bell, active: preferences.pushNotifications },
    { key: 'accountPrivacy', title: 'Account Privacy', desc: 'Control public link visibility.', icon: Shield, active: preferences.accountPrivacy },
    { key: 'darkMode', title: 'Dark Mode', desc: 'Toggle visual theme.', icon: Moon, active: preferences.darkMode },
    { key: 'emailSummaries', title: 'Email Summaries', desc: 'Weekly career progress reports.', icon: Mail, active: preferences.emailSummaries }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {prefList.map((pref) => (
          <div key={pref.key} onClick={() => togglePref(pref.key)} className="p-6 bg-stone-50 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className={`p-3 bg-white rounded-2xl border border-black/5 transition-colors shrink-0 ${pref.active ? 'text-orange-500' : 'text-stone-400 group-hover:text-orange-500'}`}>
                <pref.icon size={20} />
              </div>
              <div><h4 className="text-sm font-black text-black mb-1">{pref.title}</h4><p className="text-xs text-stone-400 font-medium">{pref.desc}</p></div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${pref.active ? 'bg-orange-500' : 'bg-stone-200'}`}>
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ProfilePage = () => {
  const { 
    resumeData, 
    updatePersonalInfo, 
    syncProfileWithBackend, 
    loading: contextLoading,
    addEntry,
    removeEntry,
    updateEntry,
    setResumeData
  } = useResume();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [syncing, setSyncing] = useState(false);
  
  // State for Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalSection, setModalSection] = useState(null);

  const isLocked = resumeData.profileLocked;
  const isLive = isLiveSession();

  const handleInfoChange = (field, value) => {
    if (isLocked && (field === 'fullName' || field === 'phone')) return;
    updatePersonalInfo(field, value);
    setLocalError('');
  };

  const handleSync = async (overrideData = null) => {
    setSyncing(true);
    setLocalError('');
    try {
      await syncProfileWithBackend(overrideData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    } catch (err) {
      setLocalError(err.message || 'Failed to sync with database.');
    } finally {
      setSyncing(false);
    }
  };

  const handleRemove = async (section, id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      removeEntry(section, id);
      await handleSync();
    }
  };

  const openAddModal = (section) => {
    setModalSection(section);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setModalSection(null);
  };

  const handleAddSubmit = async () => {
    addEntry(modalSection);
    await handleSync();
    closeAddModal();
  };

  return (
    <div className="flex bg-white min-h-screen overflow-x-hidden text-black">
      <Sidebar />
      <main className="flex-1 ml-20 min-h-screen transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <header className="flex flex-col md:flex-row items-center gap-10 mb-20 bg-stone-50 p-12 rounded-[56px] border border-black/[0.02] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full" />
            <div className="relative group">
              <div className="h-32 w-32 rounded-[40px] bg-orange-500 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-orange-500/30 overflow-hidden relative">
                {resumeData.personalInfo.fullName?.charAt(0) || 'U'}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity cursor-pointer flex items-center justify-center"><User size={32} /></div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-black/5 text-orange-500"><Sparkles size={16} fill="currentColor" /></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-3">
                <h1 className="text-4xl font-black tracking-tight">{resumeData.personalInfo.fullName || 'Complete Your Profile'}</h1>
                <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Premium Member</span>
                {isLocked && <span className="flex items-center gap-1 px-3 py-1 bg-white text-orange-500 text-[10px] font-black rounded-lg border border-orange-500 uppercase"><Lock size={10} fill="currentColor" /> Verified</span>}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-stone-500 font-bold text-sm">
                <div className="flex items-center gap-2"><Mail size={16} /> {resumeData.personalInfo.email}</div>
                <div className="flex items-center gap-2"><Phone size={16} /> {resumeData.personalInfo.phone}</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> {resumeData.personalInfo.location}</div>
              </div>
            </div>
          </header>

          <div className="flex gap-4 p-2 bg-stone-50 rounded-3xl w-fit mb-16">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-white text-orange-500 shadow-xl scale-[1.02]' : 'text-stone-400 hover:text-black'}`}>
                <tab.icon size={18} />{tab.name}
              </button>
            ))}
          </div>

          {contextLoading ? (
            <div className="h-64 flex flex-col items-center justify-center"><Loader2 size={48} className="text-orange-500 animate-spin mb-4" /><p className="text-stone-400 font-black uppercase tracking-widest text-xs">Syncing with MongoDB Cloud...</p></div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <ProfileSection 
                  resumeData={resumeData}
                  isLive={isLive}
                  isLocked={isLocked}
                  syncing={syncing}
                  handleSync={handleSync}
                  handleInfoChange={handleInfoChange}
                  showSuccess={showSuccess}
                  localError={localError}
                />
              )}
              {activeTab === 'resume' && (
                <ResumeDataSection 
                  resumeData={resumeData}
                  syncing={syncing}
                  handleSync={handleSync}
                  openAddModal={openAddModal}
                  handleRemove={handleRemove}
                  updateEntry={updateEntry}
                  setResumeData={setResumeData}
                />
              )}
              {activeTab === 'settings' && <SettingsSection />}
              {activeTab === 'billing' && <div className="h-64 flex flex-col items-center justify-center bg-stone-50 rounded-[48px] border-2 border-dashed border-stone-200 animate-pulse"><CreditCard size={48} className="text-stone-200 mb-4" /><p className="text-stone-400 font-black uppercase text-xs">Coming Soon</p></div>}
            </>
          )}
        </div>
      </main>
      <AddDataModal 
        show={showAddModal}
        section={modalSection}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default ProfilePage;