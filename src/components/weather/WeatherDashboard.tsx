import React from 'react';
import { WeatherData } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Sparkles,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface WeatherDashboardProps {
  weather: WeatherData;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  weather,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Weather Banner */}
      <Card className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB300]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#FFB300] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {weather.current.location}, {weather.current.state}
            </span>
            <h1 className="text-3xl font-extrabold font-serif text-white tracking-tight">
              {weather.current.tempC}°C
            </h1>
            <p className="text-xs text-emerald-200">
              {weather.current.condition} • Feels like {weather.current.feelsLikeC}°C
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-300 block uppercase font-medium">
                Air Quality
              </span>
              <span className="text-lg font-bold text-emerald-400 font-serif">
                AQI {weather.current.airQualityIndex}
              </span>
              <span className="text-[9px] text-emerald-200 block">Good / Clean</span>
            </div>
          </div>
        </div>

        {/* Live Weather Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>Humidity</span>
            </div>
            <p className="text-2xl font-extrabold font-serif text-white">
              {weather.current.humidityPercent}%
            </p>
            <p className="text-[10px] text-emerald-300">Soil Moisture Ideal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
              <CloudRain className="w-4 h-4 text-blue-300" />
              <span>Rainfall</span>
            </div>
            <p className="text-2xl font-extrabold font-serif text-white">
              {weather.current.rainfallMm} mm
            </p>
            <p className="text-[10px] text-emerald-300">Precipitation today</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
              <Wind className="w-4 h-4 text-emerald-300" />
              <span>Wind Speed</span>
            </div>
            <p className="text-2xl font-extrabold font-serif text-white">
              {weather.current.windSpeedKmH} km/h
            </p>
            <p className="text-[10px] text-emerald-300">North-West direction</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-emerald-200 mb-1">
              <Sun className="w-4 h-4 text-[#FFB300]" />
              <span>Solar Radiation</span>
            </div>
            <p className="text-2xl font-extrabold font-serif text-white">
              6.5 kWh/m²
            </p>
            <p className="text-[10px] text-emerald-300">Peak photosynthesis</p>
          </div>
        </div>
      </Card>

      {/* Gemini AI Agronomist Advisory & Risk Indicator */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-300 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFB300] text-amber-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">
                {weather.geminiAdvice.title}
              </h3>
              <p className="text-xs text-slate-600">
                AI powered weather prediction tailored for oilseed spray & irrigation
              </p>
            </div>
          </div>

          <Badge variant="amber" size="md" className="bg-amber-100 text-amber-900 border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-700" />
            {weather.geminiAdvice.riskLevel}
          </Badge>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {weather.geminiAdvice.summary}
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recommended Action Items:
          </h4>
          <div className="space-y-2">
            {weather.geminiAdvice.actionItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 7-Day Weather Forecast Grid */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base font-serif">
              7-Day Micro-Climate Forecast
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Jaipur District</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center space-y-2 transition-all ${
                idx === 0
                  ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <p className="text-xs font-extrabold text-slate-900">{day.dayName}</p>
              <p className="text-[10px] text-slate-400">{day.date}</p>

              <div className="py-1">
                {day.condition.includes('Rain') || day.condition.includes('Thunder') ? (
                  <CloudRain className="w-6 h-6 text-blue-500 mx-auto animate-bounce" />
                ) : (
                  <Sun className="w-6 h-6 text-[#FFB300] mx-auto" />
                )}
              </div>

              <div>
                <span className="text-sm font-extrabold text-slate-900 font-serif block">
                  {day.tempMaxC}°C
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Min {day.tempMinC}°C
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[10px] font-semibold text-blue-700">
                {day.rainProbabilityPercent}% Rain
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
