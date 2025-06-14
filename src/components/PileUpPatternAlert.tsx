
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface PileUpPattern {
  id: string;
  factors: string[];
  rareOccurrence: boolean;
  historicalFrequency: number;
  exponentialMultiplier: number;
  criticalThreshold: number;
}

interface PileUpPatternAlertProps {
  pattern: PileUpPattern;
}

export const PileUpPatternAlert: React.FC<PileUpPatternAlertProps> = ({ pattern }) => {
  return (
    <Alert key={pattern.id} className="border-l-4 border-red-500 bg-red-100">
      <AlertDescription>
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-red-800">
            Rare Pattern: {pattern.factors.join(' + ')}
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive" className="text-xs">
              {pattern.exponentialMultiplier}x MULTIPLIER
            </Badge>
            <Badge variant="outline" className="text-xs">
              {(pattern.historicalFrequency * 100).toFixed(1)}% frequency
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-red-700">
          <strong>Critical Threshold:</strong> {pattern.criticalThreshold} • 
          <strong> Historical Frequency:</strong> Only {(pattern.historicalFrequency * 100).toFixed(1)}% of observations
        </div>
        
        <div className="mt-2 text-xs text-red-800 bg-white/60 p-2 rounded">
          ⚠️ <strong>Exponential Risk Warning:</strong> This rare pattern combination creates 
          {pattern.exponentialMultiplier}x normal risk levels. Immediate protective measures recommended.
        </div>
      </AlertDescription>
    </Alert>
  );
};
