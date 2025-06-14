
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface ExecutiveDashboardProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup
}) => {
  // Calculate overall status
  const getOverallStatus = () => {
    const issues = [];
    if (environmentalParams.co2 > 800) issues.push('air_quality');
    if (environmentalParams.pm25 > 25) issues.push('pollution');
    if (Math.abs(environmentalParams.temperature - 21) > 3) issues.push('temperature');
    if (cosmicData && cosmicData.geomagnetic.kpIndex > 4) issues.push('space_weather');
    
    if (issues.length === 0) return 'excellent';
    if (issues.length <= 1) return 'good';
    if (issues.length <= 2) return 'caution';
    return 'attention';
  };

  const getBuildingSpecificInsights = () => {
    const status = getOverallStatus();
    const baseInsights = {
      office: {
        excellent: "Your office environment is optimized for peak productivity. Employees should experience clear thinking and high energy levels today.",
        good: "Office conditions are generally favorable. Minor adjustments may help maintain optimal performance throughout the day.",
        caution: "Environmental factors may impact concentration and decision-making. Consider adjusting ventilation or temperature controls.",
        attention: "Multiple environmental stressors detected. Take action to prevent productivity loss and employee discomfort."
      },
      school: {
        excellent: "Learning conditions are ideal. Students should experience enhanced focus and cognitive performance today.",
        good: "Educational environment is supportive for learning. Monitor for any changes that could affect student attention.",
        caution: "Environmental factors may reduce student concentration. Consider classroom adjustments to maintain learning effectiveness.",
        attention: "Conditions may significantly impact learning outcomes. Immediate environmental improvements recommended."
      },
      healthcare: {
        excellent: "Patient care environment is optimal. Healing conditions are favorable with minimal environmental stress.",
        good: "Healthcare facility conditions support patient wellness. Continue monitoring for any emerging concerns.",
        caution: "Environmental factors may affect patient comfort and recovery. Consider facility adjustments.",
        attention: "Multiple factors could impact patient outcomes. Priority should be given to environmental improvements."
      }
    };

    return baseInsights[buildingType as keyof typeof baseInsights]?.[status] || 
           "Environmental conditions require attention to maintain optimal facility performance.";
  };

  const getTopPriorities = () => {
    const priorities = [];
    
    if (environmentalParams.co2 > 1000) {
      priorities.push({
        icon: AlertTriangle,
        title: "Urgent: Improve Air Circulation",
        description: "CO₂ levels are critically high. Increase ventilation immediately to restore cognitive performance.",
        urgency: "high"
      });
    } else if (environmentalParams.co2 > 800) {
      priorities.push({
        icon: Clock,
        title: "Monitor Air Quality",
        description: "CO₂ levels are elevated. Plan to increase fresh air intake during peak occupancy.",
        urgency: "medium"
      });
    }

    if (environmentalParams.pm25 > 35) {
      priorities.push({
        icon: AlertTriangle,
        title: "Air Filtration Action Needed",
        description: "Particulate levels are high. Activate air purifiers and limit outdoor air intake.",
        urgency: "high"
      });
    }

    if (Math.abs(environmentalParams.temperature - 21) > 4) {
      priorities.push({
        icon: Target,
        title: "Adjust Temperature Settings",
        description: `Temperature is ${environmentalParams.temperature > 21 ? 'too warm' : 'too cool'}. Optimize HVAC for comfort and efficiency.`,
        urgency: "medium"
      });
    }

    if (cosmicData && cosmicData.geomagnetic.kpIndex > 6) {
      priorities.push({
        icon: AlertTriangle,
        title: "Space Weather Alert",
        description: "Geomagnetic activity may affect sensitive equipment and circadian rhythms. Monitor systems closely.",
        urgency: "medium"
      });
    }

    if (priorities.length === 0) {
      priorities.push({
        icon: CheckCircle,
        title: "All Systems Optimal",
        description: "Environmental conditions are excellent. Continue current practices.",
        urgency: "low"
      });
    }

    return priorities.slice(0, 3); // Show top 3 priorities
  };

  const getProductivityForecast = () => {
    const status = getOverallStatus();
    const forecasts = {
      excellent: { level: 95, trend: 'stable', description: 'Peak performance expected' },
      good: { level: 88, trend: 'stable', description: 'Good productivity conditions' },
      caution: { level: 75, trend: 'declining', description: 'Productivity may be impacted' },
      attention: { level: 62, trend: 'declining', description: 'Significant performance risks' }
    };
    
    return forecasts[status];
  };

  const status = getOverallStatus();
  const priorities = getTopPriorities();
  const forecast = getProductivityForecast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700 bg-green-50 border-green-200';
      case 'good': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'caution': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'attention': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className={`border-l-4 ${getStatusColor(status)}`}>
        <CardHeader>
          <CardTitle className="text-xl">
            Today's Environmental Intelligence Summary
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="outline" className="capitalize">{buildingType}</Badge>
            <Badge variant="outline" className="capitalize">{populationGroup}</Badge>
            {externalData.location && (
              <span>{externalData.location.city}, {externalData.location.region}</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-gray-800">
            {getBuildingSpecificInsights()}
          </p>
        </CardContent>
      </Card>

      {/* Productivity Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {forecast.trend === 'stable' ? 
                <TrendingUp className="h-5 w-5 text-green-600" /> : 
                <TrendingDown className="h-5 w-5 text-orange-600" />
              }
              Performance Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {forecast.level}%
            </div>
            <p className="text-gray-600">{forecast.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2 capitalize">
              {status}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  status === 'excellent' ? 'bg-green-500' :
                  status === 'good' ? 'bg-blue-500' :
                  status === 'caution' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${forecast.level}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Actions for Today</CardTitle>
          <p className="text-sm text-gray-600">
            Key steps to optimize your environment and maintain peak performance
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {priorities.map((priority, index) => {
            const IconComponent = priority.icon;
            return (
              <Alert key={index} className={`border-l-4 ${
                priority.urgency === 'high' ? 'border-red-400 bg-red-50' :
                priority.urgency === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                'border-green-400 bg-green-50'
              }`}>
                <IconComponent className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">{priority.title}</div>
                  <div className="text-sm">{priority.description}</div>
                </AlertDescription>
              </Alert>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
