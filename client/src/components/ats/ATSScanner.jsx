import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FileText, Search, CheckCircle, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const getScoreColor = (score) => {
  if (score >= 80) return { text: 'text-green-500', bg: 'bg-green-500', ring: 'ring-green-200', badge: 'bg-green-50 text-green-700 border-green-100' };
  if (score >= 60) return { text: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-200', badge: 'bg-orange-50 text-orange-700 border-orange-100' };
  return { text: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-200', badge: 'bg-red-50 text-red-700 border-red-100' };
};

const ATSScanner = () => {
  const [status, setStatus] = useState('idle'); // idle, scanning, result, error
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const startScan = async () => {
    if (!file) return;
    setStatus('scanning');
    
    // Simulate initial delay to show animation (optional, but looks nice)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post('http://localhost:5000/api/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      setStatus('result');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[40px] border border-black/[0.05] bg-stone-50/50 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {status === 'idle' && (
        <div className="flex flex-col items-center gap-8 py-10">
          <div className="p-8 rounded-full bg-white shadow-sm border border-black/5 relative hover:scale-105 transition-transform cursor-pointer">
            <FileText size={64} className="text-orange-500" />
            <div className="absolute -bottom-2 -right-2 p-2 bg-orange-500 rounded-lg text-white shadow-lg">
              <Search size={20} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-black mb-3">ATS Score Checker</h3>
            <p className="text-stone-500 max-w-xs mx-auto">Upload your resume to see if it passes the ATS filters used by top companies.</p>
          </div>
          
          <div className="w-full space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full py-4 text-lg font-bold bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors shadow-sm"
            >
              {file ? `📄 ${file.name}` : "Upload Resume"}
            </Button>

            <Button 
              onClick={startScan} 
              disabled={!file}
              className={`w-full py-4 text-lg font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-colors ${!file ? 'opacity-50 cursor-not-allowed hover:bg-orange-600' : ''}`}
            >
              Check ATS Score
            </Button>
          </div>
        </div>
      )}

      {status === 'scanning' && (
        <div className="flex flex-col items-center gap-10 py-16">
          <div className="relative h-48 w-40 bg-white rounded-xl border-2 border-dashed border-orange-200 shadow-sm flex items-center justify-center overflow-hidden">
            <FileText size={80} className="text-stone-100" />
            <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_#fb923c] animate-scan z-10" />
            <div className="absolute inset-0 bg-orange-500/5" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-black">Analyzing Document...</h3>
            <p className="text-stone-400 mt-2 font-medium">Extracting keywords & matching criteria</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-10 py-16 text-center">
           <div className="p-8 rounded-full bg-red-50 shadow-sm border border-red-100">
             <AlertCircle size={64} className="text-red-500" />
           </div>
           <div>
             <h3 className="text-2xl font-black text-black mb-3">Upload Failed</h3>
             <p className="text-stone-500 max-w-xs mx-auto">{errorMsg}</p>
           </div>
           <Button onClick={reset} className="w-full py-4 text-lg">
             Try Again
           </Button>
        </div>
      )}

      {status === 'result' && result && (() => {
        const colors = getScoreColor(result.score);
        return (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-black">Analysis Complete</h3>
              <div className={`flex items-center gap-2 font-bold px-4 py-1.5 rounded-full border ${colors.badge}`}>
                <TrendingUp size={18} />
                <span>{result.label}</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-8 bg-white rounded-3xl border border-black/[0.05] shadow-sm">
               <div className="relative flex flex-col items-center">
                  <span className={`text-6xl font-black ${colors.text}`}>{result.score}%</span>
                  <span className="text-sm font-bold text-stone-400 tracking-widest mt-1 uppercase">ATS Score</span>
               </div>
            </div>

            <div className="space-y-4">
               {result.missingKeywords?.length > 0 && (
                 <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                       <AlertCircle size={16} /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {result.missingKeywords.map(kw => (
                         <span key={kw} className="text-xs font-bold bg-white text-orange-600 px-3 py-1 rounded-lg border border-orange-100 capitalize">{kw}</span>
                       ))}
                    </div>
                 </div>
               )}

               {result.recommendations?.length > 0 && (
                 <div className="p-5 rounded-2xl bg-stone-50 border border-black/[0.05]">
                    <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                       <CheckCircle size={16} className="text-green-500" /> Top Recommendation
                    </h4>
                    <p className="text-sm text-stone-500 font-medium">{result.recommendations[0]}</p>
                 </div>
               )}
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={reset} 
                className="w-1/3 py-4 text-base bg-white text-black border border-black/10 hover:border-orange-500 hover:text-orange-500"
              >
                Retry
              </Button>
              <Button 
                onClick={() => navigate('/builder')} 
                className="w-2/3 flex items-center justify-center gap-2 py-4 text-base"
              >
                Build Improved Resume <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ATSScanner;
