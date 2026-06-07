import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import testService from '../../services/testService';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  Camera,
  Shield,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Terminal,
  UserCheck,
  RefreshCw,
  Play,
  Video
} from 'lucide-react';

const TestPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // Primary States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Proctoring States
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [proctoringLogs, setProctoringLogs] = useState([]);
  const [isCheatingModalOpen, setIsCheatingModalOpen] = useState(false);
  const [cheatingReason, setCheatingReason] = useState('');

  // Interactive UI States
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // WebRTC Stream & Video Reference
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Helper to add timestamped security logs
  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setProctoringLogs(prev => [`[${time}] ${message}`, ...prev]);
  };

  // Handle Generate
  const handleGenerateTest = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await testService.generateTest(resumeId);
      setTest(data.test);

      // Initialize answer states
      const initialAnswers = {};
      data.test.questions.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate test. Make sure you set GROQ_API_KEY in server/.env');
    } finally {
      setIsLoading(false);
    }
  };

  // Request Camera Access (Security Checkpoint)
  const requestCameraPermission = async () => {
    try {
      setIsCameraStarting(true);
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCameraPermissionGranted(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addLog('Webcam initialized successfully.');
    } catch (_err) {
      console.error("Camera permission denied", _err);
      setError('Web camera access is strictly required to proceed with this proctored interview. Please enable browser camera permissions.');
    } finally {
      setIsCameraStarting(false);
    }
  };

  // Start Test (Enforce security policies: Fullscreen & Webcam Feed)
  const handleStartTest = async () => {
    if (!cameraPermissionGranted) {
      setError('You must grant web camera permission before starting.');
      return;
    }

    try {
      // Request Fullscreen Mode
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      addLog('Secure Fullscreen mode locked.');
    } catch {
      addLog('WARNING: Fullscreen request failed. Please stay focused.');
    }

    setIsTestStarted(true);
    addLog('Secure Interview started.');
  };

  // Track Real-time Browser Anti-Cheating Violations
  useEffect(() => {
    if (!isTestStarted || result) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const nextVal = prev + 1;
          addLog(`SECURITY WARNING: Tab/window switch detected! (Violation #${nextVal})`);
          return nextVal;
        });
        setCheatingReason('Tab Switch or Window Minimization');
        setIsCheatingModalOpen(true);
      }
    };

    const handleBlur = () => {
      setTabSwitches(prev => {
        const nextVal = prev + 1;
        addLog(`SECURITY WARNING: Application lost focus! (Violation #${nextVal})`);
        return nextVal;
      });
      setCheatingReason('Application/Window Focus Lost');
      setIsCheatingModalOpen(true);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenExits(prev => {
          const nextVal = prev + 1;
          addLog(`SECURITY WARNING: Exited Fullscreen mode! (Violation #${nextVal})`);
          return nextVal;
        });
        setCheatingReason('Exited Fullscreen Lock');
        setIsCheatingModalOpen(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isTestStarted, result]);

  // Sync webcam reference if view shifts and camera active
  useEffect(() => {
    if (cameraPermissionGranted && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraPermissionGranted, isTestStarted]);

  // Clean up WebRTC tracks when test is done/exited
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle change in textareas
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Submit secure data to backend
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        answerText: ans.trim() || 'No answer provided',
      }));

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const totalTabSwitches = tabSwitches;
      const totalFullscreenExits = fullscreenExits;

      const data = await testService.submitTest(test._id, {
        answers: formattedAnswers,
        tabSwitchesCount: totalTabSwitches,
        fullscreenExitsCount: totalFullscreenExits,
        proctoringLogs: proctoringLogs,
        cheatingDetected: totalTabSwitches >= 3 || totalFullscreenExits >= 2,
      });

      setResult({
        score: data.score,
        feedback: data.feedback,
        tabSwitchesCount: totalTabSwitches,
        fullscreenExitsCount: totalFullscreenExits,
        cheatingDetected: totalTabSwitches >= 3 || totalFullscreenExits >= 2,
        proctoringLogs: proctoringLogs
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to evaluate test');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper styling for Question Type Pills
  const getTypePillStyles = (type) => {
    switch (type) {
      case 'System Design':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'Behavioral':
        return 'bg-orange-50 text-orange-700 border border-orange-100';
      case 'Case Study':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Technical':
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Embedded Dynamic Animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
        {!isTestStarted && !result && (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm animate-fadeIn">
            <div className="flex gap-3">
              <ShieldAlert className="text-red-500 shrink-0" size={20} />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* State 1: Ready to Generate */}
        {!test && !isLoading && !result && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={44} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">AI Secure Proctoring Interview</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Generate a high-fidelity, strict, and secure professional assessment customized to your resume. To safeguard test integrity, camera access and browser focus security measures are enforced.
            </p>
            <Button onClick={handleGenerateTest} className="px-8 py-4 text-base font-semibold">
              Generate My Professional Test
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center max-w-2xl mx-auto">
            <Loader2 className="w-14 h-14 text-orange-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Constructing Professional Assessment...</h2>
            <p className="text-slate-500 mt-2 text-center leading-relaxed">
              Our AI recruiter is scanning your skills & experience profiles to formulate advanced technical, case scenario, and design questions.
            </p>
          </div>
        )}

        {/* State 2: Readiness Checklist / Agreement */}
        {test && !isTestStarted && !result && (
          <div className="bg-white rounded-3xl shadow-md border border-slate-200 max-w-2xl mx-auto overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Secure Verification Checklist</h1>
                <p className="text-slate-400 text-sm mt-1">Please agree to proctoring policies to start</p>
              </div>
              <Shield className="text-orange-500 w-10 h-10 shrink-0" />
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Proctoring Ground Rules</h2>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex gap-3">
                    <span className="text-orange-500 font-bold">1.</span>
                    <span><strong>Active Camera Stream:</strong> Your web camera must remain active. You must keep your face visible in the center frame at all times.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-500 font-bold">2.</span>
                    <span><strong>Secure Fullscreen Lock:</strong> The test will launch in full-screen. Exiting full-screen will be captured as a security violation.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-500 font-bold">3.</span>
                    <span><strong>No Tab or Focus Switches:</strong> Any action of shifting tabs, minimizing the browser, or opening other programs will be recorded automatically.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-500 font-bold">4.</span>
                    <span><strong>Strict AI Auditing:</strong> The grading engine will evaluate your responses alongside integrity violations. High violation counts will lead to automatic grading penalties.</span>
                  </li>
                </ul>
              </div>

              {/* Camera Preview Frame */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Video size={16} className="text-slate-500" /> Webcam Verification Feed
                  </span>
                  {cameraPermissionGranted ? (
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">Camera Verified</span>
                  ) : (
                    <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2.5 py-1 rounded-full">Webcam Required</span>
                  )}
                </div>

                <div className="aspect-video w-full max-h-[220px] bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraPermissionGranted && (
                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 text-center">
                      <Camera size={36} className="text-slate-400 mb-2" />
                      <p className="text-white text-sm font-medium mb-3">Permission is required to view your camera stream</p>
                      <Button
                        onClick={requestCameraPermission}
                        className="py-2.5 px-4 text-xs font-semibold"
                        disabled={isCameraStarting}
                      >
                        {isCameraStarting ? 'Initializing...' : 'Grant Webcam Access'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button onClick={() => navigate('/dashboard')} className="bg-transparent hover:bg-slate-200 text-slate-700 px-6 py-2.5 border border-slate-300">
                Cancel
              </Button>
              <Button
                onClick={handleStartTest}
                disabled={!cameraPermissionGranted}
                className="px-8 py-2.5 font-bold"
              >
                I Agree & Start Secure Test
              </Button>
            </div>
          </div>
        )}

        {/* State 3: Active Interactive Proctored Testing Interface */}
        {test && isTestStarted && !result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left/Middle Columns: Single Question Interactive Area */}
            <div className="lg:col-span-2 space-y-6">

              {/* Timeline Header Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Secure Interview Timeline</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-md">
                    Question {activeQuestionIndex + 1} of {test.questions.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {test.questions.map((q, idx) => {
                    const isAnswered = answers[q.id]?.trim().length > 0;
                    const isActive = idx === activeQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`w-11 h-11 flex items-center justify-center text-xs font-bold rounded-xl border transition-all ${isActive
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm scale-105'
                          : isAnswered
                            ? 'bg-orange-50 border-orange-200 text-orange-700 font-extrabold'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Question Card */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 min-h-[460px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question Category</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTypePillStyles(test.questions[activeQuestionIndex].type)}`}>
                      {test.questions[activeQuestionIndex].type || 'Technical'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-snug mb-5">
                    {test.questions[activeQuestionIndex].text}
                  </h2>

                  <div className="relative">
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[220px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-y text-slate-700 text-sm leading-relaxed"
                      placeholder="Type your detailed, structured professional response here..."
                      value={answers[test.questions[activeQuestionIndex].id] || ''}
                      onChange={(e) => handleAnswerChange(test.questions[activeQuestionIndex].id, e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                      {answers[test.questions[activeQuestionIndex].id]?.trim().split(/\s+/).filter(Boolean).length || 0} words
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors text-sm font-bold"
                  >
                    <ChevronLeft size={18} /> Previous Question
                  </button>

                  {activeQuestionIndex < test.questions.length - 1 ? (
                    <Button
                      onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                      className="flex items-center gap-1 text-sm font-semibold px-6 py-2.5"
                    >
                      Next Question <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-2.5 font-bold shadow-lg shadow-orange-500/10"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting Assessment...
                        </span>
                      ) : (
                        'Submit Interview'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Secure Proctoring Hub Console */}
            <div className="space-y-6">

              {/* Webcam Live Frame */}
              <div className="bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 p-5 relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-ring" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">PROCTOR ACTIVE</span>
                </div>

                <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden relative mt-12 mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Subtle terminal-like visual overlays */}
                  <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none" />
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded">
                    FPS: 30
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center border-t border-slate-800 pt-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Tab switches</span>
                    <span className={`text-lg font-bold block ${tabSwitches > 0 ? 'text-red-400' : 'text-slate-200'}`}>{tabSwitches} / 3</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="block text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Esc Exits</span>
                    <span className={`text-lg font-bold block ${fullscreenExits > 0 ? 'text-red-400' : 'text-slate-200'}`}>{fullscreenExits}</span>
                  </div>
                </div>
              </div>

              {/* Proctoring Logs Feed terminal */}
              <div className="bg-slate-950 text-emerald-400 rounded-2xl p-5 border border-slate-800 shadow-md font-mono text-xs flex flex-col h-[280px]">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-3 text-slate-400 font-bold shrink-0">
                  <Terminal size={14} /> SECURITY AUDIT EVENT FEED
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                  {proctoringLogs.length === 0 ? (
                    <div className="text-slate-600 italic">Listening for security system hooks...</div>
                  ) : (
                    proctoringLogs.map((log, index) => {
                      const isWarn = log.includes('WARNING') || log.includes('SECURITY');
                      return (
                        <div key={index} className={isWarn ? 'text-rose-400' : 'text-emerald-400'}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* State 4: Security Result Assessment View */}
        {result && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto transform transition-all animate-fadeIn">

            {/* Header banner indicating overall score */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center text-white relative">
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold">
                <Shield size={14} className="text-orange-500" /> Secure-Audited Assessment
              </div>

              <CheckCircle className="w-14 h-14 mx-auto mb-3 text-orange-500" />
              <h2 className="text-xs font-bold tracking-widest uppercase mb-1 opacity-70">Evaluated score</h2>

              <div className="text-7xl font-black flex items-center justify-center gap-2 tracking-tighter">
                {result.score} <span className="text-2xl font-semibold opacity-50">/ 100</span>
              </div>
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Feedback details */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">AI Recruiter Evaluation</h3>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {result.feedback.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>

              {/* Proctoring Scorecard Details */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase border-b border-slate-200 pb-2">Security Audit Report</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Integrity Rating</span>
                    {result.cheatingDetected ? (
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">Suspicion Flagged</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Verified Secure</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Tab Switches</span>
                    <span className={`text-sm font-bold ${result.tabSwitchesCount >= 3 ? 'text-red-600' : 'text-slate-800'}`}>
                      {result.tabSwitchesCount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">Fullscreen Exits</span>
                    <span className={`text-sm font-bold ${result.fullscreenExitsCount >= 1 ? 'text-red-600' : 'text-slate-800'}`}>
                      {result.fullscreenExitsCount}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-mono custom-scrollbar max-h-[140px] overflow-y-auto">
                  <div className="font-bold text-slate-700 border-b border-slate-100 pb-1.5 mb-2 flex items-center gap-1.5">
                    <Terminal size={12} /> SESSION VIOLATION LOGS
                  </div>
                  {result.proctoringLogs && result.proctoringLogs.length > 0 ? (
                    result.proctoringLogs.slice().reverse().map((log, i) => (
                      <div key={i} className="mb-1 last:mb-0 break-words">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="italic text-slate-400 text-center">No proctoring logs found.</div>
                  )}
                </div>
              </div>

            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-center">
              <Button onClick={() => navigate('/dashboard')} className="px-8 py-3 font-semibold text-sm">
                Return to My Dashboard
              </Button>
            </div>

          </div>
        )}

      </div>

      {/* Proctoring Violation Cheating Warning Modal */}
      {isCheatingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100 text-center mx-4 animate-scaleUp">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldAlert size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Integrity Violation Detected!</h2>
            <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-4">
              Reason: {cheatingReason}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              This exam is strictly live-proctored. Any tab switching, application minimizing, window switching, or exiting fullscreen mode is logged as a security breach. Continued violations will severely lower your AI-assessed interview score.
            </p>
            <Button
              onClick={async () => {
                setIsCheatingModalOpen(false);
                // Attempt to re-enforce fullscreen
                try {
                  const elem = document.documentElement;
                  if (!document.fullscreenElement) {
                    if (elem.requestFullscreen) {
                      await elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                      await elem.webkitRequestFullscreen();
                    }
                  }
                } catch { /* intentionally empty */ }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white w-full py-3 rounded-xl font-bold"
            >
              I Understand, Resume Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
