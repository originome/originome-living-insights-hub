
import React from 'react';
import { ConfigurationSection } from '@/components/ConfigurationSection';
import { EnvironmentalControls } from '@/components/EnvironmentalControls';
import { WhatMakesOriginomeDifferentModal } from '@/components/WhatMakesOriginomeDifferentModal';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface ConfigurationControlsProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (buildingType: string) => void;
  onPopulationGroupChange: (populationGroup: string) => void;
  externalData: ExternalData;
  isLoading: boolean;
  onRefresh: () => void;
  environmentalParams: EnvironmentalParams;
  onParamChange: (param: string, value: number) => void;
}

export const ConfigurationControls: React.FC<ConfigurationControlsProps> = ({
  location,
  buildingType,
  populationGroup,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange,
  externalData,
  isLoading,
  onRefresh,
  environmentalParams,
  onParamChange
}) => {
  return (
    <>
      {/* Configuration Row */}
      <ConfigurationSection
        location={location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        onLocationChange={onLocationChange}
        onBuildingTypeChange={onBuildingTypeChange}
        onPopulationGroupChange={onPopulationGroupChange}
        externalData={externalData}
        isLoading={isLoading}
        onRefresh={onRefresh}
        environmentalParams={environmentalParams}
      />

      {/* What Makes Originome Different Button */}
      <div className="flex justify-center">
        <WhatMakesOriginomeDifferentModal />
      </div>

      {/* Environmental Controls */}
      <EnvironmentalControls
        params={environmentalParams}
        onParamChange={onParamChange}
        externalData={externalData}
      />
    </>
  );
};
