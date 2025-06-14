
import React from 'react';
import { PredictiveAnalyticsPanel } from '@/components/PredictiveAnalyticsPanel';
import { EnterpriseIntegrationDashboard } from '@/components/EnterpriseIntegrationDashboard';
import { AutomatedReportingDashboard } from '@/components/AutomatedReportingDashboard';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface AdvancedAnalyticsSectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
}

export const AdvancedAnalyticsSection: React.FC<AdvancedAnalyticsSectionProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup
}) => {
  return (
    <>
      {/* Predictive Analytics - Environmental Velocity Forecasting */}
      <PredictiveAnalyticsPanel
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />

      {/* Enterprise Integration Dashboard */}
      <EnterpriseIntegrationDashboard
        environmentalParams={environmentalParams}
      />

      {/* Automated Reporting and Compliance */}
      <AutomatedReportingDashboard
        environmentalParams={environmentalParams}
        buildingType={buildingType}
      />
    </>
  );
};
