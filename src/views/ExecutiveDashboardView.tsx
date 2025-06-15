
import React from 'react';
import { ExecutivePatternBanner } from '@/components/ExecutivePatternBanner';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ScientificROISection } from '@/components/ScientificROISection';

interface ExecutiveDashboardViewProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  environmentalParams: any;
  externalData: any;
  cosmicData: any;
  isLoading: boolean;
  isCosmicLoading: boolean;
  systemIntelligence: {
    riskLevel: string;
    activeFactors: number;
    confidence: number;
  };
  onParamChange: (param: string, value: number) => void;
  onRefresh: () => void;
}

const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  location,
  buildingType,
  populationGroup,
  environmentalParams,
  externalData,
  cosmicData,
  isLoading,
  isCosmicLoading,
  systemIntelligence,
  onParamChange,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Pattern Intelligence Engine - Enhanced with System Context */}
      <ExecutivePatternBanner
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
        location={location}
        systemIntelligence={systemIntelligence}
      />

      {/* Strategic Business Intelligence Dashboard - Cross-Domain Integration */}
      <ExecutiveDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
        location={location}
        systemIntelligence={systemIntelligence}
      />

      {/* ROI & Strategic Value Demonstration - Network Effect Value */}
      <ScientificROISection
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        occupantCount={100}
        location={location}
        systemIntelligence={systemIntelligence}
      />
    </div>
  );
};

export default ExecutiveDashboardView;
