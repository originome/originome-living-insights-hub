
import React from 'react';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';
import { RealTimeStreamingDashboard } from '@/components/RealTimeStreamingDashboard';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useLocationState } from '@/hooks/useLocationState';
import { useState } from 'react';

const ExecutiveDashboardView: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* Executive Summary Dashboard */}
      <ExecutiveDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* Real-Time Intelligence Engine for C-Suite */}
      <RealTimeStreamingDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        streamingActive={streamingActive}
        onToggleStreaming={() => setStreamingActive(!streamingActive)}
      />

      {/* Scientific ROI Demonstration */}
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
