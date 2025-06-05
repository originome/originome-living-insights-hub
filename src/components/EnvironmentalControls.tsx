
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings, Thermometer, Wind, Lightbulb, Volume2, Droplet } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';

interface EnvironmentalControlsProps {
  params: {
    co2: number;
    pm25: number;
    temperature: number;
    light: number;
    noise: number;
    humidity: number;
  };
  onParamChange: (param: string, value: number) => void;
  externalData: ExternalData;
}

export const EnvironmentalControls: React.FC<EnvironmentalControlsProps> = ({
  params,
  onParamChange,
  externalData
}) => {
  const parameterConfig = [
    {
      key: 'co2',
      label: 'CO₂ Level',
      value: params.co2,
      unit: 'ppm',
      min: 400,
      max: 2000,
      optimal: [400, 800],
      icon: Wind,
      color: params.co2 > 800 ? 'text-red-600' : params.co2 > 600 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      key: 'pm25',
      label: 'PM2.5',
      value: params.pm25,
      unit: 'μg/m³',
      min: 0,
      max: 250,
      optimal: [0, 12],
      icon: Wind,
      color: params.pm25 > 35 ? 'text-red-600' : params.pm25 > 12 ? 'text-yellow-600' : 'text-green-600',
      external: externalData.airQuality?.pm25
    },
    {
      key: 'temperature',
      label: 'Temperature',
      value: params.temperature,
      unit: '°C',
      min: 16,
      max: 30,
      optimal: [20, 22],
      icon: Thermometer,
      color: Math.abs(params.temperature - 21) > 2 ? 'text-red-600' : Math.abs(params.temperature - 21) > 1 ? 'text-yellow-600' : 'text-green-600',
      external: externalData.weather?.temperature
    },
    {
      key: 'light',
      label: 'Light Level',
      value: params.light,
      unit: 'lux',
      min: 100,
      max: 2000,
      optimal: [500, 1000],
      icon: Lightbulb,
      color: params.light < 300 ? 'text-red-600' : params.light < 500 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      key: 'noise',
      label: 'Noise Level',
      value: params.noise,
      unit: 'dB',
      min: 30,
      max: 80,
      optimal: [30, 50],
      icon: Volume2,
      color: params.noise > 60 ? 'text-red-600' : params.noise > 50 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      key: 'humidity',
      label: 'Humidity',
      value: params.humidity,
      unit: '%',
      min: 20,
      max: 80,
      optimal: [40, 60],
      icon: Droplet,
      color: params.humidity < 30 || params.humidity > 70 ? 'text-red-600' : params.humidity < 40 || params.humidity > 60 ? 'text-yellow-600' : 'text-green-600',
      external: externalData.weather?.humidity
    }
  ];

  const getOptimalStatus = (value: number, optimal: [number, number]) => {
    if (value >= optimal[0] && value <= optimal[1]) return 'Optimal';
    if (value < optimal[0] * 0.8 || value > optimal[1] * 1.2) return 'Poor';
    return 'Suboptimal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'bg-green-100 text-green-800';
      case 'Suboptimal': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-600" />
          Environmental Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parameterConfig.map((param) => {
            const Icon = param.icon;
            const status = getOptimalStatus(param.value, param.optimal);
            
            return (
              <div key={param.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {param.label}
                  </Label>
                  <Badge className={getStatusColor(status)} variant="secondary">
                    {status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold ${param.color}`}>
                    {param.value}
                  </span>
                  <span className="text-sm text-gray-500">{param.unit}</span>
                  {param.external && (
                    <Badge variant="outline" className="text-xs">
                      Outdoor: {param.external}{param.unit}
                    </Badge>
                  )}
                </div>
                
                <Slider
                  value={[param.value]}
                  onValueChange={(value) => onParamChange(param.key, value[0])}
                  min={param.min}
                  max={param.max}
                  step={param.key === 'temperature' ? 0.5 : 1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{param.min}</span>
                  <span className="text-green-600 font-medium">
                    Optimal: {param.optimal[0]}-{param.optimal[1]}
                  </span>
                  <span>{param.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
