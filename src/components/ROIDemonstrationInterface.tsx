
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, DollarSign, Shield, Target, Award, AlertTriangle } from 'lucide-react';
import { PatternEngineService } from '@/services/patternEngineService';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface ROIDemonstrationInterfaceProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  occupantCount?: number;
}

export const ROIDemonstrationInterface: React.FC<ROIDemonstrationInterfaceProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  occupantCount = 100
}) => {
  const roiAnalysis = useMemo(() => {
    const currentPattern = PatternEngineService.generatePatternOfTheDay(
      environmentalParams,
      cosmicData,
      externalData,
      buildingType
    );

    const patternROI = PatternEngineService.calculatePatternROI(
      currentPattern,
      buildingType,
      occupantCount
    );

    // Benchmark comparison with reactive monitoring
    const reactiveMonitoringCosts = {
      incidentResponse: 75000,
      downtime: 125000,
      healthcareClaims: 45000,
      productivity: 180000
    };

    const preventiveAdvantage = {
      incidentPrevention: reactiveMonitoringCosts.incidentResponse * 0.7,
      downtimePrevention: reactiveMonitoringCosts.downtime * 0.8,
      healthPrevention: reactiveMonitoringCosts.healthcareClaims * 0.6,
      productivityGains: reactiveMonitoringCosts.productivity * 0.4
    };

    const totalPreventiveValue = Object.values(preventiveAdvantage).reduce((sum, val) => sum + val, 0);

    // Case studies of prevented incidents
    const preventedIncidents = [
      {
        type: 'HVAC Cascade Failure',
        probability: currentPattern.severity === 'high' ? 0.23 : 0.08,
        cost: 85000,
        detectionAdvantage: '48 hours early warning vs reactive detection'
      },
      {
        type: 'Widespread Productivity Drop',
        probability: currentPattern.compoundFactors ? 0.31 : 0.12,
        cost: 65000,
        detectionAdvantage: 'Pattern prediction vs post-incident analysis'
      },
      {
        type: 'Health Incident Cluster',
        probability: currentPattern.severity === 'critical' ? 0.18 : 0.05,
        cost: 120000,
        detectionAdvantage: 'Multi-domain correlation vs single-parameter monitoring'
      }
    ];

    return {
      currentPattern,
      patternROI,
      reactiveMonitoringCosts,
      preventiveAdvantage,
      totalPreventiveValue,
      preventedIncidents
    };
  }, [environmentalParams, cosmicData, externalData, buildingType, occupantCount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'moderate': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Pattern ROI Card */}
      <Card className={`${getSeverityColor(roiAnalysis.currentPattern.severity)} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Pattern-Specific ROI Analysis
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{roiAnalysis.currentPattern.confidence}% confidence</Badge>
            <Badge variant="outline">{occupantCount} occupants</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-2">{roiAnalysis.currentPattern.title}</div>
              <div className="text-sm mb-3">{roiAnalysis.currentPattern.description}</div>
              {roiAnalysis.currentPattern.citation && (
                <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  <strong>Scientific Evidence:</strong> {roiAnalysis.currentPattern.citation}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Prevented Costs</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(roiAnalysis.patternROI.preventedCosts)}
              </div>
              <div className="text-xs text-gray-500">Based on pattern severity & impact</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-gray-600">Net Benefit</div>
              <div className="text-2xl font-bold text-indigo-600">
                {formatCurrency(roiAnalysis.patternROI.netBenefit)}
              </div>
              <div className="text-xs text-gray-500">
                Payback: {roiAnalysis.patternROI.paybackPeriod} days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Predictive vs Reactive Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Traditional Reactive Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Incident Response</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(roiAnalysis.reactiveMonitoringCosts.incidentResponse)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">System Downtime</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(roiAnalysis.reactiveMonitoringCosts.downtime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Healthcare Claims</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(roiAnalysis.reactiveMonitoringCosts.healthcareClaims)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Productivity Loss</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(roiAnalysis.reactiveMonitoringCosts.productivity)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Originome Preventive Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Incident Prevention</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(roiAnalysis.preventiveAdvantage.incidentPrevention)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Downtime Prevention</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(roiAnalysis.preventiveAdvantage.downtimePrevention)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Health Prevention</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(roiAnalysis.preventiveAdvantage.healthPrevention)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Productivity Gains</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(roiAnalysis.preventiveAdvantage.productivityGains)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Annual Advantage</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(roiAnalysis.totalPreventiveValue)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prevented Incidents Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Prevented Incident Case Studies
          </CardTitle>
          <div className="text-sm text-gray-600">
            Real-world scenarios that traditional monitoring would miss
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roiAnalysis.preventedIncidents.map((incident, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{incident.type}</h4>
                  <Badge variant="outline">
                    {(incident.probability * 100).toFixed(1)}% probability
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Potential Cost: </span>
                    <span className="font-medium">{formatCurrency(incident.cost)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Detection Advantage: </span>
                    <span className="font-medium">{incident.detectionAdvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantage Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Originome Competitive Advantage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold">Non-Obvious Pattern Detection</div>
                <div className="text-sm text-gray-600">
                  Identifies compound risks that single-parameter monitoring misses entirely
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold">Scientific Evidence Integration</div>
                <div className="text-sm text-gray-600">
                  Links peer-reviewed research directly to real-time pattern predictions
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-semibold">Predictive Intervention</div>
                <div className="text-sm text-gray-600">
                  Prevents incidents 24-72 hours before traditional systems detect issues
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
