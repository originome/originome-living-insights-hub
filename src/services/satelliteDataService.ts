
export interface SatelliteData {
  ndvi: number; // Normalized Difference Vegetation Index
  lst: number; // Land Surface Temperature
  aerosolOpticalDepth: number;
  no2TroposphericColumn: number;
  uvIndex: number;
  surfaceReflectance: number;
  cloudCover: number;
  precipitationRate: number;
  source: string;
  timestamp: Date;
}

export interface MicroAnomalyData {
  anomalyType: 'thermal' | 'vegetation' | 'pollution' | 'atmospheric';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  spatialResolution: number; // meters
  temporalPattern: string;
  predictedDuration: number; // hours
  riskScore: number;
  affectedRadius: number; // meters
}

export class SatelliteDataService {
  static async fetchSatelliteData(lat: number, lon: number): Promise<SatelliteData> {
    try {
      // Simulate NASA MODIS/Landsat data integration
      const mockSatelliteData: SatelliteData = {
        ndvi: Math.max(0, Math.min(1, 0.3 + (Math.sin(lat * 0.1) * 0.4))),
        lst: 15 + (Math.abs(lat) * 0.5) + (Math.random() * 10),
        aerosolOpticalDepth: 0.1 + (Math.random() * 0.3),
        no2TroposphericColumn: 2e15 + (Math.random() * 5e15),
        uvIndex: Math.max(0, 5 + (Math.random() * 6)),
        surfaceReflectance: 0.1 + (Math.random() * 0.4),
        cloudCover: Math.random() * 100,
        precipitationRate: Math.random() * 5,
        source: 'NASA MODIS/Landsat Fusion',
        timestamp: new Date()
      };

      return mockSatelliteData;
    } catch (error) {
      console.error('Satellite data fetch error:', error);
      throw new Error('Failed to fetch satellite data');
    }
  }

  static detectMicroAnomalies(
    satelliteData: SatelliteData,
    historicalBaseline: Partial<SatelliteData>
  ): MicroAnomalyData[] {
    const anomalies: MicroAnomalyData[] = [];

    // Thermal anomaly detection
    const thermalDeviation = Math.abs(satelliteData.lst - (historicalBaseline.lst || 20));
    if (thermalDeviation > 5) {
      anomalies.push({
        anomalyType: 'thermal',
        severity: thermalDeviation > 10 ? 'critical' : thermalDeviation > 7 ? 'high' : 'moderate',
        confidence: Math.min(95, 60 + thermalDeviation * 3),
        spatialResolution: 30,
        temporalPattern: 'Persistent over 6-hour window',
        predictedDuration: 12 + (thermalDeviation * 2),
        riskScore: Math.min(100, thermalDeviation * 8),
        affectedRadius: 500 + (thermalDeviation * 100)
      });
    }

    // Vegetation stress detection
    const ndviDeviation = (historicalBaseline.ndvi || 0.6) - satelliteData.ndvi;
    if (ndviDeviation > 0.2) {
      anomalies.push({
        anomalyType: 'vegetation',
        severity: ndviDeviation > 0.4 ? 'high' : 'moderate',
        confidence: 70 + (ndviDeviation * 50),
        spatialResolution: 10,
        temporalPattern: 'Declining over 14-day period',
        predictedDuration: 168, // 7 days
        riskScore: ndviDeviation * 150,
        affectedRadius: 200
      });
    }

    // Atmospheric pollution spikes
    if (satelliteData.aerosolOpticalDepth > 0.3) {
      anomalies.push({
        anomalyType: 'atmospheric',
        severity: satelliteData.aerosolOpticalDepth > 0.5 ? 'critical' : 'high',
        confidence: 85,
        spatialResolution: 1000,
        temporalPattern: 'Episodic with wind patterns',
        predictedDuration: 24,
        riskScore: satelliteData.aerosolOpticalDepth * 200,
        affectedRadius: 2000
      });
    }

    return anomalies.sort((a, b) => b.riskScore - a.riskScore);
  }
}
