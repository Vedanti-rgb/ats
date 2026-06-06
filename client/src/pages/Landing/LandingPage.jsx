import React from 'react';
import { Link } from 'react-router-dom';
import ATSScanner from '../../components/ats/ATSScanner';
import { Cpu, Zap, Shield, Globe, Star, Sparkles, CheckCircle, Target, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full font-sans bg-white min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500 opacity-10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-orange-400 opacity-10 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-8 pb-16 md:pt-16 md:pb-28 flex flex-col lg:flex-row items-center justify-between gap-12 z-10 animate-in-up">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-[50%] flex flex-col items-start text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-bold text-sm mb-8 shadow-sm">
            <Sparkles size={16} className="text-orange-500" />
            <span>Next-Generation Resume Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight md:leading-[1.1] mb-6">
            Land more interviews with <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">
              AI Resume Builder.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-xl leading-relaxed">
            Beat the Applicant Tracking Systems, write compelling bullet points with AI, and perfectly tailor your resume to any job description in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 w-full">
            <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-[20px] bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group transform active:scale-95">
              <Zap size={20} className="fill-white group-hover:scale-110 transition-transform" />
              Build Your Resume
            </Link>
            <a href="#ats-scanner-section" className="w-full sm:w-auto px-8 py-4 rounded-[20px] bg-white text-slate-800 font-bold text-lg border-2 border-slate-200 hover:border-orange-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 transform active:scale-95 hover:shadow-md">
              <CheckCircle size={20} className="text-orange-600"/>
              Check ATS Score
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-200/60 w-full max-w-md">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-bold text-sm">4.9/5 Rating</span>
              <span className="text-slate-500 text-xs font-medium">Trusted by 25,000+ users</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Target size={18} className="text-orange-500" />
              <span>ATS-Friendly</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <TrendingUp size={18} className="text-orange-500" />
              <span>Higher Callback Rate</span>
            </div>
          </div>

        </div>

        {/* Right Side: Visuals / ATS Scanner */}
        <div id="ats-scanner-section" className="w-full lg:w-[45%] relative mt-12 lg:mt-0 lg:pl-10">
          
          {/* Decorative Behind Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-orange-500 transform rotate-3 rounded-[40px] opacity-15 blur-2xl blur-3xl -z-10"></div>
          
          {/* Main Card Wrapper */}
          <div className="bg-white/90 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative">
            
            {/* Absolute Badges */}
            <div className="absolute -top-6 -right-6 lg:-right-10 bg-orange-600 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-xl transform rotate-6 border-4 border-white z-20 flex items-center gap-2">
              <Zap size={16} className="fill-white" />
              <span>Instant Analysis</span>
            </div>
            
            <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-white text-slate-800 font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-xl transform -rotate-3 border border-slate-100 z-20 flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
              <span>100% Secure</span>
            </div>

            {/* ATS Component Embedded */}
            <div className="bg-slate-50 rounded-2xl p-1 overflow-hidden">
               <ATSScanner />
            </div>
          </div>
        </div>

      </section>

      {/* Templates Showcase Section */}
      <section id="templates-section" className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 animate-in-up" style={{ animationDelay: '0.2s' }}>
         <div className="text-center mb-16">
           <span className="text-orange-600 font-bold text-sm tracking-wider uppercase mb-2 block">Resume Templates</span>
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Professionally Designed Templates</h2>
           <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Choose from our selection of ATS-optimized designs proven to get you hired.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="aspect-[1/1.4] bg-white rounded-[24px] shadow-xl border border-slate-100 overflow-hidden relative group transform transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                 <Link to="/dashboard" className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">Use Template</Link>
              </div>
              <div className="w-full h-full bg-slate-50 p-6">
                 {/* Mock Template 1 */}
                 <div className="w-full h-full bg-white shadow-sm border border-slate-200 flex flex-col p-6 rounded-lg pointer-events-none">
                    <div className="h-5 w-1/2 bg-slate-800 rounded mb-3"></div>
                    <div className="h-3 w-1/3 bg-orange-500 rounded mb-8"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                    <div className="h-2 w-3/4 bg-slate-200 rounded mb-8"></div>
                    
                    <div className="h-3 w-1/4 bg-slate-800 rounded mb-4"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                    <div className="h-2 w-5/6 bg-slate-200 rounded mb-2"></div>
                 </div>
              </div>
            </div>
            
            <div className="aspect-[1/1.4] bg-white rounded-[24px] shadow-xl border border-slate-100 overflow-hidden relative group transform transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                 <Link to="/dashboard" className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">Use Template</Link>
              </div>
              <div className="w-full h-full bg-slate-50 p-6">
                 {/* Mock Template 2 - Centered */}
                 <div className="w-full h-full bg-white shadow-sm border border-slate-200 flex flex-col p-6 rounded-lg pointer-events-none border-t-8 border-t-orange-500 items-center">
                    <div className="h-5 w-2/3 bg-slate-800 rounded mb-3"></div>
                    <div className="h-3 w-1/3 bg-slate-400 rounded mb-8"></div>
                    <div className="w-full text-left">
                      <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                      <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                      <div className="h-2 w-4/5 bg-slate-200 rounded mb-8"></div>
                      
                      <div className="h-3 w-1/4 bg-slate-800 rounded mb-4"></div>
                      <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
                      <div className="h-2 w-5/6 bg-slate-200 rounded mb-2"></div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="aspect-[1/1.4] bg-white rounded-[24px] shadow-xl border border-slate-100 overflow-hidden relative group transform transition-transform hover:-translate-y-2 hidden md:block">
              <div className="absolute inset-0 bg-orange-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                 <Link to="/dashboard" className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">Use Template</Link>
              </div>
              <div className="w-full h-full bg-slate-50 p-6 flex gap-3">
                 {/* Mock Template 3 - Two Column */}
                 <div className="w-1/3 h-full bg-slate-800 rounded-l-lg opacity-90"></div>
                 <div className="w-2/3 h-full bg-white shadow-sm border border-slate-200 border-l-0 flex flex-col py-6 px-4 rounded-r-lg pointer-events-none">
                    <div className="h-5 w-3/4 bg-slate-800 rounded mb-8"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                    <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                    <div className="h-2 w-5/6 bg-slate-200 rounded mb-8"></div>
                    
                    <div className="h-2 w-full bg-slate-200 rounded mb-3"></div>
                    <div className="h-2 w-4/5 bg-slate-200 rounded mb-3"></div>
                 </div>
              </div>
            </div>
         </div>
         <div className="mt-12 text-center">
            <Link to="/dashboard" className="text-orange-600 font-bold hover:text-orange-800 transition-colors inline-flex items-center gap-2">
              See all templates
              <span className="text-xl leading-none">&rarr;</span>
            </Link>
         </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 border-t border-slate-200/50 animate-in-up" style={{ animationDelay: '0.4s' }}>
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Why professionals choose us</h2>
           <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Everything you need to create a resume that passes the algorithms and catches the recruiter's eye.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem 
              icon={<Cpu className="text-orange-600" size={28} />} 
              title="AI Analysis" 
              desc="Deep learning models rewrite and optimize every single bullet point."
              color="bg-orange-50"
            />
            <FeatureItem 
              icon={<Target className="text-orange-600" size={28} />} 
              title="ATS Precision" 
              desc="Get instant compatibility scores mapped against real ATS filters."
              color="bg-orange-50"
            />
            <FeatureItem 
              icon={<Shield className="text-orange-600" size={28} />} 
              title="100% Compliant" 
              desc="Modern templates perfectly readable by workday and greenhouse."
              color="bg-orange-50"
            />
            <FeatureItem 
              icon={<Globe className="text-orange-600" size={28} />} 
              title="Global Standards" 
              desc="Trusted by professionals in over 50 countries globally."
              color="bg-orange-50"
            />
         </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-slate-900 text-white py-16 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-left">
          <div className="col-span-1 lg:col-span-2 pr-8">
            <h2 className="text-2xl font-black tracking-tighter text-white mb-6 flex items-center gap-1">
              GetResume<span className="text-orange-400">AI</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
              Empowering job seekers with high-performance resume solutions driven by advanced artificial intelligence. Win the job you deserve.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><Link to="/dashboard" className="hover:text-orange-400 transition-colors">Resume Builder</Link></li>
              <li><a href="#ats-scanner-section" className="hover:text-orange-400 transition-colors">ATS Checker</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Templates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Connect</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><a href="#" className="hover:text-orange-400 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto border-t border-slate-800 mt-16 pt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          © 2026 GetResumeAI. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc, color }) => (
  <div className="flex flex-col items-start p-8 rounded-3xl bg-white border border-slate-200/70 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300">
    <div className={`p-4 rounded-2xl ${color} mb-6`}>{icon}</div>
    <h4 className="font-bold text-slate-900 text-xl mb-3">{title}</h4>
    <p className="text-base text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default LandingPage;
