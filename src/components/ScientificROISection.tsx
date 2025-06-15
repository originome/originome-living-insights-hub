
import React from 'react';
import { PatternEnginePanel } from '@/components/PatternEnginePanel';
import { ROIDemonstrationInterface } from '@/components/ROIDemonstrationInterface';
import { PatternEngineService } from '@/services/patternEngineService';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface ScientificROISectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  occupantCount?: number;
}

export const ScientificROISection: React.FC<ScientificROISectionProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  occupantCount = 100
}) => {
  const patternInsight = PatternEngineService.generatePatternOfTheDay(
    environmentalParams,
    cosmicData,
    externalData,
    buildingType
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Pattern Engine with Scientific Integration */}
      <PatternEnginePanel 
        patternInsight={patternInsight} 
        showROIHighlight={true}
      />

      {/* Comprehensive ROI Demonstration */}
      <ROIDemonstrationInterface
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        occupantCount={occupantCount}
      />
    </div>
  );
};
