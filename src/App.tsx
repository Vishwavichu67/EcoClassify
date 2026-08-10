import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ImageClassifier } from './components/ImageClassifier';
import { UserDashboard } from './components/UserDashboard';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { RetrainPipeline } from './components/RetrainPipeline';
import { GlobalDatasets } from './components/GlobalDatasets';
import { RegionalRules } from './components/RegionalRules';
import { PlatformGuide } from './components/PlatformGuide';
import { AuthModal } from './components/AuthModal';
import { auth, initAuth, signOutUser, getUserRoleFromFirestore } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [currentRegion, setCurrentRegion] = useState<string>('North America');
  const [feedbackCount, setFeedbackCount] = useState<number>(4);

  // Auth State
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Listen for Firebase Auth changes and automatically determine role
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user && !user.isAnonymous) {
        const role = await getUserRoleFromFirestore(user);
        setUserRole(role);
      } else {
        setUserRole('user');
      }
    });
    // Ensure initial auth init
    initAuth();
    return () => unsubscribe();
  }, []);

  const refreshFeedbackCount = async () => {
    try {
      const res = await fetch('/api/feedback/list');
      const data = await res.json();
      if (data.success && typeof data.total === 'number') {
        setFeedbackCount(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch feedback count:', err);
    }
  };

  useEffect(() => {
    refreshFeedbackCount();
  }, []);

  const handleAuthSuccess = (user: FirebaseUser, role: 'user' | 'admin') => {
    setAuthUser(user);
    setUserRole(role);
    if (role === 'admin') {
      setActiveTab('datasets');
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUserRole('user');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        feedbackCount={feedbackCount}
        currentRegion={currentRegion}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onGoToClassifier={() => setActiveTab('classifier')}
            onGoToAuth={() => setIsAuthModalOpen(true)}
            onGoToRegional={() => setActiveTab('regional')}
            onGoToAdmin={() => {
              if (userRole === 'admin') {
                setActiveTab('datasets');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            userRole={userRole}
            authUser={authUser}
          />
        )}

        {activeTab === 'classifier' && (
          <ImageClassifier
            currentRegion={currentRegion}
            onFeedbackSubmitted={refreshFeedbackCount}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'userDashboard' && (
          <UserDashboard
            onGoToClassifier={() => setActiveTab('classifier')}
            onGoToRegional={() => setActiveTab('regional')}
            currentRegion={currentRegion}
            authUser={authUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'feedback' && <FeedbackDashboard />}

        {activeTab === 'datasets' && <GlobalDatasets />}

        {activeTab === 'retrain' && <RetrainPipeline />}

        {activeTab === 'regional' && (
          <RegionalRules currentRegion={currentRegion} setCurrentRegion={setCurrentRegion} />
        )}

        {activeTab === 'report' && (
          <PlatformGuide
            onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 px-4 sm:px-6 lg:px-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-white">EcoClassify Engine v2.0</span>
            <span>— Waste Segregation & Recycling AI Classifier</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="capitalize font-semibold text-slate-300">
              Role: {userRole === 'admin' ? 'ML Admin' : 'Standard User'}
            </span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('report')}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Platform Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

