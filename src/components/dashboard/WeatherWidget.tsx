import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { WeatherData } from '../../types';
import { weatherService } from '../../services/weatherService';
import { CloudRain, Sun, Wind, Droplets, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    weatherService.getWeatherData().then(setWeather);
  }, []);

  if (!weather) return null;

  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white relative overflow-hidden space-y-4 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB300]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-[#FFB300]" />
          <div>
            <h3 className="font-bold text-white text-base font-serif">
              Today's Agronomic Weather
            </h3>
            <p className="text-xs text-emerald-200">{weather.current.location}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/weather')}
          className="text-xs font-semibold text-[#FFB300] hover:underline flex items-center gap-1"
        >
          <span>7-Day Advisory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
            <Sun className="w-4 h-4 text-[#FFB300]" />
            <span>Temperature</span>
          </div>
          <p className="text-xl font-extrabold font-serif text-white">
            {weather.current.tempC}°C
          </p>
          <p className="text-[10px] text-emerald-300">Feels like {weather.current.feelsLikeC}°C</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Humidity</span>
          </div>
          <p className="text-xl font-extrabold font-serif text-white">
            {weather.current.humidityPercent}%
          </p>
          <p className="text-[10px] text-emerald-300">Moisture Index</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
            <CloudRain className="w-4 h-4 text-blue-300" />
            <span>Rainfall</span>
          </div>
          <p className="text-xl font-extrabold font-serif text-white">
            {weather.current.rainfallMm} mm
          </p>
          <p className="text-[10px] text-emerald-300">Light showers expected</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
            <Wind className="w-4 h-4 text-emerald-300" />
            <span>Wind Speed</span>
          </div>
          <p className="text-xl font-extrabold font-serif text-white">
            {weather.current.windSpeedKmH} km/h
          </p>
          <p className="text-[10px] text-emerald-300">Breeze from NW</p>
        </div>
      </div>

      {/* Gemini Advice Strip */}
      <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#FFB300] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-[#FFB300] uppercase tracking-wider text-[10px] block">
            {weather.geminiAdvice.title}
          </span>
          <p className="text-emerald-100 leading-relaxed">
            {weather.geminiAdvice.summary}
          </p>
        </div>
      </div>
    </Card>
  );
};
