
import React from 'react';
import { ExecutivePatternBanner } from '@/components/ExecutivePatternBanner';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';
import { SystemIntelligenceHeader } from '@/components/SystemIntelligenceHeader';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';

const ExecutiveDashboardView: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* System Intelligence Platform Header */}
      <SystemIntelligenceHeader
        location={location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
        cosmicLastUpdated={cosmicLastUpdated}
        onLocationChange={handleLocationChange}
        onBuildingTypeChange={handleBuildingTypeChange}
        onPopulationGroupChange={handlePopulationGroupChange}
        onRefresh={() => {
          refreshData();
          refreshCosmicData();
        }}
      />

      {/* Hero Pattern Intelligence Engine - Most Prominent */}
      <ExecutivePatternBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* Strategic Business Intelligence Dashboard */}
      <ExecutiveDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* ROI & Strategic Value Demonstration */}
      <ScientificROISection
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        occupantCount={100}
      />
    </div>
  );
};

export default ExecutiveDashboardView;
