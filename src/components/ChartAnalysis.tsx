
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';

interface ChartAnalysisProps {
  environmentalParams: {
    co2: number;
    pm25: number;
    temperature: number;
    light: number;
    noise: number;
    humidity: number;
  };
  externalData: ExternalData;
  buildingType: string;
}

export const ChartAnalysis: React.FC<ChartAnalysisProps> = ({
  environmentalParams,
  externalData,
  buildingType
}) => {
  const performanceData = useMemo(() => {
    // Calculate performance scores (0-100)
    const cognitiveScore = Math.max(0, 100 - (environmentalParams.co2 - 400) / 20);
    const productivityScore = Math.max(0, 100 - Math.abs(environmentalParams.temperature - 21) * 5);
    const healthScore = Math.max(0, 100 - environmentalParams.pm25 * 2);
    const comfortScore = Math.max(0, 100 - Math.abs(environmentalParams.humidity - 50) * 1.5);
    const focusScore = Math.max(0, 100 - Math.max(0, environmentalParams.noise - 40) * 2);

    return [
      {
        subject: 'Cognitive',
        current: Math.round(cognitiveScore),
        optimized: 95,
        fullMark: 100,
      },
      {
        subject: 'Productivity',
        current: Math.round(productivityScore),
        optimized: 98,
        fullMark: 100,
      },
      {
        subject: 'Health',
        current: Math.round(healthScore),
        optimized: 95,
        fullMark: 100,
      },
      {
        subject: 'Comfort',
        current: Math.round(comfortScore),
        optimized: 95,
        fullMark: 100,
      },
      {
        subject: 'Focus',
        current: Math.round(focusScore),
        optimized: 90,
        fullMark: 100,
      },
    ];
  }, [environmentalParams]);

  const impactData = useMemo(() => {
    const co2Impact = Math.min(0, -((environmentalParams.co2 - 400) / 40) * 15);
    const pm25Impact = -environmentalParams.pm25 * 0.6;
    const tempImpact = -Math.abs(environmentalParams.temperature - 21) * 2;
    const lightImpact = environmentalParams.light < 500 ? -(500 - environmentalParams.light) / 10 : 0;
    const noiseImpact = environmentalParams.noise > 50 ? -(environmentalParams.noise - 50) * 0.5 : 0;

    return [
      {
        name: 'CO₂ Impact',
        current: Math.max(-30, co2Impact),
        optimized: -1,
      },
      {
        name: 'PM2.5 Impact',
        current: Math.max(-20, pm25Impact),
        optimized: -2,
      },
      {
        name: 'Temperature',
        current: Math.max(-10, tempImpact),
        optimized: 0,
      },
      {
        name: 'Lighting',
        current: Math.max(-15, lightImpact),
        optimized: 0,
      },
      {
        name: 'Noise',
        current: Math.max(-10, noiseImpact),
        optimized: 0,
      },
    ];
  }, [environmentalParams]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Radar Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Performance Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {buildingType}
            </Badge>
            {externalData.location && (
              <Badge variant="outline" className="text-xs">
                {externalData.location.city}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" className="text-sm" />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                className="text-xs"
                tick={false}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Optimized"
                dataKey="optimized"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Current Conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Optimized Conditions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Comparison Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Environmental Impact Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#ef4444" name="Current Impact" />
              <Bar dataKey="optimized" fill="#22c55e" name="Optimized Impact" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
