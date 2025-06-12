
export interface GeomagneticData {
  kpIndex: number;
  apIndex: number;
  activity: 'Quiet' | 'Unsettled' | 'Active' | 'Storm' | 'Severe Storm';
  riskLevel: number; // 1-10 scale
  impact: string;
  timestamp: Date;
}

export interface SolarData {
  sunspotNumber: number;
  solarWindSpeed: number; // km/s
  flareActivity: 'Quiet' | 'Minor' | 'Moderate' | 'Strong' | 'Extreme';
  riskLevel: number;
  impact: string;
  timestamp: Date;
}

export interface SeasonalData {
  daylength: number; // hours
  lunarPhase: string;
  lunarIllumination: number; // 0-100%
  pollenCount: {
    tree: number;
    grass: number;
    weed: number;
    total: number;
    level: 'Low' | 'Moderate' | 'High' | 'Very High';
  };
  meteorologicalAnomalies: string[];
  timestamp: Date;
}

export interface SeismicData {
  recentActivity: number; // earthquakes in last 24h within 500km
  maxMagnitude: number;
  riskLevel: number;
  impact: string;
  timestamp: Date;
}

export class CosmicDataService {
  // Geomagnetic Activity (NOAA Space Weather Prediction Center)
  static async fetchGeomagneticData(): Promise<GeomagneticData> {
    try {
      // In production, this would fetch from NOAA SWPC API
      // For demo, using realistic simulated data
      const kp = Math.random() * 9;
      const ap = Math.pow(2, kp - 1) * 3.33; // Approximate relationship
      
      let activity: GeomagneticData['activity'] = 'Quiet';
      let riskLevel = 1;
      let impact = 'Minimal impact on human performance and equipment';
      
      if (kp >= 5) {
        activity = 'Storm';
        riskLevel = 7;
        impact = 'Increased absenteeism (8-12%), equipment failures, and cognitive stress';
      } else if (kp >= 4) {
        activity = 'Active';
        riskLevel = 5;
        impact = 'Moderate increase in headaches and sleep disturbances';
      } else if (kp >= 3) {
        activity = 'Unsettled';
        riskLevel = 3;
        impact = 'Slight increase in fatigue and irritability';
      }

      return {
        kpIndex: Math.round(kp * 10) / 10,
        apIndex: Math.round(ap),
        activity,
        riskLevel,
        impact,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch geomagnetic data:', error);
      return this.getDefaultGeomagneticData();
    }
  }

  // Solar Activity
  static async fetchSolarData(): Promise<SolarData> {
    try {
      const sunspots = Math.floor(Math.random() * 200);
      const solarWind = 300 + Math.random() * 400; // 300-700 km/s typical range
      
      let flareActivity: SolarData['flareActivity'] = 'Quiet';
      let riskLevel = 1;
      let impact = 'Normal solar conditions, minimal biological impact';
      
      if (sunspots > 150) {
        flareActivity = 'Strong';
        riskLevel = 8;
        impact = 'High solar activity linked to disrupted circadian rhythms and increased cardiovascular stress';
      } else if (sunspots > 100) {
        flareActivity = 'Moderate';
        riskLevel = 5;
        impact = 'Moderate solar activity may affect sensitive individuals';
      } else if (sunspots > 50) {
        flareActivity = 'Minor';
        riskLevel = 3;
        impact = 'Slight increase in electromagnetic sensitivity symptoms';
      }

      return {
        sunspotNumber: sunspots,
        solarWindSpeed: Math.round(solarWind),
        flareActivity,
        riskLevel,
        impact,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch solar data:', error);
      return this.getDefaultSolarData();
    }
  }

  // Seasonal and Biological Proxies
  static async fetchSeasonalData(latitude: number = 40.7128): Promise<SeasonalData> {
    try {
      const now = new Date();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate daylength based on latitude and day of year
      const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
      const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
      const daylength = (2 * hourAngle * 12) / Math.PI;
      
      // Lunar phase calculation (simplified)
      const lunarCycle = 29.53;
      const daysSinceNewMoon = (now.getTime() / (1000 * 60 * 60 * 24)) % lunarCycle;
      const lunarIllumination = Math.round(50 * (1 + Math.cos(2 * Math.PI * daysSinceNewMoon / lunarCycle)));
      
      let lunarPhase = 'New Moon';
      if (daysSinceNewMoon < 7.4) lunarPhase = 'Waxing Crescent';
      else if (daysSinceNewMoon < 14.8) lunarPhase = 'First Quarter';
      else if (daysSinceNewMoon < 22.1) lunarPhase = 'Waxing Gibbous';
      else if (daysSinceNewMoon < 29.5) lunarPhase = 'Full Moon';
      
      // Seasonal pollen simulation
      const pollenBase = Math.max(0, 50 * Math.sin(2 * Math.PI * (dayOfYear - 60) / 365));
      const pollenNoise = Math.random() * 0.3 + 0.85;
      
      const treeTotal = Math.round(pollenBase * 1.2 * pollenNoise);
      const grassTotal = Math.round(pollenBase * 0.8 * pollenNoise);
      const weedTotal = Math.round(pollenBase * 0.6 * pollenNoise);
      const totalPollen = treeTotal + grassTotal + weedTotal;
      
      let pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
      if (totalPollen > 120) pollenLevel = 'Very High';
      else if (totalPollen > 80) pollenLevel = 'High';
      else if (totalPollen > 40) pollenLevel = 'Moderate';

      return {
        daylength: Math.round(daylength * 10) / 10,
        lunarPhase,
        lunarIllumination,
        pollenCount: {
          tree: treeTotal,
          grass: grassTotal,
          weed: weedTotal,
          total: totalPollen,
          level: pollenLevel
        },
        meteorologicalAnomalies: this.generateMeteorologicalAnomalies(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch seasonal data:', error);
      return this.getDefaultSeasonalData();
    }
  }

  // Seismic Activity
  static async fetchSeismicData(latitude: number = 40.7128, longitude: number = -74.0060): Promise<SeismicData> {
    try {
      // Simulate seismic data based on location
      const recentActivity = Math.floor(Math.random() * 5);
      const maxMagnitude = 2 + Math.random() * 3; // 2.0-5.0 range
      
      let riskLevel = 1;
      let impact = 'Minimal seismic activity, no performance impact expected';
      
      if (maxMagnitude > 4.5) {
        riskLevel = 6;
        impact = 'Significant seismic activity may cause subconscious stress and sleep disruption';
      } else if (maxMagnitude > 3.5) {
        riskLevel = 3;
        impact = 'Moderate seismic activity may affect sensitive individuals';
      }

      return {
        recentActivity,
        maxMagnitude: Math.round(maxMagnitude * 10) / 10,
        riskLevel,
        impact,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch seismic data:', error);
      return this.getDefaultSeismicData();
    }
  }

  private static generateMeteorologicalAnomalies(): string[] {
    const anomalies = [
      'Heat dome over region (+8°C above normal)',
      'Polar vortex displacement (-12°C below normal)',
      'Atmospheric river event (300% normal precipitation)',
      'Prolonged high pressure system (14 days)',
      'Jet stream anomaly causing temperature swings'
    ];
    
    if (Math.random() > 0.7) {
      return [anomalies[Math.floor(Math.random() * anomalies.length)]];
    }
    return [];
  }

  private static getDefaultGeomagneticData(): GeomagneticData {
    return {
      kpIndex: 2.0,
      apIndex: 7,
      activity: 'Quiet',
      riskLevel: 1,
      impact: 'Minimal impact on human performance and equipment',
      timestamp: new Date()
    };
  }

  private static getDefaultSolarData(): SolarData {
    return {
      sunspotNumber: 75,
      solarWindSpeed: 350,
      flareActivity: 'Quiet',
      riskLevel: 2,
      impact: 'Normal solar conditions, minimal biological impact',
      timestamp: new Date()
    };
  }

  private static getDefaultSeasonalData(): SeasonalData {
    return {
      daylength: 12.0,
      lunarPhase: 'First Quarter',
      lunarIllumination: 50,
      pollenCount: {
        tree: 20,
        grass: 15,
        weed: 10,
        total: 45,
        level: 'Moderate'
      },
      meteorologicalAnomalies: [],
      timestamp: new Date()
    };
  }

  private static getDefaultSeismicData(): SeismicData {
    return {
      recentActivity: 1,
      maxMagnitude: 2.3,
      riskLevel: 1,
      impact: 'Minimal seismic activity, no performance impact expected',
      timestamp: new Date()
    };
  }
}
