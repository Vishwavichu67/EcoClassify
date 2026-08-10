import React, { useState } from 'react';
import {
  RotateCw,
  MessageSquare,
  BookOpen,
  Globe,
  Cpu,
  Database,
  Award,
  LogIn,
  LogOut,
  Home,
  Menu,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';

export type TabType =
  | 'home'
  | 'classifier'
  | 'userDashboard'
  | 'regional'
  | 'datasets'
  | 'feedback'
  | 'retrain'
  | 'report';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole: 'user' | 'admin';
  feedbackCount: number;
  currentRegion: string;
  authUser: any;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  feedbackCount,
  currentRegion,
  authUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo / Title */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => handleTabClick('home')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">EcoClassify</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI Vision
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {userRole === 'user' ? 'Waste Classifier & Sustainability SOP' : 'Admin & Model Training Engine'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 shrink overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {userRole === 'user' ? (
              <>
                <button
                  onClick={() => handleTabClick('classifier')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'classifier'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Classifier</span>
                </button>

                <button
                  onClick={() => handleTabClick('userDashboard')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'userDashboard'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>My Eco-Tracker</span>
                </button>

                <button
                  onClick={() => handleTabClick('regional')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'regional'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="truncate max-w-[100px] lg:max-w-none">{currentRegion} Bins</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleTabClick('datasets')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'datasets'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Datasets</span>
                </button>

                <button
                  onClick={() => handleTabClick('feedback')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 relative ${
                    activeTab === 'feedback'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback</span>
                  {feedbackCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full">
                      {feedbackCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('retrain')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'retrain'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Retrain Pipeline</span>
                </button>
              </>
            )}

            {/* Platform Guide Tab */}
            <button
              onClick={() => handleTabClick('report')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'report'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Platform Guide</span>
            </button>
          </nav>

          {/* Right side: Auth status */}
          <div className="flex items-center space-x-2 shrink-0">
            {authUser && !authUser.isAnonymous ? (
              <div className="flex items-center space-x-2 bg-slate-800/90 pl-2.5 pr-1 py-1 rounded-xl border border-slate-700">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-bold text-white truncate max-w-[100px]">
                    {authUser.email || 'User'}
                  </div>
                  <div className="text-[9px] text-emerald-400 uppercase font-semibold">
                    {userRole === 'admin' ? 'ML Admin' : 'User'}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                activeTab === 'home' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {userRole === 'user' ? (
              <>
                <button
                  onClick={() => handleTabClick('classifier')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'classifier' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Classifier</span>
                </button>

                <button
                  onClick={() => handleTabClick('userDashboard')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'userDashboard' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Eco-Tracker</span>
                </button>

                <button
                  onClick={() => handleTabClick('regional')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'regional' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentRegion} Bins</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleTabClick('datasets')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'datasets' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Global Datasets</span>
                </button>

                <button
                  onClick={() => handleTabClick('feedback')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'feedback' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback Store</span>
                </button>

                <button
                  onClick={() => handleTabClick('retrain')}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    activeTab === 'retrain' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Retrain Pipeline</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleTabClick('report')}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 sm:col-span-2 ${
                activeTab === 'report' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Platform Operating Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

