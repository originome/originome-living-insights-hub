
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, MapPin, Share, Download, Zap } from 'lucide-react';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { RealTimeStreamingDashboard } from '@/components/RealTimeStreamingDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';
import { GeographicMicroAnomalyPanel } from '@/components/GeographicMicroAnomalyPanel';
import { AssetLearningPanel } from '@/components/AssetLearningPanel';
import { CrossDomainCorrelationPanel } from '@/components/CrossDomainCorrelationPanel';
import { InteractivePatternExplorer } from '@/components/InteractivePatternExplorer';
import { CompoundRiskMatrix } from '@/components/CompoundRiskMatrix';
import { RateOfChangeAnalytics } from '@/components/RateOfChangeAnalytics';
import { PredictiveAnalyticsPanel } from '@/components/PredictiveAnalyticsPanel';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('executive');
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

  // Calculate system intelligence
  const getSystemIntelligence = () => {
    const riskFactors = [];
    if (environmentalParams.co2 > 800) riskFactors.push('cognitive_decline');
    if (environmentalParams.pm25 > 25) riskFactors.push('health_risks');
    if (cosmicData?.geomagnetic?.kpIndex > 4) riskFactors.push('system_sensitivity');
    
    const overallRiskLevel = riskFactors.length === 0 ? 'optimal' : 
                           riskFactors.length <= 1 ? 'low' :
                           riskFactors.length <= 2 ? 'moderate' : 'high';
    
    return {
      riskLevel: overallRiskLevel,
      activeFactors: riskFactors.length,
      confidence: 95 - (riskFactors.length * 5)
    };
  };

  const systemIntelligence = getSystemIntelligence();

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
      {/* Streamlined Header */}
      <OriginomeHeader 
        location={externalData.location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
      />
      
      {/* Critical Alert Bar - Upper Left Priority */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-red-600 animate-pulse" />
              <span className="text-sm font-medium text-red-800">
                Real-Time Pattern Intelligence Active
              </span>
              <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
                {streamingActive ? "STREAMING" : "PAUSED"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="executive" className="text-sm font-medium">
              Executive Dashboard
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="text-sm font-medium">
              Pattern Intelligence
            </TabsTrigger>
            <TabsTrigger value="geographic" className="text-sm font-medium">
              Geographic Anomalies
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-sm font-medium">
              Asset Learning
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-sm font-medium">
              Cross-Domain
            </TabsTrigger>
          </TabsList>

          {/* Executive Dashboard - Primary Focus */}
          <TabsContent value="executive" className="space-y-4">
            <ExecutiveDashboard
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              location={location}
              systemIntelligence={systemIntelligence}
            />

            <ScientificROISection
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              occupantCount={100}
              location={location}
              systemIntelligence={systemIntelligence}
            />
          </TabsContent>

          {/* Pattern Intelligence Tab - Technical Deep Dive */}
          <TabsContent value="intelligence" className="space-y-4">
            {/* Real-Time Streaming Dashboard - Top Priority */}
            <RealTimeStreamingDashboard
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              streamingActive={streamingActive}
              onToggleStreaming={() => setStreamingActive(!streamingActive)}
            />

            {/* Interactive Pattern Explorer */}
            <InteractivePatternExplorer
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              onLocationChange={handleLocationChange}
              onBuildingTypeChange={handleBuildingTypeChange}
              onPopulationGroupChange={handlePopulationGroupChange}
              onParamChange={handleParamChange}
              location={location}
              populationGroup={populationGroup}
            />

            {/* Compound Risk & Rate of Change - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <CompoundRiskMatrix
                environmentalParams={environmentalParams}
                externalData={externalData}
                cosmicData={cosmicData}
                buildingType={buildingType}
              />
              <RateOfChangeAnalytics
                environmentalParams={environmentalParams}
                externalData={externalData}
              />
            </div>

            {/* Predictive Analytics */}
            <PredictiveAnalyticsPanel
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
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

          {/* Asset-Specific Learning */}
          <TabsContent value="assets" className="space-y-4">
            {externalData.location && (
              <AssetLearningPanel
                buildingType={buildingType}
                location={{ lat: externalData.location.lat, lon: externalData.location.lon }}
                currentConditions={environmentalParams}
              />
            )}
          </TabsContent>

          {/* Cross-Sector Correlations */}
          <TabsContent value="correlations" className="space-y-4">
            <CrossDomainCorrelationPanel
              currentSector={buildingType}
              environmentalData={environmentalParams}
              buildingType={buildingType}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
