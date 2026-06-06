import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  Briefcase, 
  ShieldAlert, 
  Activity, 
  Lock, 
  Unlock, 
  Trash2, 
  PlusCircle, 
  Search, 
  Download, 
  X, 
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Button from '../common/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPortal = () => {
  // Tabs: 'users', 'resumes', 'jobs', 'tests'
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tests, setTests] = useState([]);

  // UI / Modal States
  const [selectedResume, setSelectedResume] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: ''
  });
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Real-time notification lists
  const [notifications, setNotifications] = useState([]);
  const previousUsersStateRef = useRef([]);

  // Headers for Authorization
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Main fetch loop
  const fetchData = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const [usersRes, resumesRes, jobsRes, testsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, getAuthHeaders()),
        axios.get(`${API_URL}/api/admin/resumes`, getAuthHeaders()),
        axios.get(`${API_URL}/api/jobs`, getAuthHeaders()),
        axios.get(`${API_URL}/api/admin/tests`, getAuthHeaders())
      ]);

      const currentUsers = usersRes.data || [];
      setUsers(currentUsers);
      setResumes(resumesRes.data || []);
      setJobs(jobsRes.data || []);
      setTests(testsRes.data || []);

      // Real-time login/registration detection logic
      const prevUsers = previousUsersStateRef.current;
      if (prevUsers.length > 0) {
        currentUsers.forEach(currUser => {
          const prevUser = prevUsers.find(p => p._id === currUser._id);
          
          // Case 1: New user registration detected
          if (!prevUser) {
            triggerNotification(`🎉 New user registered: ${currUser.name} (${currUser.email})`);
          } 
          // Case 2: New user login detected (check lastLogin timestamp changed)
          else if (currUser.lastLogin && (!prevUser.lastLogin || currUser.lastLogin !== prevUser.lastLogin)) {
            triggerNotification(`🟢 User logged in: ${currUser.name}`);
          }
        });
      }
      previousUsersStateRef.current = currentUsers;
    } catch (err) {
      console.error("Failed to load admin data", err);
      setError("Failed to sync admin logs. Make sure you are logged in as an administrator.");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Toast Notification handler
  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  // Poller setup for real-time notifications (polls every 4 seconds)
  useEffect(() => {
    fetchData(true);

    const poller = setInterval(() => {
      fetchData(false);
    }, 4000);

    return () => clearInterval(poller);
  }, []);

  // Lock / Unlock candidates
  const handleToggleLock = async (userId) => {
    try {
      setError('');
      const res = await axios.put(`${API_URL}/api/admin/users/${userId}/toggle-lock`, {}, getAuthHeaders());
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, profileLocked: res.data.profileLocked } : u));
      triggerNotification(`🔒 Security status toggled for user: ${res.data.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user profile lock status.');
    }
  };

  // Job posting logic
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      setError('Please fill in all mandatory job fields.');
      return;
    }

    try {
      setIsSubmittingJob(true);
      setError('');
      setSuccessMsg('');
      const res = await axios.post(`${API_URL}/api/jobs`, newJob, getAuthHeaders());
      setJobs(prev => [res.data, ...prev]);
      setSuccessMsg('Job posting created successfully!');
      setNewJob({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requirements: ''
      });
      triggerNotification(`💼 Posted new job opening: ${res.data.title} at ${res.data.company}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job listing.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  // Job deletion logic
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      setError('');
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, getAuthHeaders());
      setJobs(prev => prev.filter(j => j._id !== jobId));
      triggerNotification(`🗑️ Deleted job listing.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job listing.');
    }
  };

  // Calculate quick analytics
  const getAnalytics = () => {
    const totalUsersCount = users.filter(u => !u.isAdmin).length;
    const resumesCount = resumes.length;
    const activeJobsCount = jobs.length;
    
    // Average ATS Score
    const totalAts = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
    const avgAtsScore = resumesCount > 0 ? Math.round(totalAts / resumesCount) : 0;

    // Total Applications
    const totalApps = jobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);

    // Total tests taken
    const totalTestsCount = tests.length;
    const suspiciousTests = tests.filter(t => t.cheatingDetected).length;

    return {
      totalUsersCount,
      resumesCount,
      activeJobsCount,
      avgAtsScore,
      totalApps,
      totalTestsCount,
      suspiciousTests
    };
  };

  const stats = getAnalytics();

  // Print/Download Resume from Admin Modal
  const handlePrintResume = () => {
    window.print();
  };

  // Filtering data based on query
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResumes = resumes.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personalInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTests = tests.filter(t => 
    t.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.resumeId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full text-slate-800">
      
      {/* Toast Notification Alert Stream (Top-Right) */}
      <div className="fixed top-6 right-6 z-[100] w-96 space-y-3 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="bg-slate-900 border-l-4 border-orange-500 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-slideIn pointer-events-auto border border-slate-800"
          >
            <Activity className="text-orange-500 shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-xs font-semibold leading-snug">{n.message}</p>
              <span className="text-[9px] font-mono text-slate-400 block mt-1">{n.time}</span>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Admin Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-lg border border-slate-800 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            ADMINISTRATOR HUB ACTIVE
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-3">Executive Administration Console</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time candidate indexing, resume review, secure proctoring tracking, and jobs postings.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0 font-mono text-xs text-emerald-400">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse-ring" />
          SYSTEM LIVE SYNC ACTIVE
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-6 rounded-r-xl shadow-sm">
          <div className="flex gap-3">
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
            <p className="text-rose-800 text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Analytics Summary Scoreboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Candidates</span>
            <Users className="text-blue-500 w-5 h-5" />
          </div>
          <span className="text-2xl font-black block mt-2">{stats.totalUsersCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Resumes in DB</span>
            <FileText className="text-purple-500 w-5 h-5" />
          </div>
          <span className="text-2xl font-black block mt-2">{stats.resumesCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Average ATS</span>
            <CheckCircle className="text-emerald-500 w-5 h-5" />
          </div>
          <span className="text-2xl font-black block mt-2">{stats.avgAtsScore}%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Job postings</span>
            <Briefcase className="text-orange-500 w-5 h-5" />
          </div>
          <span className="text-2xl font-black block mt-2">{stats.activeJobsCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Security Flags</span>
            <ShieldAlert className="text-rose-500 w-5 h-5" />
          </div>
          <span className="text-2xl font-black block mt-2 text-rose-600">
            {stats.suspiciousTests} <span className="text-xs font-bold text-slate-400">/ {stats.totalTestsCount} tests</span>
          </span>
        </div>
      </div>

      {/* Main Console Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Navigation Sidebar inside Admin Portal */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">Navigation Menu</div>
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'users' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users size={16} /> 👥 Users Directory
              </button>

              <button
                onClick={() => { setActiveTab('resumes'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'resumes' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <FileText size={16} /> 📄 All Resumes
              </button>

              <button
                onClick={() => { setActiveTab('jobs'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'jobs' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Briefcase size={16} /> 💼 Jobs Posting Manager
              </button>

              <button
                onClick={() => { setActiveTab('tests'); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'tests' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldAlert size={16} /> 🛡️ Secure Proctor Logs
              </button>
            </nav>
          </div>

          {/* Mini active events ticker in Admin Sidebar */}
          <div className="bg-slate-950 text-slate-400 p-4 rounded-2xl border border-slate-800 text-[10px] font-mono leading-relaxed space-y-2 h-[160px] flex flex-col justify-between overflow-hidden">
            <div className="font-bold border-b border-slate-900 pb-1 flex justify-between items-center text-slate-500">
              <span>🔔 LIVE LOG STREAM</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-ring" />
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-slate-700 italic">Listening for user logins and operations...</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="text-slate-300">
                    {n.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tab content area */}
        <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto">
          
          {/* Quick Filter Search Bar */}
          {activeTab !== 'jobs' && (
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all text-sm text-slate-700 font-medium"
                placeholder={`Search ${activeTab === 'users' ? 'candidates' : activeTab === 'resumes' ? 'resumes' : 'tests'} by query...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-500 w-10 h-10 mb-4" />
              <p className="text-slate-500 text-sm font-semibold">Updating administration logs...</p>
            </div>
          ) : (
            <>
              
              {/* TAB 1: USER DIRECTORY */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">👥 System Registered Candidates</h2>
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Last Login</th>
                          <th className="px-6 py-4">Access Level</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-8 text-slate-400 italic">No candidates matched the query.</td>
                          </tr>
                        ) : (
                          filteredUsers.map(u => (
                            <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-slate-950 font-bold block">{u.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">ID: {u._id}</span>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono">{u.email}</td>
                              <td className="px-6 py-4 text-xs">
                                {u.lastLogin ? (
                                  <span className="flex items-center gap-1.5 text-slate-600">
                                    <Clock size={12} className="text-slate-400" />
                                    {new Date(u.lastLogin).toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Never</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {u.isAdmin ? (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">Administrator</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Candidate</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {u.profileLocked ? (
                                  <span className="text-rose-600 bg-rose-50 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                                    <Lock size={10} /> Profile Locked
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                                    <Unlock size={10} /> Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {!u.isAdmin && (
                                  <button
                                    onClick={() => handleToggleLock(u._id)}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                      u.profileLocked 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                    }`}
                                  >
                                    {u.profileLocked ? 'Unlock Profile' : 'Lock Profile'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: RESUMES DIRECTORY */}
              {activeTab === 'resumes' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">📄 Candidate Resumes Database</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.length === 0 ? (
                      <div className="col-span-full text-center py-20 text-slate-400 italic">No candidate resumes found.</div>
                    ) : (
                      filteredResumes.map(r => {
                        const candidateName = r.personalInfo?.name || r.userId?.name || 'Unknown Candidate';
                        const candidateEmail = r.personalInfo?.email || r.userId?.email || 'No email';
                        return (
                          <div 
                            key={r._id} 
                            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow relative"
                          >
                            <div className="absolute top-4 right-4 text-xs font-black bg-slate-950 text-emerald-400 px-3 py-1 rounded-full border border-slate-800">
                              ATS: {r.atsScore || 0}%
                            </div>

                            <div className="space-y-3 mt-4">
                              <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Candidate</span>
                              <h3 className="text-base font-bold text-slate-950 leading-snug">{candidateName}</h3>
                              <p className="text-xs font-mono text-slate-500 truncate">{candidateEmail}</p>
                              
                              <div className="border-t border-slate-100 pt-3 space-y-1 mt-2">
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Resume Title</span>
                                <span className="text-xs font-bold text-slate-700 block truncate">{r.title}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedResume(r)}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <ExternalLink size={12} /> View/Download Resume
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: JOBS POSTINGS MANAGER */}
              {activeTab === 'jobs' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left panel: Post new job opening */}
                  <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5 h-fit">
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase border-b border-slate-200 pb-2">Post New Job Opening</h3>
                    
                    {successMsg && (
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg text-emerald-800 text-xs font-semibold">
                        {successMsg}
                      </div>
                    )}

                    <form onSubmit={handlePostJob} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Job Title *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          placeholder="e.g. Lead Software Engineer"
                          value={newJob.title}
                          onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Company Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          placeholder="e.g. Google DeepMind"
                          value={newJob.company}
                          onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Location *</label>
                          <input
                            type="text"
                            required
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                            placeholder="e.g. London, UK"
                            value={newJob.location}
                            onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Salary Range</label>
                          <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                            placeholder="e.g. $140,000 - $180,000"
                            value={newJob.salary}
                            onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Job Description *</label>
                        <textarea
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800 min-h-[100px] resize-y"
                          placeholder="Provide detailed duties, tech stack, and goals..."
                          value={newJob.description}
                          onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Key Requirements (Comma-separated)</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-800"
                          placeholder="e.g. React, Node.js, Python, Mongoose"
                          value={newJob.requirements}
                          onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmittingJob}
                        className="w-full flex items-center justify-center gap-1.5 text-xs py-3 font-bold"
                      >
                        {isSubmittingJob ? 'Creating Job...' : <><PlusCircle size={14} /> Create Job Posting</>}
                      </Button>
                    </form>
                  </div>

                  {/* Right panel: Active postings list with applicant overview */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase">Active Job Listings & Applicant Choice</h3>
                    
                    {jobs.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 italic text-sm">
                        No active jobs posted. Create one using the form on the left.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map(j => (
                          <div key={j._id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-bold text-slate-950 leading-snug">{j.title}</h4>
                                <div className="flex gap-3 text-xs font-semibold text-slate-400 mt-1">
                                  <span>{j.company}</span>
                                  <span>•</span>
                                  <span>{j.location}</span>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-bold">{j.salary}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteJob(j._id)}
                                className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-xl border border-rose-100 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed truncate">{j.description}</p>

                            {/* Applicants choice view */}
                            <div className="border-t border-slate-100 pt-4 space-y-3">
                              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                                Candidates applied / chose this job ({j.applicants?.length || 0})
                              </span>

                              {j.applicants && j.applicants.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {j.applicants.map(app => (
                                    <div key={app._id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold">
                                      <div>
                                        <span className="text-slate-900 block font-bold">{app.name}</span>
                                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{app.email}</span>
                                      </div>
                                      <span className="text-[9px] bg-slate-950 text-white font-mono px-2 py-0.5 rounded-full shrink-0">Selected</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic block">No candidates have applied/chose this opening yet.</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: SECURE PROCTOR LOGS */}
              {activeTab === 'tests' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">🛡️ AI Secure Proctoring Violations Logs</h2>
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Candidate</th>
                          <th className="px-6 py-4">Resume Context</th>
                          <th className="px-6 py-4">AI Score</th>
                          <th className="px-6 py-4">Browser Violations</th>
                          <th className="px-6 py-4">Security Level</th>
                          <th className="px-6 py-4">Assessment Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filteredTests.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-8 text-slate-400 italic">No security tests logs found.</td>
                          </tr>
                        ) : (
                          filteredTests.map(t => (
                            <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-slate-950 font-bold block">{t.userId?.name || 'Unknown User'}</span>
                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{t.userId?.email}</span>
                              </td>
                              <td className="px-6 py-4 text-xs">
                                {t.resumeId?.title || <span className="text-slate-400 italic">Deleted Resume</span>}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-base font-extrabold text-slate-950">{t.score}</span>
                                <span className="text-xs text-slate-400 font-bold">/100</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-0.5 text-xs text-slate-500 font-bold">
                                  <div>Tab Switches: <span className={t.tabSwitchesCount >= 3 ? 'text-red-500' : 'text-slate-700'}>{t.tabSwitchesCount || 0}</span></div>
                                  <div>Fullscreen Exits: <span className={t.fullscreenExitsCount >= 1 ? 'text-red-500' : 'text-slate-700'}>{t.fullscreenExitsCount || 0}</span></div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {t.cheatingDetected ? (
                                  <span className="text-rose-600 bg-rose-50 border border-rose-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                                    <ShieldAlert size={10} /> SUSPICION FLAGGED
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                                    <CheckCircle size={10} /> VERIFIED SECURE
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                                {new Date(t.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* OVERLAY MODAL: RESUME VIEW & DOWNLOAD */}
      {selectedResume && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-[90vh] animate-scaleUp">
            
            {/* Modal header */}
            <div className="bg-slate-950 text-white px-8 py-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest">Candidate Resume File</span>
                <h3 className="text-lg font-bold mt-0.5">{selectedResume.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handlePrintResume} 
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                >
                  <Download size={14} /> Download PDF / Print
                </Button>
                <button 
                  onClick={() => setSelectedResume(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal content (Render clean candidate resume view) */}
            <div className="flex-1 p-12 overflow-y-auto print:p-0 bg-stone-50 print:bg-white custom-scrollbar select-text text-left">
              <div id="printable-resume-area" className="bg-white p-10 shadow-sm border border-slate-200 max-w-3xl mx-auto rounded-2xl print:border-none print:shadow-none">
                
                {/* Header section */}
                <div className="border-b-2 border-slate-900 pb-6 text-center">
                  <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
                    {selectedResume.personalInfo?.name || selectedResume.userId?.name}
                  </h2>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 mt-3">
                    {selectedResume.personalInfo?.email && <span>📧 {selectedResume.personalInfo.email}</span>}
                    {selectedResume.personalInfo?.phone && <span>📞 {selectedResume.personalInfo.phone}</span>}
                    {selectedResume.personalInfo?.linkedin && (
                      <span className="truncate max-w-[200px]">🔗 {selectedResume.personalInfo.linkedin}</span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {selectedResume.summary && (
                  <div className="mt-8">
                    <h4 className="text-sm font-black uppercase text-slate-950 tracking-wider border-b border-slate-200 pb-1 mb-3">Professional Summary</h4>
                    <p className="text-slate-700 text-xs leading-relaxed">{selectedResume.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {selectedResume.skills && selectedResume.skills.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-black uppercase text-slate-950 tracking-wider border-b border-slate-200 pb-1 mb-3">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedResume.skills.map((s, i) => (
                        <span key={i} className="text-xs bg-slate-100 font-bold px-3 py-1 rounded text-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedResume.experience && selectedResume.experience.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-black uppercase text-slate-950 tracking-wider border-b border-slate-200 pb-1 mb-4">Professional Experience</h4>
                    <div className="space-y-5">
                      {selectedResume.experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between font-bold text-slate-950 text-xs">
                            <span>{exp.position} at {exp.company}</span>
                            <span className="text-slate-500">{exp.duration}</span>
                          </div>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedResume.education && selectedResume.education.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-black uppercase text-slate-950 tracking-wider border-b border-slate-200 pb-1 mb-4">Academic Credentials</h4>
                    <div className="space-y-3">
                      {selectedResume.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between font-bold text-slate-950 text-xs">
                          <span>{edu.degree} — {edu.school}</span>
                          <span className="text-slate-500">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedResume.projects && selectedResume.projects.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-black uppercase text-slate-950 tracking-wider border-b border-slate-200 pb-1 mb-4">Personal / Academic Projects</h4>
                    <div className="space-y-5">
                      {selectedResume.projects.map((proj, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-bold text-slate-950 text-xs">
                            <span>{proj.title}</span>
                            {proj.link && <span className="text-slate-400 font-semibold text-[10px] font-mono">{proj.link}</span>}
                          </div>
                          <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortal;
