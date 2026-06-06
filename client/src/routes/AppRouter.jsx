import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import BuilderPage from '../pages/Builder/BuilderPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import TemplatesPage from '../pages/Templates/TemplatesPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import TestPage from '../pages/Test/TestPage';
import JobsPage from '../pages/Jobs/JobsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/test/:resumeId" 
        element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRouter;
