import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/jobs/candidate/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications list', err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(true);

    const poller = setInterval(() => {
      fetchApplications(false);
    }, 4000);

    return () => clearInterval(poller);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 font-extrabold text-xs">
            Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full border border-rose-200 font-bold text-xs">
            Rejected
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200 font-bold text-xs">
            Under Review
          </span>
        );
      case 'Interview Scheduled':
        return (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200 font-bold text-xs">
            Interview Scheduled
          </span>
        );
      case 'Selected':
        return (
          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full border border-teal-200 font-bold text-xs">
            Selected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200 font-bold text-xs">
            Applied
          </span>
        );
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-20 min-h-screen transition-all duration-300 overflow-hidden text-left relative">
        <div className="max-w-4xl mx-auto px-4 md:px-12 pt-10 pb-12 w-full space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs bg-orange-500/10 text-orange-600 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Candidate Center
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3 flex items-center gap-2">
                <FileText className="text-orange-500" size={32} /> My Applications
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Track your active job applications, view status updates, and manage recruiter notifications.
              </p>
            </div>
          </header>

          {/* Applications list */}
          {isLoading ? (
            <div className="flex h-60 flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-orange-500 w-10 h-10 mb-4" />
              <p className="text-slate-500 text-sm font-semibold">Retrieving your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <Briefcase size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800">No Applications Yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  You haven't applied to any job postings. Browse the "Job Openings" page to start applying today!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => {
                const isShortlisted = app.status === 'Shortlisted';
                const jobTitle = app.job?.title || 'Unknown Position';
                const companyName = app.job?.company || 'Unknown Company';

                return (
                  <div
                    key={app._id}
                    className={`rounded-3xl border p-6 md:p-8 transition-all duration-200 relative overflow-hidden flex flex-col gap-6 ${
                      isShortlisted
                        ? 'bg-emerald-50/20 border-emerald-300 shadow-sm shadow-emerald-500/5'
                        : 'bg-white border-slate-200/80 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-slate-900 leading-snug">{jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold">
                          <span className="flex items-center gap-1 text-slate-700 font-bold">
                            <Building size={14} className="text-slate-400" /> {companyName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-slate-400" /> Applied: {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-slate-400" /> Updated: {new Date(app.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">{getStatusBadge(app.status)}</div>
                    </div>

                    {/* Shortlisted Message UI Section */}
                    {isShortlisted && (
                      <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 text-left text-xs font-semibold text-emerald-800 space-y-2 mt-2">
                        <p className="text-sm font-black flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          🎉 Congratulations! You have been shortlisted by {companyName} for the {jobTitle} position.
                        </p>
                        <div className="pl-6 space-y-1 text-emerald-700">
                          <p>
                            Shortlisted Date:{' '}
                            <span className="font-bold">
                              {app.shortlistedAt ? new Date(app.shortlistedAt).toLocaleDateString() : new Date(app.updatedAt).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="font-medium">Please wait for further communication from the recruiter.</p>
                        </div>
                      </div>
                    )}
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

export default MyApplicationsPage;
