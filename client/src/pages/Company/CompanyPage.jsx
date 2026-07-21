import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import {
  Building,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Edit2,
  PlusCircle,
  FileText,
  HelpCircle,
  ArrowRight,
  Briefcase,
  MapPin,
  Sparkles,
  Info,
  Check,
  User,
  Mail,
  Phone,
  Calendar,
  Layers,
  X,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle,
  AlertOctagon,
  Percent
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

// Option lists
const industries = ['IT', 'Software', 'Banking', 'Healthcare', 'Education', 'Manufacturing', 'Consulting', 'Retail', 'Marketing', 'Other'];
const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
const companyTypes = ['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'Startup', 'Government', 'NGO'];

const branchOptions = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Business Administration',
  'Finance & Accounting',
  'Commerce',
  'Others'
];

const initialFormState = {
  companyName: '',
  officialEmail: '',
  website: '',
  phone: '',
  hrName: '',
  hrEmail: '',
  hrPhone: '',
  yearEstablished: '',
  industry: '',
  companySize: '',
  companyType: '',
  country: '',
  state: '',
  city: '',
  address: '',
  postalCode: '',
  description: '',
  cin: '',
  gst: '',
  pan: '',
  registrationNumber: '',
  linkedin: '',
  careersPage: '',
  logo: '',
  certifiedTrue: false,
};

const CompanyPage = () => {
  const { user } = useAuth();
  
  // Loading & status states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);
  
  // Form Wizard State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  
  // File Upload State
  const [documentsState, setDocumentsState] = useState({});
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);

  // Modal / Interaction States
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Verified Recruiter Dashboard specific states
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedCandidates: 0,
    rejectedCandidates: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);
  
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loadingRecruiterJobs, setLoadingRecruiterJobs] = useState(false);
  
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  
  const [selectedApplicationForResume, setSelectedApplicationForResume] = useState(null);
  const [showResumeViewerModal, setShowResumeViewerModal] = useState(false);

  // Job form state (active once verified)
  const [newJob, setNewJob] = useState({
    title: '',
    salary: 'Competitive',
    location: '',
    description: '',
    requirements: '',
    employmentType: 'Full-time',
    experienceRequired: '',
    deadline: '',
    vacancies: 1,
    min10thPercentage: 0,
    min12thPercentage: 0,
    minGraduationPercentage: 0,
    minCGPA: 0,
    backlogsAllowed: 'Yes',
    maxBacklogs: 0,
    eligibleBranches: [],
    passingYear: ''
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Drag and drop states
  const [dragOverDoc, setDragOverDoc] = useState(null);

  // Reference for PDF download container
  const resumePrintRef = useRef(null);

  // Load profile and draft
  useEffect(() => {
    fetchProfile();
    
    // Load draft from localStorage if not already registered
    const draft = localStorage.getItem('company_verification_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsedDraft }));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }

    const docsDraft = localStorage.getItem('company_verification_docs_draft');
    if (docsDraft) {
      try {
        setDocumentsState(JSON.parse(docsDraft));
      } catch (e) {
        console.error("Failed to parse documents draft", e);
      }
    }
  }, []);

  // Autosave draft when formData or documentsState changes
  useEffect(() => {
    if (!companyProfile) {
      localStorage.setItem('company_verification_draft', JSON.stringify(formData));
    }
  }, [formData, companyProfile]);

  useEffect(() => {
    if (!companyProfile) {
      localStorage.setItem('company_verification_docs_draft', JSON.stringify(documentsState));
    }
  }, [documentsState, companyProfile]);

  // Recruiter Dashboard statistics/jobs fetcher
  useEffect(() => {
    if (companyProfile && companyProfile.verificationStatus === 'Verified') {
      fetchStats();
      fetchRecruiterJobs();
    }
  }, [companyProfile]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axios.get(`${API_URL}/api/company/profile`, getAuthHeaders());
      setCompanyProfile(res.data);
      if (res.data) {
        // Pre-populate fields in case they are editing/resubmitting
        setFormData({
          ...initialFormState,
          ...res.data,
          certifiedTrue: true
        });
        if (res.data.documents) {
          const docsMap = {};
          res.data.documents.forEach(doc => {
            docsMap[doc.name] = { progress: 100, path: doc.path, originalName: doc.originalName || doc.path.split('/').pop() };
          });
          setDocumentsState(docsMap);
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        showToast(err.response?.data?.message || "Failed to load company profile", 'error');
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  // Recruiter Dashboard fetches
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API_URL}/api/jobs/applications/stats`, getAuthHeaders());
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecruiterJobs = async () => {
    setLoadingRecruiterJobs(true);
    try {
      const res = await axios.get(`${API_URL}/api/jobs/recruiter/my-jobs`, getAuthHeaders());
      setRecruiterJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecruiterJobs(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const res = await axios.get(`${API_URL}/api/jobs/${jobId}/applicants`, getAuthHeaders());
      setApplicantsList(res.data || []);
    } catch (err) {
      showToast("Failed to fetch applicant listings.", "error");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/api/jobs/applications/${appId}/status`, { status: newStatus }, getAuthHeaders());
      
      const successMessage = newStatus === 'Shortlisted' 
        ? 'Candidate shortlisted successfully.' 
        : `Candidate marked as ${newStatus} successfully!`;

      if (res.data?.warning) {
        // Show the warning toast to the recruiter
        showToast(res.data.warning, 'error');
      } else {
        showToast(successMessage, 'success');
      }

      // Local state sync
      setApplicantsList(prev => prev.map(app => app._id === appId ? { ...app, ...res.data.application } : app));
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update recruitment status.", "error");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action will remove all corresponding applicant listings.")) return;
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`, getAuthHeaders());
      showToast("Job posting deleted successfully!");
      fetchRecruiterJobs();
      fetchStats();
      if (selectedJobForApplicants?._id === jobId) {
        setSelectedJobForApplicants(null);
        setApplicantsList([]);
      }
    } catch (err) {
      showToast("Failed to delete job listing.", "error");
    }
  };

  // Direct Candidate Resume PDF Download Handler
  const handleDownloadCandidatePDF = async (resumeDataObj) => {
    try {
      const { downloadAsPDF } = await import('../../utils/pdfGenerator');
      const candidateName = resumeDataObj.personalInfo?.name || 'Candidate';
      const formattedName = candidateName.replace(/\s+/g, '_');
      
      showToast("Preparing PDF generation...", "success");
      
      const success = await downloadAsPDF('applicant-resume-preview', `${formattedName}_Resume_Snapshot.pdf`);
      if (success) {
        showToast("PDF downloaded successfully!");
      } else {
        throw new Error("Failed to download PDF.");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF.", "error");
    }
  };

  // Validations
  const validateStep = (currentStep) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;

    if (currentStep === 1) {
      if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
      if (!formData.officialEmail.trim()) errors.officialEmail = 'Official email is required';
      else if (!emailRegex.test(formData.officialEmail)) errors.officialEmail = 'Invalid email address';
      
      if (!formData.website.trim()) errors.website = 'Official website is required';
      else if (!websiteRegex.test(formData.website)) errors.website = 'Invalid website URL (e.g. https://google.com)';

      if (!formData.phone.trim()) errors.phone = 'Company phone number is required';
      if (!formData.hrName.trim()) errors.hrName = 'HR contact person name is required';
      if (!formData.hrEmail.trim()) errors.hrEmail = 'HR contact email is required';
      else if (!emailRegex.test(formData.hrEmail)) errors.hrEmail = 'Invalid HR email address';
    }

    if (currentStep === 2) {
      if (!formData.yearEstablished) errors.yearEstablished = 'Establishment year is required';
      else {
        const year = Number(formData.yearEstablished);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
          errors.yearEstablished = `Please enter a valid year between 1800 and ${currentYear}`;
        }
      }
      if (!formData.industry) errors.industry = 'Industry selection is required';
      if (!formData.companySize) errors.companySize = 'Company size is required';
      if (!formData.companyType) errors.companyType = 'Company type is required';
      
      if (formData.description && formData.description.length > 500) {
        errors.description = 'Description cannot exceed 500 characters';
      }
    }

    if (currentStep === 3) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const cinRegex = /^[U|L][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

      if (formData.gst && !gstRegex.test(formData.gst)) {
        errors.gst = 'Invalid GST format (15 characters: e.g. 22AAAAA0000A1Z5)';
      }
      if (formData.pan && !panRegex.test(formData.pan)) {
        errors.pan = 'Invalid PAN format (10 characters: e.g. ABCDE1234F)';
      }
      if (formData.cin && !cinRegex.test(formData.cin)) {
        errors.cin = 'Invalid CIN format (21 characters: e.g. U12345MH2010PTC123456)';
      }
      if (!formData.certifiedTrue) {
        errors.certifiedTrue = 'You must certify that the information is true';
      }
    }

    if (currentStep === 4) {
      // Documents are now OPTIONAL — no required validation
      // Only validate the logo format if it was uploaded (already handled in uploadDocFile)
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reactive validation for final submit button (checks all required fields across all steps)
  const isFormReadyToSubmit = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const cinRegex = /^[U|L][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    const currentYear = new Date().getFullYear();
    const year = Number(formData.yearEstablished);

    // Step 1 required fields
    if (!formData.companyName?.trim()) return false;
    if (!formData.officialEmail?.trim() || !emailRegex.test(formData.officialEmail)) return false;
    if (!formData.website?.trim() || !websiteRegex.test(formData.website)) return false;
    if (!formData.phone?.trim()) return false;
    if (!formData.hrName?.trim()) return false;
    if (!formData.hrEmail?.trim() || !emailRegex.test(formData.hrEmail)) return false;

    // Step 2 required fields
    if (!formData.yearEstablished || isNaN(year) || year < 1800 || year > currentYear) return false;
    if (!formData.industry) return false;
    if (!formData.companySize) return false;
    if (!formData.companyType) return false;
    if (formData.description && formData.description.length > 500) return false;

    // Step 3 optional but validated if filled
    if (formData.gst && !gstRegex.test(formData.gst)) return false;
    if (formData.pan && !panRegex.test(formData.pan)) return false;
    if (formData.cin && !cinRegex.test(formData.cin)) return false;

    // Certification checkbox required
    if (!formData.certifiedTrue) return false;

    return true;
  }, [formData]);

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleGoToStep = (targetStep) => {
    // Allow jumping to any step freely — no locking
    setStep(targetStep);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Upload logo helper (Step 3)
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10 MB limit.", "error");
      return;
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      showToast("Only PNG, JPG, and JPEG logo formats are allowed.", "error");
      return;
    }

    const payload = new FormData();
    payload.append('file', file);

    try {
      setLogoUploadProgress(10);
      const res = await axios.post(`${API_URL}/api/company/upload`, payload, {
        ...getAuthHeaders(),
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLogoUploadProgress(percentCompleted);
        }
      });
      setFormData(prev => ({ ...prev, logo: res.data.path }));
      showToast("Logo uploaded successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Logo upload failed.", "error");
    } finally {
      setLogoUploadProgress(0);
    }
  };

  // Upload proof document (Step 4)
  const uploadDocFile = async (docName, file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast(`File ${file.name} exceeds 10MB.`, "error");
      return;
    }

    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      showToast("Invalid file format. Only PDF, PNG, and JPEG documents are allowed.", "error");
      return;
    }

    setDocumentsState(prev => ({
      ...prev,
      [docName]: { progress: 10, path: '', originalName: file.name }
    }));

    const payload = new FormData();
    payload.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/api/company/upload`, payload, {
        ...getAuthHeaders(),
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDocumentsState(prev => ({
            ...prev,
            [docName]: { ...prev[docName], progress: percentCompleted }
          }));
        }
      });

      setDocumentsState(prev => ({
        ...prev,
        [docName]: { progress: 100, path: res.data.path, originalName: file.name }
      }));

      if (docName === 'Company Logo') {
        setFormData(prev => ({ ...prev, logo: res.data.path }));
      }

      showToast(`${docName} uploaded successfully!`);
    } catch (err) {
      showToast(err.response?.data?.message || "File upload failed.", "error");
      setDocumentsState(prev => {
        const copy = { ...prev };
        delete copy[docName];
        return copy;
      });
    }
  };

  const handleRemoveDoc = (docName) => {
    setDocumentsState(prev => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
    if (docName === 'Company Logo') {
      setFormData(prev => ({ ...prev, logo: '' }));
    }
    showToast(`Removed ${docName}.`);
  };

  // Submit company verification details
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const docsArray = Object.keys(documentsState).map(key => ({
        name: key,
        path: documentsState[key].path,
        originalName: documentsState[key].originalName
      }));

      const payload = {
        ...formData,
        documents: docsArray
      };

      const url = companyProfile ? `${API_URL}/api/company/update` : `${API_URL}/api/company/register`;
      const method = companyProfile ? 'put' : 'post';

      const res = await axios[method](url, payload, getAuthHeaders());
      
      setCompanyProfile(res.data);
      showToast("Company verification profile submitted successfully!");
      
      localStorage.removeItem('company_verification_draft');
      localStorage.removeItem('company_verification_docs_draft');
      setShowConfirmSubmit(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit verification details.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post a Job Handler (when verified)
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.location || !newJob.description) {
      showToast("Please fill in all mandatory job fields.", "error");
      return;
    }

    setIsCreatingJob(true);
    try {
      const payload = {
        title: newJob.title,
        company: companyProfile?.companyName || 'Verified Employer',
        location: newJob.location,
        salary: newJob.salary,
        description: newJob.description,
        requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean),
        employmentType: newJob.employmentType,
        experienceRequired: newJob.experienceRequired,
        deadline: newJob.deadline || null,
        vacancies: Number(newJob.vacancies) || 1,
        min10thPercentage: Number(newJob.min10thPercentage) || 0,
        min12thPercentage: Number(newJob.min12thPercentage) || 0,
        minGraduationPercentage: Number(newJob.minGraduationPercentage) || 0,
        minCGPA: Number(newJob.minCGPA) || 0,
        backlogsAllowed: newJob.backlogsAllowed,
        maxBacklogs: Number(newJob.maxBacklogs) || 0,
        eligibleBranches: newJob.eligibleBranches,
        passingYear: newJob.passingYear ? Number(newJob.passingYear) : null
      };

      await axios.post(`${API_URL}/api/jobs`, payload, getAuthHeaders());
      
      showToast("Job opening posted successfully!");
      setShowJobModal(false);
      
      // Reset form fields
      setNewJob({
        title: '',
        salary: 'Competitive',
        location: '',
        description: '',
        requirements: '',
        employmentType: 'Full-time',
        experienceRequired: '',
        deadline: '',
        vacancies: 1,
        min10thPercentage: 0,
        min12thPercentage: 0,
        minGraduationPercentage: 0,
        minCGPA: 0,
        backlogsAllowed: 'Yes',
        maxBacklogs: 0,
        eligibleBranches: [],
        passingYear: ''
      });
      
      fetchRecruiterJobs();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to post job listing.", "error");
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleBranchCheckboxChange = (branch, checked) => {
    setNewJob(prev => {
      let branches = [...prev.eligibleBranches];
      if (checked) {
        if (!branches.includes(branch)) branches.push(branch);
      } else {
        branches = branches.filter(b => b !== branch);
      }
      return { ...prev, eligibleBranches: branches };
    });
  };

  const isVerified = companyProfile?.verificationStatus === 'Verified';

  return (
    <div className="flex bg-white min-h-screen overflow-x-hidden text-black">
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 ml-20 min-h-screen transition-all duration-300 overflow-hidden text-left relative">
        
        {/* Floating Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[120] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all duration-300 animate-slide-down ${
            toast.type === 'error' 
              ? 'bg-rose-50 border-rose-100 text-rose-800' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-800'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="text-rose-500 shrink-0" size={20} /> : <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-10 pb-16 w-full space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-8">
            <div className="space-y-1">
              <span className="text-xs bg-orange-500/10 text-orange-600 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Employer Console
              </span>
              <h1 className="text-4xl font-black text-black tracking-tight mt-3">
                {isVerified ? 'Recruiter Dashboard' : 'Company Verification'}
              </h1>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">
                {isVerified 
                  ? 'Manage your posted vacancies, review candidate compliance profiles, and shortlist applications.' 
                  : 'Register your organization to become a verified employer and post jobs on GetResume AI.'}
              </p>
            </div>

            {/* Badges / Verification Badge Status */}
            {loadingProfile ? (
              <div className="h-10 w-36 bg-stone-100 animate-pulse rounded-xl" />
            ) : !companyProfile ? (
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/60 px-4 py-2.5 rounded-2xl font-bold text-xs text-stone-500 shadow-sm shrink-0">
                <span className="h-2 w-2 rounded-full bg-stone-400" />
                ⭕ Not Verified
              </div>
            ) : companyProfile.verificationStatus === 'Pending' ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 px-4 py-2.5 rounded-2xl font-bold text-xs text-amber-600 shadow-sm shrink-0">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                🟡 Verification Pending
              </div>
            ) : companyProfile.verificationStatus === 'Under Review' ? (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-4 py-2.5 rounded-2xl font-bold text-xs text-blue-600 shadow-sm shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                🔵 Under Review
              </div>
            ) : companyProfile.verificationStatus === 'Verified' ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-4 py-2.5 rounded-2xl font-extrabold text-xs text-emerald-600 shadow-sm shrink-0">
                <CheckCircle2 size={16} className="text-emerald-500" />
                🟢 Verified Company
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/60 px-4 py-2.5 rounded-2xl font-bold text-xs text-rose-600 shadow-sm shrink-0">
                  <AlertCircle size={16} className="text-rose-500" />
                  🔴 Verification Rejected
                </div>
              </div>
            )}
          </header>

          {/* Show Rejection Reason if any */}
          {companyProfile?.verificationStatus === 'Rejected' && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex gap-4 text-left">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-950">Verification Rejection Explanation</h4>
                <p className="text-xs text-rose-800 leading-relaxed font-semibold">
                  "{companyProfile.rejectionReason || 'Your submitted certificates/information could not be verified by our administrative team. Please review details below, adjust information, and resubmit.'}"
                </p>
                <button 
                  onClick={() => {
                    setCompanyProfile(null); 
                    setStep(1);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-extrabold flex items-center gap-1 pt-2 underline cursor-pointer"
                >
                  Edit Registration Details & Resubmit <ArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* MAIN PAGE RENDER */}
          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
              <p className="text-stone-500 text-sm font-bold">Synchronizing verification parameters...</p>
            </div>
          ) : isVerified ? (
            
            /* SHOW VERIFIED COMPANY RECRUITER DASHBOARD */
            <div className="space-y-8">
              
              {/* Recruiter Banner */}
              <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {companyProfile.logo && (
                      <div className="h-12 w-12 rounded-xl bg-white p-1 overflow-hidden shrink-0 border border-stone-800 flex items-center justify-center">
                        <img src={`${API_URL}${companyProfile.logo}`} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{companyProfile.companyName}</h3>
                      <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider">{companyProfile.industry} • {companyProfile.companyType} • {companyProfile.companySize} Employees</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/50 px-3 py-1 rounded-full w-fit mt-3">
                    <CheckCircle2 size={12} /> Recruitment Rights Active
                  </div>
                </div>

                <Button 
                  onClick={() => setShowJobModal(true)}
                  className="flex items-center gap-2 py-4 px-6 shrink-0 shadow-xl shadow-orange-500/20"
                >
                  <PlusCircle size={18} /> Post Job Opening
                </Button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-stone-100 gap-6 pb-2 text-sm font-bold text-stone-400">
                <button 
                  onClick={() => setActiveDashboardTab('overview')}
                  className={`pb-3 border-b-2 px-1 transition-all ${activeDashboardTab === 'overview' ? 'border-orange-500 text-black' : 'border-transparent hover:text-stone-600'}`}
                >
                  Dashboard Overview
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('jobs')}
                  className={`pb-3 border-b-2 px-1 transition-all ${activeDashboardTab === 'jobs' ? 'border-orange-500 text-black' : 'border-transparent hover:text-stone-600'}`}
                >
                  My Job Openings ({recruiterJobs.length})
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('applicants')}
                  className={`pb-3 border-b-2 px-1 transition-all ${activeDashboardTab === 'applicants' ? 'border-orange-500 text-black' : 'border-transparent hover:text-stone-600'}`}
                >
                  Applicants {selectedJobForApplicants && `— ${selectedJobForApplicants.title}`}
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('profile')}
                  className={`pb-3 border-b-2 px-1 transition-all ${activeDashboardTab === 'profile' ? 'border-orange-500 text-black' : 'border-transparent hover:text-stone-600'}`}
                >
                  Company Profile
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeDashboardTab === 'overview' && (
                <div className="space-y-8 animate-in-up">
                  {/* Statistics Grid */}
                  {loadingStats ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(n => <div key={n} className="h-28 bg-stone-50 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-stone-50/70 border border-stone-100 rounded-3xl p-5 text-left space-y-1">
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Total Jobs</span>
                        <h4 className="text-3xl font-black text-black">{stats.totalJobs}</h4>
                      </div>
                      <div className="bg-stone-50/70 border border-stone-100 rounded-3xl p-5 text-left space-y-1">
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Total Apps</span>
                        <h4 className="text-3xl font-black text-black">{stats.totalApplications}</h4>
                      </div>
                      <div className="bg-stone-50/70 border border-stone-100 rounded-3xl p-5 text-left space-y-1">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Pending</span>
                        <h4 className="text-3xl font-black text-amber-600">{stats.pendingApplications}</h4>
                      </div>
                      <div className="bg-stone-50/70 border border-stone-100 rounded-3xl p-5 text-left space-y-1">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">Shortlisted</span>
                        <h4 className="text-3xl font-black text-emerald-600">{stats.shortlistedCandidates}</h4>
                      </div>
                      <div className="bg-stone-50/70 border border-stone-100 rounded-3xl p-5 text-left space-y-1">
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">Rejected</span>
                        <h4 className="text-3xl font-black text-rose-600">{stats.rejectedCandidates}</h4>
                      </div>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="bg-orange-50/30 border border-orange-100 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="space-y-2 text-left max-w-xl">
                      <h4 className="text-lg font-black text-black flex items-center gap-2">
                        <Sparkles size={18} className="text-orange-500" /> Start Recruiting Right Away
                      </h4>
                      <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                        Add compliance rules to your job postings. When candidates apply, GetResume AI automatically checks their 10th/12th marks, active backlogs, passing years, and engineering branches to screen eligibility instantly.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowJobModal(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shrink-0"
                    >
                      Post New Opening
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: MY JOB OPENINGS */}
              {activeDashboardTab === 'jobs' && (
                <div className="space-y-6 animate-in-up">
                  {loadingRecruiterJobs ? (
                    <div className="flex flex-col items-center py-16 justify-center">
                      <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
                    </div>
                  ) : recruiterJobs.length === 0 ? (
                    <div className="border border-stone-100 rounded-3xl p-12 text-center text-stone-400 bg-stone-50/30 space-y-4">
                      <Briefcase className="mx-auto" size={48} />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-black">No jobs posted yet</h4>
                        <p className="text-xs font-semibold text-stone-400">Post a new job opening to begin receiving applicant profiles.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {recruiterJobs.map(job => (
                        <div key={job._id} className="border border-stone-150 rounded-3xl p-6 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-stone-300 transition-all">
                          <div className="space-y-1.5 text-left">
                            <h4 className="text-base font-black text-black">{job.title}</h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-400 font-semibold">
                              <span className="text-stone-700 font-bold">{job.location}</span>
                              <span>•</span>
                              <span>{job.employmentType || 'Full-time'}</span>
                              <span>•</span>
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span>{job.vacancies || 1} Vacancy</span>
                            </div>
                            
                            {/* Display criteria tags */}
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {job.minCGPA > 0 && <span className="bg-stone-50 border border-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">Min CGPA: {job.minCGPA}</span>}
                              {job.backlogsAllowed === 'No' && <span className="bg-stone-50 border border-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">No Backlogs</span>}
                              {job.eligibleBranches?.length > 0 && <span className="bg-stone-50 border border-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">Branches: {job.eligibleBranches.join(', ')}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <button
                              onClick={() => {
                                setSelectedJobForApplicants(job);
                                fetchApplicants(job._id);
                                setActiveDashboardTab('applicants');
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 px-4 text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <User size={14} /> View Applicants ({job.applicants?.length || 0})
                            </button>
                            
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2.5 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: APPLICANTS */}
              {activeDashboardTab === 'applicants' && (
                <div className="space-y-6 animate-in-up">
                  {!selectedJobForApplicants ? (
                    <div className="border border-stone-100 rounded-3xl p-12 text-center text-stone-400 bg-stone-50/30 space-y-4">
                      <FileSpreadsheet className="mx-auto" size={48} />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-black">No Job Selected</h4>
                        <p className="text-xs font-semibold text-stone-400">Select a job from "My Job Openings" tab to review candidates.</p>
                      </div>
                    </div>
                  ) : loadingApplicants ? (
                    <div className="flex flex-col items-center py-16 justify-center">
                      <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
                    </div>
                  ) : applicantsList.length === 0 ? (
                    <div className="border border-stone-150 rounded-3xl p-12 text-center bg-stone-50/30 space-y-3">
                      <p className="text-sm font-bold text-black">No applicants yet for "{selectedJobForApplicants.title}"</p>
                      <p className="text-xs font-semibold text-stone-400">As soon as candidates start applying, they will appear here instantly.</p>
                      <button 
                        onClick={() => { setSelectedJobForApplicants(null); setActiveDashboardTab('jobs'); }}
                        className="text-xs text-orange-500 hover:underline font-extrabold cursor-pointer"
                      >
                        Back to Job Openings
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-stone-150 rounded-3xl overflow-hidden shadow-sm">
                      <div className="px-6 py-4 bg-stone-50 border-b border-stone-150 flex justify-between items-center">
                        <h4 className="text-sm font-black text-black">Applicants for "{selectedJobForApplicants.title}"</h4>
                        <button 
                          onClick={() => { setSelectedJobForApplicants(null); setActiveDashboardTab('jobs'); }}
                          className="text-xs text-stone-500 hover:text-black font-extrabold flex items-center gap-1.5"
                        >
                          Change Job
                        </button>
                      </div>

                      {/* Applicants Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-stone-50/50 border-b border-stone-150 text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-4">Applicant Name</th>
                              <th className="px-6 py-4">Email / Phone</th>
                              <th className="px-6 py-4">Resume</th>
                              <th className="px-6 py-4">Applied Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 font-semibold text-stone-700">
                            {applicantsList.map(app => (
                              <tr key={app._id} className="hover:bg-stone-50/30 transition-colors">
                                <td className="px-6 py-4 font-black text-black text-sm">{app.applicantDetails?.name}</td>
                                <td className="px-6 py-4">
                                  <div className="space-y-0.5">
                                    <div>{app.applicantDetails?.email}</div>
                                    <div className="text-[10px] text-stone-400 font-bold">{app.applicantDetails?.phone || 'N/A'}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {app.resumeSource === 'Upload' ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                                      📎 PDF Upload
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full">
                                      🏗 Builder
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">{new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                  {app.status === 'Applied' && (
                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 font-bold text-[10px]">
                                      Applied
                                    </span>
                                  )}
                                  {app.status === 'Shortlisted' && (
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-extrabold text-[10px]">
                                      Shortlisted
                                    </span>
                                  )}
                                  {app.status === 'Rejected' && (
                                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100 font-bold text-[10px]">
                                      Rejected
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex gap-2 items-center justify-end">
                                    <button
                                      onClick={() => {
                                        setSelectedApplicationForResume(app);
                                        setShowResumeViewerModal(true);
                                      }}
                                      className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                                    >
                                      <Eye size={12} /> View Resume
                                    </button>

                                    {app.status !== 'Shortlisted' && (
                                      <button
                                        onClick={() => handleUpdateStatus(app._id, 'Shortlisted')}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1.5 rounded-lg text-[10px]"
                                      >
                                        Shortlist
                                      </button>
                                    )}

                                    {app.status !== 'Rejected' && (
                                      <button
                                        onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                                        className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold px-2.5 py-1.5 rounded-lg text-[10px]"
                                      >
                                        Reject
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: COMPANY PROFILE */}
              {activeDashboardTab === 'profile' && (
                <div className="space-y-8 animate-in-up">
                  {/* Company Info Grid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-stone-50/50 border border-stone-200/60 rounded-3xl p-6 space-y-4">
                      <h4 className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-200/50">
                        <Info size={16} className="text-orange-500" /> Organization Summary
                      </h4>
                      <ul className="text-xs font-semibold text-stone-600 space-y-3">
                        <li className="flex justify-between"><span className="text-stone-400">Official Email:</span> <span>{companyProfile.officialEmail}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">Website:</span> <a href={companyProfile.website} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">{companyProfile.website}</a></li>
                        <li className="flex justify-between"><span className="text-stone-400">Phone:</span> <span>{companyProfile.phone}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">Established:</span> <span>{companyProfile.yearEstablished}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">Location:</span> <span>{companyProfile.city}, {companyProfile.state}, {companyProfile.country}</span></li>
                      </ul>
                    </div>

                    {/* Verification/Compliance Info */}
                    <div className="bg-stone-50/50 border border-stone-200/60 rounded-3xl p-6 space-y-4">
                      <h4 className="text-sm font-extrabold text-black uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-stone-200/50">
                        <CheckCircle2 size={16} className="text-orange-500" /> Compliance Details
                      </h4>
                      <ul className="text-xs font-semibold text-stone-600 space-y-3">
                        <li className="flex justify-between"><span className="text-stone-400">CIN:</span> <span className="font-mono">{companyProfile.cin || 'N/A'}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">GST:</span> <span className="font-mono">{companyProfile.gst || 'N/A'}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">PAN:</span> <span className="font-mono">{companyProfile.pan || 'N/A'}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">HR Contact:</span> <span>{companyProfile.hrName}</span></li>
                        <li className="flex justify-between"><span className="text-stone-400">HR Email:</span> <span>{companyProfile.hrEmail}</span></li>
                      </ul>
                    </div>
                  </div>

                  {/* Uploaded Documents List */}
                  <div className="bg-stone-50/50 border border-stone-200/60 rounded-3xl p-6 space-y-4">
                    <h4 className="text-sm font-extrabold text-black uppercase tracking-wider pb-2 border-b border-stone-200/50 flex items-center gap-2">
                      <FileText size={16} className="text-orange-500" /> Verification Documents Submitted
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {companyProfile.documents && companyProfile.documents.map((doc, idx) => (
                        <a 
                          key={idx}
                          href={`${API_URL}${doc.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 hover:border-orange-500/30 transition-all shadow-sm"
                        >
                          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <span className="text-xs font-bold text-black block truncate">{doc.name}</span>
                            <span className="text-[10px] text-stone-400 font-medium block mt-0.5 truncate">{doc.originalName || 'document.pdf'}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            
            /* SHOW MULTI STEP COMPANY VERIFICATION REGISTRATION FORM */
            <div className="space-y-8 animate-in-up">
              {/* Wizard Steps Indicator */}
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-100 -translate-y-1/2 z-0 hidden md:block" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500 hidden md:block" 
                  style={{ width: `${((step - 1) / 4) * 100}%` }}
                />

                <div className="relative z-10 flex justify-between items-center flex-wrap gap-y-4 md:flex-nowrap">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const stepTitles = ["Basic Info", "Company Details", "Verification", "Documents", "Review"];
                    const isCompleted = step > s;
                    const isActive = step === s;
                    return (
                      <div key={s} className="flex flex-col items-center gap-2 w-1/5 min-w-[70px] text-center">
                        <button
                          onClick={() => handleGoToStep(s)}
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 cursor-pointer ${
                            isCompleted 
                              ? 'bg-orange-500 border-orange-500 text-white hover:bg-orange-600' 
                              : isActive 
                              ? 'bg-white border-orange-500 text-orange-600 shadow-md ring-4 ring-orange-500/10'
                              : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {isCompleted ? <Check size={14} /> : s}
                        </button>
                        <span className={`text-[10px] md:text-xs font-black tracking-tight cursor-pointer hover:text-black transition-colors ${
                          isActive ? 'text-black' : 'text-stone-400'
                        }`}
                          onClick={() => handleGoToStep(s)}
                        >
                          {stepTitles[s - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 1: BASIC INFORMATION */}
              {step === 1 && (
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 space-y-6 shadow-sm">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-xl font-bold text-black">Step 1 — Basic Information</h3>
                    <p className="text-xs text-stone-500 font-medium">Please enter your company identity and core HR coordinates.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Company Name *</label>
                      <input 
                        type="text" 
                        name="companyName" 
                        placeholder="e.g. Acme Corporation"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.companyName ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.companyName && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.companyName}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Official Email *</label>
                      <input 
                        type="email" 
                        name="officialEmail" 
                        placeholder="e.g. verification@acme.com"
                        value={formData.officialEmail}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.officialEmail ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.officialEmail && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.officialEmail}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Official Website *</label>
                      <input 
                        type="url" 
                        name="website" 
                        placeholder="e.g. https://www.acme.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.website ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.website && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.website}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Company Phone Number *</label>
                      <input 
                        type="text" 
                        name="phone" 
                        placeholder="e.g. +1 555 0199"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.phone ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.phone && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.phone}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">HR Contact Person *</label>
                      <input 
                        type="text" 
                        name="hrName" 
                        placeholder="e.g. Jane Doe"
                        value={formData.hrName}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.hrName ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.hrName && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.hrName}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">HR Contact Email *</label>
                      <input 
                        type="email" 
                        name="hrEmail" 
                        placeholder="e.g. jane.doe@acme.com"
                        value={formData.hrEmail}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.hrEmail ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.hrEmail && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.hrEmail}</span>}
                    </div>

                    <div className="space-y-1.5 text-left md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500">HR Contact Phone (Optional)</label>
                      <input 
                        type="text" 
                        name="hrPhone" 
                        placeholder="e.g. +1 555 0144"
                        value={formData.hrPhone}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: COMPANY DETAILS */}
              {step === 2 && (
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 space-y-6 shadow-sm animate-in-up">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-xl font-bold text-black">Step 2 — Company Details</h3>
                    <p className="text-xs text-stone-500 font-medium">Please enter your company establishment data and locations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Year Established *</label>
                      <input 
                        type="number" 
                        name="yearEstablished" 
                        placeholder="e.g. 2018"
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all ${
                          formErrors.yearEstablished ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.yearEstablished && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.yearEstablished}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Industry *</label>
                      <select 
                        name="industry" 
                        value={formData.industry}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all appearance-none cursor-pointer ${
                          formErrors.industry ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      >
                        <option value="">Select Industry</option>
                        {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                      {formErrors.industry && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.industry}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Company Size *</label>
                      <select 
                        name="companySize" 
                        value={formData.companySize}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all appearance-none cursor-pointer ${
                          formErrors.companySize ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      >
                        <option value="">Select Employee Size</option>
                        {companySizes.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                      </select>
                      {formErrors.companySize && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.companySize}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Company Type *</label>
                      <select 
                        name="companyType" 
                        value={formData.companyType}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all appearance-none cursor-pointer ${
                          formErrors.companyType ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      >
                        <option value="">Select Company Type</option>
                        {companyTypes.map(typ => <option key={typ} value={typ}>{typ}</option>)}
                      </select>
                      {formErrors.companyType && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.companyType}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Country</label>
                      <input 
                        type="text" 
                        name="country" 
                        placeholder="e.g. India"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">State</label>
                      <input 
                        type="text" 
                        name="state" 
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">City</label>
                      <input 
                        type="text" 
                        name="city" 
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Postal Code</label>
                      <input 
                        type="text" 
                        name="postalCode" 
                        placeholder="e.g. 400001"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500">Complete Address</label>
                      <input 
                        type="text" 
                        name="address" 
                        placeholder="e.g. Suite 402, Trade Tower, Bandra Kurla Complex"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left md:col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-stone-500">Company Description (Max 500 characters)</label>
                        <span className="text-[10px] text-stone-400 font-bold">{formData.description?.length || 0}/500</span>
                      </div>
                      <textarea 
                        name="description" 
                        rows="4"
                        placeholder="Describe your organization's vision, culture, and core operations..."
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength="500"
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all resize-y ${
                          formErrors.description ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.description && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.description}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFICATION DETAILS */}
              {step === 3 && (
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 space-y-6 shadow-sm animate-in-up">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-xl font-bold text-black">Step 3 — Verification Details</h3>
                    <p className="text-xs text-stone-500 font-medium">Please enter legal identifier registration parameters to authenticate your organization.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Corporate Identification Number (CIN)</label>
                      <input 
                        type="text" 
                        name="cin" 
                        placeholder="21-digit alphanumeric, e.g. U12345MH2010PTC123456"
                        value={formData.cin}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all font-mono uppercase ${
                          formErrors.cin ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.cin && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.cin}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">GST Number</label>
                      <input 
                        type="text" 
                        name="gst" 
                        placeholder="15-digit alphanumeric, e.g. 22AAAAA0000A1Z5"
                        value={formData.gst}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all font-mono uppercase ${
                          formErrors.gst ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.gst && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.gst}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">PAN Number</label>
                      <input 
                        type="text" 
                        name="pan" 
                        placeholder="10-digit alphanumeric, e.g. ABCDE1234F"
                        value={formData.pan}
                        onChange={handleInputChange}
                        className={`w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all font-mono uppercase ${
                          formErrors.pan ? 'border-rose-300 bg-rose-50/10 focus:border-rose-400' : ''
                        }`}
                      />
                      {formErrors.pan && <span className="text-[10px] text-rose-500 font-bold block">{formErrors.pan}</span>}
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">General Registration Number</label>
                      <input 
                        type="text" 
                        name="registrationNumber" 
                        placeholder="e.g. Reg-77412A"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">LinkedIn Company Profile</label>
                      <input 
                        type="url" 
                        name="linkedin" 
                        placeholder="e.g. https://linkedin.com/company/acme"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-stone-500">Careers Page URL</label>
                      <input 
                        type="url" 
                        name="careersPage" 
                        placeholder="e.g. https://www.acme.com/careers"
                        value={formData.careersPage}
                        onChange={handleInputChange}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-stone-800 transition-all"
                      />
                    </div>

                    {/* Logo Upload Panel */}
                    <div className="space-y-3 text-left md:col-span-2 border-t border-stone-100 pt-5">
                      <label className="block text-xs font-bold text-stone-500">Company Logo Upload (Required)</label>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center text-stone-400 overflow-hidden shrink-0">
                          {formData.logo ? (
                            <img src={`${API_URL}${formData.logo}`} alt="Logo preview" className="h-full w-full object-cover" />
                          ) : (
                            <Building size={24} />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <input 
                              type="file" 
                              id="logoInput"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={handleLogoUpload}
                              className="hidden" 
                            />
                            <label 
                              htmlFor="logoInput"
                              className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-2 px-4 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                            >
                              <UploadCloud size={14} /> Upload Logo
                            </label>
                            {formData.logo && (
                              <button 
                                onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 font-medium">Accepts PNG, JPG, or JPEG. Max size 10 MB.</p>
                        </div>
                      </div>

                      {logoUploadProgress > 0 && (
                        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${logoUploadProgress}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Legal Checkbox */}
                    <div className="md:col-span-2 border-t border-stone-100 pt-5 text-left">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="certifiedTrue" 
                          checked={formData.certifiedTrue}
                          onChange={handleInputChange}
                          className="mt-0.5 h-4 w-4 accent-orange-500 rounded border-stone-300"
                        />
                        <span className="text-xs font-bold text-stone-600 select-none leading-relaxed">
                          I certify that all information provided is true and represent the registered entity accurately.
                        </span>
                      </label>
                      {formErrors.certifiedTrue && <span className="text-[10px] text-rose-500 font-bold block mt-1.5">{formErrors.certifiedTrue}</span>}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENTS UPLOAD */}
              {step === 4 && (
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 space-y-6 shadow-sm animate-in-up">
                  <div className="border-b border-stone-100 pb-3">
                    <h3 className="text-xl font-bold text-black">Step 4 — Documents Upload</h3>
                    <p className="text-xs text-stone-500 font-medium">Please drag & drop your official company certification PDFs or images below.</p>
                  </div>

                  {/* Optional documents info banner */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700 font-semibold">
                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Supporting documents are <strong>optional</strong>. Uploading them may help speed up the verification process.
                    </span>
                  </div>

                  <div className="space-y-6">
                    {[
                      { key: 'Certificate of Incorporation', desc: 'Proof of legal entity registration (Optional)' },
                      { key: 'GST Certificate', desc: 'GST identification certificate (Optional)' },
                      { key: 'PAN Card', desc: 'Organization PAN card scan (Optional)' },
                      { key: 'Company Logo', desc: 'Employer logo symbol for listings (Optional)' },
                      { key: 'Address Proof', desc: 'Recent utility bill or registry address proof (Optional)' },
                      { key: 'Authorization Letter', desc: 'HR authorization letter (Optional)' },
                    ].map((docItem) => {
                      const docName = docItem.key;
                      const hasUploaded = documentsState[docName] && documentsState[docName].path;
                      const isUploading = documentsState[docName] && documentsState[docName].progress < 100;
                      const fileInfo = documentsState[docName] || {};
                      const isDragActive = dragOverDoc === docName;

                      return (
                        <div 
                          key={docName}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverDoc(docName);
                          }}
                          onDragLeave={() => setDragOverDoc(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverDoc(null);
                            const file = e.dataTransfer.files[0];
                            uploadDocFile(docName, file);
                          }}
                          className={`border-2 border-dashed rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                            isDragActive 
                              ? 'border-orange-500 bg-orange-50/10' 
                              : hasUploaded 
                              ? 'border-emerald-200 bg-emerald-50/5' 
                              : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                          }`}
                        >
                          <div className="text-left space-y-0.5">
                            <h4 className="text-xs font-black text-black">{docName}</h4>
                            <p className="text-[10px] text-stone-400 font-medium">{docItem.desc}</p>
                            {formErrors[docName] && <span className="text-[10px] text-rose-500 font-bold block">{formErrors[docName]}</span>}
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto">
                            {isUploading ? (
                              <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
                                <Loader2 className="animate-spin" size={14} /> Uploading ({fileInfo.progress}%)
                              </div>
                            ) : hasUploaded ? (
                              <div className="flex items-center gap-3 justify-between w-full md:w-auto">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 max-w-[200px] truncate">
                                  <Check size={14} /> {fileInfo.originalName || 'file_uploaded.pdf'}
                                </div>
                                <button 
                                  onClick={() => handleRemoveDoc(docName)}
                                  className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                                  title="Remove document"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 w-full justify-end">
                                <input 
                                  type="file" 
                                  id={`file-${docName}`}
                                  accept="application/pdf, image/png, image/jpeg, image/jpg"
                                  onChange={(e) => uploadDocFile(docName, e.target.files[0])}
                                  className="hidden" 
                                />
                                <label 
                                  htmlFor={`file-${docName}`}
                                  className="bg-white border border-stone-200/80 hover:bg-stone-50 text-black text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0 active:scale-98"
                                >
                                  <UploadCloud size={14} /> Choose File
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* STEP 5: REVIEW INFORMATION */}
              {step === 5 && (
                <div className="space-y-6 animate-in-up">
                  <div className="grid grid-cols-1 gap-6">
                    
                    {/* Basic Info Summary */}
                    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 shadow-sm relative text-left">
                      <button 
                        onClick={() => setStep(1)}
                        className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-black border border-stone-100 hover:bg-stone-50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Edit2 size={10} /> Edit Section
                      </button>
                      <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-stone-100 pb-2">Basic Info Review</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold text-stone-600">
                        <p><span className="text-stone-400 block font-medium">Company Name:</span> <span className="text-black font-bold text-sm">{formData.companyName}</span></p>
                        <p><span className="text-stone-400 block font-medium">Official Email:</span> <span className="text-black">{formData.officialEmail}</span></p>
                        <p><span className="text-stone-400 block font-medium">Official Website:</span> <a href={formData.website} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">{formData.website}</a></p>
                        <p><span className="text-stone-400 block font-medium">Phone:</span> <span>{formData.phone}</span></p>
                        <p><span className="text-stone-400 block font-medium">HR Contact Person:</span> <span>{formData.hrName}</span></p>
                        <p><span className="text-stone-400 block font-medium">HR Email:</span> <span>{formData.hrEmail}</span></p>
                      </div>
                    </div>

                    {/* Company Details Summary */}
                    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 shadow-sm relative text-left">
                      <button 
                        onClick={() => setStep(2)}
                        className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-black border border-stone-100 hover:bg-stone-50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Edit2 size={10} /> Edit Section
                      </button>
                      <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-stone-100 pb-2">Company Details Review</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold text-stone-600">
                        <p><span className="text-stone-400 block font-medium">Industry:</span> <span className="text-black">{formData.industry}</span></p>
                        <p><span className="text-stone-400 block font-medium">Company Size:</span> <span className="text-black">{formData.companySize} Employees</span></p>
                        <p><span className="text-stone-400 block font-medium">Company Type:</span> <span className="text-black">{formData.companyType}</span></p>
                        <p><span className="text-stone-400 block font-medium">Year Established:</span> <span>{formData.yearEstablished}</span></p>
                        <p className="md:col-span-2"><span className="text-stone-400 block font-medium">Location:</span> <span>{formData.address || 'N/A'}, {formData.city || 'N/A'}, {formData.state || 'N/A'}, {formData.postalCode || 'N/A'}, {formData.country || 'N/A'}</span></p>
                        <p className="md:col-span-2"><span className="text-stone-400 block font-medium">Description:</span> <span className="text-stone-500 font-normal leading-relaxed">{formData.description || 'No description provided.'}</span></p>
                      </div>
                    </div>

                    {/* Verification Details Summary */}
                    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 shadow-sm relative text-left">
                      <button 
                        onClick={() => setStep(3)}
                        className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-black border border-stone-100 hover:bg-stone-50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Edit2 size={10} /> Edit Section
                      </button>
                      <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-stone-100 pb-2">Verification details Review</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs font-semibold text-stone-600">
                        <p><span className="text-stone-400 block font-medium">CIN (Corporate ID):</span> <span className="font-mono">{formData.cin || 'N/A'}</span></p>
                        <p><span className="text-stone-400 block font-medium">GST Number:</span> <span className="font-mono">{formData.gst || 'N/A'}</span></p>
                        <p><span className="text-stone-400 block font-medium">PAN Number:</span> <span className="font-mono">{formData.pan || 'N/A'}</span></p>
                        <p><span className="text-stone-400 block font-medium">Registration Number:</span> <span className="font-mono">{formData.registrationNumber || 'N/A'}</span></p>
                        <p><span className="text-stone-400 block font-medium">LinkedIn Profile:</span> <span>{formData.linkedin || 'N/A'}</span></p>
                        <p><span className="text-stone-400 block font-medium">Careers Page URL:</span> <span>{formData.careersPage || 'N/A'}</span></p>
                      </div>
                    </div>

                    {/* Documents Upload Summary */}
                    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 shadow-sm relative text-left">
                      <button 
                        onClick={() => setStep(4)}
                        className="absolute top-6 right-6 p-2 rounded-xl text-stone-400 hover:text-black border border-stone-100 hover:bg-stone-50 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Edit2 size={10} /> Edit Section
                      </button>
                      <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-stone-100 pb-2">Documents Review</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(documentsState).map(key => (
                          <div key={key} className="bg-stone-50 border border-stone-150 rounded-xl p-3 flex items-center gap-3">
                            <FileText size={16} className="text-orange-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-black text-black block truncate">{key}</span>
                              <span className="text-[9px] text-stone-400 block truncate">{documentsState[key].originalName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Back / Forward Actions */}
              <div className="flex justify-between items-center pt-4">
                {step > 1 ? (
                  <button 
                    onClick={handlePrevStep}
                    className="bg-white text-black border border-stone-200 hover:bg-stone-50 rounded-2xl px-6 py-3.5 font-bold text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : <div />}

                {step < 5 ? (
                  <Button 
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-8 py-3.5 cursor-pointer"
                  >
                    Continue <ChevronRight size={16} />
                  </Button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    {!isFormReadyToSubmit && (
                      <p className="text-[10px] text-stone-400 font-semibold text-right max-w-xs">
                        Complete all required information before submitting for verification.
                      </p>
                    )}
                    <Button 
                      onClick={() => {
                        if (isFormReadyToSubmit) {
                          setShowConfirmSubmit(true);
                        }
                      }}
                      disabled={!isFormReadyToSubmit}
                      className={`${
                        isFormReadyToSubmit
                          ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                      } text-white rounded-2xl px-8 py-3.5 font-bold text-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all`}
                    >
                      Submit for Verification <CheckCircle2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-[440px] rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl animate-scaleUp">
            <h3 className="text-2xl font-black text-black tracking-tight text-center">Confirm Submission</h3>
            <p className="text-xs text-stone-500 text-center leading-relaxed mt-4 font-medium">
              Are you sure you want to submit your company profile for verification? 
              Once submitted, our administration team will review your legal documents before approving your recruiter status.
            </p>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-white border border-stone-200 hover:bg-stone-50 text-black py-3 rounded-2xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 text-xs py-3 cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RECRUITER POST JOB MODAL (Verified Only) */}
      {showJobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-[640px] rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl animate-scaleUp text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-6">
              <h3 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
                <Briefcase size={22} className="text-orange-500" /> Post New Job Opening
              </h3>
              <button 
                onClick={() => setShowJobModal(false)}
                className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-6">
              
              {/* Primary parameters */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest border-l-2 border-orange-500 pl-2">Job Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Job Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={newJob.title}
                      onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Employment Type *</label>
                    <select
                      value={newJob.employmentType}
                      onChange={(e) => setNewJob(prev => ({ ...prev, employmentType: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800 cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Location *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. London, UK (or Remote)"
                      value={newJob.location}
                      onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Salary Range</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $100,000 - $130,000"
                      value={newJob.salary}
                      onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Experience Required</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2 - 5 years"
                      value={newJob.experienceRequired}
                      onChange={(e) => setNewJob(prev => ({ ...prev, experienceRequired: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Vacancies</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newJob.vacancies}
                      onChange={(e) => setNewJob(prev => ({ ...prev, vacancies: Number(e.target.value) }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Application Deadline</label>
                    <input 
                      type="date" 
                      value={newJob.deadline}
                      onChange={(e) => setNewJob(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Job Description *</label>
                  <textarea 
                    required
                    rows="3"
                    placeholder="Describe role responsibilities, tech stacks, and team expectations..."
                    value={newJob.description}
                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800 resize-y"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Skills Requirements (Comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React, TypeScript, Redux, Tailwind"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Eligibility Section */}
              <div className="space-y-4 pt-4 border-t border-stone-150">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest border-l-2 border-rose-500 pl-2">Academic Eligibility Criteria</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Minimum 10th Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={newJob.min10thPercentage}
                      onChange={(e) => setNewJob(prev => ({ ...prev, min10thPercentage: Number(e.target.value) }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Minimum 12th Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={newJob.min12thPercentage}
                      onChange={(e) => setNewJob(prev => ({ ...prev, min12thPercentage: Number(e.target.value) }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Minimum Graduation Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={newJob.minGraduationPercentage}
                      onChange={(e) => setNewJob(prev => ({ ...prev, minGraduationPercentage: Number(e.target.value) }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Minimum CGPA Requirement (0 to 10)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="10"
                      step="0.01"
                      value={newJob.minCGPA}
                      onChange={(e) => setNewJob(prev => ({ ...prev, minCGPA: Number(e.target.value) }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Active Backlogs Allowed?</label>
                    <select
                      value={newJob.backlogsAllowed}
                      onChange={(e) => setNewJob(prev => ({ ...prev, backlogsAllowed: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800 cursor-pointer"
                    >
                      <option value="Yes">Yes, Allowed</option>
                      <option value="No">No, Strictly Disallowed</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Maximum Allowed Backlogs</label>
                    <input 
                      type="number" 
                      min="0"
                      disabled={newJob.backlogsAllowed === 'No'}
                      value={newJob.maxBacklogs}
                      onChange={(e) => setNewJob(prev => ({ ...prev, maxBacklogs: Number(e.target.value) }))}
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs font-bold outline-none ${
                        newJob.backlogsAllowed === 'No' 
                          ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed' 
                          : 'bg-stone-50/50 border-stone-200 focus:border-stone-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Passing Year (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 2024"
                      value={newJob.passingYear}
                      onChange={(e) => setNewJob(prev => ({ ...prev, passingYear: e.target.value }))}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                {/* Branch Checkbox selections */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Eligible Branches (Multi-select)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-stone-150 rounded-2xl p-4 bg-stone-50/20 max-h-[160px] overflow-y-auto">
                    {branchOptions.map((branch) => {
                      const isChecked = newJob.eligibleBranches.includes(branch);
                      return (
                        <label key={branch} className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-700 hover:text-black">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleBranchCheckboxChange(branch, e.target.checked)}
                            className="h-4 w-4 accent-orange-500 rounded border-stone-300"
                          />
                          <span>{branch}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-stone-400 font-medium">Leave all unchecked to indicate any academic branch is eligible.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-stone-150">
                <button 
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 bg-white border border-stone-200 hover:bg-stone-50 text-black py-3.5 rounded-2xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <Button 
                  type="submit"
                  disabled={isCreatingJob}
                  className="flex-1 text-xs py-3.5 cursor-pointer"
                >
                  {isCreatingJob ? 'Posting Job...' : 'Create Job Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANDIDATE RESUME PREVIEW MODAL */}
      {showResumeViewerModal && selectedApplicationForResume && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-[840px] rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl animate-scaleUp text-left max-h-[92vh] flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-stone-100">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-black text-black">
                  {selectedApplicationForResume.applicantDetails?.name}
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-xs text-stone-400 font-bold uppercase">
                    Applied: {new Date(selectedApplicationForResume.appliedDate || selectedApplicationForResume.createdAt).toLocaleDateString()}
                  </p>
                  {selectedApplicationForResume.resumeSource === 'Upload' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                      📎 Uploaded PDF
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full">
                      🏗 Resume Builder
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {selectedApplicationForResume.resumeSource === 'Upload' && selectedApplicationForResume.resumePdf ? (
                  <a
                    href={`${API_URL}${selectedApplicationForResume.resumePdf}`}
                    target="_blank"
                    rel="noreferrer"
                    download={selectedApplicationForResume.resumeFileName || 'resume.pdf'}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-orange-500/10 active:scale-95"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownloadCandidatePDF(selectedApplicationForResume.resumeJson)}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-orange-500/10 active:scale-95"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                )}
                <button 
                  onClick={() => { setSelectedApplicationForResume(null); setShowResumeViewerModal(false); }}
                  className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable resume details container */}
            <div className="flex-1 overflow-y-auto py-6 pr-2 mt-2 min-h-0">

              {/* SOURCE: Uploaded PDF — embed with iframe */}
              {selectedApplicationForResume.resumeSource === 'Upload' && selectedApplicationForResume.resumePdf ? (
                <div className="w-full rounded-2xl overflow-hidden border border-stone-100 shadow-sm" style={{ height: '65vh' }}>
                  <iframe
                    src={`${API_URL}${selectedApplicationForResume.resumePdf}#toolbar=0`}
                    title="Applicant Resume PDF"
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="space-y-8">
              
              {/* High Fidelity A4 replication container for print/download */}
              <div 
                id="applicant-resume-preview" 
                ref={resumePrintRef}
                className="bg-white p-12 text-black font-serif w-full max-w-[760px] mx-auto border border-stone-100 shadow-sm"
              >
                <header className="text-center border-b pb-4 mb-6">
                  <h1 className="text-2xl font-bold uppercase tracking-wide">
                    {selectedApplicationForResume.resumeJson?.personalInfo?.name || selectedApplicationForResume.applicantDetails?.name}
                  </h1>
                  <p className="text-[11px] mt-2">
                    {selectedApplicationForResume.applicantDetails?.email} | {selectedApplicationForResume.applicantDetails?.phone || selectedApplicationForResume.resumeJson?.personalInfo?.phone}
                    {selectedApplicationForResume.resumeJson?.personalInfo?.location && ` | ${selectedApplicationForResume.resumeJson.personalInfo.location}`}
                    {selectedApplicationForResume.resumeJson?.personalInfo?.linkedin && ` | ${selectedApplicationForResume.resumeJson.personalInfo.linkedin}`}
                  </p>
                </header>

                {/* Summary */}
                {selectedApplicationForResume.resumeJson?.summary && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Professional Summary</h2>
                    <p className="text-[10px] leading-relaxed whitespace-pre-wrap text-stone-700">
                      {selectedApplicationForResume.resumeJson.summary}
                    </p>
                  </section>
                )}

                {/* Education */}
                {selectedApplicationForResume.resumeJson?.education?.length > 0 && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Education</h2>
                    <div className="space-y-3">
                      {selectedApplicationForResume.resumeJson.education.map((edu, index) => (
                        <div key={index} className="text-[10px]">
                          <div className="flex justify-between items-baseline font-bold">
                            <div>{edu.school}</div>
                            <div>{edu.year}</div>
                          </div>
                          <div className="italic text-stone-600 mt-0.5">{edu.degree} {edu.location && `— ${edu.location}`}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Experience */}
                {selectedApplicationForResume.resumeJson?.experience?.length > 0 && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Work Experience</h2>
                    <div className="space-y-4">
                      {selectedApplicationForResume.resumeJson.experience.map((exp, index) => (
                        <div key={index} className="text-[10px]">
                          <div className="flex justify-between items-baseline font-bold">
                            <div>{exp.company}</div>
                            <div>{exp.duration}</div>
                          </div>
                          <div className="font-bold text-stone-600 mt-0.5 mb-1">{exp.position}</div>
                          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Internships */}
                {selectedApplicationForResume.resumeJson?.internships?.length > 0 && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Internships</h2>
                    <div className="space-y-4">
                      {selectedApplicationForResume.resumeJson.internships.map((intern, index) => (
                        <div key={index} className="text-[10px]">
                          <div className="flex justify-between items-baseline font-bold">
                            <div>{intern.company}</div>
                            <div>{intern.duration}</div>
                          </div>
                          <div className="font-bold text-stone-600 mt-0.5 mb-1">{intern.position}</div>
                          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {selectedApplicationForResume.resumeJson?.projects?.length > 0 && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Projects</h2>
                    <div className="space-y-3">
                      {selectedApplicationForResume.resumeJson.projects.map((proj, index) => (
                        <div key={index} className="text-[10px]">
                          <div className="flex justify-between items-baseline font-bold">
                            <div>{proj.title}</div>
                            {proj.link && <div className="text-[9px] font-normal text-stone-500 font-mono">{proj.link}</div>}
                          </div>
                          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed mt-1">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {selectedApplicationForResume.resumeJson?.skills?.length > 0 && (
                  <section className="mb-6 text-left">
                    <h2 className="text-xs font-bold border-b border-black pb-0.5 mb-2 uppercase tracking-wider">Technical Skills</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-stone-700">
                      {selectedApplicationForResume.resumeJson.skills.map((skill, index) => (
                        <span key={index}>• {skill}</span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              </div>
              )}

              {/* Extra user parameters for verification comparison */}
              {selectedApplicationForResume.user && (
                <div className="max-w-[760px] mx-auto space-y-4 pt-6 border-t border-stone-100">
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest">Candidate Academic Marksheet Snapshot</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 border border-slate-100 rounded-2xl p-4 font-semibold text-slate-700">
                    <div>10th Score: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.percent10th || '0'}%</span></div>
                    <div>12th Score: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.percent12th || '0'}%</span></div>
                    <div>Graduation: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.percentGraduation || '0'}%</span></div>
                    <div>CGPA: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.cgpa || '0'} / 10</span></div>
                    <div>Backlogs: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.backlogs || '0'}</span></div>
                    <div>Branch: <span className="text-slate-900 font-bold block mt-1 truncate" title={selectedApplicationForResume.user.branch}>{selectedApplicationForResume.user.branch || 'N/A'}</span></div>
                    <div>Passing Year: <span className="text-slate-900 font-bold block mt-1">{selectedApplicationForResume.user.passingYear || 'N/A'}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal actions footer */}
            <div className="flex gap-4 pt-4 border-t border-stone-100 mt-4 justify-end">
              <button 
                onClick={() => { setSelectedApplicationForResume(null); setShowResumeViewerModal(false); }}
                className="bg-stone-900 hover:bg-stone-800 text-white rounded-2xl py-3.5 px-8 text-xs font-extrabold cursor-pointer transition-all active:scale-95"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyPage;
