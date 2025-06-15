import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowRight, Clock, TrendingUp, Zap } from "lucide-react";
import VelocityChart from "../components/visualization/VelocityChart";
import PatternInsightChart from "../components/patterns/PatternInsightChart";

interface VelocityParameter {
  parameter: string;
  currentValue: number;
  velocity: number;
  acceleration: number;
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
  const [velocityData, setVelocityData] = useState<VelocityParameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('co2');

  useEffect(() => {
    // Generate realistic velocity data
    const generateVelocityData = () => {
      const now = new Date();
      
      const generateHistoricalData = (baseValue: number, volatility: number, trend: number) => {
        return Array.from({ length: 24 }, (_, i) => {
          const timestamp = new Date(now.getTime() - (23 - i) * 5 * 60000).toISOString();
          const randomFactor = (Math.random() - 0.5) * volatility;
          const trendFactor = trend * i / 23;
          const value = baseValue + randomFactor + trendFactor;
          const velocity = i === 0 ? 0 : (value - baseValue - (Math.random() - 0.5) * volatility * 0.8 - trend * (i - 1) / 23) / (5 / 60);
          return { timestamp, value, velocity };
        });
      };

      const co2Data = generateHistoricalData(800, 50, 120);
      const tempData = generateHistoricalData(23.2, 0.8, 1.5);
      const pm25Data = generateHistoricalData(18, 5, 12);
      const humidityData = generateHistoricalData(45, 8, -10);
      
      const calculateVelocity = (data: any[]) => {
        const recent = data.slice(-5);
        const velocitySum = recent.reduce((sum, point) => sum + point.velocity, 0);
        return velocitySum / recent.length;
      };
      
      const calculateAcceleration = (data: any[]) => {
        const recent = data.slice(-10);
        if (recent.length < 2) return 0;
        
        const firstHalf = recent.slice(0, 5);
        const secondHalf = recent.slice(-5);
        
        const firstVelocity = firstHalf.reduce((sum, point) => sum + point.velocity, 0) / firstHalf.length;
        const secondVelocity = secondHalf.reduce((sum, point) => sum + point.velocity, 0) / secondHalf.length;
        
        return (secondVelocity - firstVelocity) / ((recent.length - 1) * 5 / 60);
      };
      
      const getRiskLevel = (value: number, velocity: number, acceleration: number, thresholds: any) => {
        if (value > thresholds.criticalValue || velocity > thresholds.criticalVelocity || acceleration > thresholds.criticalAcceleration) {
          return 'critical';
        } else if (value > thresholds.highValue || velocity > thresholds.highVelocity || acceleration > thresholds.highAcceleration) {
          return 'high';
        } else if (value > thresholds.moderateValue || velocity > thresholds.moderateVelocity || acceleration > thresholds.moderateAcceleration) {
          return 'moderate';
        }
        return 'low';
      };
      
      const getTrend = (velocity: number) => {
        if (velocity > 0.5) return 'increasing';
        if (velocity < -0.5) return 'decreasing';
        return 'stable';
      };
      
      const velocityParameters: VelocityParameter[] = [
        {
          parameter: 'CO₂',
          currentValue: co2Data[co2Data.length - 1].value,
          velocity: calculateVelocity(co2Data),
          acceleration: calculateAcceleration(co2Data),
          unit: 'ppm',
          velocityUnit: 'ppm/hr',
          riskLevel: getRiskLevel(co2Data[co2Data.length - 1].value, calculateVelocity(co2Data), calculateAcceleration(co2Data), {
            moderateValue: 800, highValue: 1000, criticalValue: 1200,
            moderateVelocity: 50, highVelocity: 100, criticalVelocity: 150,
            moderateAcceleration: 10, highAcceleration: 20, criticalAcceleration: 30
          }),
          trend: getTrend(calculateVelocity(co2Data)),
          alertThreshold: 100,
          historicalData: co2Data
        },
        {
          parameter: 'Temperature',
          currentValue: tempData[tempData.length - 1].value,
          velocity: calculateVelocity(tempData),
          acceleration: calculateAcceleration(tempData),
          unit: '°C',
          velocityUnit: '°C/hr',
          riskLevel: getRiskLevel(Math.abs(tempData[tempData.length - 1].value - 21), calculateVelocity(tempData), calculateAcceleration(tempData), {
            moderateValue: 2, highValue: 3, criticalValue: 4,
            moderateVelocity: 1, highVelocity: 2, criticalVelocity: 3,
            moderateAcceleration: 0.5, highAcceleration: 1, criticalAcceleration: 1.5
          }),
          trend: getTrend(calculateVelocity(tempData)),
          alertThreshold: 2,
          historicalData: tempData
        },
        {
          parameter: 'PM2.5',
          currentValue: pm25Data[pm25Data.length - 1].value,
          velocity: calculateVelocity(pm25Data),
          acceleration: calculateAcceleration(pm25Data),
          unit: 'μg/m³',
          velocityUnit: 'μg/m³/hr',
          riskLevel: getRiskLevel(pm25Data[pm25Data.length - 1].value, calculateVelocity(pm25Data), calculateAcceleration(pm25Data), {
            moderateValue: 12, highValue: 35, criticalValue: 55,
            moderateVelocity: 5, highVelocity: 10, criticalVelocity: 15,
            moderateAcceleration: 2, highAcceleration: 4, criticalAcceleration: 6
          }),
          trend: getTrend(calculateVelocity(pm25Data)),
          alertThreshold: 10,
          historicalData: pm25Data
        },
        {
          parameter: 'Humidity',
          currentValue: humidityData[humidityData.length - 1].value,
          velocity: calculateVelocity(humidityData),
          acceleration: calculateAcceleration(humidityData),
          unit: '%',
          velocityUnit: '%/hr',
          riskLevel: getRiskLevel(Math.abs(humidityData[humidityData.length - 1].value - 45), calculateVelocity(humidityData), calculateAcceleration(humidityData), {
            moderateValue: 10, highValue: 20, criticalValue: 30,
            moderateVelocity: 5, highVelocity: 10, criticalVelocity: 15,
            moderateAcceleration: 2, highAcceleration: 4, criticalAcceleration: 6
          }),
          trend: getTrend(calculateVelocity(humidityData)),
          alertThreshold: 10,
          historicalData: humidityData
        }
      ];
      
      setVelocityData(velocityParameters);
      setIsLoading(false);
    };

    setTimeout(generateVelocityData, 1000);
  }, []);

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500 rotate-45" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-500 -rotate-45" />;
      default: return <ArrowRight className="h-4 w-4 text-blue-500" />;
    }
  };

  const getActiveParameter = () => {
    return velocityData.find(param => param.parameter.toLowerCase().includes(activeTab)) || velocityData[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Zap className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Calculating Environmental Velocity...
            </h3>
            <p className="text-slate-600">
              Processing rate-of-change analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pattern Intelligence: Cognitive Fatigue */}
      <Card className="bg-gradient-to-r from-fuchsia-50 to-blue-50 border-fuchsia-200">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">
            Cognitive Fatigue Risk Velocity
          </CardTitle>
          <div className="text-fuchsia-700 text-sm">
            Detected fusion signal: dCO₂/dt + dTemp/dt + Light Intensity Rate + Barometric Delta
          </div>
        </CardHeader>
        <CardContent>
          <PatternInsightChart
            patternId="cognitive-fatigue-velocity"
            inputs={[
              { name: "CO₂ Rate", value: 22, unit: "ppm/hr" },
              { name: "Temp Rate", value: 0.7, unit: "°C/hr" },
              { name: "Light Rate", value: -55, unit: "lux/hr" },
              { name: "Barometric Rate", value: -0.3, unit: "hPa/hr" },
            ]}
            compoundRiskLevel="high"
            anomalyDescription="Non-obvious risk surge: Upward CO₂ + decrease in light + slight thermal rise = cognitive fatigue window forecast in 68 minutes."
          />
        </CardContent>
      </Card>

      {/* Environmental Velocity Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environmental Velocity Analysis</CardTitle>
          <p className="text-sm text-slate-600">
            Rate-of-change analytics for early pattern detection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Parameter Selection */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              {velocityData.map((param) => (
                <TabsTrigger key={param.parameter} value={param.parameter.toLowerCase()}>
                  <div className="flex items-center space-x-2">
                    <span>{param.parameter}</span>
                    <Badge className={getRiskBadgeColor(param.riskLevel)}>
                      {param.riskLevel}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {velocityData.map((param) => (
              <TabsContent key={param.parameter} value={param.parameter.toLowerCase()}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{param.currentValue.toFixed(1)}</div>
                        <div className="text-xs text-slate-500">{param.parameter} ({param.unit})</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center flex flex-col items-center">
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-bold">{param.velocity.toFixed(1)}</div>
                          {getTrendIcon(param.trend)}
                        </div>
                        <div className="text-xs text-slate-500">Velocity ({param.velocityUnit})</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{param.acceleration.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">Acceleration ({param.velocityUnit}/hr)</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Velocity Trend</h3>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">Last 2 hours</span>
                    </div>
                  </div>

                  <div className="h-64 border border-slate-200 rounded-lg p-4">
                    <VelocityChart data={param} />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        param.riskLevel === 'critical' ? 'text-red-500' :
                        param.riskLevel === 'high' ? 'text-orange-500' :
                        param.riskLevel === 'moderate' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <h4 className="font-medium">Velocity Risk Assessment</h4>
                    </div>
                    <p className="text-sm text-slate-700">
                      {param.parameter} is {param.trend} at {param.velocity.toFixed(1)} {param.velocityUnit}.
                      {param.riskLevel !== 'low' && ` This rate of change exceeds the ${param.riskLevel} threshold.`}
                      {param.acceleration > 0 && ` Acceleration is positive, indicating the rate is increasing.`}
                      {param.acceleration < 0 && ` Acceleration is negative, indicating the rate is decreasing.`}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Compound Risk Velocity */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">
            Compound Risk Velocity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">CO₂ + Temperature Velocity</h3>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    High Risk
                  </Badge>
                  <span className="text-sm text-slate-600">Compound Rate: +127.5 units/hr</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Combined velocity indicates cognitive impact window in 45-60 minutes
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">PM2.5 + Humidity Velocity</h3>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Moderate Risk
                  </Badge>
                  <span className="text-sm text-slate-600">Compound Rate: +42.3 units/hr</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Combined velocity indicates respiratory sensitivity in 90-120 minutes
                </p>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-indigo-600" />
                <h4 className="font-medium text-indigo-900">Velocity Pattern Intelligence</h4>
              </div>
              <p className="text-sm text-indigo-800">
                The current compound velocity pattern indicates a convergence of multiple environmental stressors.
                The rate of change suggests a 78% probability of crossing cognitive performance thresholds
                within the next 60 minutes if current velocity trends continue.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-xs">
                View Detailed Velocity Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
