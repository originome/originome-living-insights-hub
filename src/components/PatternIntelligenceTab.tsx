
import React from 'react';
import { ConfigurationControls } from '@/components/ConfigurationControls';
import { PatternOfTheDayBanner } from '@/components/PatternOfTheDayBanner';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';
import { PatternEngineService } from '@/services/patternEngineService';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface PatternIntelligenceTabProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
  isCosmicLoading: boolean;
  location: string;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (buildingType: string) => void;
  onPopulationGroupChange: (populationGroup: string) => void;
  onParamChange: (param: string, value: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PatternIntelligenceTab: React.FC<PatternIntelligenceTabProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup,
  isCosmicLoading,
  location,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange,
  onParamChange,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Configuration Controls */}
      <ConfigurationControls
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
        onParamChange={onParamChange}
      />

      {/* Pattern of the Day - Main Insight */}
      <PatternOfTheDayBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* Intelligent Alert System - Compound Risk Detection */}
      <IntelligentAlertSystem
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />
    </div>
  );
};
