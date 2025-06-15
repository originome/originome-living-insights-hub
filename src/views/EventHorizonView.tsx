
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';

const EventHorizonView: React.FC<SharedViewProps> = ({
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Event Horizon Analysis</h2>
        <p className="text-gray-600 mb-4">
          Real-time environmental risk detection for {location} - {buildingType}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold">Risk Level</h3>
            <p className="text-2xl font-bold text-blue-600">{systemIntelligence.riskLevel.toUpperCase()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold">Active Factors</h3>
            <p className="text-2xl font-bold text-green-600">{systemIntelligence.activeFactors}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-semibold">Confidence</h3>
            <p className="text-2xl font-bold text-purple-600">{systemIntelligence.confidence}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHorizonView;
