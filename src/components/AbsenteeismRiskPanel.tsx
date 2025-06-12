
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { AbsenteeismData } from '@/services/patternEngineService';

interface AbsenteeismRiskPanelProps {
  absenteeismData: AbsenteeismData;
  isLoading?: boolean;
}

export const AbsenteeismRiskPanel: React.FC<AbsenteeismRiskPanelProps> = ({
  absenteeismData,
  isLoading = false
}) => {
  const getRiskColor = (rate: number) => {
    if (rate > 15) return 'text-red-600';
    if (rate > 10) return 'text-orange-600';
    if (rate > 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskLevel = (rate: number) => {
    if (rate > 15) return 'High Risk';
    if (rate > 10) return 'Elevated';
    if (rate > 7) return 'Moderate';
    return 'Low Risk';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Absenteeism Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskIncrease = Math.max(0, absenteeismData.currentRate - absenteeismData.historicalAverage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          Absenteeism Risk Analysis
        </CardTitle>
        <div className="text-xs text-gray-500">
          Multifactor risk assessment based on environmental and cosmic conditions
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getRiskColor(absenteeismData.currentRate)}`}>
              {absenteeismData.currentRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Current Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {absenteeismData.historicalAverage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Historical Avg</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Level</span>
            <Badge className={getRiskColor(absenteeismData.currentRate)}>
              {getRiskLevel(absenteeismData.currentRate)}
            </Badge>
          </div>
          <Progress value={Math.min(100, absenteeismData.currentRate * 3.33)} className="h-2" />
        </div>

        {riskIncrease > 0 && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Elevated Risk Alert</span>
            </div>
            <div className="text-xs text-orange-700">
              {riskIncrease.toFixed(1)}% increase above historical baseline due to current conditions
            </div>
          </div>
        )}

        {absenteeismData.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Contributing Factors:</div>
            <div className="space-y-1">
              {absenteeismData.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  <span className="text-gray-700">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          <strong>Research Base:</strong> Risk calculations integrate findings from 15+ peer-reviewed 
          studies on environmental health impacts, including geomagnetic activity effects on absenteeism 
          (Babayev & Allahverdiyeva, 2007).
        </div>
      </CardContent>
    </Card>
  );
};
