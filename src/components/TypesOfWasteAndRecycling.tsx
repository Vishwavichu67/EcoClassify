import React, { useState } from 'react';
import {
  Recycle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Leaf,
  Layers,
  FileText,
  X,
  Droplets,
  Zap,
  Trash2,
  Box,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { WASTE_TYPES, WasteTypeInfo } from '../data/wasteTypes';

interface TypesOfWasteAndRecyclingProps {
  onSelectWasteType?: (wasteType: WasteTypeInfo) => void;
}

// Icon helper with animated symbols for each category card
const CategoryAnimatedIcon: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  switch (categoryId) {
    case 'plastic':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
          <Recycle className="w-6 h-6 text-blue-600 animate-spin-slow" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
        </div>
      );
    case 'paper_cardboard':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
          <FileText className="w-6 h-6 text-sky-600 animate-bounce-slow" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full animate-pulse" />
        </div>
      );
    case 'metal':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6 text-amber-600 animate-pulse" />
        </div>
      );
    case 'glass':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
          <Droplets className="w-6 h-6 text-emerald-600 animate-pulse-gentle" />
        </div>
      );
    case 'organic':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
          <Leaf className="w-6 h-6 text-green-600 animate-float" />
        </div>
      );
    case 'ewaste':
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
          <Zap className="w-6 h-6 text-purple-600 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" />
        </div>
      );
    default:
      return (
        <div className="relative w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
          <Trash2 className="w-6 h-6 text-slate-600" />
        </div>
      );
  }
};

export const TypesOfWasteAndRecycling: React.FC<TypesOfWasteAndRecyclingProps> = ({
  onSelectWasteType,
}) => {
  const [selectedModalType, setSelectedModalType] = useState<WasteTypeInfo | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-1">
            <Recycle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Waste Categories & Recycling Guide</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Types of Waste & Recycling Processes
          </h2>
          <p className="text-xs text-slate-500">
            Click any card to flip open its full recycling journey, bin rules, and environmental benefits.
          </p>
        </div>
      </div>

      {/* Grid of Waste Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WASTE_TYPES.map((wt) => (
          <div
            key={wt.id}
            onClick={() => setSelectedModalType(wt)}
            className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/80 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
          >
            {/* Top row: Animated Icon & Category Tag */}
            <div className="flex items-start justify-between gap-3">
              <CategoryAnimatedIcon categoryId={wt.id} />
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${wt.badgeColor}`}
              >
                {wt.category}
              </span>
            </div>

            {/* Title & Bin Type */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {wt.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs"
                  style={{ backgroundColor: wt.binColorHex }}
                />
                <span>Bin: <strong className="text-slate-800">{wt.binType}</strong></span>
              </p>
            </div>

            {/* Common Items Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {wt.commonItems.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-200/80"
                >
                  {item}
                </span>
              ))}
              {wt.commonItems.length > 3 && (
                <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                  +{wt.commonItems.length - 3} more
                </span>
              )}
            </div>

            {/* Action Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>View Recycling Steps</span>
              </span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Modal Window ("Flipped into new window") */}
      {selectedModalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-fadeIn relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedModalType(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
              <CategoryAnimatedIcon categoryId={selectedModalType.id} />
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: selectedModalType.binColorHex }}
                  />
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${selectedModalType.badgeColor}`}>
                    {selectedModalType.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedModalType.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Recommended Bin: <strong className="text-slate-800">{selectedModalType.binType}</strong>
                </p>
              </div>
            </div>

            {/* What belongs here */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                <Box className="w-4 h-4 text-emerald-600" />
                <span>Common Examples in This Category</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedModalType.commonItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-800 font-semibold px-3 py-1 rounded-lg border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Preparation Tips & Environmental Benefit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Preparation Tips</span>
                </span>
                <ul className="text-slate-700 space-y-1 list-disc list-inside">
                  {selectedModalType.preparationTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Environmental Benefit</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {selectedModalType.environmentalBenefit}
                </p>
              </div>
            </div>

            {/* 5-Step Recycling Process */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Simple 5-Step Recycling Process</span>
              </h4>

              <div className="space-y-3">
                {selectedModalType.recyclingProcess.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 flex items-start space-x-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-slate-900">{step.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedModalType(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Close
              </button>

              {onSelectWasteType && (
                <button
                  onClick={() => {
                    onSelectWasteType(selectedModalType);
                    setSelectedModalType(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-2 shadow-md shadow-emerald-900/20"
                >
                  <span>Classify a {selectedModalType.category} Sample</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

