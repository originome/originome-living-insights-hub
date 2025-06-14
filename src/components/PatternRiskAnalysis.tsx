
import React from 'react';
import { CompoundRiskMatrix } from '@/components/CompoundRiskMatrix';
import { RateOfChangeAnalytics } from '@/components/RateOfChangeAnalytics';
import { PatternRecognitionEngine } from '@/components/PatternRecognitionEngine';
import { PatternEnginePanel } from '@/components/PatternEnginePanel';
import { AbsenteeismRiskPanel } from '@/components/AbsenteeismRiskPanel';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface PatternRiskAnalysisProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
  patternInsight: any;
  absenteeismData: any;
  isCosmicLoading: boolean;
}

export const PatternRiskAnalysis: React.FC<PatternRiskAnalysisProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup,
  patternInsight,
  absenteeismData,
  isCosmicLoading
}) => {
  return (
    <>
      {/* Advanced Pattern Recognition & Risk Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CompoundRiskMatrix
          environmentalParams={environmentalParams}
          externalData={externalData}
          cosmicData={cosmicData}
          buildingType={buildingType}
        />
        <RateOfChangeAnalytics
          environmentalParams={environmentalParams}
          externalData={externalData}
        />
      </div>

      {/* Machine Learning Pattern Recognition */}
      <PatternRecognitionEngine
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />

      {/* Pattern Engine and Absenteeism Risk Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patternInsight && (
          <PatternEnginePanel
            patternInsight={patternInsight}
            isLoading={isCosmicLoading}
          />
        )}
        {absenteeismData && (
          <AbsenteeismRiskPanel
            absenteeismData={absenteeismData}
            buildingType={buildingType}
            populationGroup={populationGroup}
            isLoading={isCosmicLoading}
          />
        )}
      </div>
    </>
  );
};
