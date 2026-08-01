import { WeatherData } from '../types';

export const initialWeatherData: WeatherData = {
  current: {
    tempC: 29.4,
    feelsLikeC: 31.2,
    humidityPercent: 68,
    rainfallMm: 4.2,
    windSpeedKmH: 14,
    condition: 'Partly Cloudy with Light Breezes',
    location: 'Chomu, Jaipur',
    state: 'Rajasthan',
    airQualityIndex: 48,
    lastUpdated: 'Today, 10:30 AM',
  },
  forecast: [
    { date: '2026-07-31', dayName: 'Today', tempMaxC: 32, tempMinC: 24, condition: 'Partly Cloudy', rainProbabilityPercent: 20, humidityPercent: 68, windSpeedKmH: 14, uvIndex: 7 },
    { date: '2026-08-01', dayName: 'Sat', tempMaxC: 31, tempMinC: 23, condition: 'Rainy', rainProbabilityPercent: 75, humidityPercent: 82, windSpeedKmH: 18, uvIndex: 4 },
    { date: '2026-08-02', dayName: 'Sun', tempMaxC: 29, tempMinC: 22, condition: 'Thunderstorm', rainProbabilityPercent: 85, humidityPercent: 88, windSpeedKmH: 22, uvIndex: 3 },
    { date: '2026-08-03', dayName: 'Mon', tempMaxC: 30, tempMinC: 23, condition: 'Rainy', rainProbabilityPercent: 60, humidityPercent: 78, windSpeedKmH: 16, uvIndex: 5 },
    { date: '2026-08-04', dayName: 'Tue', tempMaxC: 33, tempMinC: 24, condition: 'Sunny', rainProbabilityPercent: 10, humidityPercent: 62, windSpeedKmH: 12, uvIndex: 8 },
    { date: '2026-08-05', dayName: 'Wed', tempMaxC: 34, tempMinC: 25, condition: 'Sunny', rainProbabilityPercent: 5, humidityPercent: 58, windSpeedKmH: 11, uvIndex: 9 },
    { date: '2026-08-06', dayName: 'Thu', tempMaxC: 32, tempMinC: 24, condition: 'Partly Cloudy', rainProbabilityPercent: 30, humidityPercent: 65, windSpeedKmH: 13, uvIndex: 7 },
  ],
  geminiAdvice: {
    title: 'Gemini AI Agronomist Weather Advisory',
    summary:
      'Moderate to heavy rainfall (25-40mm expected) forecast between Saturday evening and Sunday night. Ideal for rainwater harvesting in farm ponds.',
    actionItems: [
      'Postpone scheduled urea fertilizer top-dressing until Monday to prevent nitrogen leaching.',
      'Clear field drainage channels around Mustard & Groundnut seedbeds to avoid root stagnation.',
      'Ensure pesticide spray is completed before Saturday 2:00 PM or hold until dry weather returns.',
    ],
    riskLevel: 'Moderate Risk',
    riskColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
};
