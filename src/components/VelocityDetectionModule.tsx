
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Zap, Activity, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

interface VelocityData {
  timestamp: string;
  co2: number;
  co2Velocity: number;
  co2Acceleration: number;
  pm25: number;
  pm25Velocity: number;
  temperature: number;
  tempVelocity: number;
}

interface VelocityAlert {
  parameter: string;
  currentVelocity: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  prediction: string;
  timeToImpact: number; // minutes
}

interface VelocityDetectionModuleProps {
  environmentalParams: any;
  externalData: any;
}

export const VelocityDetectionModule: React.FC<VelocityDetectionModuleProps> = ({
  environmentalParams,
  externalData
}) => {
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [velocityAlerts, setVelocityAlerts] = useState<VelocityAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [processingRate, setProcessingRate] = useState(0);

  useEffect(() => {
    // Initialize with some historical data
    const initialData = generateInitialData();
    setVelocityData(initialData);

    const interval = setInterval(() => {
      if (isMonitoring) {
        const newDataPoint = generateVelocityDataPoint();
        setVelocityData(prev => [...prev, newDataPoint].slice(-20)); // Keep last 20 points
        
        // Check for velocity alerts
        const alerts = detectVelocityAlerts(newDataPoint);
        setVelocityAlerts(alerts);
        
        // Update processing rate
        setProcessingRate(prev => prev + 1);
      }
    }, 2000); // Update every 2 seconds for high-frequency analysis

    return () => clearInterval(interval);
  }, [environmentalParams, isMonitoring]);

  const generateInitialData = (): VelocityData[] => {
    const data: VelocityData[] = [];
    const now = new Date();
    
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2000);
      const co2 = environmentalParams.co2 + (Math.random() - 0.5) * 50;
      const pm25 = Math.max(0, environmentalParams.pm25 + (Math.random() - 0.5) * 10);
      const temperature = environmentalParams.temperature + (Math.random() - 0.5) * 2;
      
      // Calculate velocities based on previous point
      const prevData = data[data.length - 1];
      const co2Velocity = prevData ? (co2 - prevData.co2) * 30 : 0;
      const pm25Velocity = prevData ? (pm25 - prevData.pm25) * 30 : 0;
      const tempVelocity = prevData ? (temperature - prevData.temperature) * 30 : 0;
      const co2Acceleration = prevData ? (co2Velocity - prevData.co2Velocity) : 0;

      data.push({
        timestamp: timestamp.toLocaleTimeString(),
        co2,
        co2Velocity,
        co2Acceleration,
        pm25,
        pm25Velocity,
        temperature,
        tempVelocity
      });
    }
    
    return data;
  };

  const generateVelocityDataPoint = (): VelocityData => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    
    // Simulate realistic velocity calculations with occasional spikes
    const suddenChange = Math.random() < 0.15; // 15% chance of sudden change
    
    const co2 = environmentalParams.co2 + (suddenChange ? (Math.random() - 0.5) * 100 : (Math.random() - 0.5) * 20);
    const pm25 = Math.max(0, environmentalParams.pm25 + (suddenChange ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 3));
    const temperature = environmentalParams.temperature + (Math.random() - 0.5) * 2;
    
    // Calculate velocities (rate of change per minute)
    const prevData = velocityData[velocityData.length - 1];
    const co2Velocity = prevData ? (co2 - prevData.co2) * 30 : 0; // Convert to per-minute rate
    const pm25Velocity = prevData ? (pm25 - prevData.pm25) * 30 : 0;
    const tempVelocity = prevData ? (temperature - prevData.temperature) * 30 : 0;
    
    // Calculate acceleration (second derivative)
    const co2Acceleration = prevData ? (co2Velocity - prevData.co2Velocity) : 0;

    return {
      timestamp,
      co2,
      co2Velocity,
      co2Acceleration,
      pm25,
      pm25Velocity,
      temperature,
      tempVelocity
    };
  };

  const detectVelocityAlerts = (currentData: VelocityData): VelocityAlert[] => {
    const alerts: VelocityAlert[] = [];
    
    // CO2 velocity thresholds
    if (Math.abs(currentData.co2Velocity) > 15) {
      alerts.push({
        parameter: 'CO₂',
        currentVelocity: currentData.co2Velocity,
        threshold: 15,
        severity: Math.abs(currentData.co2Velocity) > 25 ? 'critical' : 'high',
        prediction: currentData.co2Velocity > 0 
          ? 'Cognitive performance decline predicted in 8-12 minutes'
          : 'Air quality improvement expected in 5-8 minutes',
        timeToImpact: currentData.co2Velocity > 0 ? 10 : 6
      });
    }
    
    // PM2.5 velocity thresholds
    if (Math.abs(currentData.pm25Velocity) > 5) {
      alerts.push({
        parameter: 'PM2.5',
        currentVelocity: currentData.pm25Velocity,
        threshold: 5,
        severity: Math.abs(currentData.pm25Velocity) > 10 ? 'high' : 'medium',
        prediction: currentData.pm25Velocity > 0
          ? 'Respiratory stress increase predicted in 15-20 minutes'
          : 'Air quality stabilization expected in 10-15 minutes',
        timeToImpact: currentData.pm25Velocity > 0 ? 18 : 12
      });
    }
    
    // Temperature velocity thresholds
    if (Math.abs(currentData.tempVelocity) > 3) {
      alerts.push({
        parameter: 'Temperature',
        currentVelocity: currentData.tempVelocity,
        threshold: 3,
        severity: 'medium',
        prediction: Math.abs(currentData.tempVelocity) > 5
          ? 'Thermal comfort disruption in 5-10 minutes'
          : 'Minor comfort adjustment needed',
        timeToImpact: 8
      });
    }

    return alerts;
  };

  const getVelocityIcon = (velocity: number) => {
    if (velocity > 5) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (velocity < -5) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <Activity className="h-4 w-4 text-blue-600" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                Environmental Velocity Detection
              </CardTitle>
              <div className="text-sm text-purple-600">
                Rate-of-change monitoring • First-derivative risk detection
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isMonitoring ? "default" : "secondary"} className="text-xs">
                {isMonitoring ? "ACTIVE" : "PAUSED"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="text-xs"
              >
                {isMonitoring ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Processing Status */}
          <div className="mb-4 p-3 bg-white/60 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="text-purple-700">
                <strong>Processing Rate:</strong> {processingRate} data points analyzed
              </div>
              <div className="text-purple-600">
                <strong>Frequency:</strong> Every 2 seconds
              </div>
            </div>
          </div>

          {/* Current Velocity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {velocityData.length > 0 && (
              <>
                <div className="text-center p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getVelocityIcon(velocityData[velocityData.length - 1].co2Velocity)}
                    <span className="font-medium">CO₂ Velocity</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {velocityData[velocityData.length - 1].co2Velocity.toFixed(1)}
                  </div>
                  <div className="text-xs text-purple-600">ppm/min</div>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getVelocityIcon(velocityData[velocityData.length - 1].pm25Velocity)}
                    <span className="font-medium">PM2.5 Velocity</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {velocityData[velocityData.length - 1].pm25Velocity.toFixed(1)}
                  </div>
                  <div className="text-xs text-purple-600">μg/m³/min</div>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getVelocityIcon(velocityData[velocityData.length - 1].tempVelocity)}
                    <span className="font-medium">Temp Velocity</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {velocityData[velocityData.length - 1].tempVelocity.toFixed(1)}
                  </div>
                  <div className="text-xs text-purple-600">°C/min</div>
                </div>
              </>
            )}
          </div>

          {/* Velocity Chart */}
          {velocityData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">CO₂ Velocity Trend</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={velocityData.slice(-10)}>
                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ReferenceLine y={15} stroke="red" strokeDasharray="2 2" />
                    <ReferenceLine y={-15} stroke="red" strokeDasharray="2 2" />
                    <Line 
                      type="monotone" 
                      dataKey="co2Velocity" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Red lines indicate velocity alert thresholds (±15 ppm/min)
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Velocity Alerts */}
      {velocityAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Active Velocity Alerts
            </CardTitle>
            <div className="text-sm text-orange-600">
              {velocityAlerts.length} velocity threshold violations detected
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {velocityAlerts.map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                      {alert.parameter} Velocity Alert
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.currentVelocity > 0 ? '+' : ''}{alert.currentVelocity.toFixed(1)}/min
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{alert.prediction}</div>
                  <div className="text-xs text-gray-600">
                    <strong>Time to Impact:</strong> {alert.timeToImpact} minutes • <strong>Threshold:</strong> ±{alert.threshold}/min
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
