
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, MapPin, Share, Download, Zap } from 'lucide-react';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { RiskEventHorizon } from '@/components/RiskEventHorizon';
import { VelocityDetectionModule } from '@/components/VelocityDetectionModule';
import { GeographicMicroAnomalyPanel } from '@/components/GeographicMicroAnomalyPanel';
import { AssetLearningPanel } from '@/components/AssetLearningPanel';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('event-horizon');
  const [streamingActive, setStreamingActive] = useState(true);
  
  // Use custom hooks for state management
  const {
    location,
    buildingType,
    populationGroup,
    handleLocationChange,
    handleBuildingTypeChange,
    handlePopulationGroupChange
  } = useLocationState();

  const { environmentalParams, handleParamChange } = useEnvironmentalParams();

  const {
    externalData,
    isLoading,
    lastUpdated,
    error,
    refreshData
  } = useApiIntegration(location, buildingType, populationGroup);

  const {
    cosmicData,
    isLoading: isCosmicLoading,
    error: cosmicError,
    lastUpdated: cosmicLastUpdated,
    refreshData: refreshCosmicData
  } = useCosmicData(
    externalData.location?.lat,
    externalData.location?.lon
  );

  useEffect(() => {
    if (error) {
      toast({
        title: "Data Stream Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Enterprise Header */}
      <OriginomeHeader 
        location={externalData.location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
      />
      
      {/* Enterprise Status Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-800">
                Perpetual Risk Monitoring Active
              </span>
              <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
                {streamingActive ? "LIVE INTELLIGENCE" : "PAUSED"}
              </Badge>
              <div className="text-xs text-blue-600">
                Enterprise-Grade • Full Audit Trail • 99.9% Uptime
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Share className="h-3 w-3 mr-1" />
                Share Intelligence
              </Button>
              <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                <Download className="h-3 w-3 mr-1" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="event-horizon" className="text-sm font-medium">
              Risk Event Horizon
            </TabsTrigger>
            <TabsTrigger value="velocity" className="text-sm font-medium">
              Velocity Detection
            </TabsTrigger>
            <TabsTrigger value="geographic" className="text-sm font-medium">
              Micro-Anomaly Map
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-sm font-medium">
              Asset Intelligence
            </TabsTrigger>
          </TabsList>

          {/* Risk Event Horizon - Primary Tab */}
          <TabsContent value="event-horizon" className="space-y-4">
            <RiskEventHorizon
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
            />

            {/* Intelligent Alert System - Compound Patterns */}
            <IntelligentAlertSystem
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
            />
          </TabsContent>

          {/* Velocity Detection Module */}
          <TabsContent value="velocity" className="space-y-4">
            <VelocityDetectionModule
              environmentalParams={environmentalParams}
              externalData={externalData}
            />
          </TabsContent>

          {/* Geographic Micro-Anomaly Detection */}
          <TabsContent value="geographic" className="space-y-4">
            {externalData.location && (
              <GeographicMicroAnomalyPanel
                latitude={externalData.location.lat}
                longitude={externalData.location.lon}
                location={externalData.location.city}
              />
            )}
          </TabsContent>

          {/* Asset-Specific Intelligence */}
          <TabsContent value="assets" className="space-y-4">
            {externalData.location && (
              <AssetLearningPanel
                buildingType={buildingType}
                location={{ lat: externalData.location.lat, lon: externalData.location.lon }}
                currentConditions={environmentalParams}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
