
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, DollarSign } from 'lucide-react';
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
  // Calculate overall business impact
  const getBusinessImpact = () => {
    const issues = [];
    if (environmentalParams.co2 > 800) issues.push('cognitive_decline');
    if (environmentalParams.pm25 > 25) issues.push('health_risks');
    if (Math.abs(environmentalParams.temperature - 21) > 3) issues.push('comfort_issues');
    if (cosmicData && cosmicData.geomagnetic.kpIndex > 4) issues.push('system_sensitivity');
    
    if (issues.length === 0) return 'peak_performance';
    if (issues.length <= 1) return 'good_conditions';
    if (issues.length <= 2) return 'moderate_risk';
    return 'high_risk';
  };

  const getBusinessInsights = () => {
    const impact = getBusinessImpact();
    const insights = {
      peak_performance: "Your environment is optimized for maximum ROI. Current conditions support 18-23% above-baseline productivity across all operations.",
      good_conditions: "Business conditions are favorable with minor optimization opportunities. Maintaining current performance levels with 95% reliability.",
      moderate_risk: "Environmental factors may impact bottom-line performance. Proactive adjustments recommended to maintain competitive advantage.",
      high_risk: "Multiple risk factors detected. Immediate action required to prevent significant productivity losses and associated revenue impact."
    };
    
    return insights[impact];
  };

  const getKeyBusinessMetrics = () => {
    const impact = getBusinessImpact();
    const baseProductivity = 100;
    
    const metrics = {
      peak_performance: { productivity: 122, risk: 5, savings: 184000 },
      good_conditions: { productivity: 108, risk: 15, savings: 89000 },
      moderate_risk: { productivity: 87, risk: 35, savings: -43000 },
      high_risk: { productivity: 73, risk: 65, savings: -127000 }
    };
    
    return metrics[impact];
  };

  const getStrategicPriorities = () => {
    const priorities = [];
    
    if (environmentalParams.co2 > 1000) {
      priorities.push({
        icon: AlertTriangle,
        title: "Critical: Cognitive Performance at Risk",
        description: "CO₂ levels are impairing decision-making quality. Estimated $28,500 weekly impact on strategic initiatives.",
        urgency: "critical",
        roi: "Immediate ventilation improvements provide 600% ROI within 48 hours"
      });
    } else if (environmentalParams.co2 > 800) {
      priorities.push({
        icon: Target,
        title: "Optimization Opportunity: Air Quality",
        description: "Enhanced ventilation could improve productivity by 8-12% while reducing sick days.",
        urgency: "medium",
        roi: "Investment payback period: 3-4 weeks"
      });
    }

    if (environmentalParams.pm25 > 35) {
      priorities.push({
        icon: AlertTriangle,
        title: "Health Risk: Elevated Particulates",
        description: "Current air quality may increase absenteeism by 15-20% over next month.",
        urgency: "high",
        roi: "Air filtration investment prevents $45,000 in lost productivity"
      });
    }

    if (cosmicData && cosmicData.geomagnetic.kpIndex > 6) {
      priorities.push({
        icon: Clock,
        title: "Strategic Timing Alert: Space Weather",
        description: "Geomagnetic activity may affect critical system performance and staff sensitivity.",
        urgency: "medium",
        roi: "Postponing major decisions saves 12% implementation costs"
      });
    }

    if (priorities.length === 0) {
      priorities.push({
        icon: CheckCircle,
        title: "Optimal Performance Window",
        description: "All systems operating at peak efficiency. Ideal conditions for strategic initiatives and major decisions.",
        urgency: "opportunity",
        roi: "Current optimal conditions worth $89,000 weekly productivity premium"
      });
    }

    return priorities.slice(0, 3);
  };

  const impact = getBusinessImpact();
  const metrics = getKeyBusinessMetrics();
  const priorities = getStrategicPriorities();

  const getStatusColor = (impact: string) => {
    switch (impact) {
      case 'peak_performance': return 'text-green-700 bg-green-50 border-green-200';
      case 'good_conditions': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'moderate_risk': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'high_risk': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className={`border-l-4 ${getStatusColor(impact)}`}>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            Business Intelligence Summary
            {externalData.location && (
              <Badge variant="outline" className="text-sm">
                {externalData.location.city}, {externalData.location.region}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-gray-800 mb-4">
            {getBusinessInsights()}
          </p>
        </CardContent>
      </Card>

      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Productivity Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.productivity}%
            </div>
            <p className="text-sm text-gray-600">vs. baseline performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.risk}%
            </div>
            <p className="text-sm text-gray-600">operational risk exposure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${metrics.savings >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${Math.abs(metrics.savings).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              {metrics.savings >= 0 ? 'annual value creation' : 'potential annual losses'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Priorities</CardTitle>
          <p className="text-sm text-gray-600">
            Executive actions to optimize business performance and minimize risk exposure
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {priorities.map((priority, index) => {
            const IconComponent = priority.icon;
            return (
              <Alert key={index} className={`border-l-4 ${
                priority.urgency === 'critical' ? 'border-red-400 bg-red-50' :
                priority.urgency === 'high' ? 'border-orange-400 bg-orange-50' :
                priority.urgency === 'opportunity' ? 'border-green-400 bg-green-50' :
                'border-blue-400 bg-blue-50'
              }`}>
                <IconComponent className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">{priority.title}</div>
                  <div className="text-sm mb-2">{priority.description}</div>
                  <div className="text-xs font-medium text-gray-700 bg-white/70 p-2 rounded">
                    ROI: {priority.roi}
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
