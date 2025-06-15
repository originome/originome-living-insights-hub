
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Layers, MapPin, Eye, AlertTriangle } from 'lucide-react';
import LocationSelector, { DemoLocation } from '../controls/LocationSelector';

interface GeographicHeaderProps {
  selectedLocation: DemoLocation;
  demoLocations: DemoLocation[];
  onLocationChange: (location: DemoLocation) => void;
  onUseCurrentLocation: () => void;
  criticalAnomalies: number;
  highAnomalies: number;
  viewMode: 'heatmap' | 'markers' | 'compound';
  onViewModeChange: (mode: 'heatmap' | 'markers' | 'compound') => void;
}

const GeographicHeader: React.FC<GeographicHeaderProps> = ({
  selectedLocation,
  demoLocations,
  onLocationChange,
  onUseCurrentLocation,
  criticalAnomalies,
  highAnomalies,
  viewMode,
  onViewModeChange
}) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <div className="space-y-4">
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
                  onClick={() => onViewModeChange('heatmap')}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Heatmap
                </Button>
                <Button
                  variant={viewMode === 'markers' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('markers')}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Markers
                </Button>
                <Button
                  variant={viewMode === 'compound' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange('compound')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Compound
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-200 pt-4">
            <LocationSelector
              locations={demoLocations}
              selectedLocation={selectedLocation}
              onLocationChange={onLocationChange}
              onUseCurrentLocation={onUseCurrentLocation}
            />
            <div className="mt-2 text-sm text-purple-700">
              <strong>Industry Focus:</strong> {selectedLocation.industry} • {selectedLocation.description}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default GeographicHeader;
