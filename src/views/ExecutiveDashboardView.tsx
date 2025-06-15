
import React from 'react';
import { ExecutivePatternBanner } from '@/components/ExecutivePatternBanner';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';
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
    <div className="space-y-8">
      {/* Hero Pattern Banner - Most Prominent */}
      <ExecutivePatternBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />

      {/* Streamlined Executive Summary */}
      <ExecutiveDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* ROI Demonstration - Business Focus */}
      <ScientificROISection
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />
    </div>
  );
};

export default ExecutiveDashboardView;
