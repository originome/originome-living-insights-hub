
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { MicroAnomaly } from '@/services/demoDataService';

interface AnomalyDetailsPanelProps {
  selectedAnomaly: MicroAnomaly | null;
  selectedLocation: { industry: string; name: string };
}

const AnomalyDetailsPanel: React.FC<AnomalyDetailsPanelProps> = ({
  selectedAnomaly,
  selectedLocation
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'thermal': return '🌡️';
      case 'pollution': return '🏭';
      case 'atmospheric': return '🌪️';
      case 'electromagnetic': return '⚡';
      default: return '🔍';
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Micro-Anomaly Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedAnomaly ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon(selectedAnomaly.type)}</span>
              <div>
                <h4 className="font-semibold capitalize">{selectedAnomaly.type} Anomaly</h4>
                <Badge className={`text-xs ${getSeverityColor(selectedAnomaly.severity)}`}>
                  {selectedAnomaly.severity.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <strong>Risk Score:</strong> {selectedAnomaly.riskScore}/100
              </div>
              <div>
                <strong>Confidence:</strong> {selectedAnomaly.confidence.toFixed(0)}%
              </div>
              <div>
                <strong>Radius:</strong> {selectedAnomaly.radius.toFixed(0)}m
              </div>
              <div>
                <strong>Detected:</strong> {selectedAnomaly.detectedAt.toLocaleTimeString()}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-700 mb-3">{selectedAnomaly.description}</p>
            </div>

            <div>
              <h5 className="font-semibold text-sm mb-2">Compound Factors:</h5>
              <div className="space-y-1">
                {selectedAnomaly.compoundFactors.map((factor, index) => (
                  <div key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                    • {factor}
                  </div>
                ))}
              </div>
            </div>

            <Button size="sm" className="w-full">
              Generate Intervention Plan
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Click on a marker or heatmap area to view detailed micro-anomaly information
            </p>
            <p className="text-xs mt-2 text-slate-400">
              Current view: {selectedLocation.industry} patterns in {selectedLocation.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyDetailsPanel;
