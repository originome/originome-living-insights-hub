
import React from 'react';
import { ConfigurationControls } from '@/components/ConfigurationControls';
import { PatternOfTheDayBanner } from '@/components/PatternOfTheDayBanner';
import { PatternRiskAnalysis } from '@/components/PatternRiskAnalysis';
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
  // Generate pattern insights and absenteeism data
  const patternInsight = cosmicData ? 
    PatternEngineService.generatePatternOfTheDay(environmentalParams, externalData, cosmicData, buildingType) :
    null;

  const absenteeismData = cosmicData ?
    PatternEngineService.calculateAbsenteeismRisk(environmentalParams, externalData, cosmicData, buildingType) :
    null;

  return (
    <div className="space-y-8">
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

      {/* Pattern of the Day Banner */}
      <PatternOfTheDayBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
      />

      {/* Advanced Pattern Risk Analysis */}
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
    </div>
  );
};
