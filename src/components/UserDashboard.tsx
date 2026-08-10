import React, { useState, useEffect } from 'react';
import {
  Upload,
  MessageSquare,
  Leaf,
  Award,
  Clock,
  CheckCircle2,
  RotateCw,
  Zap,
  ChevronRight,
  ShieldCheck,
  Recycle,
  Sparkles,
  Layers,
  X,
  TrendingUp,
} from 'lucide-react';
import {
  fetchUserScansFromFirestore,
  fetchUserFeedbackFromFirestore,
} from '../lib/firebase';
import { calculateEcoRank, ECO_RANKS, EcoRankProgress } from '../lib/ecoRanks';

interface UserDashboardProps {
  onGoToClassifier: () => void;
  onGoToRegional: () => void;
  currentRegion: string;
  authUser: any;
  onOpenAuthModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onGoToClassifier,
  onGoToRegional,
  currentRegion,
  authUser,
  onOpenAuthModal,
}) => {
  const [userScans, setUserScans] = useState<any[]>([]);
  const [userFeedback, setUserFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRankListModal, setShowRankListModal] = useState<boolean>(false);

  // Load real Firestore data for current user
  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      if (!authUser || authUser.isAnonymous) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const scans = await fetchUserScansFromFirestore(authUser.uid);
        const feedback = await fetchUserFeedbackFromFirestore(authUser.uid);
        if (isMounted) {
          setUserScans(scans);
          setUserFeedback(feedback);
        }
      } catch (err) {
        console.error('Error loading user dashboard data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [authUser]);

  // If user is not logged in, render authentication gate
  if (!authUser || authUser.isAnonymous) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Leaf className="w-10 h-10 animate-bounce-slow" />
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Sign In to Access Your Personal Eco Tracker
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            My Eco Tracker tracks your personal waste classifications, RLHF feedback annotations, and Eco Rank progression from Level 1 up to Level 20.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all"
          >
            Sign In / Register Account
          </button>
          <button
            onClick={onGoToClassifier}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all"
          >
            Try ML Classifier First
          </button>
        </div>
      </div>
    );
  }

  const totalScans = userScans.length;
  const feedbackCount = userFeedback.length;
  // Point system: 10 pts per upload scan, 15 pts per RLHF feedback submission
  const totalEcoPoints = totalScans * 10 + feedbackCount * 15;
  const rankProgress: EcoRankProgress = calculateEcoRank(totalEcoPoints);
  const carbonSavedKg = (totalScans * 0.42).toFixed(1);
  const divertedItems = Math.round(totalScans * 0.85);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Real-time Firestore Eco Tracker & ML Contributor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Recycling Timeline & Model Contributions
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Logged in as <span className="text-emerald-400 font-semibold">{authUser.email}</span>. Track your uploaded waste images, review your RLHF feedback reward annotations, and progress through 20 Eco Rank levels.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0 relative z-10 w-full sm:w-auto">
          <button
            onClick={onGoToClassifier}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <RotateCw className="w-4 h-4" />
            <span>Classify Waste Image</span>
          </button>

          <button
            onClick={onGoToRegional}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all border border-slate-700"
          >
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span>Region: {currentRegion}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Uploaded Images</span>
            <Upload className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {isLoading ? '...' : totalScans}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500">Saved in Firestore (+10 pts each)</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>RLHF Feedbacks</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {isLoading ? '...' : feedbackCount}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500">Fine-tuning ML model (+15 pts each)</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Eco Points</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {isLoading ? '...' : totalEcoPoints} pts
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500">Accumulated score</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Est. CO₂ Offset</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {isLoading ? '...' : `${carbonSavedKg} kg`}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500">Landfill diversion estimate</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Recent Scans History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                My Firestore Upload History
              </h2>
              <p className="text-xs text-slate-500">
                Your scanned waste images, computer vision predicted categories, and RLHF feedback
              </p>
            </div>
            <button
              onClick={onGoToClassifier}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Scan New Item</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Fetching your real data from Firestore...</span>
              </div>
            ) : userScans.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto font-bold shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Fresh Account: Start at Zero Level</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    You currently have <span className="font-semibold text-slate-700">0 uploads</span>. As a new user, you start at <span className="font-semibold text-emerald-700">Level 1: Eco Novice</span>! Upload your first waste image to earn +10 Eco Points and begin leveling up towards Level 20.
                  </p>
                </div>
                <button
                  onClick={onGoToClassifier}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Upload & Classify Your First Item</span>
                </button>
              </div>
            ) : (
              userScans.map((scan: any, i: number) => (
                <div
                  key={scan.id || i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200/80">
                      <Recycle className="w-5.5 h-5.5 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{scan.itemName || 'Scanned Waste Item'}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {scan.predictedCategory}
                        </span>
                        <span>•</span>
                        <span>{scan.confidence ? `${(scan.confidence * 100).toFixed(0)}% Conf.` : 'Neural Conf.'}</span>
                        <span>•</span>
                        <span>{scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : 'Just now'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    {scan.feedbackSubmitted ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RLHF Provided</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Feedback</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Eco Rank Status (Level 1 to 20) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Eco Rank Status</span>
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${rankProgress.badgeBg} ${rankProgress.badgeText}`}>
                Level {rankProgress.level} / 20
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Current Eco Rank</div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Level {rankProgress.level}: {rankProgress.title}
              </h3>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                {rankProgress.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>
                  Next: <strong className="text-emerald-400">{rankProgress.nextLevelTitle}</strong>
                </span>
                <span className="font-semibold text-slate-400">
                  {rankProgress.currentPoints} / {rankProgress.pointsForNextLevel} pts
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${rankProgress.progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                <span>{rankProgress.progressPercent}% Completed</span>
                <span>+{10} pts per Scan | +{15} pts per RLHF</span>
              </div>
            </div>

            <button
              onClick={() => setShowRankListModal(true)}
              className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View All 20 Level Ranks</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Reinforcement Learning (RLHF) Loop</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <p>
                  <strong>Image Uploads:</strong> Every waste photo uploaded extracts optical features (RGB channels, edge density, aspect ratio) into the computer vision classifier.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <p>
                  <strong>Human Feedback (RLHF):</strong> Confirmations generate policy reward signals; category corrections apply cross-entropy loss penalties to refine neural confidence thresholds.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <p>
                  <strong>Model Retraining Queue:</strong> Verified annotations flow into the active learning queue for continuous automated model retraining cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View All 20 Levels */}
      {showRankListModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Eco Rank Progression Hierarchy (Levels 1 - 20)</h3>
              </div>
              <button
                onClick={() => setShowRankListModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-100 flex-1 text-xs">
              {ECO_RANKS.map((r) => {
                const isCurrent = r.level === rankProgress.level;
                const isUnlocked = totalEcoPoints >= r.minPoints;
                return (
                  <div
                    key={r.level}
                    className={`pt-3 first:pt-0 flex items-start justify-between gap-3 ${
                      isCurrent ? 'bg-emerald-50/70 p-3 rounded-xl border border-emerald-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shrink-0 ${
                          isUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {r.level}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            Level {r.level}: {r.title}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                              Current Level
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">{r.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-800 text-xs">{r.minPoints} pts</div>
                      <span
                        className={`text-[10px] font-semibold ${
                          isUnlocked ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0">
              <button
                onClick={() => setShowRankListModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
              >
                Close Progression Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
