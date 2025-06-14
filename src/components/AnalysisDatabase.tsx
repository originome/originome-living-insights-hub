
import React from 'react';
import { CosmicConditionsSection } from '@/components/CosmicConditionsSection';
import { AnalysisSection } from '@/components/AnalysisSection';
import { LiteratureDatabase } from '@/components/LiteratureDatabase';
import { HistoricalInsightPanel } from '@/components/HistoricalInsightPanel';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';
import { getRelevantCitations } from '@/utils/literatureCitations';

interface AnalysisDatabaseProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
  isCosmicLoading: boolean;
}

export const AnalysisDatabase: React.FC<AnalysisDatabaseProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup,
  isCosmicLoading
}) => {
  return (
    <>
      {/* Historical Insight Panel */}
      <HistoricalInsightPanel />

      {/* Cosmic & Environmental Forces Section */}
      <CosmicConditionsSection
        cosmicData={cosmicData}
        isCosmicLoading={isCosmicLoading}
      />

      {/* Analysis and Insights Row */}
      <AnalysisSection
        environmentalParams={environmentalParams}
        externalData={externalData}
        buildingType={buildingType}
        populationGroup={populationGroup}
        getRelevantCitations={() => getRelevantCitations(environmentalParams)}
      />

      {/* Literature Database */}
      <LiteratureDatabase />
    </>
  );
};
