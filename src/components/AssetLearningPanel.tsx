
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain, Building, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { AssetLearningService, AssetFingerprint, DynamicAssetCard } from '@/services/assetLearningService';

interface AssetLearningPanelProps {
  buildingType: string;
  location: { lat: number; lon: number };
  currentConditions: any;
}

export const AssetLearningPanel: React.FC<AssetLearningPanelProps> = ({
  buildingType,
  location,
  currentConditions
}) => {
  const [assetFingerprint, setAssetFingerprint] = useState<AssetFingerprint | null>(null);
  const [dynamicCard, setDynamicCard] = useState<DynamicAssetCard | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);

  const assetId = `asset_${buildingType}_${location.lat.toFixed(2)}_${location.lon.toFixed(2)}`;

  useEffect(() => {
    // Create or retrieve asset fingerprint
    let asset = AssetLearningService.createAssetFingerprint(assetId, buildingType, location);
    setAssetFingerprint(asset);

    // Generate dynamic asset card
    const card = AssetLearningService.generateDynamicAssetCard(assetId, currentConditions);
    setDynamicCard(card);

    // Simulate learning progress
    setIsLearning(true);
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          setIsLearning(false);
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [assetId, buildingType, location.lat, location.lon, currentConditions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      case 'warning': return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'optimal': return 'text-green-800 bg-green-100 border-green-300';
      default: return 'text-gray-800 bg-gray-100 border-gray-300';
    }
  };

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'degrading': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="space-y-4">
      {/* Asset Fingerprinting Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Asset-Specific Learning System
            <Badge variant={isLearning ? "default" : "secondary"} className="text-xs">
              {isLearning ? "LEARNING ACTIVE" : "TRAINED"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-purple-600">
            30-day adaptive learning cycle • Individual vulnerability signatures
          </div>
        </CardHeader>
        <CardContent>
          {isLearning && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Learning Progress</span>
                <span>{learningProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${learningProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {assetFingerprint && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-purple-700">
                  {assetFingerprint.learningMetrics.dataPoints.toLocaleString()}
                </div>
                <div className="text-purple-600">Data Points</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-700">
                  {(assetFingerprint.learningMetrics.accuracyScore * 100).toFixed(1)}%
                </div>
                <div className="text-purple-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-700">
                  {assetFingerprint.operationalHistory.totalDays}
                </div>
                <div className="text-purple-600">Days Tracked</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-700">
                  {assetFingerprint.learningMetrics.learningVelocity.toFixed(1)}
                </div>
                <div className="text-purple-600">Learning Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Asset Card */}
      {dynamicCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              {dynamicCard.name}
              <Badge className={`text-xs ${getStatusColor(dynamicCard.status)}`}>
                {dynamicCard.status.toUpperCase()}
              </Badge>
            </CardTitle>
            <div className="text-sm text-blue-600">
              Real-time environmental exposure • Predictive risk assessment
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Exposure */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Environmental Exposure
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold">{dynamicCard.currentExposure.temperature}°C</div>
                  <div className="text-blue-600">Temperature</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold">{dynamicCard.currentExposure.humidity}%</div>
                  <div className="text-blue-600">Humidity</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold">{dynamicCard.currentExposure.airQuality}</div>
                  <div className="text-blue-600">AQI</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-bold">{dynamicCard.currentExposure.noise} dB</div>
                  <div className="text-blue-600">Noise</div>
                </div>
              </div>
            </div>

            {/* Risk Probability */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Predictive Risk Probability
              </h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-orange-700">
                    {dynamicCard.riskProbability.next24h.toFixed(0)}%
                  </div>
                  <div className="text-orange-600">Next 24h</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-orange-700">
                    {dynamicCard.riskProbability.next7days.toFixed(0)}%
                  </div>
                  <div className="text-orange-600">Next 7 days</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-orange-700">
                    {dynamicCard.riskProbability.next30days.toFixed(0)}%
                  </div>
                  <div className="text-orange-600">Next 30 days</div>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            {dynamicCard.predictiveInsights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Predictive Insights</h4>
                <div className="space-y-2">
                  {dynamicCard.predictiveInsights.map((insight, index) => (
                    <Alert key={index} className="border-l-4 border-blue-400 bg-blue-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {insight}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {dynamicCard.recommendedActions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <div className="space-y-2">
                  {dynamicCard.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
                      <span className="text-green-600">✓</span>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Level */}
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Confidence Level:</strong> {dynamicCard.confidenceLevel.toFixed(1)}% • 
              <strong> Asset ID:</strong> {dynamicCard.assetId}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vulnerability Signature */}
      {assetFingerprint && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              Vulnerability Signature Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span>HVAC Sensitivity</span>
                  <span>{(assetFingerprint.vulnerabilitySignature.hvacSensitivity * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${assetFingerprint.vulnerabilitySignature.hvacSensitivity * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Air Quality Response</span>
                  <span>{(assetFingerprint.vulnerabilitySignature.airQualityResponse * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${assetFingerprint.vulnerabilitySignature.airQualityResponse * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Occupant Sensitivity</span>
                  <span>{(assetFingerprint.vulnerabilitySignature.occupantSensitivity * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${assetFingerprint.vulnerabilitySignature.occupantSensitivity * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Thermal Inertia</span>
                  <span>{(assetFingerprint.vulnerabilitySignature.thermalInertia * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${assetFingerprint.vulnerabilitySignature.thermalInertia * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span>{getRiskTrendIcon(assetFingerprint.riskProfile.riskTrend)}</span>
              <span className="capitalize">{assetFingerprint.riskProfile.riskTrend} trend</span>
              <Badge variant="outline" className="text-xs">
                {assetFingerprint.operationalHistory.incidentCount} incidents
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
