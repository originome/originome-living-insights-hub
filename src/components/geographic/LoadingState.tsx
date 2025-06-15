
import React from 'react';
import { Map } from 'lucide-react';

interface LoadingStateProps {
  selectedLocation: { id: string; industry: string; name: string };
}

const LoadingState: React.FC<LoadingStateProps> = ({ selectedLocation }) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-4">
        <div className="animate-pulse">
          <Map className="h-12 w-12 text-blue-600 mx-auto" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedLocation.id === 'current-location' 
              ? 'Processing Your Location...' 
              : `Scanning ${selectedLocation.industry} Micro-Anomalies...`}
          </h3>
          <p className="text-slate-600">
            Processing hyperlocal environmental signatures for {selectedLocation.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
