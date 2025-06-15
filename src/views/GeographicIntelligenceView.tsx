
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';

const GeographicIntelligenceView: React.FC<SharedViewProps> = ({
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
        <h2 className="text-2xl font-bold mb-4">Geographic Intelligence</h2>
        <p className="text-gray-600 mb-4">
          Micro-anomaly detection for {location} - {buildingType}
        </p>
        {externalData.location && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Location Coordinates</h3>
              <p>Latitude: {externalData.location.lat}</p>
              <p>Longitude: {externalData.location.lon}</p>
              <p>City: {externalData.location.city}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Weather Conditions</h3>
              {externalData.weather && (
                <>
                  <p>Temperature: {externalData.weather.temperature}°C</p>
                  <p>Humidity: {externalData.weather.humidity}%</p>
                  <p>Pressure: {externalData.weather.pressure} hPa</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeographicIntelligenceView;
