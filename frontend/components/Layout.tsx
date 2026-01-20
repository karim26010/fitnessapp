import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardEdit, 
  UserCircle, 
  LogOut, 
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userAvatar: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate, 
  onLogout,
  userAvatar
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Page.SURVEY, label: 'Health Survey', icon: ClipboardEdit },
    { id: Page.PROFILE, label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans relative text-slate-200">
      {/* Ambient background blobs for magic feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-card border-y-0 border-l-0 rounded-none z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <Activity className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
            FitPulse
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group
                ${currentPage === item.id 
                  ? 'text-white bg-primary-500/20 border border-primary-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {currentPage === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-full"></div>
              )}
              <item.icon size={20} className={currentPage === item.id ? 'text-primary-400' : 'group-hover:text-primary-400 transition-colors'} />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/10">
          <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5 mb-3 backdrop-blur-sm group cursor-pointer hover:bg-white/10 transition-colors">
            <img src={userAvatar} alt="User" className="h-10 w-10 rounded-full object-cover border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white group-hover:text-primary-200 transition-colors">Karim26010</p>
              <p className="text-xs text-slate-400">Pro Member</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 text-slate-400 hover:text-red-400 transition-colors text-sm hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 glass-card rounded-none border-x-0 border-t-0 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.4)]">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-white">FitPulse</span>
        </div>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xl pt-24 px-6 md:hidden animate-fade-in">
          <nav className="space-y-4">
             {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-4 p-4 rounded-xl text-lg font-medium border transition-all
                  ${currentPage === item.id 
                    ? 'bg-primary-500/20 text-white border-primary-500/30 shadow-lg' 
                    : 'text-slate-400 bg-white/5 border-white/5'}
                `}
              >
                <item.icon size={24} className={currentPage === item.id ? 'text-primary-400' : ''} />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-white/10 my-6"></div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-4 p-4 rounded-xl text-lg font-medium text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={24} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-24 md:pt-0 relative z-10 scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};