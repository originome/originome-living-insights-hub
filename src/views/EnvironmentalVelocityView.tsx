import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Zap, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VelocityChart from "../components/visualization/VelocityChart";

interface VelocityPattern {
  parameter: string;
  description: string;
  currentValue: number;
  velocity: number; // First derivative (rate of change)
  acceleration: number; // Second derivative
  unit: string;
  velocityUnit: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  alertThreshold: number;
  historicalData: Array<{
    timestamp: string;
    value: number;
    velocity: number;
  }>;
}

const EnvironmentalVelocityView: React.FC = () => {
  const [velocityData, setVelocityData] = useState<VelocityPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate realistic velocity data for demonstration
    const generateVelocityData = () => {
      const now = new Date();
      const generateTimeSeries = (baseValue: number, volatility: number) => {
        return Array.from({ length: 24 }, (_, i) => {
          const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000).toISOString();
          const noise = (Math.random() - 0.5) * volatility;
          const value = baseValue + noise + Math.sin(i * 0.3) * (volatility * 0.5);
          const velocity = i > 0 ? (value - (baseValue + (Math.random() - 0.5) * volatility)) / 1 : 0;
          return { timestamp, value, velocity };
        });
      };

      const demoData: VelocityPattern[] = [
        {
          parameter: 'Cognitive Fatigue Risk Velocity',
          description: 'Rate-of-change in CO₂ concentration',
          currentValue: 418.7,
          velocity: 2.3,
          acceleration: 0.12,
          unit: 'ppm',
          velocityUnit: 'ppm/hr (dCO₂/dt)',
          riskLevel: 'moderate',
          trend: 'increasing',
          alertThreshold: 3.0,
          historicalData: generateTimeSeries(418, 2.5)
        },
        {
          parameter: 'Respiratory Irritant Acceleration',
          description: 'Acceleration of PM2.5 particle concentration',
          currentValue: 35.2,
          velocity: -1.8,
          acceleration: -0.34,
          unit: 'μg/m³',
          velocityUnit: 'μg/m³/hr (dPM/dt)',
          riskLevel: 'high',
          trend: 'decreasing',
          alertThreshold: 2.5,
          historicalData: generateTimeSeries(35, 4.2)
        },
        {
          parameter: 'Mechanical Stress Index',
          description: 'Rate-of-change in thermal differential',
          currentValue: 23.4,
          velocity: 0.8,
          acceleration: 0.05,
          unit: '°C',
          velocityUnit: '°C/hr (dTemp/dt)',
          riskLevel: 'low',
          trend: 'increasing',
          alertThreshold: 1.2,
          historicalData: generateTimeSeries(23, 1.5)
        },
        {
          parameter: 'Corrosion/Mold Risk Acceleration',
          description: 'Acceleration of atmospheric humidity',
          currentValue: 67.3,
          velocity: 4.2,
          acceleration: 0.67,
          unit: '%',
          velocityUnit: '%/hr (dHum/dt)',
          riskLevel: 'critical',
          trend: 'increasing',
          alertThreshold: 3.5,
          historicalData: generateTimeSeries(67, 5.1)
        },
        {
          parameter: 'Barometric Cascade Trigger',
          description: 'Velocity of atmospheric pressure change',
          currentValue: 1013.8,
          velocity: -2.1,
          acceleration: -0.28,
          unit: 'hPa',
          velocityUnit: 'hPa/hr (dPress/dt)',
          riskLevel: 'moderate',
          trend: 'decreasing',
          alertThreshold: 2.0,
          historicalData: generateTimeSeries(1013, 3.2)
        },
        {
          parameter: 'Structural Load Fluctuation',
          description: 'Rate-of-change in wind speed impacting assets',
          currentValue: 12.7,
          velocity: 1.5,
          acceleration: 0.19,
          unit: 'km/h',
          velocityUnit: 'km/h/hr (dWind/dt)',
          riskLevel: 'low',
          trend: 'stable',
          alertThreshold: 4.0,
          historicalData: generateTimeSeries(12, 2.8)
        }
      ];

      setVelocityData(demoData);
      setIsLoading(false);
    };

    setTimeout(generateVelocityData, 1000);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-green-700 bg-green-100 border-green-300';
    }
  };

  const getTrendIcon = (trend: string, velocity: number) => {
    if (Math.abs(velocity) < 0.1) return <Activity className="h-4 w-4 text-gray-500" />;
    return velocity > 0 ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Calculating Environmental Derivatives...
            </h3>
            <p className="text-slate-600">
              Processing rate-of-change patterns across data streams
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-xl text-green-900">
                  Derivative Pattern Intelligence
                </CardTitle>
                <p className="text-green-700 text-sm">
                  First & second-derivative risk detection • Predictive rate-of-change analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                Real-time Derivative Engine
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Velocity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {velocityData.map((data, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTrendIcon(data.trend, data.velocity)}
                  <div>
                    <h3 className="font-semibold text-slate-900">{data.parameter}</h3>
                    <p className="text-sm text-slate-600">{data.description}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${getRiskColor(data.riskLevel)}`}>
                  {data.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Current Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {data.currentValue.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-600">{data.unit}</div>
                  <div className="text-xs text-slate-500">Current</div>
                </div>
                
                <div>
                  <div className={`text-lg font-bold ${
                    Math.abs(data.velocity) > data.alertThreshold ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {data.velocity > 0 ? '+' : ''}{data.velocity.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-600">{data.velocityUnit}</div>
                  <div className="text-xs text-slate-500">Velocity (δ/δt)</div>
                </div>
                
                <div>
                  <div className={`text-lg font-bold ${
                    Math.abs(data.acceleration) > 0.1 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {data.acceleration > 0 ? '+' : ''}{data.acceleration.toFixed(3)}
                  </div>
                  <div className="text-xs text-slate-600">{data.velocityUnit}/hour</div>
                  <div className="text-xs text-slate-500">Acceleration (δ²/δt²)</div>
                </div>
              </div>

              {/* Velocity Visualization */}
              <VelocityChart data={data} />

              {/* Alert Status */}
              {Math.abs(data.velocity) > data.alertThreshold && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">
                      Velocity Alert Triggered
                    </span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Rate of change ({Math.abs(data.velocity).toFixed(2)} {data.velocityUnit}) 
                    exceeds threshold ({data.alertThreshold} {data.velocityUnit})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Derivative Intelligence Summary */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">First-Derivative Intelligence Summary</h4>
              <p className="text-sm text-slate-600">
                Advanced rate-of-change detection identifies risks before they appear in absolute values
              </p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <div className="font-mono">
                {velocityData.filter(d => Math.abs(d.velocity) > d.alertThreshold).length} parameters 
                exceeding velocity thresholds
              </div>
              <div>Next calculation: 00:18</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
