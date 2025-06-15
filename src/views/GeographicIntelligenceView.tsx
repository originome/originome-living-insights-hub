
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Layers, Eye, AlertTriangle } from "lucide-react";
import GeoIntelMap from "../components/visualization/GeoIntelMap";

interface MicroAnomaly {
  id: string;
  latitude: number;
  longitude: number;
  type: 'thermal' | 'pollution' | 'atmospheric' | 'electromagnetic';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  description: string;
  detectedAt: Date;
  radius: number; // meters
  confidence: number;
  compoundFactors: string[];
}

const GeographicIntelligenceView: React.FC = () => {
  const [microAnomalies, setMicroAnomalies] = useState<MicroAnomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<MicroAnomaly | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers' | 'compound'>('heatmap');

  useEffect(() => {
    // Generate realistic micro-anomaly data for demonstration
    const generateMicroAnomalies = () => {
      const baseLocations = [
        { lat: 40.7589, lng: -73.9851, area: 'Times Square' },
        { lat: 40.7505, lng: -73.9934, area: 'Herald Square' },
        { lat: 40.7614, lng: -73.9776, area: 'Central Park South' },
        { lat: 40.7282, lng: -73.9942, area: 'Greenwich Village' },
        { lat: 40.7472, lng: -73.9857, area: 'Chelsea' },
        { lat: 40.7549, lng: -73.9840, area: 'Theater District' },
        { lat: 40.7329, lng: -74.0059, area: 'Tribeca' },
        { lat: 40.7178, lng: -74.0431, area: 'Financial District' }
      ];

      const anomalyTypes = ['thermal', 'pollution', 'atmospheric', 'electromagnetic'] as const;
      const severityLevels = ['low', 'moderate', 'high', 'critical'] as const;

      const demoAnomalies: MicroAnomaly[] = baseLocations.map((location, index) => ({
        id: `anomaly-${index + 1}`,
        latitude: location.lat + (Math.random() - 0.5) * 0.01,
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
        severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
        riskScore: Math.floor(Math.random() * 100),
        description: `Street-level ${anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]} anomaly detected in ${location.area}`,
        detectedAt: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
        radius: 50 + Math.random() * 200, // 50-250 meters
        confidence: 70 + Math.random() * 30, // 70-100%
        compoundFactors: [
          'High pedestrian density',
          'Vehicle emission concentration',
          'Building heat signature',
          'Atmospheric pressure variation'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }));

      setMicroAnomalies(demoAnomalies);
      setIsLoading(false);
    };

    setTimeout(generateMicroAnomalies, 1200);
  }, []);

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

  const criticalAnomalies = microAnomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = microAnomalies.filter(a => a.severity === 'high').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Map className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Scanning Geographic Micro-Anomalies...
            </h3>
            <p className="text-slate-600">
              Processing hyperlocal environmental signatures
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Map className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl text-purple-900">
                  Geographic Intelligence - Micro-Anomaly Detection
                </CardTitle>
                <p className="text-purple-700 text-sm">
                  Street-level risk mapping • Hyperlocal pattern detection • Compound risk visualization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-700">{criticalAnomalies} Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold text-orange-700">{highAnomalies} High Risk</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('heatmap')}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Heatmap
                </Button>
                <Button
                  variant={viewMode === 'markers' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('markers')}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Markers
                </Button>
                <Button
                  variant={viewMode === 'compound' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('compound')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Compound
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Map Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Interactive Risk Mapping</CardTitle>
              <Badge variant="outline" className="text-xs">
                Live Data • 30m Resolution
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <GeoIntelMap
              center={mapCenter}
              anomalies={microAnomalies}
              viewMode={viewMode}
              onAnomalySelect={setSelectedAnomaly}
              selectedAnomaly={selectedAnomaly}
            />
          </CardContent>
        </Card>

        {/* Anomaly Details Panel */}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Anomalies', value: microAnomalies.length, color: 'blue' },
          { label: 'Critical Risk Zones', value: criticalAnomalies, color: 'red' },
          { label: 'Average Risk Score', value: Math.round(microAnomalies.reduce((sum, a) => sum + a.riskScore, 0) / microAnomalies.length), color: 'orange' },
          { label: 'Coverage Area', value: '15.7 km²', color: 'green' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="py-4 text-center">
              <div className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeographicIntelligenceView;
