
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';
import { AssetLearningPanel } from '@/components/AssetLearningPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Brain, Target, TrendingUp } from 'lucide-react';

const AssetIntelligenceView: React.FC<SharedViewProps> = ({
  location,
  buildingType,
  populationGroup,
  environmentalParams,
  externalData,
  cosmicData,
  isLoading,
  isCosmicLoading,
  systemIntelligence,
  onParamChange,
  onRefresh
}) => {
  // Asset intelligence metrics
  const assetMetrics = {
    learningAccuracy: 87,
    fingerprintComplexity: 'High',
    vulnerabilityScore: 23,
    adaptationRate: 12.5
  };

  return (
    <div className="space-y-6">
      {/* Asset Intelligence Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6 text-purple-600" />
            Asset Intelligence & Learning
            <Badge variant="outline" className="text-xs">
              ADAPTIVE ML
            </Badge>
          </CardTitle>
          <div className="text-sm text-purple-600">
            Legacy-asset fingerprinting for {location} - {buildingType}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 p-4 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Learning Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{assetMetrics.learningAccuracy}%</div>
              <div className="text-xs text-purple-600">Continuously improving</div>
            </div>
            
            <div className="bg-white/60 p-4 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Fingerprint</span>
              </div>
              <div className="text-lg font-bold text-purple-600">{assetMetrics.fingerprintComplexity}</div>
              <div className="text-xs text-purple-600">Complexity level</div>
            </div>
            
            <div className="bg-white/60 p-4 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Vulnerability</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{assetMetrics.vulnerabilityScore}</div>
              <div className="text-xs text-purple-600">Risk score (lower is better)</div>
            </div>
            
            <div className="bg-white/60 p-4 rounded border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Adaptation Rate</span>
              </div>
              <div className="text-lg font-bold text-purple-600">{assetMetrics.adaptationRate}/hr</div>
              <div className="text-xs text-purple-600">Learning velocity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Learning Panel */}
      {externalData.location && (
        <AssetLearningPanel
          buildingType={buildingType}
          location={{ lat: externalData.location.lat, lon: externalData.location.lon }}
          currentConditions={environmentalParams}
        />
      )}
    </div>
  );
};

export default AssetIntelligenceView;
