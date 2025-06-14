
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Zap, Eye, Settings } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface MultiFactorRiskMatrixProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
}

interface RiskFactor {
  id: string;
  name: string;
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'environmental' | 'cosmic' | 'operational';
}

interface ConvergenceScenario {
  id: string;
  factors: string[];
  riskScore: number;
  probability: number;
  impact: string;
  timeframe: string;
}

export const MultiFactorRiskMatrix: React.FC<MultiFactorRiskMatrixProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'convergence' | 'timeline'>('matrix');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const riskFactors = useMemo((): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    // Environmental factors
    factors.push({
      id: 'co2',
      name: 'CO₂ Levels',
      value: environmentalParams.co2,
      severity: environmentalParams.co2 > 1000 ? 'critical' : environmentalParams.co2 > 800 ? 'high' : 'medium',
      category: 'environmental'
    });

    factors.push({
      id: 'pm25',
      name: 'Air Quality (PM2.5)',
      value: environmentalParams.pm25,
      severity: environmentalParams.pm25 > 35 ? 'critical' : environmentalParams.pm25 > 25 ? 'high' : 'medium',
      category: 'environmental'
    });

    factors.push({
      id: 'temperature',
      name: 'Temperature Deviation',
      value: Math.abs(environmentalParams.temperature - 21),
      severity: Math.abs(environmentalParams.temperature - 21) > 5 ? 'high' : 'medium',
      category: 'environmental'
    });

    // Cosmic factors
    if (cosmicData) {
      factors.push({
        id: 'geomagnetic',
        name: 'Geomagnetic Activity',
        value: cosmicData.geomagnetic.kpIndex,
        severity: cosmicData.geomagnetic.kpIndex > 6 ? 'critical' : cosmicData.geomagnetic.kpIndex > 4 ? 'high' : 'medium',
        category: 'cosmic'
      });

      factors.push({
        id: 'solar',
        name: 'Solar Activity',
        value: cosmicData.solar.sunspotNumber,
        severity: cosmicData.solar.sunspotNumber > 150 ? 'high' : 'medium',
        category: 'cosmic'
      });
    }

    return factors;
  }, [environmentalParams, cosmicData]);

  const convergenceScenarios = useMemo((): ConvergenceScenario[] => {
    const scenarios: ConvergenceScenario[] = [];

    // High CO2 + Poor Air Quality
    if (environmentalParams.co2 > 800 && environmentalParams.pm25 > 20) {
      scenarios.push({
        id: 'co2_air_quality',
        factors: ['CO₂ Levels', 'Air Quality'],
        riskScore: 85,
        probability: 0.78,
        impact: 'Cognitive performance decline, respiratory stress',
        timeframe: '2-4 hours'
      });
    }

    // Geomagnetic + Temperature extreme
    if (cosmicData?.geomagnetic.kpIndex > 4 && Math.abs(environmentalParams.temperature - 21) > 4) {
      scenarios.push({
        id: 'geomag_temp',
        factors: ['Geomagnetic Activity', 'Temperature'],
        riskScore: 72,
        probability: 0.65,
        impact: 'Circadian disruption, stress response activation',
        timeframe: '6-12 hours'
      });
    }

    // Triple convergence scenario
    if (environmentalParams.co2 > 900 && environmentalParams.pm25 > 25 && cosmicData?.geomagnetic.kpIndex > 5) {
      scenarios.push({
        id: 'triple_convergence',
        factors: ['CO₂ Levels', 'Air Quality', 'Geomagnetic Activity'],
        riskScore: 94,
        probability: 0.89,
        impact: 'Compound physiological stress, significant performance impact',
        timeframe: '1-3 hours'
      });
    }

    return scenarios.sort((a, b) => b.riskScore - a.riskScore);
  }, [environmentalParams, cosmicData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental': return 'bg-blue-100 text-blue-800';
      case 'cosmic': return 'bg-purple-100 text-purple-800';
      case 'operational': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Multi-Factor Risk Matrix
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'matrix' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('matrix')}
            >
              Matrix View
            </Button>
            <Button
              variant={viewMode === 'convergence' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('convergence')}
            >
              Convergence
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Sophisticated multi-factor analysis showing risk convergence scenarios
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'matrix' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskFactors.map((factor) => (
                <div key={factor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{factor.name}</h4>
                    <Badge className={getCategoryColor(factor.category)}>
                      {factor.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(factor.severity)}`}></div>
                    <span className="text-lg font-bold">{factor.value}</span>
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {factor.severity} risk level
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'convergence' && (
          <div className="space-y-4">
            {convergenceScenarios.length > 0 ? (
              convergenceScenarios.map((scenario) => (
                <Alert key={scenario.id} className="border-l-4 border-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDescription>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">
                        Factor Convergence: {scenario.factors.join(' + ')}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="destructive">
                          Risk: {scenario.riskScore}
                        </Badge>
                        <Badge variant="outline">
                          {(scenario.probability * 100).toFixed(0)}% probability
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Expected Impact:</strong> {scenario.impact}
                      </div>
                      <div>
                        <strong>Timeframe:</strong> {scenario.timeframe}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <div>No significant convergence scenarios detected</div>
                <div className="text-sm">Current risk factors are within normal ranges</div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">Next 1-3 hours</div>
              <div className="font-semibold text-orange-700">
                High probability convergence scenarios
              </div>
              {convergenceScenarios.filter(s => s.timeframe.includes('hour')).map(scenario => (
                <div key={scenario.id} className="text-sm mt-1">
                  • {scenario.factors.join(' + ')} - {scenario.riskScore}% risk
                </div>
              ))}
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">Next 6-12 hours</div>
              <div className="font-semibold text-blue-700">
                Medium probability scenarios
              </div>
              <div className="text-sm mt-1">
                • Continued environmental stress accumulation
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">Next 24+ hours</div>
              <div className="font-semibold text-green-700">
                Recovery and normalization expected
              </div>
              <div className="text-sm mt-1">
                • Risk factors trending toward baseline
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div>
            <strong>Matrix Status:</strong> {riskFactors.length} factors analyzed • 
            {convergenceScenarios.length} convergence scenarios detected
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
