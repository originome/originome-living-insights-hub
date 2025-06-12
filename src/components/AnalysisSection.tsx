
import React from 'react';
import { ChartAnalysis } from '@/components/ChartAnalysis';
import { LiteratureCitations } from '@/components/LiteratureCitations';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { CostBenefitAnalysis } from '@/components/CostBenefitAnalysis';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface AnalysisSectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  buildingType: string;
  populationGroup: string;
  getRelevantCitations: () => any[];
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  environmentalParams,
  externalData,
  buildingType,
  populationGroup,
  getRelevantCitations
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <ChartAnalysis 
          environmentalParams={environmentalParams}
          externalData={externalData}
          buildingType={buildingType}
        />
        
        <LiteratureCitations citations={getRelevantCitations()} />
      </div>
      
      <div className="space-y-6">
        <SmartRecommendations 
          environmentalParams={environmentalParams}
          externalData={externalData}
          buildingType={buildingType}
          populationGroup={populationGroup}
        />
        
        <CostBenefitAnalysis 
          environmentalParams={environmentalParams}
          externalData={externalData}
          buildingType={buildingType}
        />
      </div>
    </div>
  );
};
