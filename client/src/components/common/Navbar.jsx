import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import Modal from './Modal';
import SignupForm from '../auth/SignupForm';
import LoginForm from '../auth/LoginForm';
import OTPVerification from '../auth/OTPVerification';
import ForgotPasswordForm from '../auth/ForgotPasswordForm';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Info } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('LOGIN'); // 'LOGIN', 'SIGNUP', 'OTP', or 'FORGOT_PASSWORD'
  const [pendingEmail, setPendingEmail] = useState('');
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markNotifRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <div className="flex items-center gap-4 relative">
              <span className="text-sm font-bold text-black border-r border-black/10 pr-4 mr-2 hidden sm:inline">
                Hello, {user?.name?.split(' ')[0] || 'User'}
              </span>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-black transition-all relative cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white border border-stone-200 shadow-2xl rounded-2xl py-3 z-50 text-left">
                    <div className="px-4 pb-2 border-b border-stone-100 flex justify-between items-center">
                      <span className="text-xs font-black text-black uppercase tracking-wider">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[10px] text-orange-500 font-extrabold hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-stone-50 mt-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-stone-400 font-semibold text-xs space-y-1">
                          <Info size={20} className="mx-auto text-stone-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markNotifRead(notif._id)}
                            className={`px-4 py-3 flex gap-3 transition-colors ${
                              notif.isRead ? 'hover:bg-stone-50/50' : 'bg-orange-50/20 hover:bg-orange-50/30 cursor-pointer'
                            }`}
                          >
                            <div className="flex-1 space-y-0.5">
                              <p className={`text-xs font-black text-stone-900 ${notif.isRead ? '' : 'font-extrabold'}`}>
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-stone-500 font-semibold leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-[9px] text-stone-400 font-medium">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/dashboard" 
                className="text-sm font-bold text-stone-600 hover:text-black transition-colors px-2"
              >
                Dashboard
              </Link>
              <Button 
                variant="secondary" 
                className="px-6 py-2.5 text-sm border-black/10 hover:bg-black hover:text-white transition-all shrink-0"
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
