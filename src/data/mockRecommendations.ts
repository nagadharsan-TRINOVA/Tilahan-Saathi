import { CropRecommendationResult } from '../types';

export const initialRecommendations: CropRecommendationResult[] = [
  {
    id: 'rec-101',
    recommendedCrop: 'Yellow Mustard (Pusa Mustard-30 / Giriraj)',
    cropCategory: 'Mustard / Rapeseed',
    confidenceScore: 96,
    expectedYieldQuintalPerAcre: 11.5,
    expectedProfitPerAcreRupees: 48500,
    estimatedCostPerAcreRupees: 16500,
    suitableSeason: 'Rabi (Oct - Mar)',
    waterRequirementMm: 280,
    oilContentPercentage: 42.5,
    growthDurationDays: 125,
    reason:
      'Your sandy loam soil with 7.4 pH and tube well availability in Jaipur region provides peak micro-climatic conditions for Yellow Mustard. Pusa Mustard-30 offers low erucic acid content, fetching premium mandi prices (+₹350/quintal).',
    advantages: [
      {
        title: 'High Oil Content & Premium Rate',
        description: 'Contains up to 42.5% oil content, eligible for extra price bonus in CWC & NAFED procurement.',
      },
      {
        title: 'Low Water Requirement',
        description: 'Requires only 2 to 3 light irrigations during flowering and pod development stages.',
      },
      {
        title: 'NMEO-Oilseeds Subsidy Eligible',
        description: 'Entitled to 50% subsidized high-yielding seed mini-kits under the National Mission on Edible Oils.',
      },
    ],
    precautions: [
      {
        title: 'Aphid Insect Surveillance',
        severity: 'High',
        description: 'Monitor closely during cloudy weather in December. Spray Dimethoate 30% EC @ 1.7ml/liter if infestation exceeds 10 aphids/plant.',
      },
      {
        title: 'Frost / Cold Wave Protection',
        severity: 'Medium',
        description: 'Apply light irrigation or create smoke around field borders during peak cold wave nights in January.',
      },
    ],
    createdAt: '2026-07-30',
    inputsSnapshot: {
      state: 'Rajasthan',
      district: 'Jaipur',
      village: 'Chomu',
      farmSizeAcres: 5.5,
      budgetRupees: 90000,
      soilType: 'Sandy Loam',
      waterAvailability: 'Tube Well / Borewell',
      previousCrop: 'Pearl Millet (Bajra)',
      season: 'Rabi (Winter)',
    },
  },
  {
    id: 'rec-102',
    recommendedCrop: 'Groundnut (GG-20 / Kadiri-6 High Oleic)',
    cropCategory: 'Groundnut',
    confidenceScore: 92,
    expectedYieldQuintalPerAcre: 14.0,
    expectedProfitPerAcreRupees: 52000,
    estimatedCostPerAcreRupees: 22000,
    suitableSeason: 'Kharif (Jun - Oct)',
    waterRequirementMm: 450,
    oilContentPercentage: 48.0,
    growthDurationDays: 110,
    reason:
      'Loamy soil with good drainage and drip irrigation in Rajkot district provides ideal pegging conditions. High oleic varieties feature double the shelf life and command strong export demand.',
    advantages: [
      {
        title: 'Soil Nitrogen Fixation',
        description: 'Leguminous nodules naturally enrich soil with up to 40 kg/ha atmospheric Nitrogen for subsequent crop cycles.',
      },
      {
        title: 'Valuable Fodder Yield',
        description: 'Groundnut haulms (vines) provide high-protein cattle fodder valued at ₹8,000 to ₹10,000 per acre.',
      },
    ],
    precautions: [
      {
        title: 'Tikka Leaf Spot Control',
        severity: 'Medium',
        description: 'Spray Mancozeb 75% WP @ 2.5g/liter at 35 and 50 days after sowing.',
      },
      {
        title: 'Avoid Waterlogging',
        description: 'Ensure efficient field drainage during heavy Kharif downpours to prevent pod rot.',
        severity: 'High',
      },
    ],
    createdAt: '2026-07-28',
    inputsSnapshot: {
      state: 'Gujarat',
      district: 'Rajkot',
      village: 'Gondal',
      farmSizeAcres: 3.0,
      budgetRupees: 65000,
      soilType: 'Loamy',
      waterAvailability: 'Drip Irrigation',
      previousCrop: 'Cotton',
      season: 'Kharif (Monsoon)',
    },
  },
  {
    id: 'rec-103',
    recommendedCrop: 'Soybean (JS 20-34 / RVS 2001-4)',
    cropCategory: 'Soybean',
    confidenceScore: 89,
    expectedYieldQuintalPerAcre: 9.5,
    expectedProfitPerAcreRupees: 38000,
    estimatedCostPerAcreRupees: 14500,
    suitableSeason: 'Kharif (Jun - Oct)',
    waterRequirementMm: 500,
    oilContentPercentage: 20.0,
    growthDurationDays: 95,
    reason:
      'Deep black cotton soil with high moisture retention capacity in Ujjain region guarantees early maturity before October rains.',
    advantages: [
      {
        title: 'Short Growth Window',
        description: 'Matures in 95 days, leaving ample time to prepare fields for Rabi Mustard or Wheat.',
      },
      {
        title: 'High Market Demand',
        description: 'Processing mills in Malwa belt offer immediate cash settlement at MSP or higher.',
      },
    ],
    precautions: [
      {
        title: 'Girdle Beetle Surveillance',
        severity: 'High',
        description: 'Check for ring-like girdling on stems 30-40 days after sowing; spray Chlorantraniliprole 18.5% SC.',
      },
    ],
    createdAt: '2026-07-25',
    inputsSnapshot: {
      state: 'Madhya Pradesh',
      district: 'Ujjain',
      village: 'Badnagar',
      farmSizeAcres: 4.0,
      budgetRupees: 60000,
      soilType: 'Black Soil (Regur)',
      waterAvailability: 'Canal',
      previousCrop: 'Wheat (Sharbati)',
      season: 'Kharif (Monsoon)',
    },
  },
];
