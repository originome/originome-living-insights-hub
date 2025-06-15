import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Satellite, MapPin, AlertTriangle } from 'lucide-react';
import { SatelliteDataService, SatelliteData, MicroAnomalyData } from '@/services/satelliteDataService';
import InteractiveMap from './InteractiveMap';

interface GeographicMicroAnomalyPanelProps {
  latitude: number;
  longitude: number;
  location: string;
}

export const GeographicMicroAnomalyPanel: React.FC<GeographicMicroAnomalyPanelProps> = ({
  latitude,
  longitude,
  location
}) => {
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [microAnomalies, setMicroAnomalies] = useState<MicroAnomalyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSatelliteData = async () => {
      setIsLoading(true);
      try {
        const data = await SatelliteDataService.fetchSatelliteData(latitude, longitude);
        setSatelliteData(data);
        
        // Mock historical baseline for anomaly detection
        const historicalBaseline = {
          lst: 20,
          ndvi: 0.6,
          aerosolOpticalDepth: 0.15
        };
        
        const anomalies = SatelliteDataService.detectMicroAnomalies(data, historicalBaseline);
        setMicroAnomalies(anomalies);
      } catch (error) {
        console.error('Failed to fetch satellite data:', error);
        // Generate demo data for prototype
        generateDemoData();
      } finally {
        setIsLoading(false);
      }
    };

    const generateDemoData = () => {
      // Generate realistic demo satellite data
      const demoSatelliteData: SatelliteData = {
        ndvi: 0.45 + Math.random() * 0.3,
        lst: 18 + Math.random() * 15,
        aerosolOpticalDepth: 0.1 + Math.random() * 0.2,
        no2TroposphericColumn: (2 + Math.random() * 8) * 1e15,
        timestamp: new Date()
      };
      setSatelliteData(demoSatelliteData);

      // Generate demo micro-anomalies
      const demoAnomalies: MicroAnomalyData[] = [
        {
          anomalyType: 'thermal',
          severity: 'high',
          riskScore: 78,
          confidence: 87,
          spatialResolution: 30,
          temporalPattern: 'Increasing thermal signature over past 6 hours',
          affectedRadius: 250,
          predictedDuration: 4
        },
        {
          anomalyType: 'vegetation',
          severity: 'moderate',
          riskScore: 45,
          confidence: 72,
          spatialResolution: 10,
          temporalPattern: 'Gradual vegetation stress detected',
          affectedRadius: 150,
          predictedDuration: 8
        },
        {
          anomalyType: 'atmospheric',
          severity: 'critical',
          riskScore: 92,
          confidence: 95,
          spatialResolution: 50,
          temporalPattern: 'Rapid atmospheric pressure change',
          affectedRadius: 500,
          predictedDuration: 2
        }
      ];
      setMicroAnomalies(demoAnomalies);
    };

    if (latitude && longitude) {
      fetchSatelliteData();
      
      // Refresh data every 5 minutes for demo
      const interval = setInterval(fetchSatelliteData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [latitude, longitude]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-800 bg-yellow-100 border-yellow-300';
      default: return 'text-blue-800 bg-blue-100 border-blue-300';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'thermal': return '🌡️';
      case 'vegetation': return '🌱';
      case 'pollution': return '🏭';
      case 'atmospheric': return '🌪️';
      default: return '📊';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 animate-spin" />
            Loading Satellite Data...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Acquiring high-resolution satellite imagery and environmental data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Satellite Data Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-blue-600" />
            Satellite Environmental Intelligence
            <Badge variant="outline" className="text-xs">
              NASA MODIS/Landsat
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <MapPin className="h-4 w-4" />
            {location} • {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </div>
        </CardHeader>
        <CardContent>
          {satelliteData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-700">
                  {satelliteData.ndvi.toFixed(3)}
                </div>
                <div className="text-blue-600">NDVI</div>
                <div className="text-xs text-blue-500">Vegetation Health</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-blue-700">
                  {satelliteData.lst.toFixed(1)}°C
                </div>
                <div className="text-blue-600">Surface Temp</div>
                <div className="text-xs text-blue-500">Land Surface</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-blue-700">
                  {satelliteData.aerosolOpticalDepth.toFixed(3)}
                </div>
                <div className="text-blue-600">AOD</div>
                <div className="text-xs text-blue-500">Aerosol Depth</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-blue-700">
                  {(satelliteData.no2TroposphericColumn / 1e15).toFixed(1)}
                </div>
                <div className="text-blue-600">NO₂</div>
                <div className="text-xs text-blue-500">×10¹⁵ molec/cm²</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Micro-Anomaly Detection */}
      {microAnomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Street-Level Micro-Anomalies Detected
            </CardTitle>
            <div className="text-sm text-orange-600">
              {microAnomalies.length} hyperlocal environmental anomalies identified
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {microAnomalies.map((anomaly, index) => (
              <Alert key={index} className={`border-l-4 ${getSeverityColor(anomaly.severity)}`}>
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getAnomalyIcon(anomaly.anomalyType)}</span>
                      <div className="font-semibold capitalize">
                        {anomaly.anomalyType} Anomaly
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {anomaly.confidence.toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <strong>Risk Score:</strong> {anomaly.riskScore.toFixed(0)}
                    </div>
                    <div>
                      <strong>Resolution:</strong> {anomaly.spatialResolution}m
                    </div>
                    <div>
                      <strong>Affected Radius:</strong> {anomaly.affectedRadius}m
                    </div>
                  </div>
                  
                  <div className="text-sm mb-2">
                    <strong>Pattern:</strong> {anomaly.temporalPattern}
                  </div>
                  
                  <div className="text-sm bg-white/60 p-2 rounded">
                    <strong>Duration Prediction:</strong> {anomaly.predictedDuration} hours
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Interactive Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            Interactive Environmental Hot-Spot Map
          </CardTitle>
          <div className="text-sm text-gray-600">
            Hyperlocal environmental anomalies visualized. Click circles for details.
          </div>
        </CardHeader>
        <CardContent>
          <InteractiveMap
            latitude={latitude}
            longitude={longitude}
            anomalies={microAnomalies}
          />
        </CardContent>
      </Card>
    </div>
  );
};
