export interface EcoRankDefinition {
  level: number;
  title: string;
  minPoints: number;
  description: string;
  badgeBg: string;
  badgeText: string;
}

export const ECO_RANKS: EcoRankDefinition[] = [
  { level: 1, title: 'Eco Novice', minPoints: 0, description: 'Started the eco classification journey.', badgeBg: 'bg-slate-100', badgeText: 'text-slate-800' },
  { level: 2, title: 'Recycler Apprentice', minPoints: 20, description: 'Uploaded first waste scans for ML identification.', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-800' },
  { level: 3, title: 'Sorting Enthusiast', minPoints: 50, description: 'Consistently sorting waste with computer vision assistance.', badgeBg: 'bg-teal-50', badgeText: 'text-teal-800' },
  { level: 4, title: 'Waste Inspector', minPoints: 90, description: 'Verifying material features and bin routing rules.', badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-800' },
  { level: 5, title: 'Eco Scout', minPoints: 140, description: 'Actively contributing training samples to the dataset.', badgeBg: 'bg-blue-50', badgeText: 'text-blue-800' },
  { level: 6, title: 'Green Contributor', minPoints: 200, description: 'Providing high-accuracy RLHF reward signals.', badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-800' },
  { level: 7, title: 'Model Trainer', minPoints: 270, description: 'Helping fine-tune MobileNetV2 classification boundaries.', badgeBg: 'bg-purple-50', badgeText: 'text-purple-800' },
  { level: 8, title: 'Active Annotator', minPoints: 350, description: 'High-density feedback contributor for tricky packaging.', badgeBg: 'bg-fuchsia-50', badgeText: 'text-fuchsia-800' },
  { level: 9, title: 'Waste Analyst', minPoints: 440, description: 'Diverted significant volume of plastics and recyclables.', badgeBg: 'bg-pink-50', badgeText: 'text-pink-800' },
  { level: 10, title: 'Recycling Champion', minPoints: 540, description: 'Top-tier recycling accuracy and carbon offset driver.', badgeBg: 'bg-rose-50', badgeText: 'text-rose-800' },
  { level: 11, title: 'RLHF Specialist', minPoints: 650, description: 'Expert in loss penalty feedback and misclassification correction.', badgeBg: 'bg-amber-50', badgeText: 'text-amber-800' },
  { level: 12, title: 'Circularity Advocate', minPoints: 770, description: 'Promoting circular economy through verified sorting.', badgeBg: 'bg-yellow-50', badgeText: 'text-yellow-800' },
  { level: 13, title: 'Zero-Waste Pioneer', minPoints: 900, description: 'Achieving near-zero contamination in local waste streams.', badgeBg: 'bg-lime-50', badgeText: 'text-lime-800' },
  { level: 14, title: 'ML Dataset Curator', minPoints: 1040, description: 'Building clean ground-truth datasets for retrain cycles.', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-900' },
  { level: 15, title: 'Eco Sentinel', minPoints: 1190, description: 'Guardian of regional waste standards and recycling rules.', badgeBg: 'bg-teal-100', badgeText: 'text-teal-900' },
  { level: 16, title: 'Neural Vision Strategist', minPoints: 1350, description: 'Guiding active learning query strategies for computer vision.', badgeBg: 'bg-sky-100', badgeText: 'text-sky-900' },
  { level: 17, title: 'Sustainability Legend', minPoints: 1520, description: 'Incredible environmental impact and dataset contribution.', badgeBg: 'bg-purple-100', badgeText: 'text-purple-900' },
  { level: 18, title: 'Master RLHF Trainer', minPoints: 1700, description: 'Master annotator driving model accuracy beyond 98%.', badgeBg: 'bg-amber-100', badgeText: 'text-amber-950' },
  { level: 19, title: 'Global Waste Guardian', minPoints: 1890, description: 'Pinnacle of global waste segregation excellence.', badgeBg: 'bg-rose-100', badgeText: 'text-rose-950' },
  { level: 20, title: 'Eco Vision Grandmaster', minPoints: 2100, description: 'Maximum rank achieved! Grandmaster of AI Eco Classification.', badgeBg: 'bg-gradient-to-r from-amber-500 to-emerald-500', badgeText: 'text-slate-950 font-black' }
];

export interface EcoRankProgress {
  level: number;
  title: string;
  description: string;
  currentPoints: number;
  pointsInCurrentLevel: number;
  pointsNeededForCurrentLevel: number;
  progressPercent: number;
  pointsForNextLevel: number;
  nextLevelTitle: string;
  badgeBg: string;
  badgeText: string;
}

export const calculateEcoRank = (points: number = 0): EcoRankProgress => {
  const safePoints = Math.max(0, Math.round(points));
  let currentRank = ECO_RANKS[0];
  let nextRank = ECO_RANKS[1];

  for (let i = ECO_RANKS.length - 1; i >= 0; i--) {
    if (safePoints >= ECO_RANKS[i].minPoints) {
      currentRank = ECO_RANKS[i];
      nextRank = ECO_RANKS[i + 1] || ECO_RANKS[i];
      break;
    }
  }

  if (currentRank.level === 20) {
    return {
      level: 20,
      title: currentRank.title,
      description: currentRank.description,
      currentPoints: safePoints,
      pointsInCurrentLevel: safePoints - currentRank.minPoints,
      pointsNeededForCurrentLevel: 1,
      progressPercent: 100,
      pointsForNextLevel: currentRank.minPoints,
      nextLevelTitle: 'Max Level Achieved',
      badgeBg: currentRank.badgeBg,
      badgeText: currentRank.badgeText,
    };
  }

  const range = nextRank.minPoints - currentRank.minPoints;
  const gained = safePoints - currentRank.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));

  return {
    level: currentRank.level,
    title: currentRank.title,
    description: currentRank.description,
    currentPoints: safePoints,
    pointsInCurrentLevel: gained,
    pointsNeededForCurrentLevel: range,
    progressPercent,
    pointsForNextLevel: nextRank.minPoints,
    nextLevelTitle: nextRank.title,
    badgeBg: currentRank.badgeBg,
    badgeText: currentRank.badgeText,
  };
};
