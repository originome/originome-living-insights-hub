
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface AdaptiveLearning {
  dataPoints: number;
  accuracyScore: number;
  patternConfidence: number;
}

interface AdaptiveLearningHeaderProps {
  streamingActive: boolean;
  adaptiveLearning: AdaptiveLearning;
}

export const AdaptiveLearningHeader: React.FC<AdaptiveLearningHeaderProps> = ({
  streamingActive,
  adaptiveLearning
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Compound Risk Pattern Engine
          <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
            {streamingActive ? "ML ACTIVE" : "PAUSED"}
          </Badge>
        </CardTitle>
        <div className="text-sm text-purple-600">
          Multi-domain data fusion detecting exponential risk convergence patterns
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg text-purple-700">{adaptiveLearning.dataPoints.toLocaleString()}</div>
            <div className="text-purple-600">Data Points Processed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-700">{(adaptiveLearning.accuracyScore * 100).toFixed(1)}%</div>
            <div className="text-purple-600">ML Accuracy</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-700">{(adaptiveLearning.patternConfidence * 100).toFixed(1)}%</div>
            <div className="text-purple-600">Pattern Confidence</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
