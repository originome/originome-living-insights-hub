
import { useState, useEffect } from 'react';

interface VulnerabilityAsset {
  id: string;
  name: string;
  type: 'substation' | 'feeder_line' | 'transformer' | 'transmission_tower';
  latitude: number;
  longitude: number;
  riskScore: number;
  failureProbability: number;
  criticalFactors: string[];
  recommendedPlaybook: string;
}

interface VelocityAlert {
  id: string;
  parameter: string;
  currentValue: number;
  threshold: number;
  velocityRate: number;
  unit: string;
  severity: 'critical' | 'high' | 'moderate';
  utilityImpact: string;
  actionRequired: string;
  timeToThreshold?: string;
}

interface StormData {
  category: number;
  forwardSpeed: number;
  windSpeed: number;
  pressure: number;
  rainfall: number;
  track: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
    category: number;
    windSpeed: number;
  }>;
}

export const useHurricaneVelocityData = (location: string, assetFilter: string) => {
  const [vulnerabilityMap, setVulnerabilityMap] = useState<VulnerabilityAsset[]>([]);
  const [velocityThresholds, setVelocityThresholds] = useState<any[]>([]);
  const [stormData, setStormData] = useState<StormData>({
    category: 3,
    forwardSpeed: 12,
    windSpeed: 120,
    pressure: 955,
    rainfall: 15,
    track: []
  });
  const [criticalAlerts, setCriticalAlerts] = useState<VelocityAlert[]>([]);
  const [timeToLandfall, setTimeToLandfall] = useState('18 HOURS');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Generate mock vulnerability data
      const mockAssets: VulnerabilityAsset[] = [
        {
          id: 'SUB-001',
          name: 'Downtown Substation 7',
          type: 'substation',
          latitude: 28.0586,
          longitude: -82.4139,
          riskScore: 95,
          failureProbability: 87,
          criticalFactors: [
            'Storm surge convergence with high tide',
            'Transformer yard elevation below surge prediction',
            'Limited flood barriers installed'
          ],
          recommendedPlaybook: 'flood_protection'
        },
        {
          id: 'FEED-012',
          name: 'Feeder Line 7A-12',
          type: 'feeder_line',
          latitude: 28.0456,
          longitude: -82.4289,
          riskScore: 88,
          failureProbability: 82,
          criticalFactors: [
            'High wind gust acceleration zone',
            'Low vegetation management score (0.3)',
            'Saturated soil conditions from recent rainfall'
          ],
          recommendedPlaybook: 'crew_prestaging'
        },
        {
          id: 'TRANS-045',
          name: 'Hospital District Transformer',
          type: 'transformer',
          latitude: 28.0356,
          longitude: -82.4189,
          riskScore: 78,
          failureProbability: 73,
          criticalFactors: [
            'Pre-storm electrical load stress (95% capacity)',
            'Aged equipment (installed 2008)',
            'Critical load designation requires rerouting'
          ],
          recommendedPlaybook: 'load_rerouting'
        },
        {
          id: 'FEED-008',
          name: 'Coastal Feeder 8B',
          type: 'feeder_line',
          latitude: 28.0256,
          longitude: -82.4089,
          riskScore: 85,
          failureProbability: 79,
          criticalFactors: [
            'Salt spray corrosion acceleration',
            'Storm surge inundation predicted',
            'No underground alternative routing'
          ],
          recommendedPlaybook: 'strategic_deenergization'
        },
        {
          id: 'TRANS-067',
          name: 'Industrial Park Transformer Bank',
          type: 'transformer',
          latitude: 28.0656,
          longitude: -82.4389,
          riskScore: 65,
          failureProbability: 58,
          criticalFactors: [
            'Secondary heat stress risk post-storm',
            'Grid configuration increases cascade potential',
            'Limited monitoring capability'
          ],
          recommendedPlaybook: 'cascade_prevention'
        }
      ];

      // Filter based on assetFilter
      const filtered = assetFilter 
        ? mockAssets.filter(asset => 
            asset.name.toLowerCase().includes(assetFilter.toLowerCase()) ||
            asset.type.toLowerCase().includes(assetFilter.toLowerCase())
          )
        : mockAssets;

      setVulnerabilityMap(filtered);

      // Generate critical alerts
      const alerts: VelocityAlert[] = [
        {
          id: 'ALERT-001',
          parameter: 'Wind Gust Acceleration',
          currentValue: 45,
          threshold: 35,
          velocityRate: 8.5,
          unit: 'mph',
          severity: 'critical',
          utilityImpact: 'Wind gust acceleration exceeds asset failure threshold for non-hardened poles. Feeder segments 7A-12 through 7A-18 at immediate risk.',
          actionRequired: 'Deploy line crews to high-risk pole sections. Prioritize areas with low vegetation management scores.',
          timeToThreshold: '2.5 hours'
        },
        {
          id: 'ALERT-002',
          parameter: 'Storm Surge + Tide Convergence',
          currentValue: 3.8,
          threshold: 3.2,
          velocityRate: 0.3,
          unit: 'ft',
          severity: 'critical',
          utilityImpact: 'Inundation rate suggests imminent flooding of Substation 7. Transformer equipment below predicted surge level.',
          actionRequired: 'Initiate flood protection protocols. Deploy sandbag barriers around transformer bases immediately.',
          timeToThreshold: '45 minutes'
        },
        {
          id: 'ALERT-003',
          parameter: 'Soil Saturation Rate',
          currentValue: 78,
          threshold: 65,
          velocityRate: 12,
          unit: '%',
          severity: 'high',
          utilityImpact: 'Pole foundation stability compromised in sectors with high saturation. Increased toppling risk under wind load.',
          actionRequired: 'Focus restoration crews on saturated soil zones. Pre-stage replacement poles for rapid deployment.'
        }
      ];

      setCriticalAlerts(alerts);

      // Update storm track data
      setStormData(prev => ({
        ...prev,
        track: [
          { latitude: 26.5, longitude: -80.0, timestamp: '12:00', category: 3, windSpeed: 120 },
          { latitude: 27.0, longitude: -81.0, timestamp: '18:00', category: 3, windSpeed: 125 },
          { latitude: 27.5, longitude: -81.8, timestamp: '00:00', category: 3, windSpeed: 115 },
          { latitude: 28.0, longitude: -82.4, timestamp: '06:00', category: 3, windSpeed: 110 }
        ]
      }));

      // Update time to landfall
      const currentTime = new Date();
      const hours = 18 - Math.floor(Math.random() * 2); // Simulate decreasing time
      setTimeToLandfall(`${hours} HOURS`);

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [location, assetFilter]);

  return {
    vulnerabilityMap,
    velocityThresholds,
    stormData,
    criticalAlerts,
    timeToLandfall
  };
};
