import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Loader2, 
  Clock,
  Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingMap, setIsApplyingMap] = useState({});

  // Sync jobs list from database
  const fetchJobs = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to load jobs list", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Real-time active polling (updates job listings every 4 seconds)
  useEffect(() => {
    fetchJobs(true);

    const poller = setInterval(() => {
      fetchJobs(false);
    }, 4000);

    return () => clearInterval(poller);
  }, []);

  const handleApplyToJob = async (jobId) => {
    try {
      setIsApplyingMap(prev => ({ ...prev, [jobId]: true }));
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh jobs list immediately
      fetchJobs(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register application.");
    } finally {
      setIsApplyingMap(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // Filtering based on search query
  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.requirements?.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex bg-slate-50 min-h-screen overflow-x-hidden">
      {/* Sidebar - Hover-Expandable */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-20 min-h-screen transition-all duration-300 overflow-hidden text-left">
        <div className="max-w-6xl mx-auto px-4 md:px-12 pt-10 pb-12 w-full space-y-8">
          
          {/* Header section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs bg-orange-500/10 text-orange-600 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Explore Careers
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3 flex items-center gap-2">
                <Briefcase className="text-orange-500" size={32} /> Career Opportunities
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Apply directly to hand-picked professional positions posted by recruiters in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shrink-0 font-mono text-xs text-emerald-600 shadow-sm">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse-ring" />
              Real-time Postings Active
            </div>
          </header>

          {/* Search Filtering */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800 shadow-sm transition-all text-sm text-slate-700 font-medium"
              placeholder="Search jobs by title, company, location, or skill requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex h-60 flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-orange-500 w-10 h-10 mb-4" />
              <p className="text-slate-500 text-sm font-semibold">Scanning available job listings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Job Postings Match</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Check back shortly! New jobs uploaded by the recruiter appear here instantly in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map(job => {
                const hasApplied = job.applicants?.some(app => app._id === user?._id);
                return (
                  <div 
                    key={job._id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-all duration-200 hover:border-slate-300 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-900 leading-snug">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-400">
                            <span className="text-slate-600 font-bold">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                          </div>
                        </div>
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">
                          {job.salary || 'Competitive'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mt-4">
                        {job.description}
                      </p>

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                          {job.requirements.map((req, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <Clock size={10} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>

                      {hasApplied ? (
                        <div className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 size={14} /> Applied / Chosen
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyToJob(job._id)}
                          disabled={isApplyingMap[job._id]}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 px-5 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer hover:gap-2 active:scale-95 disabled:opacity-40 shrink-0 shadow-sm"
                        >
                          {isApplyingMap[job._id] ? 'Applying...' : <><ArrowRight size={14} /> Choose / Apply</>}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default JobsPage;
