import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useResumeStore from '../../store/useResumeStore';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../context/AuthContext';
import ResumeCard from '../../components/dashboard/ResumeCard';
import EmptyState from '../../components/dashboard/EmptyState';
import TemplateCard from '../../components/dashboard/TemplateCard';
import ServiceCard from '../../components/dashboard/ServiceCard';
import AdminPortal from '../../components/dashboard/AdminPortal';
import Button from '../../components/common/Button';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Target,
  Loader2,
  Shield
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { resumeList, fetchResumes, resetResume, isLoading } = useResumeStore();
  const { user } = useAuth();
  
  // State to toggle between Candidate view and Admin view
  const [isAdminView, setIsAdminView] = useState(user?.isAdmin || false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Sync state if user loads later
  useEffect(() => {
    if (user?.isAdmin) {
      setIsAdminView(true);
    }
  }, [user]);

  const handleCreateNew = () => {
    resetResume();
    navigate('/builder');
  };

  const templates = [
    { name: 'Professional Classic', id: 1, templateId: 'classic' },
    { name: 'Modern Minimalist', id: 2, templateId: 'modern' },
    { name: 'Minimalist ATS', id: 3, templateId: 'ats-alice' },
    { name: 'Modern ATS', id: 4, templateId: 'ats-isabelle' },
    { name: 'Emerald Modern', id: 5, templateId: 'creative' },
    { name: 'Ocean Blueprint', id: 6, templateId: 'ocean' },
    { name: 'Executive Premium', id: 7, templateId: 'executive' },
  ];

  const services = [
    { 
      title: 'ATS Score Checker', 
      desc: 'Verify if your resume passes the automated screening systems.', 
      icon: Search 
    },
    { 
      title: 'AI Suggestions', 
      desc: 'Get smart recommendations to improve your bullet points.', 
      icon: Sparkles 
    },
    { 
      title: 'Resume Optimization', 
      desc: 'Fine-tune your resume for specific job descriptions.', 
      icon: Target 
    },
  ];

  return (
    <div className="flex bg-white min-h-screen overflow-x-hidden">
      {/* Sidebar - Hover-Expandable */}
      <Sidebar />

      {/* Main Content Area - Properly Adjusted for Sidebar */}
      <main className="flex-1 ml-20 min-h-screen transition-all duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-6 pb-12 w-full">

          {isAdminView ? (
            /* ADMIN PORTAL SECTION */
            <AdminPortal />
          ) : (
            /* CANDIDATE DASHBOARD SECTION */
            <>
              {/* Top Section: Welcome Header */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-4xl font-bold text-black tracking-tight">
                    Welcome back, <span className="text-orange-500">{user?.name?.split(' ')[0] || 'User'}</span>
                  </h1>
                  <p className="text-stone-500 mt-2 font-medium">
                    Manage your resumes and create new ones to land your dream job.
                  </p>
                </div>
                <Button onClick={handleCreateNew} className="flex items-center gap-2 px-8 py-4">
                  <PlusCircle size={20} />
                  Create New Resume
                </Button>
              </header>

              {/* Resume Section */}
              <section className="mb-14">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-black">Your Resumes</h2>
                  {!isLoading && (
                    <span className="text-sm font-semibold text-stone-400 uppercase tracking-widest">{resumeList.length} Resumes</span>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={32} />
                  </div>
                ) : resumeList.length > 0 ? (
                  <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory scrollbar-hide px-2">
                    {resumeList.map(resume => (
                      <div key={resume._id} className="snap-start shrink-0 pointer-events-auto">
                        <ResumeCard 
                          resume={resume}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState onCreateClick={handleCreateNew} />
                )}
              </section>

              {/* Templates Section - With overflow fix */}
              <section className="mb-14">
                <h2 className="text-2xl font-semibold text-black mb-6">Resume Templates</h2>
                <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory scrollbar-hide px-2">
                  {templates.map(temp => (
                    <div key={temp.id} className="snap-start shrink-0">
                      <TemplateCard 
                        name={temp.name} 
                        templateId={temp.templateId}
                      />
                    </div>
                  ))}
                </div>
              </section>



              {/* Services Section */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-6">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
                  {services.map(service => (
                    <ServiceCard 
                      key={service.title} 
                      title={service.title} 
                      desc={service.desc} 
                      icon={service.icon} 
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
