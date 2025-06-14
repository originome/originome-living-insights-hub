
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Network, Zap, Target, Users, TrendingUp } from 'lucide-react';
import { 
  AdvancedPatternRecognition, 
  PatternModel, 
  AdaptiveLearningResult, 
  EchoDetection, 
  NetworkEffect 
} from '@/services/advancedPatternRecognition';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface AdvancedMLPatternDashboardProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
}

export const AdvancedMLPatternDashboard: React.FC<AdvancedMLPatternDashboardProps> = ({
  environmentalParams,
  externalData,
  cosmicData
}) => {
  const [patternModels, setPatternModels] = useState<PatternModel[]>([]);
  const [learningResult, setLearningResult] = useState<AdaptiveLearningResult | null>(null);
  const [echoDetections, setEchoDetections] = useState<EchoDetection[]>([]);
  const [networkEffect, setNetworkEffect] = useState<NetworkEffect | null>(null);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    // Initialize ML models
    AdvancedPatternRecognition.initializeMLModels();
    setIsLearning(true);

    // Perform adaptive learning
    const operationalData = {
      hvacLoad: 0.7 + Math.random() * 0.3,
      occupancy: 0.5 + Math.random() * 0.4,
      equipmentAge: 3 + Math.random() * 7
    };

    const interval = setInterval(() => {
      const models = AdvancedPatternRecognition.getPatternModels();
      const learning = AdvancedPatternRecognition.performAdaptiveLearning(
        environmentalParams,
        cosmicData,
        operationalData
      );
      const echoes = AdvancedPatternRecognition.getEchoDetections();
      const network = AdvancedPatternRecognition.getNetworkEffect();

      setPatternModels(models);
      setLearningResult(learning);
      setEchoDetections(echoes);
      setNetworkEffect(network);

      // Generate echo detection occasionally
      if (Math.random() < 0.1 && externalData.location) {
        AdvancedPatternRecognition.generateEchoDetection(
          environmentalParams,
          externalData.location
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [environmentalParams, cosmicData, externalData]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy > 0.9) return 'text-green-700 bg-green-100 border-green-300';
    if (accuracy > 0.8) return 'text-blue-700 bg-blue-100 border-blue-300';
    return 'text-yellow-700 bg-yellow-100 border-yellow-300';
  };

  return (
    <div className="space-y-6">
      {/* ML Models Status */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Advanced Machine Learning Models
            <Badge variant={isLearning ? "default" : "secondary"} className="text-xs">
              {isLearning ? "ADAPTIVE LEARNING" : "STATIC"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-purple-600">
            Nonlinear pattern identification • Continuous accuracy improvement • Multi-domain correlation
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {patternModels.map((model) => (
            <Alert key={model.modelId} className={`border-l-4 ${getAccuracyColor(model.accuracy)}`}>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">
                    {model.modelId.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default" className="text-xs">
                      {(model.accuracy * 100).toFixed(1)}% accuracy
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {model.predictionHorizon}d horizon
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Training Data:</strong> {model.trainingData.toLocaleString()} points
                  </div>
                  <div>
                    <strong>Network Contributors:</strong> {model.networkContributions} customers
                  </div>
                </div>
                <div className="text-xs mt-2 bg-white/60 p-1 rounded">
                  Last trained: {model.lastTrained.toLocaleTimeString()}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Adaptive Learning Results */}
      {learningResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Adaptive Learning Intelligence
            </CardTitle>
            <div className="text-sm text-blue-600">
              Real-time pattern recognition • Accuracy: {(learningResult.recognitionAccuracy * 100).toFixed(1)}%
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Risk Forecast */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Multi-Day Risk Forecast</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-700">
                    {learningResult.riskForecast.next24h.toFixed(0)}%
                  </div>
                  <div className="text-blue-600">Next 24 Hours</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-700">
                    {learningResult.riskForecast.next72h.toFixed(0)}%
                  </div>
                  <div className="text-blue-600">Next 72 Hours</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-700">
                    {learningResult.riskForecast.next7days.toFixed(0)}%
                  </div>
                  <div className="text-blue-600">Next 7 Days</div>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            {learningResult.predictiveInsights.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Nonlinear Pattern Insights</h4>
                {learningResult.predictiveInsights.map((insight, index) => (
                  <div key={index} className="text-sm bg-yellow-50 p-2 rounded border-l-4 border-yellow-400 mb-2">
                    {insight}
                  </div>
                ))}
              </div>
            )}

            {/* Cross-Domain Correlations */}
            {learningResult.crossDomainCorrelations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cross-Domain Correlations</h4>
                {learningResult.crossDomainCorrelations.map((correlation, index) => (
                  <div key={index} className="text-sm bg-green-50 p-2 rounded border-l-4 border-green-400 mb-2">
                    {correlation}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Echo Detection System */}
      {echoDetections.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Zap className="h-5 w-5" />
              Echo Detection Warnings
            </CardTitle>
            <div className="text-sm text-red-600">
              Pre-sensor environmental intelligence • Warning customers before their sensors detect issues
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {echoDetections.slice(0, 5).map((echo) => (
              <Alert key={echo.echoId} className="border-l-4 border-red-400 bg-white">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Echo Detection Alert</div>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {echo.estimatedDelay.toFixed(0)}min delay
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(echo.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-red-700 mb-2">
                    <strong>Pattern:</strong> {echo.sourcePattern}
                  </div>
                  <div className="text-sm">
                    <strong>Target Location:</strong> {echo.targetLocation.lat.toFixed(4)}, {echo.targetLocation.lon.toFixed(4)} • 
                    <strong> Warning Issued:</strong> {echo.warningIssued.toLocaleTimeString()}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Network Effect Status */}
      {networkEffect && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-emerald-600" />
              Network Effect Intelligence
            </CardTitle>
            <div className="text-sm text-emerald-600">
              Each new customer strengthens pattern recognition for all users
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {networkEffect.totalCustomers}
                </div>
                <div className="text-emerald-600">Network Customers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {networkEffect.sharedLearning}
                </div>
                <div className="text-emerald-600">Shared Patterns</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {networkEffect.accuracyImprovement.toFixed(1)}%
                </div>
                <div className="text-emerald-600">Accuracy Boost</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {networkEffect.globalPatterns}
                </div>
                <div className="text-emerald-600">Global Patterns</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Status */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-700">
              <strong>Adaptive Learning Active:</strong> {networkEffect?.totalCustomers || 0} customers contributing to ML models • 
              Continuous accuracy improvement • Pattern recognition strengthening globally
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Next model update: ~3 seconds • Network effect multiplier: {networkEffect?.accuracyImprovement.toFixed(1) || 0}% • 
            Echo detection scanning: continuous
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
