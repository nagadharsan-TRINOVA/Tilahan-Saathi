import { WeatherData } from '../types';
import { initialWeatherData } from '../data/mockWeather';

export const weatherService = {
  getWeatherData: async (location = 'Chomu, Jaipur'): Promise<WeatherData> => {
    // Return mock weather data with updated location
    return {
      ...initialWeatherData,
      current: {
        ...initialWeatherData.current,
        location,
        lastUpdated: `Updated ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      },
    };
  },
};
