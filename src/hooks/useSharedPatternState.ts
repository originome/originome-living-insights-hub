
import { useState, useCallback } from 'react';

export interface UnifiedPattern {
  id: string;
  title: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'barometric_solar' | 'lunar_transformer' | 'geomagnetic_biological' | 'thermal_cascade' | 'electromagnetic_resonance';
  affectedAssets: string[];
  affectedZones: string[];
  environmentalFactors: string[];
  coordinates?: { lat: number; lng: number };
  riskWindow: string;
  countermeasures: string[];
  isActive: boolean;
}

export interface SharedPatternState {
  patterns: UnifiedPattern[];
  selectedPattern: string | null;
  selectedAsset: string | null;
  selectedZone: string | null;
  completedActions: string[];
}

const initialPatterns: UnifiedPattern[] = [
  {
    id: 'barometric_solar',
    title: 'Barometric Pressure × Solar Radiation Cascade',
    confidence: 89,
    severity: 'critical',
    type: 'barometric_solar',
    affectedAssets: ['PT-001', 'HVAC-023', 'GEN-012'],
    affectedZones: ['sector-7', 'grid-north', 'facility-core'],
    environmentalFactors: ['solar_flux', 'pressure_drop', 'humidity_oscillation'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    riskWindow: '17 hours',
    countermeasures: ['pressure_compensation', 'solar_shielding', 'backup_activation'],
    isActive: true
  },
  {
    id: 'lunar_transformer',
    title: 'Lunar Tidal Forces → Transformer Stress Pattern',
    confidence: 76,
    severity: 'high',
    type: 'lunar_transformer',
    affectedAssets: ['PT-001', 'PT-034', 'UPS-007'],
    affectedZones: ['grid-sector-7', 'transformer-yard'],
    environmentalFactors: ['tidal_variation', 'electromagnetic_flux', 'vibration_harmonics'],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    riskWindow: '5.5 hours',
    countermeasures: ['frequency_adjustment', 'vibration_dampening'],
    isActive: true
  },
  {
    id: 'geomagnetic_biological',
    title: 'Geomagnetic Field × Human Performance Coupling',
    confidence: 84,
    severity: 'high',
    type: 'geomagnetic_biological',
    affectedAssets: ['CONTROL-01', 'SECURITY-HUB'],
    affectedZones: ['control-room', 'operations-center'],
    environmentalFactors: ['kp_index', 'solar_wind', 'magnetic_declination'],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    riskWindow: '48 hours',
    countermeasures: ['biomagnetic_shielding', 'shift_rotation'],
    isActive: true
  }
];

export const useSharedPatternState = () => {
  const [state, setState] = useState<SharedPatternState>({
    patterns: initialPatterns,
    selectedPattern: null,
    selectedAsset: null,
    selectedZone: null,
    completedActions: []
  });

  const selectPattern = useCallback((patternId: string | null) => {
    setState(prev => ({ ...prev, selectedPattern: patternId }));
  }, []);

  const selectAsset = useCallback((assetId: string | null) => {
    setState(prev => ({ ...prev, selectedAsset: assetId }));
  }, []);

  const selectZone = useCallback((zoneId: string | null) => {
    setState(prev => ({ ...prev, selectedZone: zoneId }));
  }, []);

  const completeAction = useCallback((actionId: string) => {
    setState(prev => ({
      ...prev,
      completedActions: [...prev.completedActions, actionId],
      patterns: prev.patterns.map(pattern => {
        if (pattern.countermeasures.includes(actionId)) {
          return { ...pattern, confidence: Math.max(10, pattern.confidence - 15) };
        }
        return pattern;
      })
    }));
  }, []);

  const getPatternsByAsset = useCallback((assetId: string) => {
    return state.patterns.filter(pattern => pattern.affectedAssets.includes(assetId));
  }, [state.patterns]);

  const getPatternsByZone = useCallback((zoneId: string) => {
    return state.patterns.filter(pattern => pattern.affectedZones.includes(zoneId));
  }, [state.patterns]);

  return {
    ...state,
    selectPattern,
    selectAsset,
    selectZone,
    completeAction,
    getPatternsByAsset,
    getPatternsByZone
  };
};
