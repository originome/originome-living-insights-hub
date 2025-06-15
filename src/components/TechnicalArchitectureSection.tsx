
import React from 'react';
import { RealTimeStreamingDashboard } from '@/components/RealTimeStreamingDashboard';
import { AdvancedMLPatternDashboard } from '@/components/AdvancedMLPatternDashboard';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface TechnicalArchitectureSectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
}

export const TechnicalArchitectureSection: React.FC<TechnicalArchitectureSectionProps> = ({
  environmentalParams,
  externalData,
  cosmicData
}) => {
  return (
    <>
      {/* Real-Time Streaming Analytics */}
      <RealTimeStreamingDashboard />

      {/* Advanced Pattern Recognition Algorithms */}
      <AdvancedMLPatternDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />
    </>
  );
};
