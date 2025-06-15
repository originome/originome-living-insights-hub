
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';

const AssetIntelligenceView: React.FC<SharedViewProps> = ({
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
        <h2 className="text-2xl font-bold mb-4">Asset Intelligence</h2>
        <p className="text-gray-600 mb-4">
          Legacy-asset fingerprinting for {location} - {buildingType}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyan-50 p-4 rounded">
            <h3 className="font-semibold">Building Type</h3>
            <p className="text-lg capitalize">{buildingType}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded">
            <h3 className="font-semibold">Population</h3>
            <p className="text-lg capitalize">{populationGroup}</p>
          </div>
          <div className="bg-lime-50 p-4 rounded">
            <h3 className="font-semibold">System Status</h3>
            <p className="text-lg">Active Learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetIntelligenceView;
