
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, MapPin, Share, Download } from 'lucide-react';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';
import { CompoundRiskMatrix } from '@/components/CompoundRiskMatrix';
import { RateOfChangeAnalytics } from '@/components/RateOfChangeAnalytics';
import { PatternIntelligenceTab } from '@/components/PatternIntelligenceTab';
import { AssetPerformanceTab } from '@/components/AssetPerformanceTab';
import { AnalyticsTrendsTab } from '@/components/AnalyticsTrendsTab';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
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
        title: "Data Fetch Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (cosmicError) {
      toast({
        title: "Cosmic Data Error",
        description: cosmicError,
        variant: "destructive",
      });
    }
  }, [cosmicError, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Originome Branded Header */}
      <OriginomeHeader 
        location={externalData.location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
      />
      
      {/* Context Information Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  {buildingType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {populationGroup}
                </Badge>
                {externalData.location && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {externalData.location.city}, {externalData.location.region}
                  </Badge>
                )}
              </div>
              
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-600 hover:text-gray-800"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="text-sm font-medium">
              Pattern Intelligence
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-sm font-medium">
              Compound Risk Matrix
            </TabsTrigger>
            <TabsTrigger value="assets" className="text-sm font-medium">
              Asset Performance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm font-medium">
              Analytics & Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PatternIntelligenceTab
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              isCosmicLoading={isCosmicLoading}
              onLocationChange={handleLocationChange}
              onBuildingTypeChange={handleBuildingTypeChange}
              onPopulationGroupChange={handlePopulationGroupChange}
              onParamChange={handleParamChange}
              onRefresh={refreshData}
              isLoading={isLoading}
              location={location}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <IntelligentAlertSystem
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <AssetPerformanceTab
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              isCosmicLoading={isCosmicLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTrendsTab
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              isCosmicLoading={isCosmicLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
