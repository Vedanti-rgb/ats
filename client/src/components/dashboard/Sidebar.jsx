import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Layout, 
  Search, 
  User,
  LogOut, 
  Layout as LayoutDashboard,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = user?.isAdmin
    ? [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Job Openings', icon: Briefcase, path: '/jobs' },
        { name: 'Profile', icon: User, path: '/profile' },
      ]
    : [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Create Resume', icon: PlusCircle, path: '/builder' },
        { name: 'Templates', icon: Layout, path: '/templates' },
        { name: 'Job Openings', icon: Briefcase, path: '/jobs' },
        { name: 'ATS Score', icon: Search, path: '/ats-check' },
        { name: 'Profile', icon: User, path: '/profile' },
      ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-[60] h-screen bg-white border-r border-black/[0.05] flex flex-col transition-all duration-300 ease-in-out ${
        isHovered ? 'w-72 shadow-2xl shadow-black/10' : 'w-20'
      }`}
    >
      {/* App Logo / Brand */}
      <div className={`h-20 flex items-center transition-all duration-300 ${isHovered ? 'px-6' : 'px-5'} overflow-hidden`}>
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
             <span className="text-white font-black text-lg">G</span>
          </div>
          <span className={`text-xl font-black tracking-tighter text-black transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            GetResume<span className="text-orange-500">AI</span>
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className={`py-4 flex items-center gap-3 transition-all duration-300 ${isHovered ? 'px-6' : 'px-5'}`}>
        <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold border border-black/5 shrink-0">
          {user?.name?.charAt(0) || <User size={18} />}
        </div>
        <div className={`flex flex-col min-w-0 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none w-0 overflow-hidden'
        }`}>
           <span className="text-sm font-black text-black whitespace-nowrap">{user?.name?.split(' ')[0] || 'Guest User'}</span>
           <span className="text-[10px] uppercase tracking-widest font-bold text-orange-500">Premium Plan</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-hidden">
        <div className={`px-4 mb-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] transition-opacity duration-300 ${
           isHovered ? 'opacity-100' : 'opacity-0'
        }`}>Main Menu</div>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-xl p-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-stone-400 hover:bg-stone-50 hover:text-black'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-8">
                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-black'} />
              </div>
              <span className={`ml-4 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}>
                {item.name}
              </span>
              {isActive && isHovered && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}

      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-black/[0.02]">
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center rounded-xl p-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all overflow-hidden cursor-pointer active:scale-[0.98]"
        >
          <div className="shrink-0 flex items-center justify-center w-8">
            <LogOut size={20} />
          </div>
          <span className={`ml-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}>
            Sign Out
          </span>
        </button>
      </div>

      {/* Expand Indicator (Desktop only) */}
      {!isHovered && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 w-8 bg-white border border-black/5 rounded-full flex items-center justify-center text-stone-300 shadow-xl pointer-events-none group-hover:text-orange-500">
           <ChevronRight size={16} />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
