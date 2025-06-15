
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';

const EnvironmentalVelocityView: React.FC<SharedViewProps> = ({
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
        <h2 className="text-2xl font-bold mb-4">Environmental Velocity Analysis</h2>
        <p className="text-gray-600 mb-4">
          Rate-of-change analytics for {location} - {buildingType}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Temperature Velocity</h3>
            <p className="text-lg">Current: {environmentalParams.temperature}°C</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">CO₂ Velocity</h3>
            <p className="text-lg">Current: {environmentalParams.co2} ppm</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Humidity Velocity</h3>
            <p className="text-lg">Current: {environmentalParams.humidity}%</p>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-semibold mb-2">PM2.5 Velocity</h3>
            <p className="text-lg">Current: {environmentalParams.pm25} μg/m³</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalVelocityView;
