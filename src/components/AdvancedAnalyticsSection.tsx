
import React from 'react';
import { GeographicMicroAnomalyPanel } from '@/components/GeographicMicroAnomalyPanel';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
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
  // Only show geographic analysis if we have location data
  if (!externalData.location?.lat || !externalData.location?.lon) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Geographic Micro-Anomaly Detection */}
      <GeographicMicroAnomalyPanel
        latitude={externalData.location.lat}
        longitude={externalData.location.lon}
        location={`${externalData.location.city}, ${externalData.location.region}`}
      />
    </div>
  );
};
