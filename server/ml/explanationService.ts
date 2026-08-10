import { GoogleGenAI } from '@google/genai';
import { CVInferenceResult, WasteCategory } from './types';
import { RegionalGuidance } from './ruleEngine';

export interface AIExplanationResult {
  cvModelExplanation: string;
  environmentalAnalysis: string;
  materialScientificInsight: string;
  contaminationPreventionTip: string;
  localizedGuidanceText: string;
  explanationProvider: 'Gemini 3.6 Flash AI' | 'EcoClassify Rule Explanation Engine';
}

export class ExplanationService {
  /**
   * Generates AI explanation for CV model predictions using Gemini 3.6 Flash.
   * Gemini does NOT perform the classification; it explains the CV prediction.
   */
  public static async generateExplanation(
    cvResult: CVInferenceResult,
    regionalRules: RegionalGuidance,
    itemDescription?: string,
    aiClient?: GoogleGenAI | null
  ): Promise<AIExplanationResult> {
    const defaultFallback: AIExplanationResult = {
      cvModelExplanation: `The Computer Vision model (${cvResult.modelName}) detected optical and visual surface characteristics corresponding to ${cvResult.predictedCategory} with ${(cvResult.confidence * 100).toFixed(1)}% neural confidence.`,
      environmentalAnalysis: `Proper segregation of this ${cvResult.predictedCategory} item prevents roughly ${regionalRules.environmentalImpact.carbonSavedKg} kg CO₂ equivalent emissions and saves ${regionalRules.environmentalImpact.waterSavedLiters} liters of industrial processing water.`,
      materialScientificInsight: `This item is composed of ${regionalRules.materialType}. Recyclability is rated as ${regionalRules.recyclabilityRating}.`,
      contaminationPreventionTip: regionalRules.contaminationWarnings.length > 0
        ? regionalRules.contaminationWarnings[0]
        : 'Ensure the item is rinsed and free of heavy food grease before placing in the recycling stream.',
      localizedGuidanceText: `For region ${regionalRules.region}, place in ${regionalRules.binType}.`,
      explanationProvider: 'EcoClassify Rule Explanation Engine',
    };

    if (!aiClient) {
      return defaultFallback;
    }

    try {
      const topKFormatted = cvResult.topK
        .map((t) => `${t.category}: ${(t.probability * 100).toFixed(1)}%`)
        .join(', ');

      const prompt = `You are EcoClassify's AI Environmental Scientist & Explanation Engine.
CRITICAL MANDATE: A high-performance Computer Vision Neural Network (${cvResult.modelName}, Architecture: ${cvResult.architecture}) has ALREADY run inference on a waste sample and produced the following classification output:

- Predicted Category: "${cvResult.predictedCategory}"
- Neural Confidence: ${(cvResult.confidence * 100).toFixed(1)}%
- Top-K Probability Distribution: [${topKFormatted}]
- Neural Entropy / Uncertainty: ${cvResult.entropy}
- Target Region: "${regionalRules.region}"
- User Item Description / Sample: "${itemDescription || 'Visual Waste Sample'}"

YOUR TASK:
Do NOT re-classify the item. Accept the Computer Vision model's prediction of "${cvResult.predictedCategory}".
Generate a concise, highly informative, scientific explanation of why this item belongs in "${cvResult.predictedCategory}", its carbon footprint impact, and localized bin prep advice.

Respond STRICTLY in valid JSON matching this schema:
{
  "cvModelExplanation": string (2-3 sentences explaining why the CV model's feature map detected this material, e.g. surface reflection, polymer characteristics, or physical shape),
  "environmentalAnalysis": string (1-2 sentences on carbon reduction, energy savings, or landfill diversion benefits),
  "materialScientificInsight": string (1 sentence detailing chemical/material properties, e.g., PET #1 thermoplastic, cellulose fiber structure, or silica glass lattice),
  "contaminationPreventionTip": string (1 sentence actionable tip to prevent MRF batch rejection or contamination),
  "localizedGuidanceText": string (1 sentence specific bin preparation instruction for region "${regionalRules.region}")
}`;

      const geminiRes = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(geminiRes.text || '{}');
      if (parsed.cvModelExplanation) {
        return {
          cvModelExplanation: parsed.cvModelExplanation,
          environmentalAnalysis: parsed.environmentalAnalysis || defaultFallback.environmentalAnalysis,
          materialScientificInsight: parsed.materialScientificInsight || defaultFallback.materialScientificInsight,
          contaminationPreventionTip: parsed.contaminationPreventionTip || defaultFallback.contaminationPreventionTip,
          localizedGuidanceText: parsed.localizedGuidanceText || defaultFallback.localizedGuidanceText,
          explanationProvider: 'Gemini 3.6 Flash AI',
        };
      }
    } catch (err) {
      console.warn('Gemini explanation service fallback:', err);
    }

    return defaultFallback;
  }
}
