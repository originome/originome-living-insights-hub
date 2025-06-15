import React from 'react';
import { ExecutivePatternBanner } from '@/components/ExecutivePatternBanner';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';
import { SharedViewProps } from '@/types/viewProps';

const ExecutiveDashboardView: React.FC<SharedViewProps> = ({
  location,
  buildingType,
  populationGroup,
  environmentalParams,
  externalData,
  cosmicData,
  isLoading,
  isCosmicLoading,
  systemIntelligence,
  onParamChange,
  onRefresh,
  onTabChange
}) => {
  return (
    <div className="space-y-6">
      <ExecutivePatternBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
        location={location}
        systemIntelligence={systemIntelligence}
        onTabChange={onTabChange}
      />

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
    </div>
  );
};

export default ExecutiveDashboardView;
