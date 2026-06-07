import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  FileUp, FileText, CheckCircle, AlertCircle, XCircle,
  RotateCcw, TrendingUp, Zap, ChevronDown, ChevronUp
} from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 80) return { text: 'text-green-500', bg: 'bg-green-500', ring: 'ring-green-200', badge: 'bg-green-50 text-green-700 border-green-100' };
  if (score >= 60) return { text: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-200', badge: 'bg-orange-50 text-orange-700 border-orange-100' };
  return { text: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-200', badge: 'bg-red-50 text-red-700 border-red-100' };
};

const statusIcon = (status) => {
  if (status === 'good') return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
  if (status === 'warn') return <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />;
  return <XCircle size={14} className="text-red-500 flex-shrink-0" />;
};

const ScoreRing = ({ score }) => {
  const colors = getScoreColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f5f5f4" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#fb923c' : '#ef4444'}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={`text-4xl font-black ${colors.text}`}>{score}</span>
        <span className="text-xs font-bold text-stone-400 tracking-widest uppercase">/ 100</span>
      </div>
    </div>
  );
};

const ATSChecker = () => {
  const [phase, setPhase] = useState('idle');
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (f) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) {
      setErrorMsg('❌ Invalid file type. Please upload a PDF or DOCX file only.');
      setPhase('error');
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg('❌ File too large. Maximum allowed size is 10 MB.');
      setPhase('error');
      return false;
    }
    return true;
  };

  const uploadFile = async (f) => {
    setPhase('uploading');
    const formData = new FormData();
    formData.append('resume', f);
    try {
      const { data } = await axios.post('http://localhost:5000/api/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      setPhase('result');
    } catch (_err) {
      const msg = _err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMsg(`❌ ${msg}`);
      setPhase('error');
    }
  };

  const handleFile = useCallback((f) => {
    if (!f) return;
    setErrorMsg('');
    if (!validateFile(f)) return;
    setFile(f);
    uploadFile(f);
  }, []);

  const onInputChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const reset = () => {
    setPhase('idle');
    setFile(null);
    setResult(null);
    setErrorMsg('');
    setShowBreakdown(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-10 rounded-3xl border border-black/[0.06] bg-stone-50/80 overflow-hidden shadow-xl backdrop-blur-sm">

      <div className="flex items-center justify-between px-8 py-5 border-b border-black/[0.06] bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100">
            <Zap size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-black leading-tight">ATS Score Checker</h2>
            <p className="text-xs text-stone-400 font-medium">Upload your resume to get instant analysis</p>
          </div>
        </div>
        {phase !== 'idle' && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-black transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-100"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      <div className="p-8">

        {phase === 'idle' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-5 py-14 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
              ${dragOver
                ? 'border-orange-400 bg-orange-50 scale-[1.01]'
                : 'border-black/10 bg-white hover:border-orange-300 hover:bg-orange-50/50'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={onInputChange}
            />
            <div className={`p-5 rounded-2xl transition-all ${dragOver ? 'bg-orange-100' : 'bg-stone-100'}`}>
              <FileUp size={36} className={`transition-colors ${dragOver ? 'text-orange-500' : 'text-stone-400'}`} />
            </div>
            <div className="text-center">
              <p className="font-bold text-black text-sm">
                {dragOver ? 'Drop it here!' : 'Drag & drop your resume here'}
              </p>
              <p className="text-stone-400 text-xs mt-1">or <span className="text-orange-500 font-bold underline underline-offset-2">browse files</span></p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-300 bg-stone-100 px-3 py-1 rounded-full">PDF</span>
              <span className="text-xs font-semibold text-stone-300 bg-stone-100 px-3 py-1 rounded-full">DOCX</span>
              <span className="text-xs text-stone-300">• Max 10 MB</span>
            </div>
          </div>
        )}

        {phase === 'uploading' && (
          <div className="flex flex-col items-center gap-8 py-10">
            <div className="relative w-32 h-40 bg-white rounded-xl border-2 border-dashed border-orange-200 shadow-sm flex items-center justify-center overflow-hidden">
              <FileText size={64} className="text-stone-100" />
              <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_#fb923c] animate-scan z-10" />
              <div className="absolute inset-0 bg-orange-500/5" />
            </div>
            <div className="text-center">
              <p className="font-black text-black text-lg">Analyzing your resume…</p>
              <p className="text-stone-400 text-sm mt-1">
                {file?.name && <span className="font-medium text-stone-500">"{file.name}"</span>}
              </p>
              <p className="text-stone-400 text-xs mt-2">Extracting keywords & scoring sections</p>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
              <XCircle size={40} className="text-red-500" />
            </div>
            <div>
              <p className="font-black text-black text-lg">Upload Failed</p>
              <p className="text-stone-500 text-sm mt-2 max-w-xs">{errorMsg}</p>
            </div>
            <button
              onClick={reset}
              className="mt-2 flex items-center gap-2 bg-black text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <RotateCcw size={15} /> Try Again
            </button>
          </div>
        )}

        {phase === 'result' && result && (() => {
          const colors = getScoreColor(result.score);
          return (
            <div className="flex flex-col gap-7 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-black/[0.06] shadow-sm">
                <ScoreRing score={result.score} />
                <div className="flex-1 text-center sm:text-left">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-3 ${colors.badge}`}>
                    <TrendingUp size={12} /> {result.label}
                  </span>
                  <p className="font-black text-black text-xl leading-snug">
                    Your resume scored <span className={colors.text}>{result.score}/100</span>
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    {result.wordCount} words detected · {Object.values(result.breakdown).filter(b => b.status === 'good').length}/{Object.keys(result.breakdown).length} sections passing
                  </p>
                </div>
              </div>

              {result.missingKeywords?.length > 0 && (
                <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                  <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-sm">
                    <AlertCircle size={15} /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map(kw => (
                      <span key={kw} className="text-xs font-bold bg-white text-orange-600 px-3 py-1 rounded-lg border border-orange-100 capitalize">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.recommendations?.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-3">
                  <h4 className="font-bold text-black mb-1 flex items-center gap-2 text-sm">
                    <CheckCircle size={15} className="text-orange-500" /> Recommendations
                  </h4>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <p className="text-sm text-stone-600">{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-black/[0.06] overflow-hidden bg-white shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-black hover:bg-stone-50 transition-colors"
                  onClick={() => setShowBreakdown(v => !v)}
                >
                  <span>Section Breakdown</span>
                  {showBreakdown ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                </button>
                {showBreakdown && (
                  <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(result.breakdown).map(([section, data]) => (
                      <div key={section} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-black/[0.04]">
                        <div className="flex items-center gap-2">
                          {statusIcon(data.status)}
                          <span className="text-xs font-semibold text-stone-700">{section}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-500">{data.score}/{data.max}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-stone-800 transition-colors text-sm"
              >
                <RotateCcw size={15} /> Analyze Another Resume
              </button>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default ATSChecker;