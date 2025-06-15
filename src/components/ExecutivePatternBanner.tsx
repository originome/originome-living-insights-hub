
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface ExecutivePatternBannerProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
}

export const ExecutivePatternBanner: React.FC<ExecutivePatternBannerProps> = ({
  environmentalParams,
  externalData,
  cosmicData
}) => {
  const getExecutivePattern = () => {
    // High-impact business pattern detection
    if (cosmicData?.seasonal?.pollenCount?.level === 'Very High' && cosmicData?.geomagnetic?.kpIndex > 5) {
      return {
        title: "High-Risk Productivity Alert: Environmental Storm Convergence",
        impact: "Expected 15-20% productivity decline over next 72 hours",
        costImplication: "$127,000 potential revenue impact for 500-person organization",
        actionRequired: "Implement enhanced air filtration and flexible work arrangements immediately",
        severity: 'critical',
        confidence: 92,
        prevention: "Early detection prevents 85% of typical storm-related productivity losses"
      };
    }

    if (cosmicData?.solar?.sunspotNumber > 120 && environmentalParams.pm25 > 20) {
      return {
        title: "Moderate Risk: Solar-Air Quality Compound Stress",
        impact: "8-12% afternoon productivity reduction likely",
        costImplication: "$43,000 estimated weekly impact across operations",
        actionRequired: "Optimize HVAC systems and consider afternoon meeting adjustments",
        severity: 'moderate',
        confidence: 84,
        prevention: "Proactive measures reduce impact by 60-70%"
      };
    }

    if (environmentalParams.co2 > 900) {
      return {
        title: "Cognitive Performance Alert: Elevated CO₂ Levels",
        impact: "Decision-making accuracy reduced by 12-15%",
        costImplication: "$28,500 weekly cost of impaired cognitive function",
        actionRequired: "Increase ventilation rates immediately to restore peak performance",
        severity: 'moderate',
        confidence: 89,
        prevention: "Automated monitoring prevents 90% of CO₂-related performance issues"
      };
    }

    return {
      title: "Optimal Conditions: Peak Performance Window",
      impact: "All environmental factors support maximum productivity",
      costImplication: "Ideal conditions worth $89,000 weekly productivity premium",
      actionRequired: "Leverage optimal window for critical decisions and strategic initiatives",
      severity: 'optimal',
      confidence: 96,
      prevention: "Maintaining optimal conditions sustains 18-23% above-baseline performance"
    };
  };

  const pattern = getExecutivePattern();

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-red-500 border-l-8',
          bg: 'bg-gradient-to-r from-red-50 to-red-100',
          icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
          badge: 'bg-red-600 text-white'
        };
      case 'moderate':
        return {
          border: 'border-orange-500 border-l-8',
          bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
          icon: <Zap className="h-8 w-8 text-orange-600" />,
          badge: 'bg-orange-600 text-white'
        };
      case 'optimal':
        return {
          border: 'border-green-500 border-l-8',
          bg: 'bg-gradient-to-r from-green-50 to-green-100',
          icon: <TrendingUp className="h-8 w-8 text-green-600" />,
          badge: 'bg-green-600 text-white'
        };
      default:
        return {
          border: 'border-blue-500 border-l-8',
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
          icon: <Brain className="h-8 w-8 text-blue-600" />,
          badge: 'bg-blue-600 text-white'
        };
    }
  };

  const styles = getSeverityStyles(pattern.severity);

  return (
    <Card className={`${styles.border} ${styles.bg} shadow-xl mb-8`}>
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-md">
            {styles.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Today's Pattern Intelligence</h1>
              <Badge className={`${styles.badge} text-sm px-3 py-1`}>
                {pattern.confidence}% Confidence
              </Badge>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{pattern.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Business Impact</span>
                </div>
                <p className="text-gray-800">{pattern.impact}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Financial Impact</span>
                </div>
                <p className="text-gray-800 font-semibold">{pattern.costImplication}</p>
              </div>
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recommended Action</h3>
              <p className="text-gray-800">{pattern.actionRequired}</p>
            </div>
            
            <div className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 border-l-4 border-blue-300">
              <strong>ROI Advantage:</strong> {pattern.prevention}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
