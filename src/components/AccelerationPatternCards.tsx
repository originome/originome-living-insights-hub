
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Zap, Clock, AlertCircle } from 'lucide-react';
import { AccelerationPattern } from '@/types/rateOfChange';

interface AccelerationPatternCardsProps {
  accelerationPatterns: AccelerationPattern[];
}

export const AccelerationPatternCards: React.FC<AccelerationPatternCardsProps> = ({
  accelerationPatterns
}) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'sudden_shift': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'jerk': return <Zap className="h-4 w-4 text-purple-600" />;
      case 'acceleration': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {accelerationPatterns.map((pattern, index) => (
        <Card key={index} className={`border ${getRiskColor(pattern.riskLevel)}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">{pattern.parameter}</div>
              <div className="flex items-center gap-1">
                {getAlertIcon(pattern.alertType)}
                {pattern.suddenChange && <AlertCircle className="h-3 w-3 text-red-600" />}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-gray-600">Velocity (1st)</div>
                <div className="font-bold">{pattern.velocity.toFixed(2)}/min</div>
              </div>
              <div>
                <div className="text-gray-600">Acceleration (2nd)</div>
                <div className="font-bold">{pattern.acceleration.toFixed(2)}/min²</div>
              </div>
            </div>
            
            {pattern.jerk !== 0 && (
              <div className="mt-2 text-xs">
                <span className="text-gray-600">Jerk (3rd): </span>
                <span className="font-medium">{pattern.jerk.toFixed(2)}/min³</span>
              </div>
            )}
            
            {pattern.suddenChange && (
              <div className="mt-2 text-xs bg-red-100 p-1 rounded text-red-800">
                ⚠️ Sudden change pattern detected
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
