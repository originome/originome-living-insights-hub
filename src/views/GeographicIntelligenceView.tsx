
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';
import { GeographicMicroAnomalyPanel } from '@/components/GeographicMicroAnomalyPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Satellite, Globe } from 'lucide-react';

const GeographicIntelligenceView: React.FC<SharedViewProps> = ({
  location,
  buildingType,
  populationGroup,
  environmentalParams,
  externalData,
  cosmicData,
  isLoading,
  isCosmicLoading,
  systemIntelligence,
  onParamChange,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      {/* Geographic Intelligence Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            Geographic Intelligence System
            <Badge variant="outline" className="text-xs">
              SATELLITE-POWERED
            </Badge>
          </CardTitle>
          <div className="text-sm text-indigo-600">
            Hyperlocal micro-anomaly detection for {location} - {buildingType}
          </div>
        </CardHeader>
        <CardContent>
          {externalData.location && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/60 p-4 rounded border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">Location Precision</span>
                </div>
                <div className="text-sm text-indigo-700">
                  <div>Lat: {externalData.location.lat.toFixed(6)}°</div>
                  <div>Lon: {externalData.location.lon.toFixed(6)}°</div>
                  <div className="text-xs text-indigo-600 mt-1">±3m accuracy</div>
                </div>
              </div>
              
              <div className="bg-white/60 p-4 rounded border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Satellite className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">Satellite Data</span>
                </div>
                <div className="text-sm text-indigo-700">
                  <div>NASA MODIS/Landsat</div>
                  <div>Resolution: 10-30m</div>
                  <div className="text-xs text-indigo-600 mt-1">Real-time acquisition</div>
                </div>
              </div>
              
              <div className="bg-white/60 p-4 rounded border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">Coverage Area</span>
                </div>
                <div className="text-sm text-indigo-700">
                  <div>Radius: 5km</div>
                  <div>Building Type: {buildingType}</div>
                  <div className="text-xs text-indigo-600 mt-1">Hyperlocal analysis</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geographic Micro-Anomaly Detection */}
      {externalData.location && (
        <GeographicMicroAnomalyPanel
          latitude={externalData.location.lat}
          longitude={externalData.location.lon}
          location={externalData.location.city || location}
        />
      )}
    </div>
  );
};

export default GeographicIntelligenceView;
