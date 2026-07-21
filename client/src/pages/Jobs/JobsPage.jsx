import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import ApplyJobModal from '../../components/jobs/ApplyJobModal';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Search,
  Loader2,
  Clock,
  AlertCircle,
  X,
  FileText,
  Building,
  User,
  GraduationCap
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

const JobsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingMap, setIsApplyingMap] = useState({});
  
  // User Profile and Resume check states
  const [userProfile, setUserProfile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [criteriaJob, setCriteriaJob] = useState(null);

  // Apply modal state
  const [applyModalJob, setApplyModalJob] = useState(null);

  // Sync jobs list and eligibility calculations
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

  // Sync user profile & resumes list
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Load user profile details
      const profileRes = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(profileRes.data);

      // 2. Load resumes list to verify existence
      const resumeRes = await axios.get(`${API_URL}/api/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasResume(resumeRes.data && resumeRes.data.length > 0);
    } catch (err) {
      console.error("Failed to sync user data", err);
    }
  };

  useEffect(() => {
    fetchJobs(true);
    fetchUserData();

    const poller = setInterval(() => {
      fetchJobs(false);
      fetchUserData();
    }, 4000);

    return () => clearInterval(poller);
  }, []);

  const handleApplyToJob = (job) => {
    // Open the Apply modal — resume selection happens there
    setApplyModalJob(job);
  };

  const handleApplicationSuccess = () => {
    // Refresh job list after successful application
    fetchJobs(false);
    fetchUserData();
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
      <Sidebar />

      <main className="flex-1 ml-20 min-h-screen transition-all duration-300 overflow-hidden text-left relative">
        <div className="max-w-6xl mx-auto px-4 md:px-12 pt-10 pb-12 w-full space-y-8">

          {/* Header */}
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
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
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
                Check back shortly! New jobs uploaded by recruiters appear here instantly in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map(job => {
                const hasApplied = job.applicants?.some(app => app === user?._id || app._id === user?._id);
                const isEligible = job.eligible !== false;
                return (
                  <div
                    key={job._id}
                    className={`rounded-3xl border p-6 flex flex-col justify-between gap-6 transition-all duration-200 relative overflow-hidden ${
                      hasApplied 
                        ? 'bg-emerald-50/10 border-emerald-200/60 shadow-sm'
                        : !isEligible 
                        ? 'bg-rose-50/20 border-rose-100/80 shadow-sm hover:border-rose-200/90'
                        : 'bg-white border-slate-200 hover:shadow-md hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Eligibility / Applied badges */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-black text-slate-900 leading-snug">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-400">
                            <span className="text-slate-600 font-bold">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-lg border border-emerald-100">
                            {job.salary || 'Competitive'}
                          </span>
                          
                          {/* Eligibility Badge */}
                          {!hasApplied && (
                            isEligible ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded font-black tracking-wide">
                                🟢 ELIGIBLE
                              </span>
                            ) : (
                              <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-200/80 px-2 py-0.5 rounded font-black tracking-wide">
                                🔴 NOT ELIGIBLE
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mt-4">
                        {job.description}
                      </p>

                      {/* Display metadata if present */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>Type: <span className="text-slate-700 font-black">{job.employmentType || 'Full-time'}</span></div>
                        {job.experienceRequired && <div>Experience: <span className="text-slate-700 font-black">{job.experienceRequired}</span></div>}
                        {job.vacancies && <div>Vacancies: <span className="text-slate-700 font-black">{job.vacancies}</span></div>}
                        {job.deadline && <div>Deadline: <span className="text-slate-700 font-black">{new Date(job.deadline).toLocaleDateString()}</span></div>}
                      </div>

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                          {job.requirements.map((req, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2.5 py-0.5 rounded">
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
                      ) : isEligible ? (
                        <button
                          onClick={() => handleApplyToJob(job)}
                          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 px-5 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer hover:gap-2 active:scale-95 shrink-0 shadow-sm"
                        >
                          <ArrowRight size={14} /> Choose / Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => setCriteriaJob(job)}
                          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-2.5 px-5 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-98 shrink-0 shadow-sm shadow-rose-500/10"
                        >
                          <AlertCircle size={14} /> View Criteria
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

      {/* RESUME REQUIRED PROMPT MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-[420px] rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl animate-scaleUp text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 mb-6 border border-orange-100">
              <FileText size={24} />
            </div>
            
            <h3 className="text-2xl font-black text-black tracking-tight">Resume Required</h3>
            <p className="text-xs text-stone-500 leading-relaxed mt-4 font-medium">
              Please create or upload a resume before applying for jobs. A resume snapshot is saved with your application parameters.
            </p>
            
            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={() => { setShowResumeModal(false); navigate('/templates'); }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-98 shadow-lg shadow-orange-500/25 text-center block"
              >
                Create Resume
              </button>
              <button 
                onClick={() => { setShowResumeModal(false); navigate('/profile'); }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-98 text-center block"
              >
                Upload Resume
              </button>
              <button 
                onClick={() => setShowResumeModal(false)}
                className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-500 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-98 text-center block"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ELIGIBILITY CRITERIA DETAIL MODAL */}
      {criteriaJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-[500px] rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl animate-scaleUp text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-6">
              <h3 className="text-xl font-black text-black flex items-center gap-2">
                <AlertCircle className="text-rose-500 shrink-0" size={22} /> Eligibility Requirements
              </h3>
              <button 
                onClick={() => setCriteriaJob(null)}
                className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Disqualification Reasons */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">Failed Criteria Reasons:</h4>
                <div className="space-y-1.5 text-xs text-rose-800 font-semibold leading-relaxed">
                  {criteriaJob.eligibilityReasons?.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="shrink-0">❌</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                  {(!criteriaJob.eligibilityReasons || criteriaJob.eligibilityReasons.length === 0) && (
                    <div className="flex items-start gap-2">
                      <span className="shrink-0">❌</span>
                      <span>Your academic profile does not meet one or more required marks rules defined by the recruiter.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement vs Profile comparison table */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider">Comparison Summary:</h4>
                <div className="border border-stone-100 rounded-2xl overflow-hidden text-xs font-semibold">
                  <div className="grid grid-cols-3 bg-stone-50 border-b border-stone-100 px-4 py-3 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <div>Parameter</div>
                    <div>Required</div>
                    <div>Your Profile</div>
                  </div>
                  
                  <div className="divide-y divide-stone-100 text-stone-700">
                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">10th Marks</div>
                      <div>{criteriaJob.min10thPercentage ? `${criteriaJob.min10thPercentage}%` : 'N/A'}</div>
                      <div className={userProfile?.percent10th < criteriaJob.min10thPercentage ? 'text-rose-600 font-bold' : ''}>
                        {userProfile?.percent10th !== undefined ? `${userProfile.percent10th}%` : 'Not Specified'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">12th Marks</div>
                      <div>{criteriaJob.min12thPercentage ? `${criteriaJob.min12thPercentage}%` : 'N/A'}</div>
                      <div className={userProfile?.percent12th < criteriaJob.min12thPercentage ? 'text-rose-600 font-bold' : ''}>
                        {userProfile?.percent12th !== undefined ? `${userProfile.percent12th}%` : 'Not Specified'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">Graduation Marks</div>
                      <div>{criteriaJob.minGraduationPercentage ? `${criteriaJob.minGraduationPercentage}%` : 'N/A'}</div>
                      <div className={userProfile?.percentGraduation < criteriaJob.minGraduationPercentage ? 'text-rose-600 font-bold' : ''}>
                        {userProfile?.percentGraduation !== undefined ? `${userProfile.percentGraduation}%` : 'Not Specified'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">CGPA</div>
                      <div>{criteriaJob.minCGPA ? criteriaJob.minCGPA : 'N/A'}</div>
                      <div className={userProfile?.cgpa < criteriaJob.minCGPA ? 'text-rose-600 font-bold' : ''}>
                        {userProfile?.cgpa !== undefined ? userProfile.cgpa : 'Not Specified'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">Backlogs Allowed</div>
                      <div>{criteriaJob.backlogsAllowed === 'No' ? 'No Active Backlogs' : `Max ${criteriaJob.maxBacklogs || 0}`}</div>
                      <div className={
                        (criteriaJob.backlogsAllowed === 'No' && userProfile?.backlogs > 0) || 
                        (criteriaJob.backlogsAllowed === 'Yes' && userProfile?.backlogs > criteriaJob.maxBacklogs)
                          ? 'text-rose-600 font-bold' : ''
                      }>
                        {userProfile?.backlogs !== undefined ? userProfile.backlogs : 'Not Specified'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">Eligible Branch</div>
                      <div className="truncate pr-2" title={criteriaJob.eligibleBranches?.join(', ') || 'Any'}>
                        {criteriaJob.eligibleBranches && criteriaJob.eligibleBranches.length > 0 ? criteriaJob.eligibleBranches.join(', ') : 'Any'}
                      </div>
                      <div className={
                        criteriaJob.eligibleBranches && criteriaJob.eligibleBranches.length > 0 &&
                        !criteriaJob.eligibleBranches.some(b => b.trim().toLowerCase() === (userProfile?.branch || '').trim().toLowerCase())
                          ? 'text-rose-600 font-bold' : ''
                      }>
                        {userProfile?.branch || 'Not Specified'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 px-4 py-3">
                      <div className="text-stone-500">Passing Year</div>
                      <div>{criteriaJob.passingYear || 'Any'}</div>
                      <div className={criteriaJob.passingYear && userProfile?.passingYear !== criteriaJob.passingYear ? 'text-rose-600 font-bold' : ''}>
                        {userProfile?.passingYear || 'Not Specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-stone-100">
              <Button 
                onClick={() => { setCriteriaJob(null); navigate('/profile'); }}
                className="flex-1 text-xs py-3 cursor-pointer text-center"
              >
                Update Profile Settings
              </Button>
              <button 
                onClick={() => setCriteriaJob(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-2xl text-xs font-bold cursor-pointer"
              >
                Close Criteria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY JOB MODAL */}
      {applyModalJob && (
        <ApplyJobModal
          job={applyModalJob}
          onClose={() => setApplyModalJob(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobsPage;
