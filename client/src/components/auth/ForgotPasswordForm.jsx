import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { forgotPassword, resetPassword } from '../../services/authService';
import { Timer, ArrowLeft, KeyRound, MailCheck } from 'lucide-react';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('EMAIL'); // 'EMAIL' or 'RESET'
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email.toLowerCase());
      setStep('RESET');
      setTimeLeft(600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (otp.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.toLowerCase(), otp, newPassword);
      onBackToLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-50 text-orange-500 mb-4">
          {step === 'EMAIL' ? <KeyRound size={32} /> : <MailCheck size={32} />}
        </div>
        <h3 className="text-2xl font-black text-black mb-2">Reset Your Password</h3>
        <p className="text-sm text-stone-500 max-w-xs mx-auto">
          {step === 'EMAIL' 
            ? 'Enter your email address and we\'ll send you a verification code.'
            : 'Enter the OTP sent to your email and your new password.'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center font-medium">
          {error}
        </div>
      )}

      {step === 'EMAIL' ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Button type="submit" className="w-full py-5 text-lg font-black shadow-xl shadow-orange-500/20" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={onBackToLogin}
              className="flex items-center justify-center gap-2 text-sm font-bold text-stone-400 hover:text-black transition-all w-full uppercase tracking-widest"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="flex justify-center flex-col items-center gap-4">
            <Input 
              name="otp"
              type="text" 
              placeholder="0000" 
              maxLength={4} 
              className="w-40 text-center text-3xl font-black tracking-[0.5em] h-16 rounded-xl bg-stone-50 border-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              required
              autoFocus
            />
            {timeLeft > 0 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
                <Timer size={14} />
                <span>Expires in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-red-500 text-xs font-bold uppercase tracking-widest">OTP has expired</div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full py-5 text-lg font-black shadow-xl shadow-orange-500/20" disabled={loading || timeLeft <= 0}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setStep('EMAIL')}
              className="text-xs font-bold text-stone-400 hover:text-black transition-all uppercase tracking-widest"
            >
              Resend code to email
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
