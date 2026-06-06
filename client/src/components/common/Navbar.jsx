import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import Modal from './Modal';
import SignupForm from '../auth/SignupForm';
import LoginForm from '../auth/LoginForm';
import OTPVerification from '../auth/OTPVerification';
import ForgotPasswordForm from '../auth/ForgotPasswordForm';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('LOGIN'); // 'LOGIN', 'SIGNUP', 'OTP', or 'FORGOT_PASSWORD'
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const openAuth = (step) => {
    setAuthStep(step);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/dashboard');
  };

  const handleSignupSuccess = (email) => {
    setPendingEmail(email);
    setAuthStep('OTP');
  };

  const handleBackToSignup = () => {
    setAuthStep('SIGNUP');
  };

  const getModalTitle = () => {
    switch (authStep) {
      case 'LOGIN': return 'Welcome Back';
      case 'SIGNUP': return 'Create Account';
      case 'OTP': return 'Identity Verification';
      case 'FORGOT_PASSWORD': return 'Reset Password';
      default: return 'Authentication';
    }
  };

  const handleBackToLogin = () => {
    setAuthStep('LOGIN');
  };

  return (
    <nav className="w-full border-b-2 border-orange-500 bg-white sticky top-0 z-50">
      <div className="flex h-20 items-center justify-between px-6 md:px-12">
        {/* Left: Project Name */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-black flex items-center gap-1">
          GetResume<span className="text-orange-500">AI</span>
        </Link>

        {/* Right: Navigation / Auth */}
        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-black border-r border-black/10 pr-4 mr-4">
                Hello, {user?.name?.split(' ')[0] || 'User'}
              </span>
              <Link 
                to="/dashboard" 
                className="text-sm font-bold text-stone-600 hover:text-black transition-colors px-4"
              >
                Dashboard
              </Link>
              <Button 
                variant="secondary" 
                className="px-6 py-2.5 text-sm border-black/10 hover:bg-black hover:text-white transition-all"
                onClick={() => { logout(); navigate('/'); }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => openAuth('LOGIN')}
                className="text-sm font-bold text-stone-600 hover:text-black transition-colors px-4 py-2"
              >
                Login
              </button>
              <Button 
                variant="secondary" 
                className="px-6 py-2.5 text-sm border-black/10"
                onClick={() => openAuth('SIGNUP')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <Modal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        title={getModalTitle()}
      >
        <div className="min-h-[400px] flex flex-col justify-center">
          {authStep === 'LOGIN' && (
            <LoginForm 
              onSignupClick={() => setAuthStep('SIGNUP')} 
              onForgotPassword={() => setAuthStep('FORGOT_PASSWORD')} 
              onLoginSuccess={handleLoginSuccess} 
            />
          )}
          {authStep === 'FORGOT_PASSWORD' && (
            <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
          )}
          {authStep === 'SIGNUP' && (
            <SignupForm 
              onSignupSuccess={handleSignupSuccess} 
              onLoginClick={() => setAuthStep('LOGIN')} 
            />
          )}
          {authStep === 'OTP' && (
            <OTPVerification email={pendingEmail} onBack={handleBackToSignup} />
          )}
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
