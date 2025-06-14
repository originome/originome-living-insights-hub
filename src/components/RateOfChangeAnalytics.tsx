import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface RateOfChangeAnalyticsProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
}

interface VelocityIndicator {
  parameter: string;
  currentValue: number;
  velocity: number; // change per minute
  acceleration: number; // change in velocity
  trend: 'accelerating' | 'decelerating' | 'stable';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  alertType?: 'velocity' | 'acceleration' | 'threshold';
}

interface DataPoint {
  timestamp: string;
  co2: number;
  pm25: number;
  temperature: number;
  humidity: number;
  velocity_co2: number;
  velocity_pm25: number;
}

export const RateOfChangeAnalytics: React.FC<RateOfChangeAnalyticsProps> = ({
  environmentalParams,
  externalData
}) => {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [streamingActive, setStreamingActive] = useState(true);

  // Simulate real-time data streaming
  useEffect(() => {
    const interval = setInterval(() => {
      if (!streamingActive) return;

      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      
      // Add some realistic variation
      const variation = () => (Math.random() - 0.5) * 0.1;
      
      const newPoint: DataPoint = {
        timestamp,
        co2: environmentalParams.co2 + (Math.random() - 0.5) * 50,
        pm25: Math.max(0, environmentalParams.pm25 + (Math.random() - 0.5) * 5),
        temperature: environmentalParams.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, environmentalParams.humidity + (Math.random() - 0.5) * 5)),
        velocity_co2: 0,
        velocity_pm25: 0
      };

      setHistoricalData(prev => {
        const updated = [...prev, newPoint];
        
        // Calculate velocities
        if (updated.length >= 2) {
          const current = updated[updated.length - 1];
          const previous = updated[updated.length - 2];
          current.velocity_co2 = current.co2 - previous.co2;
          current.velocity_pm25 = current.pm25 - previous.pm25;
        }
        
        // Keep only last 20 points for visualization
        return updated.slice(-20);
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [environmentalParams, streamingActive]);

  const velocityIndicators = useMemo((): VelocityIndicator[] => {
    if (historicalData.length < 3) return [];

    const indicators: VelocityIndicator[] = [];
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    const beforePrevious = historicalData[historicalData.length - 3];

    // CO2 velocity analysis
    const co2Velocity = latest.velocity_co2;
    const co2Acceleration = co2Velocity - (previous.velocity_co2 || 0);
    
    indicators.push({
      parameter: 'CO₂ Concentration',
      currentValue: latest.co2,
      velocity: co2Velocity,
      acceleration: co2Acceleration,
      trend: Math.abs(co2Acceleration) > 2 ? (co2Acceleration > 0 ? 'accelerating' : 'decelerating') : 'stable',
      riskLevel: Math.abs(co2Velocity) > 15 ? 'high' : Math.abs(co2Velocity) > 8 ? 'moderate' : 'low',
      alertType: Math.abs(co2Acceleration) > 5 ? 'acceleration' : Math.abs(co2Velocity) > 10 ? 'velocity' : undefined
    });

    // PM2.5 velocity analysis
    const pm25Velocity = latest.velocity_pm25;
    const pm25Acceleration = pm25Velocity - (previous.velocity_pm25 || 0);
    
    indicators.push({
      parameter: 'PM2.5 Levels',
      currentValue: latest.pm25,
      velocity: pm25Velocity,
      acceleration: pm25Acceleration,
      trend: Math.abs(pm25Acceleration) > 0.5 ? (pm25Acceleration > 0 ? 'accelerating' : 'decelerating') : 'stable',
      riskLevel: Math.abs(pm25Velocity) > 3 ? 'critical' : Math.abs(pm25Velocity) > 1.5 ? 'high' : Math.abs(pm25Velocity) > 0.8 ? 'moderate' : 'low',
      alertType: Math.abs(pm25Acceleration) > 1 ? 'acceleration' : Math.abs(pm25Velocity) > 2 ? 'velocity' : undefined
    });

    return indicators;
  }, [historicalData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decelerating': return <TrendingDown className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-green-700 bg-green-100 border-green-200';
    }
  };

  const activeAlerts = velocityIndicators.filter(indicator => indicator.alertType);

  return (
    <div className="space-y-6">
      {/* Streaming Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Rate-of-Change Analytics
            <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
              {streamingActive ? "LIVE STREAMING" : "PAUSED"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-blue-600">
            Velocity-based risk detection • Processing {historicalData.length} data points
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-blue-700">
            Real-time environmental intelligence detecting acceleration patterns and velocity thresholds
          </div>
        </CardContent>
      </Card>

      {/* Active Velocity Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Velocity Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((indicator, index) => (
              <Alert key={index} className="border-l-4 border-orange-400">
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-orange-800">{indicator.parameter}</div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(indicator.trend)}
                      <Badge variant="outline" className="text-xs">
                        {indicator.alertType?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-orange-700">
                    <strong>Rate of Change:</strong> {indicator.velocity.toFixed(2)} units/min
                    {indicator.acceleration !== 0 && (
                      <span className="ml-2">
                        <strong>Acceleration:</strong> {indicator.acceleration.toFixed(2)} units/min²
                      </span>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Velocity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {velocityIndicators.map((indicator, index) => (
          <Card key={index} className={`border ${getRiskColor(indicator.riskLevel)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">{indicator.parameter}</div>
                {getTrendIcon(indicator.trend)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-600">Current Value</div>
                  <div className="font-bold">{indicator.currentValue.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Velocity</div>
                  <div className="font-bold">{indicator.velocity.toFixed(2)}/min</div>
                </div>
              </div>
              
              {Math.abs(indicator.acceleration) > 0.1 && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-600">Acceleration: </span>
                  <span className="font-medium">{indicator.acceleration.toFixed(2)}/min²</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Charts */}
      {historicalData.length > 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Environmental Velocity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="velocity_co2" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="CO₂ Velocity"
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity_pm25" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="PM2.5 Velocity"
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
