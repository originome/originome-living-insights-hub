
import { LocationData } from './locationService';
import { DataEstimationUtils } from '../utils/dataEstimationUtils';

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  source: string;
}

export class AirQualityService {
  static async fetchAirQuality(lat: number, lon: number, locationInfo: LocationData): Promise<AirQualityData> {
    try {
      console.log(`Fetching air quality for coordinates: ${lat}, ${lon} (${locationInfo.city}, ${locationInfo.region})`);
      
      // Try OpenAQ first for more reliable location-based data
      const openaqResponse = await fetch(
        `https://api.openaq.org/v2/latest?limit=1&coordinates=${lat},${lon}&radius=50000&order_by=lastUpdated&sort=desc`
      );
      
      if (openaqResponse.ok) {
        const openaqData = await openaqResponse.json();
        console.log('OpenAQ response:', openaqData);
        
        if (openaqData.results && openaqData.results.length > 0) {
          const result = openaqData.results[0];
          const measurements = result.measurements;
          
          const getParameterValue = (parameter: string) => {
            const measurement = measurements.find((m: any) => m.parameter === parameter);
            return measurement ? Math.round(measurement.value) : 0;
          };

          const pm25 = getParameterValue('pm25');
          const pm10 = getParameterValue('pm10');
          const o3 = getParameterValue('o3');
          const no2 = getParameterValue('no2');
          const so2 = getParameterValue('so2');
          const co = getParameterValue('co');
          
          // Calculate AQI from PM2.5 using EPA formula
          const aqi = this.calculateAQI(pm25);
          
          console.log(`OpenAQ data for ${locationInfo.city}: AQI=${aqi}, PM2.5=${pm25}`);
          
          return {
            aqi,
            pm25,
            pm10,
            o3,
            no2,
            so2,
            co,
            source: `OpenAQ Network - ${result.city || locationInfo.city}`
          };
        }
      }

      // Fallback to WAQI (but we know it may not be location-accurate)
      const waqiResponse = await fetch(
        `https://api.waqi.info/feed/geo:${lat};${lon}/?token=demo`
      );
      
      if (waqiResponse.ok) {
        const waqiData = await waqiResponse.json();
        console.log('WAQI response:', waqiData);
        
        if (waqiData.status === 'ok' && waqiData.data) {
          const data = waqiData.data;
          
          // Check if the returned city matches our expected location
          const returnedCity = data.city?.name || '';
          const isLocationMatch = returnedCity.toLowerCase().includes(locationInfo.city.toLowerCase()) ||
                                locationInfo.city.toLowerCase().includes(returnedCity.toLowerCase());
          
          if (!isLocationMatch) {
            console.warn(`WAQI returned data for ${returnedCity}, but we requested ${locationInfo.city}. Using estimated data instead.`);
            
            // Use location-based estimation if WAQI data doesn't match
            return DataEstimationUtils.getLocationBasedAirQualityEstimate(lat, lon, locationInfo);
          }
          
          return {
            aqi: data.aqi || 0,
            pm25: data.iaqi?.pm25?.v || 0,
            pm10: data.iaqi?.pm10?.v || 0,
            o3: data.iaqi?.o3?.v || 0,
            no2: data.iaqi?.no2?.v || 0,
            so2: data.iaqi?.so2?.v || 0,
            co: data.iaqi?.co?.v || 0,
            source: `WAQI - ${data.city?.name || locationInfo.city}`
          };
        }
      }

      // Use location-based estimation if APIs fail
      return DataEstimationUtils.getLocationBasedAirQualityEstimate(lat, lon, locationInfo);
      
    } catch (err) {
      console.error('Air quality fetch error:', err);
      return DataEstimationUtils.getLocationBasedAirQualityEstimate(lat, lon, locationInfo);
    }
  }

  private static calculateAQI(pm25: number): number {
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1));
    if (pm25 <= 55.4) return Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5));
    if (pm25 <= 150.4) return Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5));
    if (pm25 <= 250.4) return Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5));
    return Math.round(301 + ((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5));
  }
}
