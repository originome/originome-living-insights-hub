
import React, { useState } from 'react';
import { RealTimeStreamingDashboard } from '@/components/RealTimeStreamingDashboard';
import { AdvancedMLPatternDashboard } from '@/components/AdvancedMLPatternDashboard';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface TechnicalArchitectureSectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType?: string;
}

export const TechnicalArchitectureSection: React.FC<TechnicalArchitectureSectionProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType = 'office'
}) => {
  const [streamingActive, setStreamingActive] = useState(true);

  return (
    <>
      {/* Real-Time Streaming Analytics */}
      <RealTimeStreamingDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        streamingActive={streamingActive}
        onToggleStreaming={() => setStreamingActive(!streamingActive)}
      />

      {/* Advanced Pattern Recognition Algorithms */}
      <AdvancedMLPatternDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />
    </>
  );
};
