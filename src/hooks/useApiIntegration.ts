
import { useState, useEffect, useCallback } from 'react';
import { LocationService, LocationData } from '../services/locationService';
import { AirQualityService, AirQualityData } from '../services/airQualityService';
import { WeatherService, WeatherData } from '../services/weatherService';
import { HealthSurveillanceService, HealthSurveillanceData } from '../services/healthSurveillanceService';

export interface ExternalData {
  airQuality: AirQualityData | null;
  weather: WeatherData | null;
  healthSurveillance: HealthSurveillanceData | null;
  location: LocationData | null;
}

export const useApiIntegration = (location: string, buildingType?: string, populationGroup?: string) => {
  const [externalData, setExternalData] = useState<ExternalData>({
    airQuality: null,
    weather: null,
    healthSurveillance: null,
    location: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = useCallback(async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching real-time data for location:', location, 'buildingType:', buildingType, 'populationGroup:', populationGroup);
      
      const locationData = await LocationService.fetchLocationData(location);
      console.log('Location resolved:', locationData);
      
      const [airQuality, weather, healthSurveillance] = await Promise.all([
        AirQualityService.fetchAirQuality(locationData.lat, locationData.lon, locationData),
        WeatherService.fetchWeatherData(locationData.lat, locationData.lon),
        HealthSurveillanceService.fetchHealthSurveillance(locationData.region, locationData.country, buildingType, populationGroup)
      ]);
      
      console.log('Air quality data:', airQuality);
      console.log('Building type used:', buildingType, 'Population group used:', populationGroup);
      
      setExternalData({
        airQuality,
        weather,
        healthSurveillance,
        location: locationData
      });
      
      setLastUpdated(new Date());
      console.log('Data refresh completed successfully for:', locationData.city);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch external data';
      setError(errorMessage);
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [location, buildingType, populationGroup]);

  useEffect(() => {
    if (!location) return;
    
    refreshData();
    
    // Auto-refresh every 10 minutes for real-time data
    const interval = setInterval(refreshData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, buildingType, populationGroup, refreshData]);

  return {
    externalData,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};
