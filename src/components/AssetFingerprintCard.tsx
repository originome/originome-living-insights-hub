
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { AssetFingerprint } from '@/services/assetLearningService';

interface AssetFingerprintCardProps {
  assetFingerprint: AssetFingerprint;
  isLearning: boolean;
  learningProgress: number;
}

export const AssetFingerprintCard: React.FC<AssetFingerprintCardProps> = ({
  assetFingerprint,
  isLearning,
  learningProgress
}) => {
  return (
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
      </CardContent>
    </Card>
  );
};
