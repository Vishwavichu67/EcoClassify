import { GoogleGenAI } from '@google/genai';
import { WasteCategory, PredictionProb } from './types';

export interface GeminiVisionResult {
  predictedCategory: WasteCategory;
  itemName: string;
  confidence: number;
  probabilities: Record<WasteCategory, number>;
  topK: PredictionProb[];
  cvModelExplanation: string;
  materialScientificInsight: string;
  contaminationPreventionTip: string;
}

export class GeminiVisionService {
  /**
   * Performs direct multimodal vision classification on an uploaded image using Gemini 3.6 Flash.
   */
  public static async classifyWithVision(
    imageBase64: string | undefined,
    description: string | undefined,
    sampleId: string | undefined,
    aiClient: GoogleGenAI
  ): Promise<GeminiVisionResult | null> {
    try {
      let cleanBase64 = imageBase64;
      let mimeType = 'image/jpeg';

      if (cleanBase64 && cleanBase64.startsWith('data:')) {
        const matches = cleanBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          cleanBase64 = matches[2];
        } else {
          cleanBase64 = cleanBase64.split(',')[1] || cleanBase64;
        }
      }

      const prompt = `You are EcoClassify's state-of-the-art AI Waste Classifier and Computer Vision Expert.
Analyze the provided image ${description ? `(User notes/description: "${description}")` : ''} ${sampleId ? `(Sample ID: "${sampleId}")` : ''}.

Classify the main waste object in the image into EXACTLY ONE of the following 7 waste categories:
- "Plastic" (PET/HDPE/PP plastic bottles, plastic containers, jugs, caps, synthetic wrappers, plastic packaging, plastic cutlery, clamshells)
- "Paper & Cardboard" (Cardboard boxes, shipping cartons, paper sheets, newspapers, paper bags, egg cartons)
- "Metal" (Aluminum beverage cans, steel food tins, aluminum foil, metal caps, metal lids)
- "Glass" (Glass bottles, glass jars, glass food containers)
- "Organic / Food Waste" (Fruit peels, vegetable scraps, food remains, coffee grounds, eggshells, organic garden waste)
- "E-Waste / Hazardous" (Batteries, electronic devices, chargers, cables, circuit boards, hazardous chemicals)
- "General Trash" (Styrofoam, dirty non-recyclable wrappers, sanitary waste, heavily contaminated materials)

CRITICAL DIRECTIVES FOR ACCURACY:
1. ANY plastic bottle (water bottle, soda bottle, green Sprite bottle, detergent jug), plastic container, plastic cap, plastic bag, or plastic wrapper MUST be classified as "Plastic". Never classify a plastic bottle or container as "Organic / Food Waste"!
2. ANY metal beverage can, soda can, or tin container MUST be classified as "Metal".
3. Cardboard boxes and clean paper sheets MUST be classified as "Paper & Cardboard".
4. Glass bottles and glass jars MUST be classified as "Glass".
5. "Organic / Food Waste" is STRICTLY for biological food scraps (apples, bananas, vegetables, food remains, coffee grounds) and compostable organic matter.
6. Provide a concise, human-readable item title (e.g., "PET #1 Plastic Beverage Bottle", "Aluminum Soda Can", "Cardboard Shipping Box", "Apple Core & Peels"). Do NOT include raw file names or base64 data.

Respond STRICTLY in valid JSON matching this schema:
{
  "predictedCategory": "Plastic" | "Paper & Cardboard" | "Metal" | "Glass" | "Organic / Food Waste" | "E-Waste / Hazardous" | "General Trash",
  "itemName": string,
  "confidence": number,
  "probabilities": {
    "Plastic": number,
    "Paper & Cardboard": number,
    "Metal": number,
    "Glass": number,
    "Organic / Food Waste": number,
    "E-Waste / Hazardous": number,
    "General Trash": number
  },
  "cvModelExplanation": string (2-3 sentences detailing optical and material features detected in the image, e.g. transparent/colored PET thermoplastic bottle silhouette, molded neck thread, plastic cap, confirming it is Plastic and NOT Organic),
  "materialScientificInsight": string (1 sentence detailing chemical/material structure, e.g., Polyethylene Terephthalate PET #1 polymer),
  "contaminationPreventionTip": string (1 actionable tip for proper bin prep, e.g., rinse liquid and flatten before placing in recycling bin)
}`;

      const contents: any[] = [];
      if (cleanBase64 && cleanBase64.length > 50) {
        contents.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        });
      }
      contents.push(prompt);

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      const validCategories: WasteCategory[] = [
        'Plastic',
        'Paper & Cardboard',
        'Metal',
        'Glass',
        'Organic / Food Waste',
        'E-Waste / Hazardous',
        'General Trash',
      ];

      if (parsed.predictedCategory && validCategories.includes(parsed.predictedCategory)) {
        const cat = parsed.predictedCategory as WasteCategory;
        const probs: Record<WasteCategory, number> = {
          Plastic: 0.01,
          'Paper & Cardboard': 0.01,
          Metal: 0.01,
          Glass: 0.01,
          'Organic / Food Waste': 0.01,
          'E-Waste / Hazardous': 0.01,
          'General Trash': 0.01,
          ...parsed.probabilities,
        };

        const conf = Math.max(0.88, Math.min(0.99, parsed.confidence || 0.95));
        probs[cat] = conf;

        const topK: PredictionProb[] = validCategories
          .map((c) => ({
            category: c,
            probability: probs[c] || 0.01,
            logit: Math.round(Math.log((probs[c] || 0.01) + 1e-5) * 10) / 10,
          }))
          .sort((a, b) => b.probability - a.probability);

        return {
          predictedCategory: cat,
          itemName: parsed.itemName || `${cat} Item`,
          confidence: topK[0].probability,
          probabilities: probs,
          topK,
          cvModelExplanation:
            parsed.cvModelExplanation ||
            `Multimodal AI vision model identified visual and structural surface characteristics corresponding to ${cat}.`,
          materialScientificInsight:
            parsed.materialScientificInsight || `Composed of standard ${cat} materials.`,
          contaminationPreventionTip:
            parsed.contaminationPreventionTip || `Rinse and empty contents before recycling.`,
        };
      }
    } catch (err) {
      console.warn('Gemini Vision multimodal classification fallback:', err);
    }

    return null;
  }
}
