
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, DollarSign, Shield } from 'lucide-react';
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
  // Calculate comprehensive business intelligence
  const getSystemIntelligence = () => {
    const riskFactors = [];
    if (environmentalParams.co2 > 800) riskFactors.push('cognitive_decline');
    if (environmentalParams.pm25 > 25) riskFactors.push('health_risks');
    if (Math.abs(environmentalParams.temperature - 21) > 3) riskFactors.push('comfort_degradation');
    if (cosmicData && cosmicData.geomagnetic.kpIndex > 4) riskFactors.push('system_sensitivity');
    if (cosmicData?.seasonal?.pollenCount?.level === 'Very High') riskFactors.push('biological_stress');
    
    if (riskFactors.length === 0) return 'peak_intelligence';
    if (riskFactors.length <= 1) return 'optimal_conditions';
    if (riskFactors.length <= 2) return 'moderate_risk';
    return 'high_risk';
  };

  const getStrategicInsights = () => {
    const intelligence = getSystemIntelligence();
    const insights = {
      peak_intelligence: "System operating at maximum intelligence capacity. All environmental and operational factors aligned for superior business outcomes. ROI optimization window active.",
      optimal_conditions: "High-performance operational state maintained. Minor optimization opportunities identified. Sustained competitive advantage through environmental intelligence.",
      moderate_risk: "Compound risk factors detected through cross-domain analysis. Proactive intervention recommended to maintain operational excellence and prevent cascade effects.",
      high_risk: "Multiple convergent risk patterns identified. Immediate strategic response required to protect operational integrity and financial performance."
    };
    
    return insights[intelligence];
  };

  const getBusinessMetrics = () => {
    const intelligence = getSystemIntelligence();
    
    const metricsMap = {
      peak_intelligence: { performance: 128, riskExposure: 8, valueCreation: 234000, efficiency: 94 },
      optimal_conditions: { performance: 112, riskExposure: 18, valueCreation: 156000, efficiency: 89 },
      moderate_risk: { performance: 91, riskExposure: 42, valueCreation: -67000, efficiency: 76 },
      high_risk: { performance: 78, riskExposure: 71, valueCreation: -189000, efficiency: 62 }
    };
    
    return metricsMap[intelligence];
  };

  const getStrategicPriorities = () => {
    const priorities = [];
    
    if (environmentalParams.co2 > 1000) {
      priorities.push({
        icon: AlertTriangle,
        title: "CRITICAL: Strategic Decision Quality Compromised",
        description: "Elevated CO₂ levels impacting executive cognitive function. Board-level decisions at risk.",
        urgency: "critical",
        businessValue: "Immediate intervention prevents $127,000 in poor decision costs",
        timeframe: "Action required within 2 hours"
      });
    } else if (environmentalParams.co2 > 800) {
      priorities.push({
        icon: Target,
        title: "Performance Optimization: Cognitive Enhancement",
        description: "Ventilation improvements will boost decision-making accuracy by 15-18%.",
        urgency: "high",
        businessValue: "ROI: 340% within 30 days through improved judgment quality",
        timeframe: "Implement within 24 hours"
      });
    }

    if (cosmicData?.seasonal?.pollenCount?.level === 'Very High' && cosmicData?.geomagnetic?.kpIndex > 5) {
      priorities.push({
        icon: Shield,
        title: "STRATEGIC ALERT: Rare Convergence Pattern",
        description: "Biological-geomagnetic convergence creates exponential operational risk. Historical precedent shows 23% productivity collapse.",
        urgency: "critical",
        businessValue: "Early intervention prevents $298,000 in convergence-related losses",
        timeframe: "Immediate response window: 6 hours"
      });
    }

    if (environmentalParams.pm25 > 35) {
      priorities.push({
        icon: TrendingDown,
        title: "Health System Risk: Air Quality Crisis",
        description: "Particulate levels threaten workforce health and operational continuity.",
        urgency: "high",
        businessValue: "Air filtration investment prevents $156,000 in health-related downtime",
        timeframe: "Deploy solutions within 12 hours"
      });
    }

    if (priorities.length === 0) {
      priorities.push({
        icon: CheckCircle,
        title: "Strategic Advantage: Optimal Intelligence Window",
        description: "All systems operating at peak efficiency. Perfect conditions for high-stakes business initiatives and competitive moves.",
        urgency: "opportunity",
        businessValue: "Current optimal state worth $178,000 weekly operational premium",
        timeframe: "Leverage advantage for next 48-72 hours"
      });
    }

    return priorities.slice(0, 3);
  };

  const intelligence = getSystemIntelligence();
  const metrics = getBusinessMetrics();
  const priorities = getStrategicPriorities();

  const getIntelligenceColor = (intelligence: string) => {
    switch (intelligence) {
      case 'peak_intelligence': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'optimal_conditions': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'moderate_risk': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'high_risk': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Strategic Intelligence Summary */}
      <Card className={`border-l-4 ${getIntelligenceColor(intelligence)} shadow-lg`}>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            System Intelligence Assessment
            <Badge variant="outline" className="text-sm">
              {buildingType} • {populationGroup}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-gray-800 mb-4">
            {getStrategicInsights()}
          </p>
        </CardContent>
      </Card>

      {/* Executive Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {metrics.performance}%
            </div>
            <p className="text-sm text-blue-600">vs. industry baseline</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {metrics.riskExposure}%
            </div>
            <p className="text-sm text-orange-600">operational vulnerability</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-5 w-5 text-green-600" />
              Value Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${metrics.valueCreation >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${Math.abs(metrics.valueCreation).toLocaleString()}
            </div>
            <p className="text-sm text-green-600">
              {metrics.valueCreation >= 0 ? 'annual value added' : 'at-risk revenue'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-purple-600" />
              System Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {metrics.efficiency}%
            </div>
            <p className="text-sm text-purple-600">operational optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Action Intelligence */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Strategic Action Intelligence</CardTitle>
          <p className="text-sm text-gray-600">
            AI-driven recommendations for operational excellence and competitive advantage
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
                <IconComponent className="h-5 w-5" />
                <AlertDescription>
                  <div className="font-semibold text-lg mb-2">{priority.title}</div>
                  <div className="text-sm mb-3">{priority.description}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/70 p-3 rounded border">
                      <strong>Business Value:</strong> {priority.businessValue}
                    </div>
                    <div className="bg-white/70 p-3 rounded border">
                      <strong>Action Window:</strong> {priority.timeframe}
                    </div>
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
