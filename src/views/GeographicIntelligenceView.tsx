
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GeoIntelMap from "../components/visualization/GeoIntelMap";
import GeographicHeader from "../components/geographic/GeographicHeader";
import AnomalyDetailsPanel from "../components/geographic/AnomalyDetailsPanel";
import SummaryStatistics from "../components/geographic/SummaryStatistics";
import LoadingState from "../components/geographic/LoadingState";
import { DemoLocation } from "../components/controls/LocationSelector";
import { DemoDataService, MicroAnomaly } from "../services/demoDataService";

const GeographicIntelligenceView: React.FC = () => {
  const [demoLocations] = useState<DemoLocation[]>(DemoDataService.getDemoLocations());
  const [selectedLocation, setSelectedLocation] = useState<DemoLocation>(demoLocations[0]);
  const [microAnomalies, setMicroAnomalies] = useState<MicroAnomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<MicroAnomaly | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'heatmap' | 'markers' | 'compound'>('heatmap');

  useEffect(() => {
    // Generate industry-specific anomalies when location changes
    const generateAnomalies = () => {
      setIsLoading(true);
      setTimeout(() => {
        const anomalies = DemoDataService.generateIndustrySpecificAnomalies(selectedLocation);
        setMicroAnomalies(anomalies);
        setSelectedAnomaly(null); // Clear selected anomaly when changing locations
        setIsLoading(false);
      }, 800);
    };

    generateAnomalies();
  }, [selectedLocation]);

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    const coords = await DemoDataService.useCurrentLocation();
    
    if (coords) {
      // Create a custom location based on current coordinates
      const customLocation: DemoLocation = {
        id: 'current-location',
        name: 'Current Location',
        city: 'Your Location',
        region: '',
        coordinates: coords,
        industry: 'General',
        description: 'Your current geographic location'
      };
      
      setSelectedLocation(customLocation);
    } else {
      setIsLoading(false);
      // Could show a toast notification here
      console.warn('Unable to get current location');
    }
  };

  const criticalAnomalies = microAnomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = microAnomalies.filter(a => a.severity === 'high').length;

  if (isLoading) {
    return <LoadingState selectedLocation={selectedLocation} />;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Location Selector */}
      <GeographicHeader
        selectedLocation={selectedLocation}
        demoLocations={demoLocations}
        onLocationChange={setSelectedLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        criticalAnomalies={criticalAnomalies}
        highAnomalies={highAnomalies}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Map Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Interactive Risk Mapping</CardTitle>
              <Badge variant="outline" className="text-xs">
                Live Data • 30m Resolution • {selectedLocation.industry}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <GeoIntelMap
              center={selectedLocation.coordinates}
              anomalies={microAnomalies}
              viewMode={viewMode}
              onAnomalySelect={setSelectedAnomaly}
              selectedAnomaly={selectedAnomaly}
            />
          </CardContent>
        </Card>

        {/* Anomaly Details Panel */}
        <AnomalyDetailsPanel
          selectedAnomaly={selectedAnomaly}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Summary Statistics */}
      <SummaryStatistics
        microAnomalies={microAnomalies}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default GeographicIntelligenceView;
