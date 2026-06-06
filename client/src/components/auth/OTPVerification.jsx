import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { Timer, RefreshCw, ShieldCheck } from 'lucide-react';
import { resendOTP } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const OTPVerification = ({ email: propEmail, onBack }) => {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const email = propEmail || localStorage.getItem('pendingEmail');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP(email, otp);
      localStorage.removeItem('pendingEmail');
      // Success animation or message can be added here
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setResending(true);
    setError('');

    try {
      await resendOTP(email);
      setTimeLeft(600); // Reset timer to 10 minutes
      setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-50 text-orange-500 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-2xl font-black text-black mb-2">Verify Your Email</h3>
        <p className="text-sm text-stone-500 max-w-xs mx-auto">
          We've sent a 4-digit code to <span className="font-bold text-black">{email || 'your email'}</span>.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-center">
          <Input 
            name="otp"
            type="text" 
            placeholder="0000" 
            maxLength={4} 
            className="w-48 text-center text-4xl font-black tracking-[0.5em] bg-stone-50 border-none h-20 rounded-2xl focus:ring-4 focus:ring-orange-500/10 placeholder:text-stone-200"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setOtp(val);
              if (val.length === 4) {
                // Auto-submit could be implemented here
              }
            }}
            required
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            {timeLeft > 0 ? (
              <div className="flex items-center gap-2 text-stone-400 bg-stone-50 px-4 py-2 rounded-full">
                <Timer size={16} />
                <span>Expires in <span className="text-black font-black">{formatTime(timeLeft)}</span></span>
              </div>
            ) : (
              <div className="text-red-500 bg-red-50 px-4 py-2 rounded-full">
                OTP Expired
              </div>
            )}
          </div>

          {timeLeft <= 0 && (
            <button 
              type="button" 
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-all font-black text-sm uppercase tracking-widest disabled:opacity-50"
            >
              <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
              <span>{resending ? 'Sending Code...' : 'Resend Verification Code'}</span>
            </button>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full py-5 text-lg font-black shadow-xl shadow-orange-500/20" 
          disabled={loading || timeLeft <= 0}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>

        {onBack && (
          <div className="text-center">
            <button 
              type="button" 
              onClick={onBack}
              className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest"
            >
              Back to registration
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OTPVerification;
