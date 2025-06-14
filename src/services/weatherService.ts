
import { DataEstimationUtils } from '../utils/dataEstimationUtils';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
}

export class WeatherService {
  static async fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,uv_index&hourly=visibility&timezone=auto`
      );
      
      if (response.ok) {
        const data = await response.json();
        const current = data.current;
        const hourly = data.hourly;
        
        return {
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          pressure: Math.round(current.surface_pressure),
          windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
          uvIndex: current.uv_index || 0,
          visibility: hourly.visibility ? Math.round(hourly.visibility[0] / 1000) : 10
        };
      }

      // Fallback weather data based on season and location
      console.warn('Weather API unavailable, using seasonal estimates');
      return DataEstimationUtils.getLocationBasedWeatherEstimate(lat, lon);
    } catch (err) {
      console.error('Weather fetch error:', err);
      return null;
    }
  }
}
