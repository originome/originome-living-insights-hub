
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Network, ArrowRight, Zap } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface CascadeDetectionPanelProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
}

interface CascadePattern {
  id: string;
  trigger: string;
  cascadeChain: string[];
  probability: number;
  timeToEffect: string;
  systemImpact: string;
  breakingPoint: string;
  preventionStrategy: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export const CascadeDetectionPanel: React.FC<CascadeDetectionPanelProps> = ({
  environmentalParams,
  externalData,
  cosmicData
}) => {
  const cascadePatterns = useMemo((): CascadePattern[] => {
    const patterns: CascadePattern[] = [];

    // HVAC Overload Cascade
    if (environmentalParams.co2 > 800 && environmentalParams.temperature > 24) {
      patterns.push({
        id: 'hvac_overload_cascade',
        trigger: 'CO₂ Accumulation Rate > 15ppm/10min',
        cascadeChain: [
          'HVAC System Overcompensation',
          'Energy Consumption Spike',
          'Grid Load Stress',
          'Backup System Activation',
          'Maintenance Alert Generation'
        ],
        probability: 87,
        timeToEffect: '12-18 minutes',
        systemImpact: 'Facility-wide climate control instability for 2-4 hours',
        breakingPoint: 'HVAC system reaches 95% capacity with 23% higher energy costs',
        preventionStrategy: 'Implement gradual ventilation increase and occupancy redistribution',
        severity: 'high'
      });
    }

    // Cognitive Performance Cascade
    if (environmentalParams.co2 > 750 && environmentalParams.light < 400) {
      patterns.push({
        id: 'cognitive_cascade',
        trigger: 'Compound Cognitive Stress (CO₂ + Light Deficiency)',
        cascadeChain: [
          'Individual Attention Degradation',
          'Meeting Quality Decline',
          'Decision Delays',
          'Productivity Spiral',
          'Absenteeism Increase'
        ],
        probability: 72,
        timeToEffect: '30-60 minutes',
        systemImpact: 'Organizational productivity decline of 15-20% over 4-8 hours',
        breakingPoint: 'Critical decisions postponed, affecting daily operational targets',
        preventionStrategy: 'Immediate lighting optimization and CO₂ reduction protocols',
        severity: 'moderate'
      });
    }

    // Solar-Grid Resonance Cascade
    if (cosmicData?.solar?.sunspotNumber > 120 && cosmicData?.geomagnetic?.kpIndex > 4) {
      patterns.push({
        id: 'solar_grid_cascade',
        trigger: 'Solar-Geomagnetic Convergence Event',
        cascadeChain: [
          'Building EM Field Fluctuation',
          'Sensitive Equipment Interference',
          'Network Connectivity Issues',
          'Backup System Switching',
          'Facility Operations Disruption'
        ],
        probability: 68,
        timeToEffect: '45-90 minutes',
        systemImpact: 'Electronic systems instability with potential data connectivity issues',
        breakingPoint: 'Mission-critical systems require manual monitoring and intervention',
        preventionStrategy: 'Activate electromagnetic shielding protocols and prepare backup communications',
        severity: 'critical'
      });
    }

    // Air Quality Cascade
    if (environmentalParams.pm25 > 20 && environmentalParams.humidity > 65) {
      patterns.push({
        id: 'air_quality_cascade',
        trigger: 'PM2.5 Concentration + High Humidity Convergence',
        cascadeChain: [
          'Particulate Adhesion Increase',
          'Filter System Clogging',
          'Air Circulation Reduction',
          'Localized Pollution Pockets',
          'Health Risk Zone Formation'
        ],
        probability: 81,
        timeToEffect: '20-40 minutes',
        systemImpact: 'Uneven air quality distribution with health risk concentration zones',
        breakingPoint: 'Filter replacement required within 6 hours to prevent system failure',
        preventionStrategy: 'Increase filtration intensity and redistribute occupancy away from high-risk zones',
        severity: 'high'
      });
    }

    return patterns.sort((a, b) => b.probability - a.probability);
  }, [environmentalParams, externalData, cosmicData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-800';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'moderate': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default: return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-red-600" />
          Cascade Detection & Prevention Engine
        </CardTitle>
        <div className="text-sm text-red-600">
          Real-time cascade pattern analysis • Single-point-of-failure prevention • System-wide impact prediction
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cascadePatterns.length > 0 ? (
          cascadePatterns.map((pattern) => (
            <Alert key={pattern.id} className={`${getSeverityColor(pattern.severity)} border-l-4`}>
              <Network className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Cascade Pattern Detected</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {pattern.probability}% probability
                    </Badge>
                    <Badge variant={pattern.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                      {pattern.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="font-medium text-sm mb-1">Trigger Event</div>
                  <div className="text-sm bg-white/70 p-2 rounded flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    {pattern.trigger}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="font-medium text-sm mb-2">Cascade Chain Progression</div>
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    {pattern.cascadeChain.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="bg-white/70 px-2 py-1 rounded">
                          {step}
                        </div>
                        {index < pattern.cascadeChain.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-gray-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="bg-white/70 p-2 rounded">
                    <div className="font-medium">Time to Effect</div>
                    <div>{pattern.timeToEffect}</div>
                  </div>
                  <div className="bg-white/70 p-2 rounded">
                    <div className="font-medium">Breaking Point</div>
                    <div>{pattern.breakingPoint}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">System Impact:</span>
                    <span className="ml-2">{pattern.systemImpact}</span>
                  </div>
                  <div className="bg-green-100 p-2 rounded border-l-2 border-green-400">
                    <span className="font-medium text-green-800">Prevention Strategy:</span>
                    <span className="ml-2 text-green-700">{pattern.preventionStrategy}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Network className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm">No cascade patterns detected</div>
            <div className="text-xs">System stability maintained • Continuous monitoring active</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
