import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Building,
  Briefcase,
  Loader2,
  Trash2,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

/**
 * ApplyJobModal
 * Opens when a user clicks "Apply" on a job.
 * Presents two options:
 *   1. Select an existing Builder resume
 *   2. Upload a new PDF resume
 * Submits via multipart/form-data to POST /api/jobs/:id/apply
 */
const ApplyJobModal = ({ job, onClose, onSuccess }) => {
  const [builderResumes, setBuilderResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState('');

  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'upload'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Fetch builder resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/resume`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resumes = res.data || [];
        setBuilderResumes(resumes);
        // Auto-select the most recent resume
        if (resumes.length > 0) {
          setSelectedResumeId(resumes[0]._id);
        } else {
          // If no builder resumes, default to upload tab
          setActiveTab('upload');
        }
      } catch (err) {
        console.error('Failed to fetch resumes', err);
        setActiveTab('upload');
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  // ─── File validation ────────────────────────────────────────────────────
  const validateFile = (file) => {
    if (!file) return 'Please select a file.';
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (file.size > 10 * 1024 * 1024) return 'File size must not exceed 10 MB.';
    return '';
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setUploadedFile(null);
      return;
    }
    setFileError('');
    setUploadedFile(file);
    setUploadProgress(0);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files[0]) handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Submit application ─────────────────────────────────────────────────
  const canSubmit = () => {
    if (activeTab === 'builder') return !!selectedResumeId;
    if (activeTab === 'upload') return !!uploadedFile && !fileError;
    return false;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('token');

      if (activeTab === 'upload' && uploadedFile) {
        // Multipart upload
        const formData = new FormData();
        formData.append('resumeFile', uploadedFile);

        await axios.post(`${API_URL}/api/jobs/${job._id}/apply`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(pct);
          },
        });
      } else {
        // Builder resume selected
        await axios.post(
          `${API_URL}/api/jobs/${job._id}/apply`,
          { resumeId: selectedResumeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Keyboard close ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="relative w-full max-w-[560px] rounded-[28px] border border-black/5 bg-white shadow-2xl animate-scaleUp text-left max-h-[92vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex justify-between items-start p-7 pb-5 border-b border-stone-100 shrink-0">
          <div className="space-y-1 flex-1 pr-4">
            <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Apply for Job
            </span>
            <h3 className="text-xl font-black text-black tracking-tight leading-snug mt-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
              <Building size={12} />
              <span>{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6 min-h-0">

          {/* Application Summary */}
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-xs text-stone-600 font-semibold leading-relaxed">
            <p className="font-black text-stone-800 mb-1 text-sm">Application Summary</p>
            <p className="line-clamp-3">{job.description}</p>
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-stone-100 text-[10px] font-bold text-stone-500">
              <span className="flex items-center gap-1"><Briefcase size={10} /> {job.employmentType || 'Full-time'}</span>
              {job.salary && <span>💰 {job.salary}</span>}
              {job.vacancies && <span>👥 {job.vacancies} Vacancies</span>}
            </div>
          </div>

          {/* ── Tab Selector ── */}
          <div>
            <p className="text-xs font-black text-stone-700 mb-3 uppercase tracking-wider">Select Resume</p>
            <div className="flex gap-2 bg-stone-100/70 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                🏗 Use Builder Resume
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                📎 Upload PDF
              </button>
            </div>
          </div>

          {/* ── Tab 1: Builder Resumes ── */}
          {activeTab === 'builder' && (
            <div className="space-y-3">
              {loadingResumes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-orange-500 w-6 h-6" />
                </div>
              ) : builderResumes.length === 0 ? (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center space-y-3">
                  <FileText size={28} className="mx-auto text-amber-400" />
                  <p className="text-xs font-bold text-amber-800">No Builder resumes found.</p>
                  <p className="text-[10px] text-amber-700 font-medium">
                    Switch to "Upload PDF" to attach a resume directly, or create one in the Resume Builder first.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="text-xs font-extrabold text-orange-600 hover:text-orange-800 underline cursor-pointer"
                  >
                    Upload a PDF instead →
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[10px] text-stone-400 font-semibold">
                    The selected resume snapshot will be permanently stored with your application.
                  </p>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {builderResumes.map((resume) => {
                      const isSelected = selectedResumeId === resume._id;
                      return (
                        <button
                          key={resume._id}
                          onClick={() => setSelectedResumeId(resume._id)}
                          className={`w-full text-left border rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50 border-orange-300 shadow-sm'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-400'
                          }`}>
                            <FileText size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-black truncate ${isSelected ? 'text-black' : 'text-stone-700'}`}>
                              {resume.title}
                            </p>
                            <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                              <Clock size={9} />
                              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Tab 2: PDF Upload ── */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <p className="text-[10px] text-stone-400 font-semibold">
                Upload your resume as a PDF. This file will be permanently stored with your application.
              </p>

              {!uploadedFile ? (
                // Drop zone
                <div
                  ref={dropZoneRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-orange-400 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-stone-50/50 hover:bg-orange-50/20 group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud size={26} className="text-orange-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-black text-stone-700">
                      Drop your PDF here or <span className="text-orange-500">browse</span>
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium">
                      PDF only · Maximum 10 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                // File selected state
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-emerald-800 truncate">{uploadedFile.name}</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · PDF
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1.5 hover:bg-emerald-100 rounded-full text-emerald-500 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-stone-500">
                        <span>Uploading…</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { handleRemoveFile(); fileInputRef.current?.click(); }}
                    className="text-xs text-stone-500 font-bold hover:text-black underline cursor-pointer"
                  >
                    Replace file
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              )}

              {fileError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                  <AlertCircle size={14} />
                  {fileError}
                </div>
              )}
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-rose-700 font-bold">
              <AlertCircle size={14} className="shrink-0" />
              {submitError}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-5 border-t border-stone-100 bg-stone-50/50 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 py-3.5 rounded-2xl text-xs font-extrabold cursor-pointer transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            className={`flex-1 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              canSubmit() && !isSubmitting
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-md active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Submitting…
              </>
            ) : (
              <>
                <ArrowRight size={14} />
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
