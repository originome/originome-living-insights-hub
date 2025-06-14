
import React, { useEffect } from 'react';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PatternOfTheDayBanner } from '@/components/PatternOfTheDayBanner';
import { ConfigurationControls } from '@/components/ConfigurationControls';
import { PatternRiskAnalysis } from '@/components/PatternRiskAnalysis';
import { AnalysisDatabase } from '@/components/AnalysisDatabase';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useToast } from '@/hooks/use-toast';
import { PatternEngineService } from '@/services/patternEngineService';

const Index = () => {
  const { toast } = useToast();
  
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
    PatternEngineService.generatePatternOfTheDay(environmentalParams, externalData, cosmicData) :
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Originome Branded Header */}
      <OriginomeHeader 
        location={externalData.location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
      />
      
      {/* Original Dashboard Header */}
      <DashboardHeader 
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
        isLoading={isLoading}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
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

        {/* Pattern of the Day Banner - TOP PRIORITY */}
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

        <AnalysisDatabase
          environmentalParams={environmentalParams}
          externalData={externalData}
          cosmicData={cosmicData}
          buildingType={buildingType}
          populationGroup={populationGroup}
          isCosmicLoading={isCosmicLoading}
        />
      </div>
    </div>
  );
};

export default Index;
