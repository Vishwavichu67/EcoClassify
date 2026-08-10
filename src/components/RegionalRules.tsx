import React from 'react';
import { Globe, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface RegionalRulesProps {
  currentRegion: string;
  setCurrentRegion: (region: string) => void;
}

export const REGIONAL_OPTIONS = [
  {
    id: 'North America',
    title: 'North America (US & Canada)',
    subtitle: 'Single-Stream & Curbside Sorting Standards',
    description: 'Blue Bin for mixed dry recyclables (plastics #1, #2, #5, metal cans, cardboard). Green Bin for organics/compost. Black/Gray for landfill trash.',
    colorScheme: [
      { name: 'Blue Bin', hex: '#2563eb', desc: 'Plastics #1, #2, #5, Cardboard, Cans, Glass Jars' },
      { name: 'Green Bin', hex: '#16a34a', desc: 'Food Scraps, Yard Waste, Soiled Napkins' },
      { name: 'Black Bin', hex: '#334155', desc: 'Landfill Waste, Styrofoam, Plastic Wraps' },
    ],
  },
  {
    id: 'EU / UK',
    title: 'European Union & United Kingdom',
    subtitle: 'Strict Multi-Bin Segregation Standards',
    description: 'Yellow/Blue for lightweight packaging & plastics, Green/Amber glass banks, Brown organics, Gray residual trash. Deposit Return Scheme (DRS) bottle returns active.',
    colorScheme: [
      { name: 'Yellow Bin / Sack', hex: '#d97706', desc: 'Lightweight Plastics & Metal Packaging' },
      { name: 'Blue Bin', hex: '#0284c7', desc: 'Dry Paper, Cartons, Unstained Cardboard' },
      { name: 'Green / Brown Bin', hex: '#15803d', desc: 'Glass Bottles (sorted by color in some areas)' },
      { name: 'Brown Organic Bin', hex: '#854d0e', desc: 'Biodegradable Kitchen & Garden Scraps' },
    ],
  },
  {
    id: 'Asia Pacific',
    title: 'Asia Pacific (Japan, Singapore, India)',
    subtitle: 'High-Density Segregation & E-Waste Directives',
    description: 'Wet Waste (organics/kitchen) vs Dry Waste (recyclables), specialized E-Waste & hazardous collection days, PET bottle cap and label separation mandated.',
    colorScheme: [
      { name: 'Dry Recyclables Bin', hex: '#2563eb', desc: 'Rinsed PET Bottles, Metals, Clean Paper' },
      { name: 'Wet Waste Bin', hex: '#15803d', desc: 'Food Waste, Organic Composting' },
      { name: 'E-Waste Point', hex: '#dc2626', desc: 'Batteries, PCB boards, Old Appliances' },
    ],
  },
];

export const RegionalRules: React.FC<RegionalRulesProps> = ({
  currentRegion,
  setCurrentRegion,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <Globe className="w-3.5 h-3.5" />
          <span>Regional Customization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Regional Recycling Rules & Bin Customization
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Recycling protocols vary significantly across municipalities. EcoClassify adapts its bin colors, preparation checklists, and disposal warnings based on your selected geographic region.
        </p>
      </div>

      {/* Region Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REGIONAL_OPTIONS.map((option) => {
          const isSelected = currentRegion === option.id;
          return (
            <div
              key={option.id}
              onClick={() => setCurrentRegion(option.id)}
              className={`rounded-2xl p-6 border-2 cursor-pointer transition-all space-y-4 bg-white ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {option.id}
                </span>
                {isSelected && (
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{option.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{option.subtitle}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{option.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Bin Standard Scheme:
                </span>
                <div className="space-y-1.5">
                  {option.colorScheme.map((bin, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: bin.hex }}
                      ></span>
                      <span className="font-semibold text-slate-900">{bin.name}:</span>
                      <span className="text-[11px] text-slate-500 truncate">{bin.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
