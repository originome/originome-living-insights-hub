
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ContinuousLearningStatusProps {
  multiDomainRisksCount: number;
  pileUpPatternsCount: number;
  dataPoints: number;
}

export const ContinuousLearningStatus: React.FC<ContinuousLearningStatusProps> = ({
  multiDomainRisksCount,
  pileUpPatternsCount,
  dataPoints
}) => {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm text-gray-700">
            <strong>Adaptive ML Engine:</strong> Processing {multiDomainRisksCount} convergence patterns, 
            {pileUpPatternsCount} rare pile-ups • Accuracy improving continuously
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Next model update: ~90 seconds • Pattern library: {dataPoints.toLocaleString()} samples
        </div>
      </CardContent>
    </Card>
  );
};
