
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface MultiDomainRisk {
  name: string;
  domains: string[];
  exponentialFactor: number;
  riskScore: number;
  convergencePattern: string;
  biologicalImpact: string;
  probability: number;
}

interface MultiDomainRiskCardProps {
  risk: MultiDomainRisk;
  index: number;
}

export const MultiDomainRiskCard: React.FC<MultiDomainRiskCardProps> = ({ risk, index }) => {
  const getRiskColor = (score: number) => {
    if (score > 90) return 'bg-red-100 border-red-300 text-red-800';
    if (score > 75) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (score > 60) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  return (
    <Alert key={index} className={`border-l-4 ${getRiskColor(risk.riskScore)}`}>
      <AlertDescription>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{risk.name}</div>
          <div className="flex gap-2">
            <Badge variant="destructive" className="text-xs">
              Risk: {risk.riskScore}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {risk.exponentialFactor}x multiplier
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <strong>Domains:</strong> {risk.domains.join(' + ')}
          </div>
          <div>
            <strong>Probability:</strong> {(risk.probability * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className="mt-2 text-sm">
          <strong>Convergence Pattern:</strong> {risk.convergencePattern}
        </div>
        
        <div className="mt-2 text-sm bg-white/60 p-2 rounded">
          <strong>Biological Impact:</strong> {risk.biologicalImpact}
        </div>
      </AlertDescription>
    </Alert>
  );
};
