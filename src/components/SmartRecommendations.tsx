
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lightbulb, Thermometer, Wind, Shield, TrendingUp } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';

interface SmartRecommendationsProps {
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

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  environmentalParams,
  externalData,
  buildingType,
  populationGroup
}) => {
  const recommendations = useMemo(() => {
    const recs: Array<{
      type: 'critical' | 'warning' | 'info' | 'success';
      icon: React.ElementType;
      title: string;
      description: string;
      impact: string;
      priority: number;
    }> = [];

    // CO2 recommendations
    if (environmentalParams.co2 > 1000) {
      const improvement = Math.round((environmentalParams.co2 - 600) / 40 * 15);
      recs.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'Critical CO₂ Levels',
        description: 'Immediate ventilation increase required. Current levels severely impact cognitive function.',
        impact: `Potential ${improvement}% performance improvement`,
        priority: 1
      });
    } else if (environmentalParams.co2 > 800) {
      const improvement = Math.round((environmentalParams.co2 - 600) / 40 * 15);
      recs.push({
        type: 'warning',
        icon: Wind,
        title: 'Elevated CO₂ Levels',
        description: 'Increase fresh air ventilation to improve cognitive performance and decision-making.',
        impact: `Up to ${improvement}% performance improvement`,
        priority: 2
      });
    }

    // PM2.5 recommendations with outdoor context
    const outdoorPM25 = externalData.airQuality?.pm25 || 0;
    const indoorPM25 = Math.max(environmentalParams.pm25, outdoorPM25 * 0.6);
    
    if (indoorPM25 > 35) {
      recs.push({
        type: 'critical',
        icon: Shield,
        title: 'Poor Air Quality Alert',
        description: `High particulate matter detected. ${outdoorPM25 > environmentalParams.pm25 ? 'Outdoor pollution infiltration likely.' : 'Indoor source contributing.'} Consider air filtration.`,
        impact: 'Reduces health risks and cognitive decline',
        priority: 1
      });
    } else if (indoorPM25 > 12) {
      recs.push({
        type: 'warning',
        icon: Wind,
        title: 'Air Quality Improvement Needed',
        description: `PM2.5 levels above WHO guidelines. ${outdoorPM25 > 25 ? 'High outdoor pollution - enhance filtration.' : 'Consider indoor air purification.'}`,
        impact: 'Improves respiratory health and focus',
        priority: 3
      });
    }

    // Temperature recommendations with building context
    const optimalTemp = buildingType === 'school' ? 20 : buildingType === 'healthcare' ? 21 : 21;
    const tempDiff = Math.abs(environmentalParams.temperature - optimalTemp);
    
    if (tempDiff > 3) {
      const direction = environmentalParams.temperature > optimalTemp ? 'lower' : 'higher';
      recs.push({
        type: 'warning',
        icon: Thermometer,
        title: 'Temperature Optimization Required',
        description: `Adjust temperature ${direction} toward ${optimalTemp}°C for optimal ${buildingType} performance.`,
        impact: `${Math.round(tempDiff * 2)}% productivity improvement`,
        priority: 4
      });
    }

    // Lighting recommendations
    const optimalLight = buildingType === 'office' ? 750 : buildingType === 'school' ? 800 : 500;
    if (environmentalParams.light < optimalLight * 0.7) {
      recs.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Lighting Enhancement',
        description: `Increase lighting to ${optimalLight}+ lux for optimal ${buildingType} productivity and wellbeing.`,
        impact: 'Reduces eye strain and improves alertness',
        priority: 5
      });
    }

    // Population-specific recommendations
    if (populationGroup === 'elderly' && environmentalParams.humidity < 40) {
      recs.push({
        type: 'info',
        icon: Shield,
        title: 'Humidity Adjustment for Seniors',
        description: 'Increase humidity to 45-55% to improve comfort and respiratory health for elderly occupants.',
        impact: 'Reduces respiratory irritation',
        priority: 6
      });
    }

    // Health surveillance integration
    if (externalData.healthSurveillance?.viralActivity === 'High') {
      recs.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'Enhanced Health Protocols',
        description: 'High viral activity in area. Increase ventilation rates and consider UV-C air treatment.',
        impact: 'Reduces infection transmission risk',
        priority: 1
      });
    }

    // Success message if all optimal
    if (recs.length === 0) {
      recs.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Optimal Conditions Achieved',
        description: 'All environmental parameters are within optimal ranges for maximum performance and health.',
        impact: 'Maintaining peak performance',
        priority: 10
      });
    }

    return recs.sort((a, b) => a.priority - b.priority);
  }, [environmentalParams, externalData, buildingType, populationGroup]);

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'success': return 'default';
      default: return 'default';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'success': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-600" />
          Smart Recommendations
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
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <Alert key={index} variant={getAlertVariant(rec.type)} className="border-l-4">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(rec.type)}`} />
                <div className="flex-1">
                  <AlertDescription>
                    <div className="font-medium text-sm mb-1">{rec.title}</div>
                    <div className="text-sm mb-2">{rec.description}</div>
                    <Badge variant="outline" className="text-xs">
                      {rec.impact}
                    </Badge>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
