import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Filter,
  RefreshCw,
  Database,
  Search,
} from 'lucide-react';
import { FeedbackEntry, FeedbackStats } from '../types';
import { fetchAllFeedbackFromFirestore, updateFeedbackStatusInFirestore } from '../lib/firebase';

export const FeedbackDashboard: React.FC = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchFeedbackStats = async () => {
    setIsLoading(true);
    try {
      // First try fetching live feedback from Firestore
      const firestoreEntries = await fetchAllFeedbackFromFirestore();
      
      if (firestoreEntries && firestoreEntries.length > 0) {
        const mappedEntries: FeedbackEntry[] = firestoreEntries.map((item) => ({
          id: item.id,
          timestamp: item.createdAt || new Date().toISOString(),
          predictedCategory: item.originalCategory || 'Unknown',
          actualCategory: item.correctedCategory || 'Unknown',
          isCorrect: item.isCorrect ?? (item.originalCategory === item.correctedCategory),
          userNotes: item.comments || '',
          region: item.region || 'North America',
          itemDescription: item.itemName || 'Waste Image Scan',
          modelConfidence: item.confidence || 0.9,
          imagePreview: item.imageBase64,
        }));

        const total = mappedEntries.length;
        const correctCount = mappedEntries.filter((e) => e.isCorrect).length;
        const incorrectCount = total - correctCount;
        const accuracyRate = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        setStats({
          total,
          correctCount,
          incorrectCount,
          accuracyRate,
          entries: mappedEntries,
        });
      } else {
        // Fallback to server API endpoint
        const res = await fetch('/api/feedback/list');
        const data = await res.json();
        if (data.success) {
          setStats(data);
        }
      }
    } catch (err) {
      console.error('Failed to load feedback dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const filteredEntries = (stats?.entries || []).filter((entry) => {
    if (filterType === 'correct' && !entry.isCorrect) return false;
    if (filterType === 'incorrect' && entry.isCorrect) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDesc = entry.itemDescription?.toLowerCase().includes(q);
      const matchPred = entry.predictedCategory?.toLowerCase().includes(q);
      const matchActual = entry.actualCategory?.toLowerCase().includes(q);
      const matchNotes = entry.userNotes?.toLowerCase().includes(q);
      return matchDesc || matchPred || matchActual || matchNotes;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Dataset & Active Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            User Feedback & Retraining Dataset
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time tracking of community verified waste predictions and flagged misclassifications feeding the fine-tuning pipeline.
          </p>
        </div>

        <button
          onClick={fetchFeedbackStats}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Logged Feedback</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.total || 0}</div>
          <p className="text-[11px] text-slate-500">Collected from user usage</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Verified Correct</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats?.correctCount || 0}</div>
          <p className="text-[11px] text-slate-500">Predictions confirmed right</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Flagged Corrections</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{stats?.incorrectCount || 0}</div>
          <p className="text-[11px] text-slate-500">Used for model fine-tuning</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Current Precision Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.accuracyRate || 0}%</div>
          <p className="text-[11px] text-slate-500">Validation accuracy</p>
        </div>
      </div>

      {/* Main Table & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Filter Feedback Store</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search items, notes, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-full sm:w-64 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('correct')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterType === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Correct
              </button>
              <button
                onClick={() => setFilterType('incorrect')}
                className={`px-3 py-1 rounded-md transition-all ${
                  filterType === 'incorrect' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Flagged
              </button>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Predicted</th>
                <th className="py-3 px-4">Actual / Corrected</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">User Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{entry.itemDescription}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                        {entry.predictedCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          entry.isCorrect
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {entry.actualCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {entry.isCorrect ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-600 font-semibold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Flagged</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                      {entry.userNotes || '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No feedback entries matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
