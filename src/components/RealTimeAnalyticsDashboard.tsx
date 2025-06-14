
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertCircle, TrendingUp, TrendingDown, Target, Zap, CheckCircle } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface RealTimeAnalyticsDashboardProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
}

interface StatusIndicator {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'caution' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  impact: string;
}

interface DiagnosisItem {
  id: string;
  issue: string;
  likelihood: number;
  source: string;
  quickFix: string;
  severity: 'low' | 'medium' | 'high';
}

export const RealTimeAnalyticsDashboard: React.FC<RealTimeAnalyticsDashboardProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [overallRisk, setOverallRisk] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'optimal' | 'caution' | 'warning' | 'critical'>('optimal');

  const statusIndicators: StatusIndicator[] = [
    {
      id: 'air_quality',
      name: 'Air Quality Index',
      value: environmentalParams.pm25,
      status: environmentalParams.pm25 > 35 ? 'critical' : environmentalParams.pm25 > 25 ? 'warning' : environmentalParams.pm25 > 15 ? 'caution' : 'optimal',
      trend: 'stable',
      impact: 'Respiratory health, cognitive performance'
    },
    {
      id: 'cognitive_load',
      name: 'Cognitive Load Factor',
      value: Math.min(100, (environmentalParams.co2 - 400) / 10),
      status: environmentalParams.co2 > 1000 ? 'critical' : environmentalParams.co2 > 800 ? 'warning' : 'optimal',
      trend: environmentalParams.co2 > 900 ? 'up' : 'stable',
      impact: 'Decision making, concentration, productivity'
    },
    {
      id: 'thermal_comfort',
      name: 'Thermal Comfort',
      value: Math.max(0, 100 - (Math.abs(environmentalParams.temperature - 21) * 10)),
      status: Math.abs(environmentalParams.temperature - 21) > 4 ? 'warning' : Math.abs(environmentalParams.temperature - 21) > 2 ? 'caution' : 'optimal',
      trend: 'stable',
      impact: 'Comfort, satisfaction, task performance'
    },
    {
      id: 'space_weather',
      name: 'Space Weather Impact',
      value: cosmicData ? cosmicData.geomagnetic.kpIndex * 10 : 0,
      status: cosmicData && cosmicData.geomagnetic.kpIndex > 6 ? 'critical' : cosmicData && cosmicData.geomagnetic.kpIndex > 4 ? 'warning' : 'optimal',
      trend: 'stable',
      impact: 'Circadian rhythms, stress response, technology'
    }
  ];

  const diagnosisItems: DiagnosisItem[] = [
    {
      id: 'hvac_strain',
      issue: 'HVAC system operating at elevated load',
      likelihood: Math.abs(environmentalParams.temperature - 21) > 3 ? 85 : 30,
      source: 'Temperature deviation + external weather conditions',
      quickFix: 'Adjust thermostat settings, check air filters',
      severity: 'medium'
    },
    {
      id: 'ventilation_inadequate',
      issue: 'Ventilation may be inadequate for current occupancy',
      likelihood: environmentalParams.co2 > 800 ? 78 : 25,
      source: 'Elevated CO₂ levels during business hours',
      quickFix: 'Increase fresh air intake, check ventilation systems',
      severity: environmentalParams.co2 > 1000 ? 'high' : 'medium'
    },
    {
      id: 'air_quality_external',
      issue: 'External air quality impacting indoor environment',
      likelihood: environmentalParams.pm25 > 20 ? 72 : 20,
      source: 'PM2.5 levels above recommended thresholds',
      quickFix: 'Activate air purification, close external vents temporarily',
      severity: environmentalParams.pm25 > 35 ? 'high' : 'medium'
    }
  ];

  useEffect(() => {
    // Calculate overall risk score
    const riskFactors = [
      environmentalParams.co2 > 800 ? 25 : 0,
      environmentalParams.pm25 > 20 ? 20 : 0,
      Math.abs(environmentalParams.temperature - 21) > 3 ? 15 : 0,
      cosmicData && cosmicData.geomagnetic.kpIndex > 4 ? 20 : 0,
      environmentalParams.humidity > 60 || environmentalParams.humidity < 30 ? 10 : 0
    ];

    const totalRisk = riskFactors.reduce((sum, risk) => sum + risk, 0);
    setOverallRisk(totalRisk);

    if (totalRisk > 60) setSystemStatus('critical');
    else if (totalRisk > 40) setSystemStatus('warning');
    else if (totalRisk > 20) setSystemStatus('caution');
    else setSystemStatus('optimal');
  }, [environmentalParams, cosmicData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'warning': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'caution': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'caution': return AlertCircle;
      default: return CheckCircle;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const StatusIcon = getStatusIcon(systemStatus);

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <Card className={`border-l-4 ${getStatusColor(systemStatus)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <StatusIcon className="h-6 w-6" />
            System Status: {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
            <Badge variant="outline" className="text-xs">
              Risk Score: {overallRisk}
            </Badge>
          </CardTitle>
          <div className="text-sm opacity-80">
            Real-time environmental intelligence • Predictive diagnostics active
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-sm font-medium">Overall Risk Level</div>
          <Progress value={overallRisk} className="h-3 mb-2" />
          <div className="text-xs text-gray-600">
            {overallRisk < 20 ? 'Conditions are optimal for productivity and well-being' :
             overallRisk < 40 ? 'Minor environmental stressors detected - monitoring recommended' :
             overallRisk < 60 ? 'Moderate risk factors present - consider intervention' :
             'High risk environment - immediate action recommended'}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusIndicators.map(indicator => {
          const TrendIcon = getTrendIcon(indicator.trend);
          return (
            <Card key={indicator.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    indicator.status === 'critical' ? 'bg-red-500' :
                    indicator.status === 'warning' ? 'bg-orange-500' :
                    indicator.status === 'caution' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <TrendIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-lg font-bold mb-1">
                  {indicator.id === 'cognitive_load' || indicator.id === 'thermal_comfort' || indicator.id === 'space_weather' 
                    ? `${indicator.value.toFixed(0)}%`
                    : indicator.value}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {indicator.name}
                </div>
                <div className="text-xs text-gray-500">
                  {indicator.impact}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rapid Problem Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Rapid Problem Diagnosis
          </CardTitle>
          <div className="text-sm text-gray-600">
            AI-powered root cause analysis • Immediate action recommendations
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {diagnosisItems
            .filter(item => item.likelihood > 50)
            .sort((a, b) => b.likelihood - a.likelihood)
            .slice(0, 3)
            .map(item => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{item.issue}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {item.likelihood}% likely
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.severity}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Source:</strong> {item.source}
                </div>
                <div className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                  <strong>Quick Fix:</strong> {item.quickFix}
                </div>
              </div>
            ))}
          
          {diagnosisItems.filter(item => item.likelihood > 50).length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div>No significant issues detected</div>
              <div className="text-sm">All systems operating within normal parameters</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Impact Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Business Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-indigo-700">
                {overallRisk < 20 ? '95%' : overallRisk < 40 ? '88%' : overallRisk < 60 ? '78%' : '65%'}
              </div>
              <div className="text-indigo-600">Predicted Productivity</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-indigo-700">
                {overallRisk < 20 ? '2%' : overallRisk < 40 ? '5%' : overallRisk < 60 ? '12%' : '18%'}
              </div>
              <div className="text-indigo-600">Estimated Absenteeism</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-indigo-700">
                {overallRisk < 20 ? 'Low' : overallRisk < 40 ? 'Medium' : overallRisk < 60 ? 'High' : 'Critical'}
              </div>
              <div className="text-indigo-600">Intervention Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
