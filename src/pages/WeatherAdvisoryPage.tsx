import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { weatherService } from '../services/weatherService';
import { WeatherDashboard } from '../components/weather/WeatherDashboard';

export const WeatherAdvisoryPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    weatherService.getWeatherData().then(setWeather);
  }, []);

  if (!weather) {
    return (
      <div className="p-12 text-center font-bold text-slate-600">
        Loading Weather Data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WeatherDashboard weather={weather} />
    </div>
  );
};
