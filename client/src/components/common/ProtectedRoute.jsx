import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid border-stone-100"></div>
          <p className="text-sm font-bold text-stone-400 animate-pulse uppercase tracking-widest">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to home page but save the location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
