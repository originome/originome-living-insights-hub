import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { LiteratureService } from '@/services/literatureService';

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
    // Use real literature-based calculations
    const cognitiveImpactCO2 = LiteratureService.calculateCognitiveImpact(environmentalParams.co2);
    const pm25Impact = LiteratureService.calculatePM25Impact(environmentalParams.pm25);
    const temperatureImpact = LiteratureService.calculateTemperatureImpact(environmentalParams.temperature, buildingType);
    const lightingImpact = LiteratureService.calculateLightingImpact(environmentalParams.light, buildingType);

    // Combine cognitive impacts (literature-based)
    const totalCognitiveImpact = cognitiveImpactCO2 + pm25Impact.cognitive;
    
    // Productivity impact (Seppänen & Fisk study + lighting effects)
    const productivityImpact = temperatureImpact + lightingImpact;

    // Health risk calculation based on PM2.5 and external conditions
    const outdoorPM25 = externalData.airQuality?.pm25 || 0;
    const effectivePM25 = Math.max(environmentalParams.pm25, outdoorPM25 * 0.6);
    
    let healthRisk = 'Low';
    if (effectivePM25 > 35 || environmentalParams.co2 > 1000) {
      healthRisk = 'High';
    } else if (effectivePM25 > 15 || environmentalParams.co2 > 800) {
      healthRisk = 'Moderate';
    }

    // Absenteeism calculation (Zhang et al. study + viral activity)
    const baseAbsenteeism = pm25Impact.health * 0.3; // Convert mortality risk to absenteeism
    const viralMultiplier = {
      'Low': 1,
      'Medium': 1.5,
      'High': 2.2
    }[externalData.healthSurveillance?.viralActivity || 'Low'];
    
    const absenteeismRisk = baseAbsenteeism * viralMultiplier;

    // Population-specific adjustments based on literature
    const populationMultipliers = {
      elderly: { cognitive: 1.3, health: 1.4, absenteeism: 1.2 },
      children: { cognitive: 1.1, health: 1.2, absenteeism: 1.4 },
      vulnerable: { cognitive: 1.4, health: 1.6, absenteeism: 1.5 },
      students: { cognitive: 1.0, health: 0.9, absenteeism: 1.1 },
      adults: { cognitive: 1.0, health: 1.0, absenteeism: 1.0 }
    };

    const multiplier = populationMultipliers[populationGroup as keyof typeof populationMultipliers] || populationMultipliers.adults;

    return {
      cognitive: Math.round(Math.abs(totalCognitiveImpact) * multiplier.cognitive),
      productivity: Math.round(Math.abs(productivityImpact) * multiplier.cognitive),
      health: healthRisk,
      absenteeism: Math.round(Math.abs(absenteeismRisk) * multiplier.absenteeism)
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
