export type Language = 'en' | 'hi' | 'gu' | 'mr' | 'pa' | 'te' | 'kn';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  kisanId: string;
  state: string;
  district: string;
  village: string;
  totalLandArea: number; // in Acres
  preferredLanguage: Language;
  avatarUrl: string;
  isDarkMode: boolean;
  notificationSettings: {
    weatherAlerts: boolean;
    taskReminders: boolean;
    schemeUpdates: boolean;
    marketPrices: boolean;
  };
}

export type SoilType =
  | 'Loamy'
  | 'Sandy Loam'
  | 'Clay Loam'
  | 'Black Soil (Regur)'
  | 'Alluvial'
  | 'Red & Yellow'
  | 'Laterite'
  | 'Saline / Alkaline';

export type WaterSource =
  | 'Tube Well / Borewell'
  | 'Canal'
  | 'Rainfed'
  | 'Drip Irrigation'
  | 'Sprinkler System'
  | 'Pond / Farm Pond';

export interface LandRecord {
  id: string;
  farmName: string;
  state: string;
  district: string;
  village: string;
  areaAcres: number;
  soilType: SoilType;
  waterSource: WaterSource;
  previousCrop: string;
  currentCrop?: string;
  status: 'Active' | 'Fallow' | 'Sown' | 'Harvesting';
  phLevel?: number;
  organicCarbonPercentage?: number;
  nitrogenKgHa?: number;
  phosphorusKgHa?: number;
  potassiumKgHa?: number;
  lastUpdated: string;
}

export interface CropRecommendationInput {
  landId?: string;
  state: string;
  district: string;
  village: string;
  farmSizeAcres: number;
  budgetRupees: number;
  soilType: SoilType;
  waterAvailability: WaterSource;
  previousCrop: string;
  season: 'Rabi (Winter)' | 'Kharif (Monsoon)' | 'Zaid (Summer)';
}

export interface Advantage {
  title: string;
  description: string;
}

export interface Precaution {
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface CropRecommendationResult {
  id: string;
  recommendedCrop: string; // e.g. "Yellow Mustard (Pusa Bold)", "Groundnut (G-2)", "Soybean (JS 335)", "Sunflower (KBSH-41)"
  cropCategory: 'Mustard / Rapeseed' | 'Groundnut' | 'Soybean' | 'Sunflower' | 'Sesame' | 'Castor' | 'Safflower';
  confidenceScore: number; // e.g. 94%
  expectedYieldQuintalPerAcre: number;
  expectedProfitPerAcreRupees: number;
  estimatedCostPerAcreRupees: number;
  suitableSeason: string;
  waterRequirementMm: number;
  oilContentPercentage: number;
  growthDurationDays: number;
  reason: string;
  advantages: Advantage[];
  precautions: Precaution[];
  createdAt: string;
  inputsSnapshot: CropRecommendationInput;
}

export type TaskCategory =
  | 'Sowing'
  | 'Irrigation'
  | 'Fertilizer'
  | 'Pest Monitoring'
  | 'Harvest'
  | 'Soil Preparation';

export interface CalendarTask {
  id: string;
  recommendationId?: string;
  cropName: string;
  title: string;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  dayNumber: number; // e.g., Day 1, Day 15, Day 45
  description: string;
  recommendedProducts?: string[];
  quantityPerAcre?: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempMaxC: number;
  tempMinC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Foggy';
  rainProbabilityPercent: number;
  humidityPercent: number;
  windSpeedKmH: number;
  uvIndex: number;
}

export interface WeatherData {
  current: {
    tempC: number;
    feelsLikeC: number;
    humidityPercent: number;
    rainfallMm: number;
    windSpeedKmH: number;
    condition: string;
    location: string;
    state: string;
    airQualityIndex: number;
    lastUpdated: string;
  };
  forecast: WeatherDayForecast[];
  geminiAdvice: {
    title: string;
    summary: string;
    actionItems: string[];
    riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Alert';
    riskColor: string;
  };
}

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  hindiName?: string;
  category: 'Subsidy' | 'Insurance' | 'Soil Health' | 'Seed Mini-Kit' | 'Irrigation Support' | 'Credit / Loan';
  eligibility: string;
  benefits: string;
  subsidyAmountMax: string;
  requiredDocuments: string[];
  applyingProcess: string;
  nodalAgency: string;
  applicationDeadline?: string;
  officialUrl?: string;
  isFeatured?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'task' | 'scheme' | 'market';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface MandiPrice {
  id: string;
  mandiName: string;
  state: string;
  commodity: string;
  modalPricePerQuintal: number;
  priceChangeRupees: number;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  category: 'Certified Seeds' | 'Bio-Fertilizer' | 'Pesticide' | 'Seed Mini-Kit' | 'Soil Conditioner';
  quantity: number;
  unitPriceRupees: number;
  subsidyPercent: number;
  totalPriceRupees: number;
}

export interface OrderDeliveryAddress {
  village: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Order {
  id?: string;
  order_number?: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  kisan_id: string;
  delivery_address: OrderDeliveryAddress;
  items: OrderItem[];
  total_amount_rupees: number;
  subsidy_applied_rupees: number;
  net_payable_rupees: number;
  payment_method: 'Cash on Delivery' | 'UPI / NetBanking' | 'Kisan Credit Card (KCC)' | 'Direct Subsidy Transfer';
  payment_status: 'Pending' | 'Completed' | 'Processing';
  order_status: 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  crop_recommendation_id?: string;
  land_area_acres?: number;
  notes?: string;
  created_at?: string;
  supabase_synced?: boolean;
}

export interface AgriInputProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Certified Seeds' | 'Bio-Fertilizer' | 'Pesticide' | 'Seed Mini-Kit' | 'Soil Conditioner';
  cropTarget: string; // e.g., 'Mustard / Rapeseed', 'Groundnut', 'Soybean'
  unitPriceRupees: number;
  subsidyPercent: number;
  unitSize: string; // e.g. "5 kg Bag", "10 kg Mini-Kit"
  description: string;
  inStock: boolean;
  rating: number;
  imageUrl?: string;
}

