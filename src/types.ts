export type WasteCategory =
  | 'Plastic'
  | 'Paper & Cardboard'
  | 'Metal'
  | 'Glass'
  | 'Organic / Food Waste'
  | 'E-Waste / Hazardous'
  | 'General Trash';

export interface TopPrediction {
  category: WasteCategory | string;
  confidence: number;
}

export interface EnvironmentalImpact {
  carbonSavedKg: number;
  waterSavedLiters: number;
  energySavedKWh: number;
}

export interface CategoryGuidance {
  category: WasteCategory;
  binType: string;
  binColorHex: string;
  materialType: string;
  recyclabilityRating: string;
  prepSteps: string[];
  doNotDo: string[];
  environmentalImpact: EnvironmentalImpact;
  ecoTips: string[];
}

export interface MLPipelineTelemetry {
  modelName: string;
  modelVersion: string;
  architecture: string;
  inferenceTimeMs: number;
  entropy: number;
  isOutofDistribution: boolean;
  allProbabilities: Record<string, number>;
  preprocessing: {
    inputShape: [number, number, number];
    normalizedTensorPreview: number[];
    aspectRatio: number;
    meanRgb: [number, number, number];
    imageWidth: number;
    imageHeight: number;
    processingTimeMs: number;
  };
  featureEmbeddingVectorSample?: number[];
}

export interface AIExplanation {
  cvModelExplanation: string;
  environmentalAnalysis: string;
  materialScientificInsight: string;
  contaminationPreventionTip: string;
  localizedGuidanceText: string;
  explanationProvider: string;
}

export interface ClassificationResult {
  success: boolean;
  category: WasteCategory;
  confidence: number;
  itemName: string;
  inferenceProvider: string;
  topPredictions: TopPrediction[];
  guidance: CategoryGuidance;
  mlPipeline?: MLPipelineTelemetry;
  aiExplanation?: AIExplanation;
  region: string;
  timestamp: string;
}

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  itemDescription?: string;
  predictedCategory: WasteCategory | string;
  actualCategory: WasteCategory | string;
  isCorrect: boolean;
  userNotes?: string;
  region?: string;
  modelConfidence: number;
  imagePreview?: string;
}

export interface FeedbackStats {
  total: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  categoryBreakdown: Record<string, { total: number; incorrect: number }>;
  entries: FeedbackEntry[];
}

export interface RetrainRun {
  version: string;
  timestamp: string;
  feedbackSamplesCount: number;
  initialAccuracy: number;
  fineTunedAccuracy: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  logs: string[];
}

export interface GlobalDataset {
  id: string;
  name: string;
  organization: string;
  samplesCount: number;
  classesCount: number;
  license: string;
  description: string;
  categories: string[];
  benchmarkAccuracy: number;
  status: 'Ingested & Active' | 'Ready to Train' | 'Downloading';
}

export interface ProjectReportSection {
  id: string;
  number: string;
  title: string;
  content: string | string[];
  subsections?: { title: string; content: string | string[] }[];
}
