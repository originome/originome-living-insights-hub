
import React from 'react';
import { CosmicConditions } from '@/components/CosmicConditions';
import { CosmicData } from '@/hooks/useCosmicData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap } from 'lucide-react';

interface CosmicConditionsSectionProps {
  cosmicData: CosmicData | null;
  isCosmicLoading: boolean;
}

export const CosmicConditionsSection: React.FC<CosmicConditionsSectionProps> = ({
  cosmicData,
  isCosmicLoading
}) => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Multiscale Environmental Intelligence
          </h2>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          Beyond traditional wellness metrics: Cosmic and environmental forces affecting organizational performance
        </p>
        
        <Alert className="bg-purple-50 border-purple-200 mb-4">
          <Zap className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>What makes Originome different:</strong> Traditional dashboards show individual metrics. 
            Originome reveals hidden patterns across environmental, cosmic, and biological systems that 
            drive organizational performance. This multiscale approach uncovers invisible risks and opportunities 
            that other systems miss entirely.
          </AlertDescription>
        </Alert>
      </div>

      <CosmicConditions
        geomagneticData={cosmicData?.geomagnetic}
        solarData={cosmicData?.solar}
        seasonalData={cosmicData?.seasonal}
        seismicData={cosmicData?.seismic}
        isLoading={isCosmicLoading}
      />
    </div>
  );
};
