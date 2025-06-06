
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
    // Use real outdoor air quality data if available, otherwise use indoor params
    const effectiveOutdoorPM25 = externalData.airQuality?.pm25 || 25;
    const effectiveOutdoorAQI = externalData.airQuality?.aqi || 50;
    const effectiveTemperature = externalData.weather?.temperature || environmentalParams.temperature;
    const effectiveHumidity = externalData.weather?.humidity || environmentalParams.humidity;
    
    console.log('Performance calculation inputs:', {
      location: externalData.location?.city,
      outdoorAQI: effectiveOutdoorAQI,
      outdoorPM25: effectiveOutdoorPM25,
      outdoorTemp: externalData.weather?.temperature,
      indoorCO2: environmentalParams.co2,
      buildingType,
      populationGroup
    });

    // Calculate indoor PM2.5 based on outdoor conditions and building filtration
    const buildingFilterEfficiency = {
      'office': 0.7,      // Modern office buildings with HVAC
      'school': 0.6,      // School buildings
      'healthcare': 0.8,  // Hospitals with better filtration
      'residential': 0.4, // Typical homes
      'retail': 0.5,      // Commercial spaces
      'warehouse': 0.3,   // Industrial buildings
      'hospitality': 0.6, // Hotels/restaurants
      'laboratory': 0.9   // Labs with specialized filtration
    };

    const filterEff = buildingFilterEfficiency[buildingType as keyof typeof buildingFilterEfficiency] || 0.5;
    const effectiveIndoorPM25 = Math.max(
      environmentalParams.pm25,
      effectiveOutdoorPM25 * (1 - filterEff)
    );

    // Literature-based cognitive impact calculations
    const cognitiveImpactCO2 = LiteratureService.calculateCognitiveImpact(environmentalParams.co2);
    const pm25Impact = LiteratureService.calculatePM25Impact(effectiveIndoorPM25);
    const temperatureImpact = LiteratureService.calculateTemperatureImpact(effectiveTemperature, buildingType);
    const lightingImpact = LiteratureService.calculateLightingImpact(environmentalParams.light, buildingType);

    // Total cognitive impact
    const totalCognitiveImpact = Math.abs(cognitiveImpactCO2) + Math.abs(pm25Impact.cognitive) + Math.abs(temperatureImpact) + Math.abs(lightingImpact);
    
    // Productivity impact based on multiple factors
    const productivityImpact = totalCognitiveImpact * 0.8; // Cognitive performance correlates with productivity

    // Health risk calculation with location-specific factors
    const baseHealthRisk = pm25Impact.health;
    const viralActivity = externalData.healthSurveillance?.viralActivity || 'Low';
    const viralMultiplier = { 'Low': 1, 'Medium': 1.3, 'High': 1.6 }[viralActivity];
    
    let healthRisk = 'Low';
    const healthScore = baseHealthRisk * viralMultiplier;
    
    if (healthScore > 8 || effectiveIndoorPM25 > 35 || environmentalParams.co2 > 1200) {
      healthRisk = 'High';
    } else if (healthScore > 4 || effectiveIndoorPM25 > 15 || environmentalParams.co2 > 800) {
      healthRisk = 'Moderate';
    }

    // Absenteeism calculation with seasonal and location adjustments
    const seasonalFactor = new Date().getMonth() >= 10 || new Date().getMonth() <= 2 ? 1.4 : 1.0; // Winter months
    const locationFactor = externalData.location?.region === 'California' ? 0.8 : 1.0; // Better climate
    const baseAbsenteeism = healthScore * 0.4 * seasonalFactor * locationFactor;

    // Population-specific adjustments
    const populationMultipliers = {
      elderly: { cognitive: 1.4, productivity: 1.2, health: 1.5, absenteeism: 1.3 },
      children: { cognitive: 1.2, productivity: 1.1, health: 1.3, absenteeism: 1.5 },
      vulnerable: { cognitive: 1.5, productivity: 1.3, health: 1.6, absenteeism: 1.4 },
      students: { cognitive: 1.0, productivity: 1.0, health: 0.9, absenteeism: 1.2 },
      adults: { cognitive: 1.0, productivity: 1.0, health: 1.0, absenteeism: 1.0 },
      mixed: { cognitive: 1.1, productivity: 1.05, health: 1.1, absenteeism: 1.1 }
    };

    const multiplier = populationMultipliers[populationGroup as keyof typeof populationMultipliers] || populationMultipliers.adults;

    const finalImpacts = {
      cognitive: Math.min(50, Math.round(totalCognitiveImpact * multiplier.cognitive)),
      productivity: Math.min(40, Math.round(productivityImpact * multiplier.productivity)),
      health: healthRisk,
      absenteeism: Math.min(30, Math.round(baseAbsenteeism * multiplier.absenteeism))
    };

    console.log('Performance impacts calculated:', finalImpacts);
    return finalImpacts;
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
    return value > 15 ? TrendingDown : value > 5 ? AlertTriangle : TrendingUp;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Performance Impact
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {buildingType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {populationGroup}
          </Badge>
          {externalData.location && (
            <Badge variant="outline" className="text-xs">
              {externalData.location.city}
            </Badge>
          )}
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
              <span>Outdoor AQI:</span>
              <span className="font-medium">{externalData.airQuality.aqi}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Outdoor PM2.5:</span>
              <span className="font-medium">{externalData.airQuality.pm25} μg/m³</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Viral Activity:</span>
              <span className="font-medium">{externalData.healthSurveillance?.viralActivity || 'Low'}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{externalData.location?.city || 'Unknown'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
