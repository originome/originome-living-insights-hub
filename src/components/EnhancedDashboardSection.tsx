
import React from 'react';
import { MultiFactorRiskMatrix } from '@/components/MultiFactorRiskMatrix';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';
import { RealTimeAnalyticsDashboard } from '@/components/RealTimeAnalyticsDashboard';
import { BusinessDriverVisualization } from '@/components/BusinessDriverVisualization';
import { CascadePreventionPlaybook } from '@/components/CascadePreventionPlaybook';
import { TechnicalArchitectureSection } from '@/components/TechnicalArchitectureSection';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';

interface EnhancedDashboardSectionProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
}

export const EnhancedDashboardSection: React.FC<EnhancedDashboardSectionProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup
}) => {
  // Calculate overall risk level for cascade prevention
  const calculateOverallRisk = () => {
    const riskFactors = [
      environmentalParams.co2 > 800 ? 25 : 0,
      environmentalParams.pm25 > 20 ? 20 : 0,
      Math.abs(environmentalParams.temperature - 21) > 3 ? 15 : 0,
      cosmicData && cosmicData.geomagnetic.kpIndex > 4 ? 20 : 0,
      environmentalParams.humidity > 60 || environmentalParams.humidity < 30 ? 10 : 0
    ];
    return riskFactors.reduce((sum, risk) => sum + risk, 0);
  };

  const overallRisk = calculateOverallRisk();
  const activeAlerts = []; // This would come from the alert system in a real implementation

  return (
    <>
      {/* Technical Architecture Section - New Priority */}
      <TechnicalArchitectureSection
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />

      {/* Real-Time Analytics Dashboard */}
      <RealTimeAnalyticsDashboard
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />

      {/* Multi-Factor Risk Matrix and Intelligent Alerts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MultiFactorRiskMatrix
          environmentalParams={environmentalParams}
          externalData={externalData}
          cosmicData={cosmicData}
          buildingType={buildingType}
        />
        <IntelligentAlertSystem
          environmentalParams={environmentalParams}
          externalData={externalData}
          cosmicData={cosmicData}
          buildingType={buildingType}
        />
      </div>

      {/* Business Driver Visualization */}
      <BusinessDriverVisualization
        environmentalParams={environmentalParams}
        buildingType={buildingType}
      />

      {/* Cascade Prevention Playbook */}
      <CascadePreventionPlaybook
        currentRiskLevel={overallRisk}
        activeAlerts={activeAlerts}
      />
    </>
  );
};
