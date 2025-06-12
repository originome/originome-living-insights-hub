
import React from 'react';
import { LocationInput } from '@/components/LocationInput';
import { CurrentConditions } from '@/components/CurrentConditions';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface ConfigurationSectionProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (type: string) => void;
  onPopulationGroupChange: (group: string) => void;
  externalData: ExternalData;
  isLoading: boolean;
  onRefresh: () => void;
  environmentalParams: EnvironmentalParams;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({
  location,
  buildingType,
  populationGroup,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange,
  externalData,
  isLoading,
  onRefresh,
  environmentalParams
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <LocationInput
        location={location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        onLocationChange={onLocationChange}
        onBuildingTypeChange={onBuildingTypeChange}
        onPopulationGroupChange={onPopulationGroupChange}
      />
      
      <CurrentConditions 
        externalData={externalData}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />
      
      <PerformanceMetrics 
        environmentalParams={environmentalParams}
        externalData={externalData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />
    </div>
  );
};
