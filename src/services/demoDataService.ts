
import { LocationService } from './locationService';

export interface DemoLocation {
  id: string;
  name: string;
  city: string;
  region: string;
  coordinates: { lat: number; lng: number };
  industry: string;
  description: string;
}

export interface MicroAnomaly {
  id: string;
  latitude: number;
  longitude: number;
  type: 'thermal' | 'pollution' | 'atmospheric' | 'electromagnetic';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  description: string;
  detectedAt: Date;
  radius: number;
  confidence: number;
  compoundFactors: string[];
}

export class DemoDataService {
  static getDemoLocations(): DemoLocation[] {
    return [
      {
        id: 'nyc-financial',
        name: 'Financial District, NYC',
        city: 'New York',
        region: 'NY',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        industry: 'Financial Services',
        description: 'Urban financial center with high-density office buildings'
      },
      {
        id: 'detroit-manufacturing',
        name: 'Detroit Industrial Zone',
        city: 'Detroit',
        region: 'MI',
        coordinates: { lat: 42.3314, lng: -83.0458 },
        industry: 'Manufacturing',
        description: 'Heavy industrial area with automotive manufacturing'
      },
      {
        id: 'houston-energy',
        name: 'Houston Energy Corridor',
        city: 'Houston',
        region: 'TX',
        coordinates: { lat: 29.7604, lng: -95.3698 },
        industry: 'Energy',
        description: 'Oil & gas refining and petrochemical facilities'
      },
      {
        id: 'sf-tech',
        name: 'San Francisco Tech Hub',
        city: 'San Francisco',
        region: 'CA',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        industry: 'Technology',
        description: 'High-tech office complexes and data centers'
      },
      {
        id: 'boston-healthcare',
        name: 'Boston Medical District',
        city: 'Boston',
        region: 'MA',
        coordinates: { lat: 42.3601, lng: -71.0589 },
        industry: 'Healthcare',
        description: 'Major medical centers and research facilities'
      },
      {
        id: 'fresno-agriculture',
        name: 'Central Valley Agriculture',
        city: 'Fresno',
        region: 'CA',
        coordinates: { lat: 36.7378, lng: -119.7871 },
        industry: 'Agriculture',
        description: 'Large-scale agricultural operations and food processing'
      },
      {
        id: 'la-port',
        name: 'Port of Los Angeles',
        city: 'Los Angeles',
        region: 'CA',
        coordinates: { lat: 33.7376, lng: -118.2732 },
        industry: 'Maritime/Logistics',
        description: 'Major shipping port and logistics hub'
      }
    ];
  }

  static generateIndustrySpecificAnomalies(location: DemoLocation): MicroAnomaly[] {
    const baseCoords = location.coordinates;
    const anomalies: MicroAnomaly[] = [];
    
    // Generate 6-12 anomalies around the base location
    const anomalyCount = 6 + Math.floor(Math.random() * 7);
    
    for (let i = 0; i < anomalyCount; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.02; // ~1 mile radius
      const offsetLng = (Math.random() - 0.5) * 0.02;
      
      const anomaly = this.createIndustryAnomaly(
        location.industry,
        baseCoords.lat + offsetLat,
        baseCoords.lng + offsetLng,
        i
      );
      
      anomalies.push(anomaly);
    }
    
    return anomalies;
  }

  private static createIndustryAnomaly(
    industry: string,
    lat: number,
    lng: number,
    index: number
  ): MicroAnomaly {
    const anomalyProfiles = this.getIndustryAnomalyProfiles()[industry] || this.getIndustryAnomalyProfiles()['default'];
    const profile = anomalyProfiles[Math.floor(Math.random() * anomalyProfiles.length)];
    
    return {
      id: `${industry.toLowerCase()}-anomaly-${index + 1}`,
      latitude: lat,
      longitude: lng,
      type: profile.type,
      severity: profile.severities[Math.floor(Math.random() * profile.severities.length)],
      riskScore: profile.baseRisk + Math.floor(Math.random() * 30),
      description: profile.descriptions[Math.floor(Math.random() * profile.descriptions.length)],
      detectedAt: new Date(Date.now() - Math.random() * 3600000),
      radius: profile.radius + Math.random() * 100,
      confidence: profile.confidence + Math.random() * 20,
      compoundFactors: profile.compoundFactors
    };
  }

  private static getIndustryAnomalyProfiles(): Record<string, any[]> {
    return {
      'Financial Services': [
        {
          type: 'electromagnetic',
          severities: ['low', 'moderate'],
          baseRisk: 15,
          radius: 50,
          confidence: 80,
          descriptions: [
            'High-frequency trading electromagnetic interference',
            'Data center cooling system electromagnetic signature',
            'Mobile device concentration electromagnetic field'
          ],
          compoundFactors: ['High building density', 'Electronic equipment concentration', 'Urban heat island effect']
        },
        {
          type: 'atmospheric',
          severities: ['moderate', 'high'],
          baseRisk: 25,
          radius: 75,
          confidence: 75,
          descriptions: [
            'Urban canyon air circulation disruption',
            'HVAC system atmospheric pressure variation',
            'Pedestrian density air quality impact'
          ],
          compoundFactors: ['Building wind tunnels', 'Traffic emissions', 'Construction dust']
        }
      ],
      'Manufacturing': [
        {
          type: 'pollution',
          severities: ['moderate', 'high', 'critical'],
          baseRisk: 45,
          radius: 200,
          confidence: 85,
          descriptions: [
            'Industrial emission concentration detected',
            'Particulate matter from manufacturing processes',
            'Chemical vapor release from production line'
          ],
          compoundFactors: ['Wind patterns', 'Temperature inversion', 'Production schedule intensity']
        },
        {
          type: 'thermal',
          severities: ['high', 'critical'],
          baseRisk: 40,
          radius: 150,
          confidence: 90,
          descriptions: [
            'Furnace operation thermal signature',
            'Industrial heat island effect',
            'Equipment overheating thermal anomaly'
          ],
          compoundFactors: ['Ambient temperature', 'Production load', 'Cooling system efficiency']
        }
      ],
      'Technology': [
        {
          type: 'electromagnetic',
          severities: ['moderate', 'high'],
          baseRisk: 35,
          radius: 100,
          confidence: 88,
          descriptions: [
            'Data center electromagnetic field intensity',
            '5G infrastructure interference pattern',
            'Server farm electromagnetic emission'
          ],
          compoundFactors: ['Server load', 'Wireless device density', 'Power grid fluctuations']
        },
        {
          type: 'thermal',
          severities: ['moderate', 'high'],
          baseRisk: 30,
          radius: 80,
          confidence: 82,
          descriptions: [
            'Data center cooling inefficiency',
            'Equipment cluster heat generation',
            'Battery storage thermal signature'
          ],
          compoundFactors: ['Cooling system load', 'Ambient temperature', 'Equipment utilization']
        }
      ],
      'Healthcare': [
        {
          type: 'atmospheric',
          severities: ['low', 'moderate', 'high'],
          baseRisk: 20,
          radius: 60,
          confidence: 85,
          descriptions: [
            'Medical equipment air quality impact',
            'Patient density atmospheric variation',
            'Sterilization process atmospheric signature'
          ],
          compoundFactors: ['Patient volume', 'Medical procedure intensity', 'HVAC filtration efficiency']
        },
        {
          type: 'electromagnetic',
          severities: ['low', 'moderate'],
          baseRisk: 25,
          radius: 70,
          confidence: 78,
          descriptions: [
            'Medical imaging equipment electromagnetic field',
            'Patient monitoring device interference',
            'Surgical equipment electromagnetic signature'
          ],
          compoundFactors: ['Medical equipment density', 'Shielding effectiveness', 'Device synchronization']
        }
      ],
      'default': [
        {
          type: 'atmospheric',
          severities: ['low', 'moderate'],
          baseRisk: 20,
          radius: 75,
          confidence: 75,
          descriptions: ['General atmospheric anomaly detected'],
          compoundFactors: ['Weather patterns', 'Building density', 'Traffic volume']
        }
      ]
    };
  }

  static async useCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
}
