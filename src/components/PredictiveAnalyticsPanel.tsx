
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { PredictiveAnalyticsService, PredictiveAnalytics } from '@/services/predictiveAnalyticsService';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface PredictiveAnalyticsPanelProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
}

export const PredictiveAnalyticsPanel: React.FC<PredictiveAnalyticsPanelProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  useEffect(() => {
    const predictiveData = PredictiveAnalyticsService.getFullPredictiveAnalytics(
      environmentalParams,
      externalData,
      cosmicData,
      buildingType
    );
    setAnalytics(predictiveData);
    if (predictiveData.scenarioModels.length > 0 && !selectedScenario) {
      setSelectedScenario(predictiveData.scenarioModels[0].id);
    }
  }, [environmentalParams, externalData, cosmicData, buildingType]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading predictive analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      case 'volatile': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const selectedScenarioData = analytics.scenarioModels.find(s => s.id === selectedScenario);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          Predictive Analytics Engine
          <Badge variant="default" className="text-xs">
            AI-POWERED
          </Badge>
        </CardTitle>
        <div className="text-sm text-purple-600">
          Environmental velocity forecasting and risk window prediction
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="velocity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="velocity">Velocity Forecasts</TabsTrigger>
            <TabsTrigger value="risk-windows">Risk Windows</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Models</TabsTrigger>
          </TabsList>

          <TabsContent value="velocity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.velocityForecasts.map((forecast, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-sm">{forecast.parameter}</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${getTrendColor(forecast.trend)}`} />
                        <Badge variant="outline" className="text-xs">
                          {(forecast.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-600">Current</div>
                        <div className="font-bold text-lg">{forecast.currentValue.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Velocity</div>
                        <div className={`font-bold ${getTrendColor(forecast.trend)}`}>
                          {forecast.velocity > 0 ? '+' : ''}{forecast.velocity.toFixed(2)}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">24h Forecast</div>
                        <div className="font-medium">{forecast.predictedValue24h.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">7d Forecast</div>
                        <div className="font-medium">{forecast.predictedValue7d.toFixed(1)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <strong>Trend:</strong> {forecast.trend} • 
                      <strong> Acceleration:</strong> {forecast.acceleration.toFixed(3)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risk-windows" className="space-y-4">
            {analytics.riskWindows.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No significant risk windows predicted in the next 24 hours
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.riskWindows.map((window) => (
                  <Alert key={window.id} className={`border-l-4 ${getRiskLevelColor(window.riskLevel)}`}>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Risk Window: {window.id.replace('_', ' ').toUpperCase()}</div>
                        <div className="flex gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {(window.probability * 100).toFixed(0)}% probability
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {window.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm mb-2">
                        <strong>Time Window:</strong> {window.startTime.toLocaleTimeString()} - {window.endTime.toLocaleTimeString()}
                      </div>
                      
                      <div className="text-sm mb-2">
                        <strong>Compound Factors:</strong> {window.compoundFactors.join(', ')}
                      </div>
                      
                      <div className="text-sm mb-2">
                        <strong>Expected Impact:</strong> {window.expectedImpact}
                      </div>
                      
                      <div className="text-xs bg-white/60 p-2 rounded">
                        <strong>Mitigation Actions:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {window.mitigation.map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {analytics.scenarioModels.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className={`cursor-pointer transition-all ${
                    selectedScenario === scenario.id ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <div className="font-medium text-sm">{scenario.name}</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">{scenario.description}</div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-600">Productivity</div>
                        <div className="font-bold text-green-600">{scenario.predictedOutcomes.productivity}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Energy Cost</div>
                        <div className="font-bold text-blue-600">{scenario.predictedOutcomes.energyCosts}%</div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs mt-2">
                      {(scenario.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedScenarioData && (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedScenarioData.name} - Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Parameter Targets</h4>
                      <div className="space-y-3">
                        {Object.entries(selectedScenarioData.parameters).map(([param, range]) => (
                          <div key={param} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{param.toUpperCase()}</span>
                            <span className="text-sm">
                              {range.min} - {range.max} (target: {range.target})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Predicted Outcomes</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm">Productivity</span>
                          <span className="font-bold text-green-600">{selectedScenarioData.predictedOutcomes.productivity}%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm">Absenteeism</span>
                          <span className="font-bold text-red-600">{selectedScenarioData.predictedOutcomes.absenteeism}%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <span className="text-sm">Energy Costs</span>
                          <span className="font-bold text-blue-600">{selectedScenarioData.predictedOutcomes.energyCosts}%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                          <span className="text-sm">Maintenance</span>
                          <span className="font-bold text-orange-600">{selectedScenarioData.predictedOutcomes.maintenanceNeeds}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-50 rounded">
                    <div className="text-sm">
                      <strong>Timeframe:</strong> {selectedScenarioData.timeframe} days • 
                      <strong> Confidence:</strong> {(selectedScenarioData.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-purple-600">
          Last updated: {analytics.lastUpdated.toLocaleString()} • 
          Forecasts recalculated every 15 minutes
        </div>
      </CardContent>
    </Card>
  );
};
