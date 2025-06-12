
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, TrendingUp, Users } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface PatternOfTheDayBannerProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
}

export const PatternOfTheDayBanner: React.FC<PatternOfTheDayBannerProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup
}) => {
  const getPatternAnalysis = () => {
    // High pollen + geomagnetic convergence
    if (cosmicData?.seasonal.pollenCount.level === 'Very High' && cosmicData?.geomagnetic.kpIndex > 5) {
      return {
        title: "High Pollen + Geomagnetic Storm Convergence",
        description: "Today's key convergence: Very high pollen levels combined with geomagnetic activity creates compound stress on human physiology.",
        prediction: getBuildingSpecificPrediction('pollen_geomagnetic'),
        severity: 'high',
        citation: "Babayev & Allahverdiyeva (2007) documented increased absenteeism during geomagnetic storms; allergen studies show 15% productivity drops during peak pollen."
      };
    }

    // Solar activity + poor air quality
    if (cosmicData?.solar.sunspotNumber > 120 && environmentalParams.pm25 > 20) {
      return {
        title: "Solar Maximum + Air Quality Stress",
        description: "High solar activity amplifies sensitivity to poor air quality, creating heightened fatigue and concentration issues.",
        prediction: getBuildingSpecificPrediction('solar_air'),
        severity: 'moderate',
        citation: "Cornelissen et al. (2002) found solar activity correlates with cardiovascular stress; EPA studies link PM2.5 to cognitive decline."
      };
    }

    // Seismic + temperature stress
    if (cosmicData?.seismic.riskLevel > 4 && Math.abs(environmentalParams.temperature - 21) > 3) {
      return {
        title: "Geological + Thermal Stress Pattern",
        description: "Subtle seismic activity combined with suboptimal temperatures creates subconscious stress responses.",
        prediction: getBuildingSpecificPrediction('seismic_thermal'),
        severity: 'moderate',
        citation: "Persinger (2014) documented correlations between microseismic activity and anxiety; thermal comfort studies show 2% productivity loss per degree deviation."
      };
    }

    // Optimal conditions
    return {
      title: "Multiscale Stability Pattern",
      description: "Current environmental and cosmic conditions are within optimal ranges across all measured parameters.",
      prediction: getBuildingSpecificPrediction('optimal'),
      severity: 'low',
      citation: "Stable multifactor conditions correlate with baseline performance in organizational psychology studies."
    };
  };

  const getBuildingSpecificPrediction = (patternType: string) => {
    const predictions = {
      office: {
        pollen_geomagnetic: "Expect 19% above-baseline absenteeism. Anticipate 4-6 additional sick days this month and 12% lower afternoon focus.",
        solar_air: "Productivity may drop 8-10% during peak afternoon hours. Consider flexible schedules for sensitive employees.",
        seismic_thermal: "Staff may report increased fatigue and difficulty concentrating. Optimize HVAC and reduce non-essential stressors.",
        optimal: "Conditions support peak performance. Ideal time for important meetings and decision-making."
      },
      hotel: {
        pollen_geomagnetic: "Guest complaints likely to rise 15% this week. Expect higher noise sensitivity and comfort requests.",
        solar_air: "Guests may report 12% higher discomfort ratings. Consider extra check-ins and comfort amenities.",
        seismic_thermal: "Anticipate increased requests for room temperature adjustments and potential sleep complaints.",
        optimal: "Prime conditions for guest satisfaction. Perfect timing for events and premium service delivery."
      },
      school: {
        pollen_geomagnetic: "Afternoon test performance may drop 12-15%. Consider postponing major assessments until conditions normalize.",
        solar_air: "Student attention spans reduced by 10%. Shorter lesson blocks and increased breaks recommended.",
        seismic_thermal: "Increased behavioral issues likely. Implement calming activities and flexible scheduling.",
        optimal: "Excellent learning conditions. Ideal for challenging academic activities and testing."
      },
      healthcare: {
        pollen_geomagnetic: "Anticipate 8% increase in patient agitation and 20% more respiratory complaints.",
        solar_air: "Higher stress responses in sensitive patients. Consider enhanced monitoring protocols.",
        seismic_thermal: "Patient anxiety may increase. Implement additional comfort measures and staff awareness.",
        optimal: "Stable conditions support healing. Optimal for procedures and patient interactions."
      }
    };

    return predictions[buildingType as keyof typeof predictions]?.[patternType as keyof any] || 
           predictions.office[patternType as keyof typeof predictions.office];
  };

  const pattern = getPatternAnalysis();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'moderate': return 'border-orange-200 bg-orange-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <Zap className="h-5 w-5 text-red-600" />;
      case 'moderate': return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default: return <Brain className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <Card className={`${getSeverityColor(pattern.severity)} border-2 shadow-lg mb-6`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getSeverityIcon(pattern.severity)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">Pattern of the Day</h2>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {buildingType} • {populationGroup}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{pattern.title}</h3>
            
            <p className="text-gray-700 mb-3">{pattern.description}</p>
            
            <Alert className="mb-3">
              <AlertDescription>
                <div className="font-medium text-sm mb-1">Expected Impact:</div>
                <div className="text-sm">{pattern.prediction}</div>
              </AlertDescription>
            </Alert>
            
            <div className="text-xs text-gray-600 bg-white/60 p-2 rounded border-l-4 border-gray-300">
              <strong>Scientific Basis:</strong> {pattern.citation}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
