
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { DynamicAssetCard } from '@/services/assetLearningService';

interface DynamicAssetDisplayProps {
  dynamicCard: DynamicAssetCard;
}

export const DynamicAssetDisplay: React.FC<DynamicAssetDisplayProps> = ({
  dynamicCard
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      case 'warning': return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'optimal': return 'text-green-800 bg-green-100 border-green-300';
      default: return 'text-gray-800 bg-gray-100 border-gray-300';
    }
  };

  return (
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
  );
};
