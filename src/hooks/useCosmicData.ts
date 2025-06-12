
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
    if (!latitude || !longitude) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching cosmic data for coordinates:', { latitude, longitude });
      
      const [geomagnetic, solar, seasonal, seismic] = await Promise.all([
        CosmicDataService.fetchGeomagneticData(),
        CosmicDataService.fetchSolarData(),
        CosmicDataService.fetchSeasonalData(latitude),
        CosmicDataService.fetchSeismicData(latitude, longitude)
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
    fetchCosmicData();
  }, [latitude, longitude]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    if (!latitude || !longitude) return;
    
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
