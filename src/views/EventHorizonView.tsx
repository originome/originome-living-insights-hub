
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';
import { PatternRecognitionEngine } from '@/components/PatternRecognitionEngine';
import { DerivativeAlerts } from '@/components/DerivativeAlerts';
import { PileUpPatternAlert } from '@/components/PileUpPatternAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Brain, Activity } from 'lucide-react';
import { generateFirstDerivativeAlerts } from '@/utils/accelerationAnalysis';
import { useRateOfChangeData } from '@/hooks/useRateOfChangeData';

const EventHorizonView: React.FC<SharedViewProps> = ({
  location,
  buildingType,
  populationGroup,
  environmentalParams,
  externalData,
  cosmicData,
  isLoading,
  isCosmicLoading,
  systemIntelligence,
  onParamChange,
  onRefresh
}) => {
  const { historicalData } = useRateOfChangeData(environmentalParams, externalData);
  
  // Generate mock pile-up patterns for demonstration
  const pileUpPatterns = [
    {
      id: 'geomag_pollen_co2',
      factors: ['Geomagnetic Storm', 'High Pollen', 'CO₂ Spike'],
      rareOccurrence: true,
      historicalFrequency: 0.023,
      exponentialMultiplier: 3.4,
      criticalThreshold: 85
    }
  ].filter(pattern => 
    cosmicData?.geomagnetic?.kpIndex > 4 && 
    environmentalParams.co2 > 800 &&
    cosmicData?.seasonal?.pollenCount?.level !== 'Low'
  );

  // Generate first derivative alerts
  const accelerationPatterns = [
    {
      parameter: 'CO₂',
      velocity: 12.5,
      acceleration: 3.2,
      jerk: 0.8,
      suddenChange: true,
      riskLevel: 'high' as const,
      alertType: 'acceleration' as const
    }
  ];
  
  const firstDerivativeAlerts = generateFirstDerivativeAlerts(accelerationPatterns);

  return (
    <div className="space-y-6">
      {/* Event Horizon Header */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Event Horizon Risk Detection
            <Badge variant="destructive" className="text-xs">
              {systemIntelligence.activeFactors} ACTIVE RISKS
            </Badge>
          </CardTitle>
          <div className="text-sm text-red-600">
            Real-time environmental risk detection for {location} - {buildingType}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 p-4 rounded border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">Risk Level</span>
              </div>
              <p className="text-2xl font-bold text-red-600 uppercase">{systemIntelligence.riskLevel}</p>
            </div>
            <div className="bg-white/60 p-4 rounded border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">Active Factors</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{systemIntelligence.activeFactors}</p>
            </div>
            <div className="bg-white/60 p-4 rounded border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">Confidence</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{systemIntelligence.confidence}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pile-Up Pattern Alerts */}
      {pileUpPatterns.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Rare Pattern Cascade Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pileUpPatterns.map((pattern) => (
              <PileUpPatternAlert key={pattern.id} pattern={pattern} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* First Derivative Alerts */}
      <DerivativeAlerts firstDerivativeAlerts={firstDerivativeAlerts} />

      {/* Advanced Pattern Recognition Engine */}
      <PatternRecognitionEngine
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />
    </div>
  );
};

export default EventHorizonView;
