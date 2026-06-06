import React, { useState, useCallback } from 'react';
import useResumeStore from '../../store/useResumeStore';
import { generateAIResume, analyzeATSScore } from '../../services/groqService';
import {
  Sparkles,
  Loader2,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';

// ─── ATS Score Gauge ────────────────────────────────────────────────────────

const ATSGauge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 75) return { stroke: '#22c55e', bg: 'bg-green-50', text: 'text-green-600', label: 'Excellent' };
    if (s >= 50) return { stroke: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Good' };
    return { stroke: '#ef4444', bg: 'bg-red-50', text: 'text-red-600', label: 'Needs Work' };
  };

  const { stroke, bg, text, label } = getColor(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl ${bg} border border-black/5`}>
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={stroke} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${text}`}>{score}</span>
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">ATS</span>
        </div>
      </div>
      <div>
        <p className={`text-sm font-black ${text}`}>{label} Match</p>
        <p className="text-xs text-stone-500 mt-1 font-medium">Based on job description analysis</p>
      </div>
    </div>
  );
};

// ─── Keyword Pill ────────────────────────────────────────────────────────────

const KeywordPill = ({ word, found }) => (
  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
    found
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-600 border-red-200'
  }`}>
    {found ? <CheckCircle2 size={10} /> : <X size={10} />}
    {word}
  </span>
);

// ─── Toast Notification ──────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 p-4 rounded-2xl border shadow-xl max-w-sm ${styles[type]}`}>
      {type === 'success' && <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
      {type === 'error' && <AlertCircle size={18} className="shrink-0 mt-0.5" />}
      {type === 'info' && <Sparkles size={18} className="shrink-0 mt-0.5" />}
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Main AIPanel Component ──────────────────────────────────────────────────

const AIPanel = () => {
  const {
      currentResumeData,
      updateJobDescription,
      setAIGenerating,
      applyAIResume,
      applyATSAnalysis,
  } = useResumeStore();

  const { jobDescription, isAIGenerating, atsScore, missingKeywords, matchedKeywords, suggestedSkills, aiImprovements } = currentResumeData;

  const [isExpanded, setIsExpanded] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleAnalyzeOnly = async () => {
    if (!jobDescription || !jobDescription.trim()) {
      showToast('Please paste a job description first.', 'error');
      return;
    }
    setAIGenerating(true);
    try {
      const result = await analyzeATSScore(currentResumeData, jobDescription);
      applyATSAnalysis(result);
      setShowResults(true);
      showToast(`ATS Score: ${result.atsScore}/100 — analysis complete!`, 'success');
    } catch (err) {
      setAIGenerating(false);
      showToast(err.message || 'Analysis failed. Check your API key.', 'error');
    }
  };

  const handleGenerateFull = async () => {
    if (!jobDescription || !jobDescription.trim()) {
      showToast('Please paste a job description first.', 'error');
      return;
    }
    const hasContent = currentResumeData.personalInfo?.fullName || currentResumeData.experience?.[0]?.company;
    if (!hasContent) {
      showToast('Please fill in some resume content first, then click Generate.', 'error');
      return;
    }
    setAIGenerating(true);
    showToast('Groq AI is optimizing your resume… this takes ~10 seconds.', 'info');
    try {
      const result = await generateAIResume(currentResumeData, jobDescription);
      applyAIResume(result);
      setShowResults(true);
      showToast(`✓ Resume optimized! ATS Score: ${result.atsScore}/100`, 'success');
    } catch (err) {
      setAIGenerating(false);
      showToast(err.message || 'Generation failed. Check your API key.', 'error');
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-10 rounded-[28px] border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/30 overflow-hidden shadow-sm">
        {/* Panel Header */}
        <button
          onClick={() => setIsExpanded(v => !v)}
          className="w-full flex items-center justify-between p-5 hover:bg-orange-50/50 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              <Sparkles size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-black">AI Resume Optimizer</p>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Powered by Groq · Llama 3 70B</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {atsScore !== null && (
              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                atsScore >= 75 ? 'bg-green-100 text-green-700' :
                atsScore >= 50 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-600'
              }`}>
                ATS {atsScore}%
              </span>
            )}
            {isExpanded ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
          </div>
        </button>

        {/* Panel Body */}
        {isExpanded && (
          <div className="px-5 pb-5 space-y-4">
            {/* JD textarea */}
            <div>
              <label className="block text-xs font-black text-stone-600 uppercase tracking-widest mb-2 ml-1">
                Paste Job Description
              </label>
              <textarea
                className="w-full rounded-2xl border border-black/10 bg-white p-4 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/15 transition-all min-h-[130px] resize-none"
                placeholder="Paste the full job description here. The AI will analyze keywords, required skills, and responsibilities to optimize your resume for maximum ATS compatibility..."
                value={jobDescription}
                onChange={(e) => updateJobDescription(e.target.value)}
              />
              {jobDescription?.trim() && (
                <p className="text-[11px] text-stone-400 font-medium mt-1 ml-1">
                  {jobDescription.trim().split(/\s+/).length} words detected
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Analyze Only */}
              <button
                onClick={handleAnalyzeOnly}
                disabled={isAIGenerating}
                className="flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-xs font-black text-orange-600 hover:bg-orange-50 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isAIGenerating ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                Score Only
              </button>

              {/* Full AI Generate */}
              <button
                onClick={handleGenerateFull}
                disabled={isAIGenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/25"
              >
                {isAIGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Optimizing Resume…
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    ⚡ Generate ATS Resume
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {atsScore !== null && (
              <div className="space-y-4 pt-1">
                {/* Score Gauge */}
                <ATSGauge score={atsScore} />

                {/* AI Improvements summary */}
                {aiImprovements && (
                  <div className="flex gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <TrendingUp size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-blue-700 font-medium">{aiImprovements}</p>
                  </div>
                )}

                {/* Toggle results detail */}
                <button
                  onClick={() => setShowResults(v => !v)}
                  className="text-xs font-bold text-stone-500 hover:text-orange-500 transition-colors flex items-center gap-1"
                >
                  {showResults ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showResults ? 'Hide' : 'Show'} keyword details
                </button>

                {showResults && (
                  <div className="space-y-3">
                    {/* Matched keywords */}
                    {matchedKeywords?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">✓ Matched Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedKeywords.map(k => <KeywordPill key={k} word={k} found={true} />)}
                        </div>
                      </div>
                    )}

                    {/* Missing keywords */}
                    {missingKeywords?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">✗ Missing Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {missingKeywords.map(k => <KeywordPill key={k} word={k} found={false} />)}
                        </div>
                      </div>
                    )}

                    {/* Suggested skills */}
                    {suggestedSkills?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">💡 Skills to Add</p>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestedSkills.map(s => (
                            <span key={s} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AIPanel;
