import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRouter from './routes/AppRouter';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-white">
      {/* Decorative background glow */}
      {!isDashboard && <div className="glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 fixed" />}
      
      {/* Only show Navbar on non-dashboard routes */}
      {!isDashboard && <Navbar />}
      
      <main className="relative z-10">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
