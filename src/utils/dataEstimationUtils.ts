
import { LocationData } from '../services/locationService';
import { AirQualityData } from '../services/airQualityService';
import { WeatherData } from '../services/weatherService';

export class DataEstimationUtils {
  // Create a deterministic hash function for consistent estimates
  static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Create a seeded random number generator for consistent results
  static seededRandom(seed: number, min: number = 0, max: number = 1): number {
    const x = Math.sin(seed) * 10000;
    const randomValue = x - Math.floor(x);
    return min + randomValue * (max - min);
  }

  static getLocationBasedAirQualityEstimate(lat: number, lon: number, locationInfo: LocationData): AirQualityData {
    console.log(`Generating location-based air quality estimate for ${locationInfo.city}, ${locationInfo.region}`);
    
    // Create a consistent seed based on location
    const locationSeed = this.simpleHash(`${locationInfo.city}_${locationInfo.region}_${lat.toFixed(2)}_${lon.toFixed(2)}`);
    
    // More sophisticated estimation based on location characteristics
    let baseAQI = 35; // Default moderate air quality
    
    // Regional adjustments based on known air quality patterns
    if (locationInfo.region === 'California' || locationInfo.region === 'CA') {
      if (locationInfo.city.toLowerCase().includes('los angeles') || 
          locationInfo.city.toLowerCase().includes('san bernardino') ||
          locationInfo.city.toLowerCase().includes('riverside')) {
        baseAQI += 25; // Higher pollution in LA basin
      } else if (locationInfo.city.toLowerCase().includes('san francisco') ||
                 locationInfo.city.toLowerCase().includes('san jose')) {
        baseAQI += 10; // Moderate urban pollution
      }
    } else if (locationInfo.region === 'Illinois' || locationInfo.region === 'IL') {
      if (locationInfo.city.toLowerCase().includes('chicago')) {
        baseAQI += 15; // Urban pollution
      }
    } else if (locationInfo.region === 'New York' || locationInfo.region === 'NY') {
      if (locationInfo.city.toLowerCase().includes('new york')) {
        baseAQI += 20; // NYC urban pollution
      }
    } else if (locationInfo.region === 'Florida' || locationInfo.region === 'FL') {
      baseAQI -= 5; // Generally better air quality
    } else if (locationInfo.region === 'Texas' || locationInfo.region === 'TX') {
      if (locationInfo.city.toLowerCase().includes('houston') ||
          locationInfo.city.toLowerCase().includes('dallas')) {
        baseAQI += 15; // Industrial pollution
      }
    }
    
    // Seasonal adjustments (basic - could be enhanced with actual date)
    const month = new Date().getMonth();
    const isSummer = month >= 5 && month <= 8;
    const isWinter = month >= 11 || month <= 2;
    
    if (isSummer) baseAQI += 10; // Higher ozone in summer
    if (isWinter && lat > 35) baseAQI += 5; // Heating season pollution
    
    // Add consistent variation based on location seed instead of random
    const variation = Math.floor(this.seededRandom(locationSeed, -10, 10));
    const finalAQI = Math.max(10, Math.min(150, baseAQI + variation));
    
    const pm25 = Math.round(finalAQI * 0.4 + this.seededRandom(locationSeed + 1, 0, 5));
    
    return {
      aqi: finalAQI,
      pm25,
      pm10: Math.round(pm25 * 1.5 + this.seededRandom(locationSeed + 2, 0, 10)),
      o3: Math.round(this.seededRandom(locationSeed + 3, 20, 70)),
      no2: Math.round(this.seededRandom(locationSeed + 4, 10, 40)),
      so2: Math.round(this.seededRandom(locationSeed + 5, 2, 12)),
      co: Math.round(this.seededRandom(locationSeed + 6, 1, 3)),
      source: `Estimated for ${locationInfo.city}, ${locationInfo.region}`
    };
  }

  static getLocationBasedWeatherEstimate(lat: number, lon: number): WeatherData {
    const month = new Date().getMonth();
    const isWinter = month >= 11 || month <= 2;
    const isSummer = month >= 5 && month <= 8;
    
    let baseTemp = 15; // Spring/Fall default
    if (isWinter) baseTemp = lat > 35 ? 5 : -5; // Warmer in south
    if (isSummer) baseTemp = lat > 35 ? 25 : 20; // Cooler in north
    
    // Use consistent seed for weather estimates too
    const weatherSeed = this.simpleHash(`weather_${lat.toFixed(2)}_${lon.toFixed(2)}`);
    
    return {
      temperature: baseTemp + Math.floor(this.seededRandom(weatherSeed, -5, 5)),
      humidity: Math.floor(this.seededRandom(weatherSeed + 1, 40, 70)),
      pressure: Math.floor(this.seededRandom(weatherSeed + 2, 1005, 1045)),
      windSpeed: Math.round(this.seededRandom(weatherSeed + 3, 2, 17) * 10) / 10,
      uvIndex: Math.floor(this.seededRandom(weatherSeed + 4, 1, 9)),
      visibility: Math.floor(this.seededRandom(weatherSeed + 5, 8, 18))
    };
  }
}
