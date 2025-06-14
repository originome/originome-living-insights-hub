import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Clock, AlertCircle } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface RateOfChangeAnalyticsProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
}

interface AccelerationPattern {
  parameter: string;
  velocity: number;
  acceleration: number;
  jerk: number; // third derivative
  suddenChange: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  alertType: 'velocity' | 'acceleration' | 'jerk' | 'sudden_shift';
}

interface FirstDerivativeAlert {
  id: string;
  parameter: string;
  derivativeValue: number;
  alertReason: string;
  riskWindow: string;
  criticalityScore: number;
}

interface DataPoint {
  timestamp: string;
  co2: number;
  pm25: number;
  temperature: number;
  humidity: number;
  velocity_co2: number;
  velocity_pm25: number;
  acceleration_co2: number;
  acceleration_pm25: number;
  jerk_co2: number;
  pressure?: number;
  electromagnetic?: number;
}

export const RateOfChangeAnalytics: React.FC<RateOfChangeAnalyticsProps> = ({
  environmentalParams,
  externalData
}) => {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [streamingActive, setStreamingActive] = useState(true);
  const [processingRate, setProcessingRate] = useState(0);

  // Real-time streaming data architecture
  useEffect(() => {
    const interval = setInterval(() => {
      if (!streamingActive) return;

      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      
      // Simulate realistic variations with occasional sudden changes
      const suddenChangeEvent = Math.random() < 0.05; // 5% chance of sudden change
      const co2Variation = suddenChangeEvent ? (Math.random() - 0.5) * 200 : (Math.random() - 0.5) * 30;
      const pm25Variation = suddenChangeEvent ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 3;
      
      const newPoint: DataPoint = {
        timestamp,
        co2: Math.max(300, environmentalParams.co2 + co2Variation),
        pm25: Math.max(0, environmentalParams.pm25 + pm25Variation),
        temperature: environmentalParams.temperature + (Math.random() - 0.5) * 1.5,
        humidity: Math.max(0, Math.min(100, environmentalParams.humidity + (Math.random() - 0.5) * 4)),
        pressure: externalData.weather?.pressure ? externalData.weather.pressure + (Math.random() - 0.5) * 10 : 1013,
        electromagnetic: Math.random() * 100 + 50, // Simulated EM field data
        velocity_co2: 0,
        velocity_pm25: 0,
        acceleration_co2: 0,
        acceleration_pm25: 0,
        jerk_co2: 0
      };

      setHistoricalData(prev => {
        const updated = [...prev, newPoint];
        
        // Calculate first, second, and third derivatives
        if (updated.length >= 2) {
          const current = updated[updated.length - 1];
          const previous = updated[updated.length - 2];
          
          // First derivative (velocity)
          current.velocity_co2 = current.co2 - previous.co2;
          current.velocity_pm25 = current.pm25 - previous.pm25;
          
          if (updated.length >= 3) {
            const prevPrevious = updated[updated.length - 3];
            
            // Second derivative (acceleration)
            current.acceleration_co2 = current.velocity_co2 - (previous.co2 - prevPrevious.co2);
            current.acceleration_pm25 = current.velocity_pm25 - (previous.pm25 - prevPrevious.pm25);
            
            if (updated.length >= 4) {
              const prevPrevPrevious = updated[updated.length - 4];
              
              // Third derivative (jerk)
              const prevAcceleration_co2 = previous.velocity_co2 - (prevPrevious.co2 - prevPrevPrevious.co2);
              current.jerk_co2 = current.acceleration_co2 - prevAcceleration_co2;
            }
          }
        }
        
        // Update processing rate
        setProcessingRate(updated.length);
        
        // Keep only last 25 points for performance
        return updated.slice(-25);
      });
    }, 2000); // Process every 2 seconds for high-frequency analysis

    return () => clearInterval(interval);
  }, [environmentalParams, externalData, streamingActive]);

  // First-derivative risk detection algorithms
  const accelerationPatterns = useMemo((): AccelerationPattern[] => {
    if (historicalData.length < 4) return [];

    const patterns: AccelerationPattern[] = [];
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];

    // CO2 acceleration analysis
    const co2SuddenChange = Math.abs(latest.velocity_co2) > 50;
    patterns.push({
      parameter: 'CO₂ Concentration',
      velocity: latest.velocity_co2,
      acceleration: latest.acceleration_co2,
      jerk: latest.jerk_co2,
      suddenChange: co2SuddenChange,
      riskLevel: co2SuddenChange ? 'critical' : 
                Math.abs(latest.acceleration_co2) > 10 ? 'high' : 
                Math.abs(latest.acceleration_co2) > 5 ? 'moderate' : 'low',
      alertType: co2SuddenChange ? 'sudden_shift' : 
                Math.abs(latest.jerk_co2) > 8 ? 'jerk' : 
                Math.abs(latest.acceleration_co2) > 5 ? 'acceleration' : 'velocity'
    });

    // PM2.5 acceleration analysis
    const pm25SuddenChange = Math.abs(latest.velocity_pm25) > 8;
    patterns.push({
      parameter: 'PM2.5 Levels',
      velocity: latest.velocity_pm25,
      acceleration: latest.acceleration_pm25,
      jerk: 0, // Simplified for PM2.5
      suddenChange: pm25SuddenChange,
      riskLevel: pm25SuddenChange ? 'critical' : 
                Math.abs(latest.acceleration_pm25) > 2 ? 'high' : 
                Math.abs(latest.acceleration_pm25) > 1 ? 'moderate' : 'low',
      alertType: pm25SuddenChange ? 'sudden_shift' : 
                Math.abs(latest.acceleration_pm25) > 1.5 ? 'acceleration' : 'velocity'
    });

    // Atmospheric pressure jumps
    if (latest.pressure && previous.pressure) {
      const pressureVelocity = latest.pressure - previous.pressure;
      const pressureSuddenChange = Math.abs(pressureVelocity) > 5;
      patterns.push({
        parameter: 'Atmospheric Pressure',
        velocity: pressureVelocity,
        acceleration: 0, // Simplified
        jerk: 0,
        suddenChange: pressureSuddenChange,
        riskLevel: pressureSuddenChange ? 'high' : 
                  Math.abs(pressureVelocity) > 3 ? 'moderate' : 'low',
        alertType: pressureSuddenChange ? 'sudden_shift' : 'velocity'
      });
    }

    // Electromagnetic field variations
    if (latest.electromagnetic && previous.electromagnetic) {
      const emVelocity = latest.electromagnetic - previous.electromagnetic;
      const emSuddenChange = Math.abs(emVelocity) > 15;
      patterns.push({
        parameter: 'EM Field Intensity',
        velocity: emVelocity,
        acceleration: 0,
        jerk: 0,
        suddenChange: emSuddenChange,
        riskLevel: emSuddenChange ? 'high' : 'low',
        alertType: emSuddenChange ? 'sudden_shift' : 'velocity'
      });
    }

    return patterns.filter(p => p.riskLevel !== 'low');
  }, [historicalData]);

  // Generate first-derivative alerts
  const firstDerivativeAlerts = useMemo((): FirstDerivativeAlert[] => {
    const alerts: FirstDerivativeAlert[] = [];

    accelerationPatterns.forEach((pattern, index) => {
      if (pattern.riskLevel === 'critical' || pattern.riskLevel === 'high') {
        alerts.push({
          id: `alert_${index}`,
          parameter: pattern.parameter,
          derivativeValue: pattern.alertType === 'acceleration' ? pattern.acceleration : pattern.velocity,
          alertReason: pattern.suddenChange ? 
            `Sudden ${pattern.velocity > 0 ? 'spike' : 'drop'} detected` :
            `${pattern.alertType} threshold exceeded`,
          riskWindow: pattern.suddenChange ? '5-15 minutes' : '15-30 minutes',
          criticalityScore: pattern.riskLevel === 'critical' ? 95 : 75
        });
      }
    });

    return alerts.sort((a, b) => b.criticalityScore - a.criticalityScore);
  }, [accelerationPatterns]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'sudden_shift': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'jerk': return <Zap className="h-4 w-4 text-purple-600" />;
      case 'acceleration': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Processing Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-600" />
            Real-Time Derivative Analytics Engine
            <Badge variant={streamingActive ? "default" : "secondary"} className="text-xs">
              {streamingActive ? "STREAMING" : "PAUSED"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-cyan-600">
            First-derivative risk detection processing {processingRate} data points • 2-second intervals
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-cyan-700">
            Immediate response architecture: Velocity → Acceleration → Jerk analysis in real-time
          </div>
        </CardContent>
      </Card>

      {/* First-Derivative Alerts */}
      {firstDerivativeAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Derivative-Based Alerts
            </CardTitle>
            <div className="text-sm text-orange-600">
              Velocity-based triggers detecting acceleration patterns
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {firstDerivativeAlerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-orange-400">
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-orange-800">{alert.parameter}</div>
                    <div className="flex items-center gap-2">
                      {getAlertIcon('acceleration')}
                      <Badge variant="destructive" className="text-xs">
                        Critical: {alert.criticalityScore}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-orange-700 mb-2">
                    <strong>Alert Reason:</strong> {alert.alertReason} • 
                    <strong> Derivative Value:</strong> {alert.derivativeValue.toFixed(2)}
                  </div>
                  <div className="text-xs text-orange-800 bg-white/60 p-2 rounded">
                    <strong>Risk Window:</strong> {alert.riskWindow} • Pattern detected through first-derivative analysis
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Acceleration Pattern Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {accelerationPatterns.map((pattern, index) => (
          <Card key={index} className={`border ${getRiskColor(pattern.riskLevel)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">{pattern.parameter}</div>
                <div className="flex items-center gap-1">
                  {getAlertIcon(pattern.alertType)}
                  {pattern.suddenChange && <AlertCircle className="h-3 w-3 text-red-600" />}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-600">Velocity (1st)</div>
                  <div className="font-bold">{pattern.velocity.toFixed(2)}/min</div>
                </div>
                <div>
                  <div className="text-gray-600">Acceleration (2nd)</div>
                  <div className="font-bold">{pattern.acceleration.toFixed(2)}/min²</div>
                </div>
              </div>
              
              {pattern.jerk !== 0 && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-600">Jerk (3rd): </span>
                  <span className="font-medium">{pattern.jerk.toFixed(2)}/min³</span>
                </div>
              )}
              
              {pattern.suddenChange && (
                <div className="mt-2 text-xs bg-red-100 p-1 rounded text-red-800">
                  ⚠️ Sudden change pattern detected
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Derivative Visualization */}
      {historicalData.length > 8 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Velocity & Acceleration Streams</CardTitle>
            <div className="text-xs text-gray-600">
              Real-time first and second derivative monitoring
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData.slice(-15)}>
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
                  dataKey="acceleration_co2" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="CO₂ Acceleration"
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity_pm25" 
                  stroke="#10b981" 
                  strokeWidth={1}
                  name="PM2.5 Velocity"
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-700">
              <strong>Derivative Engine Status:</strong> Processing {accelerationPatterns.length} acceleration patterns • 
              {firstDerivativeAlerts.length} active alerts
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            High-frequency analysis: 2-second intervals • Next derivative calculation: ~2 seconds
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
