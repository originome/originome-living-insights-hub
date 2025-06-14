
import React from 'react';
import { CosmicConditionsSection } from '@/components/CosmicConditionsSection';
import { AnalysisSection } from '@/components/AnalysisSection';
import { LiteratureDatabase } from '@/components/LiteratureDatabase';
import { HistoricalInsightPanel } from '@/components/HistoricalInsightPanel';
import { GeographicMicroAnomalyPanel } from '@/components/GeographicMicroAnomalyPanel';
import { AssetLearningPanel } from '@/components/AssetLearningPanel';
import { CrossDomainCorrelationPanel } from '@/components/CrossDomainCorrelationPanel';
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

      {/* Advanced Intelligence Systems Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Micro-Anomaly Detection */}
        {externalData.location && (
          <GeographicMicroAnomalyPanel
            latitude={externalData.location.lat}
            longitude={externalData.location.lon}
            location={externalData.location.city}
          />
        )}

        {/* Asset-Specific Learning System */}
        {externalData.location && (
          <AssetLearningPanel
            buildingType={buildingType}
            location={{ lat: externalData.location.lat, lon: externalData.location.lon }}
            currentConditions={environmentalParams}
          />
        )}
      </div>

      {/* Cross-Domain Correlation Engine */}
      <CrossDomainCorrelationPanel
        currentSector={buildingType}
        environmentalData={environmentalParams}
        buildingType={buildingType}
      />

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
