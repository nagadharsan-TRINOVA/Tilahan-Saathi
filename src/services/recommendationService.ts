import { CropRecommendationInput, CropRecommendationResult } from '../types';
import { initialRecommendations } from '../data/mockRecommendations';

const STORAGE_KEY = 'tilahan_saathi_recommendations';

export const recommendationService = {
  getRecommendations: async (): Promise<CropRecommendationResult[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecommendations));
      return initialRecommendations;
    }
    return JSON.parse(data);
  },

  getRecommendationById: async (id: string): Promise<CropRecommendationResult | undefined> => {
    const list = await recommendationService.getRecommendations();
    return list.find((r) => r.id === id);
  },

  generateRecommendation: async (
    input: CropRecommendationInput
  ): Promise<CropRecommendationResult> => {
    // Simulate AI processing time (1.2 seconds)
    await new Promise((res) => setTimeout(res, 1200));

    // Smart logic mapping according to input for realistic Indian oilseed matching
    let cropName = 'Yellow Mustard (Pusa Bold / Giriraj)';
    let cropCategory: CropRecommendationResult['cropCategory'] = 'Mustard / Rapeseed';
    let expectedYield = 11.5;
    let expectedProfit = 48000;
    let estimatedCost = 16000;
    let confidenceScore = 95;
    let waterReq = 280;
    let oilPct = 42.0;
    let growthDays = 125;
    let reasonText = `Based on your ${input.soilType} in ${input.district}, ${input.state}, with ${input.waterAvailability} and budget of ₹${input.budgetRupees.toLocaleString('en-IN')}, Yellow Mustard promises maximum ROI.`;

    if (input.soilType.includes('Black') || input.soilType.includes('Clay')) {
      cropName = 'High Yield Soybean (JS 20-34 / RVS 2001)';
      cropCategory = 'Soybean';
      expectedYield = 10.0;
      expectedProfit = 42000;
      estimatedCost = 15000;
      confidenceScore = 92;
      waterReq = 480;
      oilPct = 21.0;
      growthDays = 95;
      reasonText = `Deep moisture-retaining ${input.soilType} in ${input.district} matches high-protein Soybean varieties with quick harvest turnaround.`;
    } else if (input.soilType.includes('Loamy') || input.waterAvailability.includes('Drip')) {
      cropName = 'Groundnut (GG-20 / Kadiri-6 High Oleic)';
      cropCategory = 'Groundnut';
      expectedYield = 13.5;
      expectedProfit = 54000;
      estimatedCost = 21000;
      confidenceScore = 93;
      waterReq = 450;
      oilPct = 48.0;
      growthDays = 110;
      reasonText = `Well-drained ${input.soilType} with ${input.waterAvailability} ensures excellent pod expansion and high oil recovery for Groundnut.`;
    } else if (input.season.includes('Summer') || input.soilType.includes('Red')) {
      cropName = 'Hybrid Sunflower (KBSH-41 / DRSH-1)';
      cropCategory = 'Sunflower';
      expectedYield = 8.5;
      expectedProfit = 39000;
      estimatedCost = 14000;
      confidenceScore = 90;
      waterReq = 380;
      oilPct = 40.0;
      growthDays = 90;
      reasonText = `Sufficient solar radiation and ${input.soilType} in ${input.district} drives high seed set and polyunsaturated oil synthesis in Sunflower.`;
    }

    const result: CropRecommendationResult = {
      id: `rec-${Date.now()}`,
      recommendedCrop: cropName,
      cropCategory: cropCategory,
      confidenceScore: confidenceScore,
      expectedYieldQuintalPerAcre: expectedYield,
      expectedProfitPerAcreRupees: expectedProfit,
      estimatedCostPerAcreRupees: estimatedCost,
      suitableSeason: input.season,
      waterRequirementMm: waterReq,
      oilContentPercentage: oilPct,
      growthDurationDays: growthDays,
      reason: reasonText,
      advantages: [
        {
          title: 'Optimal Resource Utilization',
          description: `Custom matched to your budget of ₹${(input.budgetRupees / input.farmSizeAcres).toLocaleString('en-IN')}/acre and ${input.waterAvailability}.`,
        },
        {
          title: 'High Oil Recovery & Price Premium',
          description: `Features ${oilPct}% oil content for maximum NAFED & local oil mill rate realization.`,
        },
        {
          title: 'NMEO Subsidy Eligible',
          description: 'Qualifies for government seed mini-kit grants under national edible oil mission.',
        },
      ],
      precautions: [
        {
          title: 'Timely Sowing Window',
          severity: 'High',
          description: 'Ensure sowing within the recommended temperature band to avoid flower drop.',
        },
        {
          title: 'Integrated Pest Management',
          severity: 'Medium',
          description: 'Deploy sticky traps early and follow organic bio-pesticide spray schedule.',
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      inputsSnapshot: input,
    };

    // Save to list
    const current = await recommendationService.getRecommendations();
    const updated = [result, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return result;
  },

  saveRecommendation: async (rec: CropRecommendationResult): Promise<boolean> => {
    const list = await recommendationService.getRecommendations();
    const exists = list.some((item) => item.id === rec.id);
    if (!exists) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([rec, ...list]));
    }
    return true;
  },
};
