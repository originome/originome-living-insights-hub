
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useRateOfChangeData } from '@/hooks/useRateOfChangeData';
import { analyzeAccelerationPatterns, generateFirstDerivativeAlerts } from '@/utils/accelerationAnalysis';
import { DerivativeVisualization } from '@/components/DerivativeVisualization';
import { AccelerationPatternCards } from '@/components/AccelerationPatternCards';
import { DerivativeAlerts } from '@/components/DerivativeAlerts';

interface RateOfChangeAnalyticsProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
}

export const RateOfChangeAnalytics: React.FC<RateOfChangeAnalyticsProps> = ({
  environmentalParams,
  externalData
}) => {
  const { historicalData, streamingActive, processingRate } = useRateOfChangeData(
    environmentalParams,
    externalData
  );

  const accelerationPatterns = useMemo(() => 
    analyzeAccelerationPatterns(historicalData), 
    [historicalData]
  );

  const firstDerivativeAlerts = useMemo(() => 
    generateFirstDerivativeAlerts(accelerationPatterns), 
    [accelerationPatterns]
  );

  return (
    <div className="space-y-6">
      {/* Real-time Processing Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-600" />
            Real-Time Derivative Analytics Engine
            <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
              {streamingActive ? "STREAMING" : "PAUSED"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-cyan-600">
            First-derivative risk detection processing {processingRate} data points • 2-second intervals
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-cyan-700">
            Immediate response architecture: Velocity → Acceleration → Jerk analysis in real-time
          </div>
        </CardContent>
      </Card>

      {/* First-Derivative Alerts */}
      <DerivativeAlerts firstDerivativeAlerts={firstDerivativeAlerts} />

      {/* Acceleration Pattern Dashboard */}
      <AccelerationPatternCards accelerationPatterns={accelerationPatterns} />

      {/* Real-time Derivative Visualization */}
      <DerivativeVisualization historicalData={historicalData} />

      {/* Processing Status */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-700">
              <strong>Derivative Engine Status:</strong> Processing {accelerationPatterns.length} acceleration patterns • 
              {firstDerivativeAlerts.length} active alerts
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            High-frequency analysis: 2-second intervals • Next derivative calculation: ~2 seconds
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
