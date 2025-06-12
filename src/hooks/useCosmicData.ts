
import { useState, useEffect } from 'react';
import { CosmicDataService, GeomagneticData, SolarData, SeasonalData, SeismicData } from '@/services/cosmicDataService';

export interface CosmicData {
  geomagnetic: GeomagneticData;
  solar: SolarData;
  seasonal: SeasonalData;
  seismic: SeismicData;
}

export const useCosmicData = (latitude?: number, longitude?: number) => {
  const [cosmicData, setCosmicData] = useState<CosmicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCosmicData = async () => {
    // Always fetch cosmic data, using defaults if no coordinates
    const lat = latitude || 40.7128; // Default to NYC
    const lon = longitude || -74.0060;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching cosmic data for coordinates:', { lat, lon });
      
      const [geomagnetic, solar, seasonal, seismic] = await Promise.all([
        CosmicDataService.fetchGeomagneticData(),
        CosmicDataService.fetchSolarData(),
        CosmicDataService.fetchSeasonalData(lat),
        CosmicDataService.fetchSeismicData(lat, lon)
      ]);

      const data: CosmicData = {
        geomagnetic,
        solar,
        seasonal,
        seismic
      };

      console.log('Cosmic data fetched successfully:', data);
      setCosmicData(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cosmic data';
      console.error('Cosmic data fetch error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately when component mounts
    fetchCosmicData();
  }, [latitude, longitude]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCosmicData();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return {
    cosmicData,
    isLoading,
    error,
    lastUpdated,
    refreshData: fetchCosmicData
  };
};
