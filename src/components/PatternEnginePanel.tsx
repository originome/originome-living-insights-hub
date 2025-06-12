
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { PatternInsight } from '@/services/patternEngineService';

interface PatternEnginePanelProps {
  patternInsight: PatternInsight;
  isLoading?: boolean;
}

export const PatternEnginePanel: React.FC<PatternEnginePanelProps> = ({
  patternInsight,
  isLoading = false
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'correlation_alert': return AlertTriangle;
      case 'prediction': return TrendingUp;
      case 'anomaly': return Zap;
      default: return Info;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Originome Pattern Engine
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

  const Icon = getTypeIcon(patternInsight.type);

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-6 w-6 text-purple-600" />
            Originome Pattern Engine
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            AI-Powered Insights
          </Badge>
        </div>
        <div className="text-xs text-purple-600 font-medium">
          Multiscale Environmental Intelligence • Pattern of the Day
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={`border-l-4 ${getSeverityColor(patternInsight.severity)}`}>
          <Icon className="h-5 w-5" />
          <AlertDescription>
            <div className="font-semibold text-sm mb-2 flex items-center gap-2">
              {patternInsight.title}
              <Badge variant="outline" className="text-xs">
                {patternInsight.confidence}% confidence
              </Badge>
            </div>
            <div className="text-sm mb-3">{patternInsight.description}</div>
            
            {patternInsight.drivers.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium mb-1">Key Drivers:</div>
                <div className="flex flex-wrap gap-1">
                  {patternInsight.drivers.map((driver, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/60 p-3 rounded border-l-2 border-purple-300">
              <div className="text-xs font-medium text-purple-800 mb-1">Recommended Action:</div>
              <div className="text-xs text-purple-700">{patternInsight.recommendation}</div>
            </div>

            {patternInsight.historicalContext && (
              <div className="text-xs text-gray-600 mt-2">
                <strong>Historical Context:</strong> {patternInsight.historicalContext}
              </div>
            )}
          </AlertDescription>
        </Alert>

        {patternInsight.citation && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs font-medium text-blue-800 mb-1">Scientific Evidence:</div>
            <div className="text-xs text-blue-700">{patternInsight.citation}</div>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          <strong>What makes this different?</strong> Traditional dashboards show individual metrics. 
          Originome reveals hidden patterns across environmental, cosmic, and biological systems that 
          drive organizational performance.
        </div>
      </CardContent>
    </Card>
  );
};
