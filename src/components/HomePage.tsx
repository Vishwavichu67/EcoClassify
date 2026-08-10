import React from 'react';
import {
  RotateCw,
  Award,
  Globe,
  Database,
  Cpu,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
} from 'lucide-react';

interface HomePageProps {
  onGoToClassifier: () => void;
  onGoToAuth: () => void;
  onGoToRegional: () => void;
  onGoToAdmin: () => void;
  userRole: 'user' | 'admin';
  authUser: any;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToClassifier,
  onGoToAuth,
  onGoToRegional,
  onGoToAdmin,
  userRole,
  authUser,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-6 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl mx-4 sm:mx-6 lg:mx-8">
        {/* Background Radial Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold border border-emerald-500/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI-Powered Municipal & Household Waste Segregation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Classify Waste Instantly with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Gemini Vision & PyTorch AI
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            EcoClassify uses real-time computer vision to identify plastics, paper, metals, compost, and hazardous items, aligning classifications with your local municipal bin standards.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onGoToClassifier}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-7 py-3.5 rounded-2xl text-sm flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-emerald-500/25"
            >
              <RotateCw className="w-5 h-5" />
              <span>Launch AI Waste Classifier</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!authUser || authUser.isAnonymous ? (
              <button
                onClick={onGoToAuth}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center space-x-2 transition-all border border-slate-700"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>User Login / Registration</span>
              </button>
            ) : (
              <button
                onClick={onGoToAdmin}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center space-x-2 transition-all border border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Open ML Operations Portal</span>
              </button>
            )}
          </div>

          {/* Live Quick Metrics Banner */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left border-t border-slate-800/80">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] sm:text-xs text-slate-400">Computer Vision Accuracy</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">96.8%</div>
              <p className="text-[10px] text-slate-500">Multimodal Gemini 2.5 Flash</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] sm:text-xs text-slate-400">Supported Waste Classes</span>
              <div className="text-xl sm:text-2xl font-black text-white">6 Categories</div>
              <p className="text-[10px] text-slate-500">PET, Paper, Glass, Metal, Organic, Trash</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] sm:text-xs text-slate-400">Regional Standards</span>
              <div className="text-xl sm:text-2xl font-black text-white">4 Continents</div>
              <p className="text-[10px] text-slate-500">NA, Europe, Asia, Australia</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="text-[11px] sm:text-xs text-slate-400">Database Sync</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">Cloud Firestore</div>
              <p className="text-[10px] text-slate-500">Real-time user feedback loop</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features & Components Architecture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span>Core Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Platform Capabilities & Components
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            An end-to-end ecosystem bridging citizen recycling actions with an automated model retraining pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1: AI Vision Classifier */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <RotateCw className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">1. Real-Time Vision Classifier</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Upload or capture any waste item photo. Instant item identification, confidence scoring, material composition breakdown, and bin destination rules.
              </p>
            </div>
            <button
              onClick={onGoToClassifier}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Test Classifier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2: User Eco-Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">2. Personal Eco-Tracker</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Registered users track scan histories, monitor estimated CO₂ diversion metrics, earn community badges, and inspect active model corrections.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 block">Requires User Account</span>
          </div>

          {/* Feature 3: Regional Bin Standards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-cyan-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">3. Regional Bin Standards</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dynamically adapt bin color codes and municipal regulations (North America, European Union, Asia-Pacific, UK/Australia) with customized instructions.
              </p>
            </div>
            <button
              onClick={onGoToRegional}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Explore Bin Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4: Feedback Annotations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">4. Firestore Feedback Store</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every user classification feedback is logged into Firebase Firestore. Admins inspect, approve, or reject difficult boundary cases.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              Admin Moderated
            </span>
          </div>

          {/* Feature 5: Datasets Ingestion */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">5. Custom Datasets Store</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Upload custom waste image packages directly to Firestore (CSV/ZIP annotations) to merge with global benchmarks like TACO and TrashNet.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
              Admin Upload Portal
            </span>
          </div>

          {/* Feature 6: PyTorch Retrain Engine */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-400 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">6. Fine-Tuning Retrain Pipeline</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Consolidates all stored Firestore user scans, feedback corrections, and custom dataset packages to fine-tune model weights on Hugging Face GPU nodes.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block">
              MLOps Automation
            </span>
          </div>
        </div>
      </section>

      {/* Admin Security & Auth Info Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Security & Access Control Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">User Self-Registration vs Admin Protection</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Public user registration creates standard user credentials in Firebase Auth. ML Admin access is protected and granted through preset admin credentials in Firebase or manual role elevation in Cloud Firestore.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>User Sign In / Sign Up</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

