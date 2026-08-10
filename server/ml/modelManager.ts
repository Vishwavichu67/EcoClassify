import { ModelVersion, WasteCategory } from './types';

const CATEGORIES: WasteCategory[] = [
  'Plastic',
  'Paper & Cardboard',
  'Metal',
  'Glass',
  'Organic / Food Waste',
  'E-Waste / Hazardous',
  'General Trash',
];

export class ModelManager {
  private activeVersion: string = 'v2.1.0-mobilenetv2-fp16';

  private versions: Record<string, ModelVersion> = {
    'v1.0.0-baseline': {
      version: 'v1.0.0-baseline',
      modelName: 'MobileNetV2-WasteNet-v1.0',
      backbone: 'MobileNetV2 (ImageNet pretrained)',
      paramCountMillions: 3.4,
      quantization: 'FP32',
      inputResolution: '224x224x3',
      releasedAt: '2026-06-01T08:00:00.000Z',
      status: 'archived',
      trainingSamplesCount: 25000,
      description: 'Initial MobileNetV2 baseline classifier trained on TrashNet & TACO datasets.',
      metrics: {
        accuracy: 0.842,
        precision: 0.838,
        recall: 0.841,
        f1Score: 0.839,
        mAP: 0.825,
        loss: 0.384,
        classMetrics: {
          'Plastic': { precision: 0.86, recall: 0.88, f1: 0.87, samples: 4500 },
          'Paper & Cardboard': { precision: 0.84, recall: 0.85, f1: 0.84, samples: 5100 },
          'Metal': { precision: 0.82, recall: 0.80, f1: 0.81, samples: 3200 },
          'Glass': { precision: 0.81, recall: 0.79, f1: 0.80, samples: 2800 },
          'Organic / Food Waste': { precision: 0.88, recall: 0.89, f1: 0.88, samples: 4100 },
          'E-Waste / Hazardous': { precision: 0.76, recall: 0.74, f1: 0.75, samples: 1800 },
          'General Trash': { precision: 0.78, recall: 0.76, f1: 0.77, samples: 3500 },
        },
        confusionMatrix: {
          labels: CATEGORIES,
          matrix: [
            [88, 3, 2, 2, 1, 1, 3],
            [2, 85, 1, 1, 2, 0, 9],
            [3, 1, 80, 4, 1, 5, 6],
            [2, 2, 5, 79, 1, 2, 9],
            [1, 2, 1, 1, 89, 0, 6],
            [2, 0, 8, 3, 1, 74, 12],
            [4, 7, 3, 4, 3, 3, 76],
          ],
        },
      },
    },
    'v2.0.0-taco-augmented': {
      version: 'v2.0.0-taco-augmented',
      modelName: 'EfficientNet-B0-WasteNet-v2.0',
      backbone: 'EfficientNet-B0',
      paramCountMillions: 5.3,
      quantization: 'FP16',
      inputResolution: '224x224x3',
      releasedAt: '2026-07-10T12:30:00.000Z',
      status: 'archived',
      trainingSamplesCount: 68000,
      description: 'Expanded training set with ISWA Global & Kaggle Garbage datasets plus data augmentation.',
      metrics: {
        accuracy: 0.914,
        precision: 0.912,
        recall: 0.915,
        f1Score: 0.913,
        mAP: 0.908,
        loss: 0.218,
        classMetrics: {
          'Plastic': { precision: 0.93, recall: 0.94, f1: 0.93, samples: 12000 },
          'Paper & Cardboard': { precision: 0.92, recall: 0.91, f1: 0.91, samples: 14000 },
          'Metal': { precision: 0.90, recall: 0.89, f1: 0.89, samples: 8500 },
          'Glass': { precision: 0.89, recall: 0.88, f1: 0.88, samples: 7200 },
          'Organic / Food Waste': { precision: 0.95, recall: 0.96, f1: 0.95, samples: 11500 },
          'E-Waste / Hazardous': { precision: 0.86, recall: 0.85, f1: 0.85, samples: 5400 },
          'General Trash': { precision: 0.88, recall: 0.87, f1: 0.87, samples: 9400 },
        },
        confusionMatrix: {
          labels: CATEGORIES,
          matrix: [
            [94, 1, 1, 1, 1, 0, 2],
            [1, 91, 1, 1, 1, 0, 5],
            [2, 1, 89, 3, 0, 2, 3],
            [1, 1, 3, 88, 1, 1, 5],
            [1, 1, 0, 1, 96, 0, 1],
            [1, 0, 4, 2, 1, 85, 7],
            [2, 4, 2, 2, 2, 1, 87],
          ],
        },
      },
    },
    'v2.1.0-mobilenetv2-fp16': {
      version: 'v2.1.0-mobilenetv2-fp16',
      modelName: 'MobileNetV2-WasteNet-v2.1 (Active)',
      backbone: 'MobileNetV2 (Inverted Residuals + Linear Bottlenecks)',
      paramCountMillions: 3.4,
      quantization: 'FP16',
      inputResolution: '224x224x3',
      releasedAt: '2026-08-01T16:00:00.000Z',
      status: 'active',
      trainingSamplesCount: 94500,
      description: 'Active production model fine-tuned on crowdsourced verified feedback, active learning queues, and edge quantization.',
      metrics: {
        accuracy: 0.958,
        precision: 0.956,
        recall: 0.957,
        f1Score: 0.956,
        mAP: 0.952,
        loss: 0.124,
        classMetrics: {
          'Plastic': { precision: 0.97, recall: 0.98, f1: 0.97, samples: 18000 },
          'Paper & Cardboard': { precision: 0.96, recall: 0.95, f1: 0.95, samples: 21000 },
          'Metal': { precision: 0.95, recall: 0.94, f1: 0.94, samples: 13000 },
          'Glass': { precision: 0.94, recall: 0.93, f1: 0.93, samples: 11000 },
          'Organic / Food Waste': { precision: 0.98, recall: 0.99, f1: 0.98, samples: 16500 },
          'E-Waste / Hazardous': { precision: 0.92, recall: 0.91, f1: 0.91, samples: 8000 },
          'General Trash': { precision: 0.93, recall: 0.92, f1: 0.92, samples: 14000 },
        },
        confusionMatrix: {
          labels: CATEGORIES,
          matrix: [
            [98, 0, 1, 0, 0, 0, 1],
            [0, 95, 0, 0, 1, 0, 4],
            [1, 0, 94, 2, 0, 1, 2],
            [0, 0, 2, 93, 0, 1, 4],
            [0, 0, 0, 0, 99, 0, 1],
            [0, 0, 3, 1, 0, 91, 5],
            [1, 3, 1, 1, 1, 1, 92],
          ],
        },
      },
    },
  };

  public getActiveModel(): ModelVersion {
    return this.versions[this.activeVersion] || Object.values(this.versions)[0];
  }

  public getAllVersions(): ModelVersion[] {
    return Object.values(this.versions);
  }

  public registerNewModelVersion(newVersion: ModelVersion) {
    this.versions[newVersion.version] = newVersion;
    if (newVersion.status === 'active') {
      // Archive old active version
      Object.keys(this.versions).forEach((key) => {
        if (key !== newVersion.version && this.versions[key].status === 'active') {
          this.versions[key].status = 'archived';
        }
      });
      this.activeVersion = newVersion.version;
    }
  }

  public setActiveVersion(versionKey: string): boolean {
    if (this.versions[versionKey]) {
      Object.keys(this.versions).forEach((key) => {
        this.versions[key].status = key === versionKey ? 'active' : 'archived';
      });
      this.activeVersion = versionKey;
      return true;
    }
    return false;
  }
}

export const modelManager = new ModelManager();
