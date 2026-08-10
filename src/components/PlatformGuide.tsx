import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Recycle,
  HelpCircle,
  Copy,
  Check,
  Printer,
  X,
  FileText,
  Layers,
  Globe,
  Award,
  Cpu,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface PlatformGuideProps {
  isDrawerMode?: boolean;
  onCloseDrawer?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const GUIDE_TOPICS = [
  {
    id: 'quickstart',
    category: 'Getting Started',
    title: '1. Quick Start & Scan Workflow',
    badge: 'Core Workflow',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    summary: 'How to classify household waste items and route them to correct recycling bins.',
    steps: [
      {
        step: 'Step 1: Choose or Upload Waste Item',
        detail: 'In the Classifier view, upload an image from your device or select from our built-in Waste Types & Recycling Process list.',
      },
      {
        step: 'Step 2: AI Vision & Confidence Analysis',
        detail: 'The Gemini 2.5 & ResNet-50 AI model analyzes material composition, estimates confidence %, and assigns the item to a waste category.',
      },
      {
        step: 'Step 3: Check Regional Bin Designation',
        detail: 'Review the bin color tag tailored to your selected municipality (e.g., Blue Bin in North America vs. Yellow Bin in Europe).',
      },
      {
        step: 'Step 4: Verify or Submit Correction',
        detail: 'Provide thumbs-up or submit an accurate category tag to help fine-tune the model and earn Eco-Points.',
      },
    ],
  },
  {
    id: 'categories',
    category: 'Waste SOP',
    title: '2. Recycling Categories & Preparation Standards',
    badge: 'SOP Manual',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    summary: 'Detailed preparation procedures for each waste type to prevent contamination.',
    guidelines: [
      {
        type: 'Plastics (#1 PET, #2 HDPE, #5 PP)',
        icon: '♻️',
        dos: ['Rinse out leftover liquids and food grease', 'Keep caps screwed on tight'],
        donts: ['Do NOT place soft plastic bags or film in curbside bins (they jam sorting gears)'],
      },
      {
        type: 'Paper & Cardboard',
        icon: '📦',
        dos: ['Flatten shipping boxes to maximize bin space', 'Keep paper completely dry'],
        donts: ['Do NOT recycle grease-soaked cardboard (e.g. oily pizza boxes go to trash or compost)'],
      },
      {
        type: 'Aluminium & Steel Cans',
        icon: '🥫',
        dos: ['Rinse out contents', 'Push sharp lids inside the metal body'],
        donts: ['Do NOT include paint cans or pressurized aerosol containers in general metal bins'],
      },
      {
        type: 'Glass Bottles & Jars',
        icon: '🍾',
        dos: ['Separate caps/corks', 'Rinse food residue'],
        donts: ['Do NOT mix window panes, mirror glass, or drinking glasses with container glass'],
      },
      {
        type: 'Organic & Food Waste',
        icon: '🍎',
        dos: ['Compost fruit peels, coffee grounds, eggshells', 'Use certified compostable paper liners'],
        donts: ['Do NOT throw plastic fruit stickers or non-compostable packaging in green bins'],
      },
      {
        type: 'E-Waste & Batteries',
        icon: '🔋',
        dos: ['Tape battery terminals with clear tape', 'Take to designated E-Waste collection points'],
        donts: ['NEVER throw lithium batteries in regular trash or standard curbside bins!'],
      },
    ],
  },
  {
    id: 'ai_confidence',
    category: 'AI Engine',
    title: '3. AI Vision Model & Confidence Thresholds',
    badge: 'AI Guidance',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    summary: 'Understanding AI predictions, confidence percentages, and boundary cases.',
    points: [
      'High Confidence (>85%): Direct automated bin match with high certainty.',
      'Medium Confidence (60-85%): Model presents primary category with suggested secondary check.',
      'Low Confidence (<60%): Triggers safety fallback rules for hazardous or ambiguous multi-material items.',
      'Continuous Learning: User feedback annotations update Firestore, feeding the MLOps retraining pipeline.',
    ],
  },
  {
    id: 'regional',
    category: 'Regional Rules',
    title: '4. Global Municipal Bin Standards Matrix',
    badge: 'Regional Standards',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    summary: 'Bin color coding reference across key global municipalities.',
    regions: [
      { name: 'North America (US / Canada)', recyclables: 'Blue', organic: 'Green / Brown', trash: 'Black / Dark Gray' },
      { name: 'European Union (Germany / France)', recyclables: 'Yellow (Gelber Sack)', paper: 'Blue', trash: 'Black / Gray' },
      { name: 'Asia-Pacific (Japan / Korea)', recyclables: 'Clear / White', burnable: 'Red / Pink', nonBurnable: 'Blue' },
      { name: 'UK & Australia', recyclables: 'Yellow / Blue Lid', organic: 'FOGO Lime Green', general: 'Red Lid' },
    ],
  },
  {
    id: 'ecotracker',
    category: 'Impact Metrics',
    title: '5. Personal Eco-Tracker & Impact Formulas',
    badge: 'User Metrics',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    summary: 'How eco-rank status and environmental formulas are calculated.',
    points: [
      'CO₂ Offset Formula: Estimated at ~0.42 kg CO₂ saved per properly classified and diverted waste item.',
      'Items Diverted Rate: ~85% of correctly identified recyclables/compostables avoid landfill disposal.',
      'Eco-Rank Levels: Earn ranks from "Level 1: Eco Novice" up to "Level 5: Master Annotator" by submitting verified feedback.',
    ],
  },
];

export const PlatformGuide: React.FC<PlatformGuideProps> = ({
  isDrawerMode = false,
  onCloseDrawer,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicId, setActiveTopicId] = useState<string>('quickstart');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredTopics = GUIDE_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyGuide = () => {
    let guideText = `ECOCLASSIFY PLATFORM OPERATING GUIDE & SIDE MANUAL\n\n`;
    GUIDE_TOPICS.forEach((t) => {
      guideText += `${t.title}\nCategory: ${t.category}\n${t.summary}\n\n`;
    });
    navigator.clipboard.writeText(guideText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`space-y-6 ${
        isDrawerMode
          ? 'h-full flex flex-col bg-slate-900 text-slate-100 p-5 overflow-y-auto'
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
      }`}
    >
      {/* Drawer Header or Full Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Platform Operating Guide & User Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform Operating Guide & SOP Manual
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Everything you need to know about AI classification, waste recycling procedures, regional bin rules, and eco-impact metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <button
            onClick={handleCopyGuide}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Guide Text'}</span>
          </button>

          {isDrawerMode && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
              aria-label="Close guide drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search guide topics (e.g., plastics, pizza box, bin colors)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="shrink-0">Quick Topics:</span>
          {GUIDE_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTopicId(t.id);
                const el = document.getElementById(`topic-${t.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                activeTopicId === t.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Guide Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table of Contents */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs sticky top-20 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center justify-between">
              <span>Manual Topics</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                5 Chapters
              </span>
            </h3>

            <nav className="space-y-1.5">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveTopicId(topic.id);
                    const el = document.getElementById(`topic-${topic.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    activeTopicId === topic.id
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/10'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${topic.badgeColor}`}>
                      {topic.category}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        activeTopicId === topic.id ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">{topic.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{topic.summary}</p>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Topic Detailed Views */}
        <div className="lg:col-span-8 space-y-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              id={`topic-${topic.id}`}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 scroll-mt-24"
            >
              {/* Topic Header */}
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${topic.badgeColor}`}>
                    {topic.badge}
                  </span>
                  <span className="text-xs text-slate-400">• EcoClassify Reference Guide</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{topic.title}</h2>
                <p className="text-xs text-slate-600">{topic.summary}</p>
              </div>

              {/* Steps rendering */}
              {topic.steps && (
                <div className="space-y-3">
                  {topic.steps.map((st, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{st.step}</span>
                      </h4>
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed">{st.detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Guidelines rendering */}
              {topic.guidelines && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topic.guidelines.map((g, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{g.icon}</span>
                        <h4 className="text-xs font-bold text-slate-900">{g.type}</h4>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <p className="font-semibold text-emerald-800">Do's:</p>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {g.dos.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                        <p className="font-semibold text-rose-800 mt-2">Don'ts:</p>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {g.donts.map((dt, i) => (
                            <li key={i}>{dt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Points rendering */}
              {topic.points && (
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                  <h4 className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Technical Architecture Highlights</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-purple-950">
                    {topic.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Regions rendering */}
              {topic.regions && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Region Standard</th>
                        <th className="py-2.5 px-3">Recyclables Bin</th>
                        <th className="py-2.5 px-3">Organic / Paper Bin</th>
                        <th className="py-2.5 px-3">General Landfill Bin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {topic.regions.map((r, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{r.name}</td>
                          <td className="py-2.5 px-3 font-semibold text-blue-700">{r.recyclables}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-700">{r.organic || r.paper || r.burnable}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-600">{r.trash || r.general || r['non-burnable']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Jump to tab if available */}
              {onNavigateToTab && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (topic.id === 'quickstart') onNavigateToTab('classifier');
                      else if (topic.id === 'categories') onNavigateToTab('classifier');
                      else if (topic.id === 'regional') onNavigateToTab('regional');
                      else if (topic.id === 'ecotracker') onNavigateToTab('userDashboard');
                      else onNavigateToTab('classifier');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <span>Open Interactive Tool for {topic.category}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
