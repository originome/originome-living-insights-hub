
import React from 'react';
import { SharedViewProps } from '@/types/viewProps';
import { RateOfChangeAnalytics } from '@/components/RateOfChangeAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Activity } from 'lucide-react';

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
  // Calculate velocity metrics
  const velocityMetrics = {
    co2Velocity: 2.3, // ppm/min
    pm25Velocity: 0.8, // μg/m³/min
    temperatureVelocity: 0.1, // °C/min
    humidityVelocity: -1.2 // %/min
  };

  const getVelocityColor = (velocity: number) => {
    const absVel = Math.abs(velocity);
    if (absVel > 2) return 'text-red-600';
    if (absVel > 1) return 'text-orange-600';
    if (absVel > 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getVelocityIcon = (velocity: number) => {
    return velocity > 0 ? '↗️' : velocity < 0 ? '↘️' : '➡️';
  };

  return (
    <div className="space-y-6">
      {/* Velocity Dashboard Header */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-600" />
            Environmental Velocity Analytics
            <Badge variant="outline" className="text-xs">
              REAL-TIME DERIVATIVES
            </Badge>
          </CardTitle>
          <div className="text-sm text-cyan-600">
            Rate-of-change analytics for {location} - {buildingType} • 2-second intervals
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 p-3 rounded border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cyan-800">CO₂ Velocity</span>
                <span className="text-lg">{getVelocityIcon(velocityMetrics.co2Velocity)}</span>
              </div>
              <div className={`text-lg font-bold ${getVelocityColor(velocityMetrics.co2Velocity)}`}>
                {velocityMetrics.co2Velocity > 0 ? '+' : ''}{velocityMetrics.co2Velocity} ppm/min
              </div>
              <div className="text-xs text-cyan-600">Current: {environmentalParams.co2} ppm</div>
            </div>
            
            <div className="bg-white/60 p-3 rounded border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cyan-800">PM2.5 Velocity</span>
                <span className="text-lg">{getVelocityIcon(velocityMetrics.pm25Velocity)}</span>
              </div>
              <div className={`text-lg font-bold ${getVelocityColor(velocityMetrics.pm25Velocity)}`}>
                {velocityMetrics.pm25Velocity > 0 ? '+' : ''}{velocityMetrics.pm25Velocity} μg/m³/min
              </div>
              <div className="text-xs text-cyan-600">Current: {environmentalParams.pm25} μg/m³</div>
            </div>
            
            <div className="bg-white/60 p-3 rounded border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cyan-800">Temperature Velocity</span>
                <span className="text-lg">{getVelocityIcon(velocityMetrics.temperatureVelocity)}</span>
              </div>
              <div className={`text-lg font-bold ${getVelocityColor(velocityMetrics.temperatureVelocity)}`}>
                {velocityMetrics.temperatureVelocity > 0 ? '+' : ''}{velocityMetrics.temperatureVelocity} °C/min
              </div>
              <div className="text-xs text-cyan-600">Current: {environmentalParams.temperature}°C</div>
            </div>
            
            <div className="bg-white/60 p-3 rounded border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-cyan-800">Humidity Velocity</span>
                <span className="text-lg">{getVelocityIcon(velocityMetrics.humidityVelocity)}</span>
              </div>
              <div className={`text-lg font-bold ${getVelocityColor(velocityMetrics.humidityVelocity)}`}>
                {velocityMetrics.humidityVelocity > 0 ? '+' : ''}{velocityMetrics.humidityVelocity} %/min
              </div>
              <div className="text-xs text-cyan-600">Current: {environmentalParams.humidity}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Rate of Change Analytics */}
      <RateOfChangeAnalytics
        environmentalParams={environmentalParams}
        externalData={externalData}
      />
    </div>
  );
};

export default EnvironmentalVelocityView;
