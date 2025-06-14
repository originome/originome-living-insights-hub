
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eye, BarChart3, Users, Building } from 'lucide-react';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PatternOfTheDayBanner } from '@/components/PatternOfTheDayBanner';
import { ConfigurationControls } from '@/components/ConfigurationControls';
import { PatternRiskAnalysis } from '@/components/PatternRiskAnalysis';
import { AnalysisDatabase } from '@/components/AnalysisDatabase';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useToast } from '@/hooks/use-toast';
import { PatternEngineService } from '@/services/patternEngineService';
import { AdvancedAnalyticsSection } from '@/components/AdvancedAnalyticsSection';

const Index = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'executive' | 'technical'>('executive');
  
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

  // Add cosmic data integration with correct coordinate access
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

  // Generate pattern insights and absenteeism data
  const patternInsight = cosmicData ? 
    PatternEngineService.generatePatternOfTheDay(environmentalParams, externalData, cosmicData, buildingType) :
    null;

  const absenteeismData = cosmicData ?
    PatternEngineService.calculateAbsenteeismRisk(environmentalParams, externalData, cosmicData, buildingType) :
    null;

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
      
      {/* View Toggle Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => value && setViewMode(value as 'executive' | 'technical')}
                className="bg-gray-100 p-1 rounded-lg"
              >
                <ToggleGroupItem 
                  value="executive" 
                  className="data-[state=on]:bg-white data-[state=on]:shadow-sm px-4 py-2 rounded-md transition-all"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Executive View
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="technical" 
                  className="data-[state=on]:bg-white data-[state=on]:shadow-sm px-4 py-2 rounded-md transition-all"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Technical View
                </ToggleGroupItem>
              </ToggleGroup>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  {buildingType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {populationGroup}
                </Badge>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {viewMode === 'executive' ? 'Simplified insights for decision makers' : 'Detailed technical analysis'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {viewMode === 'executive' ? (
          <>
            {/* Executive Dashboard View */}
            <ExecutiveDashboard
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
            />
          </>
        ) : (
          <>
            {/* Technical Dashboard View */}
            <ConfigurationControls
              location={location}
              buildingType={buildingType}
              populationGroup={populationGroup}
              onLocationChange={handleLocationChange}
              onBuildingTypeChange={handleBuildingTypeChange}
              onPopulationGroupChange={handlePopulationGroupChange}
              externalData={externalData}
              isLoading={isLoading}
              onRefresh={refreshData}
              environmentalParams={environmentalParams}
              onParamChange={handleParamChange}
            />

            {/* Pattern of the Day Banner */}
            <PatternOfTheDayBanner
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
            />

            <PatternRiskAnalysis
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              patternInsight={patternInsight}
              absenteeismData={absenteeismData}		
              isCosmicLoading={isCosmicLoading}
            />

            {/* Advanced Analytics Section */}
            <AdvancedAnalyticsSection
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
            />

            <AnalysisDatabase
              environmentalParams={environmentalParams}
              externalData={externalData}
              cosmicData={cosmicData}
              buildingType={buildingType}
              populationGroup={populationGroup}
              isCosmicLoading={isCosmicLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
