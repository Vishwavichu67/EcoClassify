export type WasteCategory =
  | 'Plastic'
  | 'Paper & Cardboard'
  | 'Metal'
  | 'Glass'
  | 'Organic / Food Waste'
  | 'E-Waste / Hazardous'
  | 'General Trash';

export interface PreprocessingResult {
  inputShape: [number, number, number]; // [width, height, channels] e.g. [224, 224, 3]
  normalizedTensorPreview: number[]; // sample normalized floating point values
  normalizedTensorData?: Float32Array; // full 224x224x3 tensor matrix
  aspectRatio: number;
  meanRgb: [number, number, number]; // [R, G, B]
  imageWidth: number;
  imageHeight: number;
  processingTimeMs: number;
}

export interface PredictionProb {
  category: WasteCategory;
  probability: number; // 0.0 to 1.0
  logit: number;
}

export interface CVInferenceResult {
  modelName: string;
  modelVersion: string;
  architecture: string;
  predictedCategory: WasteCategory;
  confidence: number;
  topK: PredictionProb[];
  allProbabilities: Record<WasteCategory, number>;
  entropy: number; // Uncertainty measure
  inferenceTimeMs: number;
  isOutofDistribution: boolean;
  featureEmbeddingVectorSample: number[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;
  loss: number;
  classMetrics: Record<WasteCategory, { precision: number; recall: number; f1: number; samples: number }>;
  confusionMatrix: {
    labels: WasteCategory[];
    matrix: number[][]; // 7x7 matrix
  };
}

export interface ModelVersion {
  version: string;
  modelName: string;
  backbone: string; // e.g., 'MobileNetV2'
  paramCountMillions: number;
  quantization: 'INT8' | 'FP16' | 'FP32';
  inputResolution: string;
  releasedAt: string;
  status: 'active' | 'archived' | 'staging';
  metrics: ModelMetrics;
  trainingSamplesCount: number;
  description: string;
}

export interface DataAugmentationConfig {
  randomRotationDegrees: number; // e.g. 30
  randomHorizontalFlip: boolean;
  randomVerticalFlip: boolean;
  brightnessJitter: number; // 0.0 to 0.5
  contrastJitter: number; // 0.0 to 0.5
  randomCutout: boolean;
  gaussianNoise: boolean;
}

export interface RetrainJobStatus {
  jobId: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentEpoch: number;
  totalEpochs: number;
  activeLearningQueueSize: number;
  trainingLossHistory: { epoch: number; trainLoss: number; valLoss: number; valAccuracy: number }[];
  augmentedSamplesGenerated: number;
  newModelVersion?: string;
  logs: string[];
}
