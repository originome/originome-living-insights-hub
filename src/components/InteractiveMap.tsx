
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle } from 'lucide-react';

interface Anomaly {
  anomalyType: string;
  severity: string;
  riskScore: number;
  affectedRadius: number;
  confidence: number;
}

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  anomalies: Anomaly[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  anomalies
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-blue-50 to-green-50">
        <div className="grid grid-cols-6 grid-rows-4 h-full opacity-10">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Location Pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <MapPin className="h-8 w-8 text-blue-600 drop-shadow-lg" />
        <div className="absolute -bottom-6 -left-8 bg-white px-2 py-1 rounded shadow text-xs font-medium">
          Your Location
        </div>
      </div>

      {/* Anomaly Hotspots */}
      {anomalies.map((anomaly, index) => {
        const offsetX = (index % 3 - 1) * 60 + Math.random() * 20 - 10;
        const offsetY = (Math.floor(index / 3) - 1) * 40 + Math.random() * 20 - 10;
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `calc(50% + ${offsetX}px)`,
              top: `calc(50% + ${offsetY}px)`
            }}
          >
            <div className={`w-4 h-4 rounded-full ${getSeverityColor(anomaly.severity)} animate-pulse`}>
              <div className={`w-8 h-8 rounded-full ${getSeverityColor(anomaly.severity)} opacity-30 absolute -top-2 -left-2 animate-ping`}></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {anomaly.anomalyType} - {anomaly.confidence}% confidence
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur rounded p-2 text-xs">
        <div className="font-medium mb-1">Risk Levels</div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Moderate</span>
          </div>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded px-2 py-1 text-xs font-mono">
        {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
      </div>
    </div>
  );
};

export default InteractiveMap;
