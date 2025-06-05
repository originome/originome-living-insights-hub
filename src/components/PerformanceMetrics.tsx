
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';

interface PerformanceMetricsProps {
  environmentalParams: {
    co2: number;
    pm25: number;
    temperature: number;
    light: number;
    noise: number;
    humidity: number;
  };
  externalData: ExternalData;
  buildingType: string;
  populationGroup: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  environmentalParams,
  externalData,
  buildingType,
  populationGroup
}) => {
  const performanceImpacts = useMemo(() => {
    let cognitiveImpact = 0;
    let productivityImpact = 0;
    let healthRisk = 'Low';
    let absenteeismRisk = 0;

    // CO2 impact (based on Allen et al. studies)
    if (environmentalParams.co2 > 600) {
      cognitiveImpact += Math.min((environmentalParams.co2 - 600) / 40, 30);
    }

    // Indoor PM2.5 vs outdoor correlation
    const outdoorPM25 = externalData.airQuality?.pm25 || 0;
    const indoorPM25 = Math.max(environmentalParams.pm25, outdoorPM25 * 0.6);
    
    if (indoorPM25 > 10) {
      cognitiveImpact += (indoorPM25 - 10) * 0.6;
      absenteeismRisk += (indoorPM25 - 10) * 0.8;
    }

    // Temperature impact with building type adjustments
    const optimalTemp = buildingType === 'school' ? 20 : 21;
    const tempDiff = Math.abs(environmentalParams.temperature - optimalTemp);
    if (tempDiff > 1) {
      productivityImpact += (tempDiff - 1) * 2;
    }

    // Population group adjustments
    if (populationGroup === 'elderly') {
      cognitiveImpact *= 1.3;
      healthRisk = cognitiveImpact > 15 ? 'High' : cognitiveImpact > 8 ? 'Moderate' : 'Low';
    } else if (populationGroup === 'children') {
      cognitiveImpact *= 1.2;
      absenteeismRisk *= 1.4;
    }

    // Viral activity impact on absenteeism
    const viralMultiplier = {
      'Low': 1,
      'Medium': 1.5,
      'High': 2.2
    }[externalData.healthSurveillance?.viralActivity || 'Low'];
    
    absenteeismRisk *= viralMultiplier;

    // Determine health risk
    if (cognitiveImpact > 20 || indoorPM25 > 50 || viralMultiplier > 2) {
      healthRisk = 'High';
    } else if (cognitiveImpact > 10 || indoorPM25 > 25 || viralMultiplier > 1.3) {
      healthRisk = 'Moderate';
    }

    return {
      cognitive: Math.round(cognitiveImpact),
      productivity: Math.round(productivityImpact),
      health: healthRisk,
      absenteeism: Math.round(absenteeismRisk)
    };
  }, [environmentalParams, externalData, buildingType, populationGroup]);

  const getRiskColor = (value: number | string, type: 'percentage' | 'risk') => {
    if (type === 'risk') {
      switch (value) {
        case 'Low': return 'text-green-600';
        case 'Moderate': return 'text-yellow-600';
        case 'High': return 'text-red-600';
        default: return 'text-gray-600';
      }
    } else {
      const num = typeof value === 'number' ? value : parseInt(value as string);
      if (num <= 5) return 'text-green-600';
      if (num <= 15) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getIcon = (value: number) => {
    return value > 10 ? TrendingDown : value > 5 ? AlertTriangle : TrendingUp;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Performance Impact
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {buildingType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {populationGroup}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              {React.createElement(getIcon(performanceImpacts.cognitive), { className: "h-4 w-4" })}
              Cognitive Performance
            </span>
            <span className={`text-lg font-semibold ${getRiskColor(performanceImpacts.cognitive, 'percentage')}`}>
              -{performanceImpacts.cognitive}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              {React.createElement(getIcon(performanceImpacts.productivity), { className: "h-4 w-4" })}
              Productivity
            </span>
            <span className={`text-lg font-semibold ${getRiskColor(performanceImpacts.productivity, 'percentage')}`}>
              -{performanceImpacts.productivity}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Health Risk
            </span>
            <span className={`text-lg font-semibold ${getRiskColor(performanceImpacts.health, 'risk')}`}>
              {performanceImpacts.health}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Absenteeism Risk
            </span>
            <span className={`text-lg font-semibold ${getRiskColor(performanceImpacts.absenteeism, 'percentage')}`}>
              +{performanceImpacts.absenteeism}%
            </span>
          </div>
        </div>

        {externalData.airQuality && (
          <div className="pt-3 border-t text-xs text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Outdoor PM2.5:</span>
              <span className="font-medium">{externalData.airQuality.pm25} μg/m³</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Indoor estimate:</span>
              <span className="font-medium">
                {Math.round(Math.max(environmentalParams.pm25, externalData.airQuality.pm25 * 0.6))} μg/m³
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data source:</span>
              <span className="font-medium">{externalData.airQuality.source}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
