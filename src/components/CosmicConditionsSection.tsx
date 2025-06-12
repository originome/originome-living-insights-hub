
import React from 'react';
import { CosmicConditions } from '@/components/CosmicConditions';
import { CosmicData } from '@/hooks/useCosmicData';

interface CosmicConditionsSectionProps {
  cosmicData: CosmicData | null;
  isCosmicLoading: boolean;
}

export const CosmicConditionsSection: React.FC<CosmicConditionsSectionProps> = ({
  cosmicData,
  isCosmicLoading
}) => {
  if (!cosmicData) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Multiscale Environmental Intelligence
        </h2>
        <p className="text-gray-600 text-sm">
          Cosmic and environmental forces affecting organizational performance - data sources beyond traditional wellness metrics
        </p>
      </div>
      <CosmicConditions
        geomagneticData={cosmicData.geomagnetic}
        solarData={cosmicData.solar}
        seasonalData={cosmicData.seasonal}
        seismicData={cosmicData.seismic}
        isLoading={isCosmicLoading}
      />
    </div>
  );
};
