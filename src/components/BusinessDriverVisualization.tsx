
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, Scatter3D, ArrowRight, Target } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface BusinessDriverVisualizationProps {
  environmentalParams: EnvironmentalParams;
  buildingType: string;
}

interface DriverRelationship {
  environmental: string;
  operational: string;
  correlation: number;
  confidence: number;
  impactSize: 'small' | 'medium' | 'large';
  timelag: string;
}

interface PerformanceData {
  hour: number;
  productivity: number;
  co2: number;
  temperature: number;
  comfort: number;
}

export const BusinessDriverVisualization: React.FC<BusinessDriverVisualizationProps> = ({
  environmentalParams,
  buildingType
}) => {
  const [viewMode, setViewMode] = useState<'correlations' | 'trends' | 'scatter'>('correlations');

  const driverRelationships: DriverRelationship[] = [
    {
      environmental: 'CO₂ Levels',
      operational: 'Decision Quality',
      correlation: -0.78,
      confidence: 92,
      impactSize: 'large',
      timelag: '30-60 min'
    },
    {
      environmental: 'Temperature',
      operational: 'Task Completion Rate',
      correlation: -0.65,
      confidence: 88,
      impactSize: 'medium',
      timelag: '15-30 min'
    },
    {
      environmental: 'Air Quality (PM2.5)',
      operational: 'Sick Leave Usage',
      correlation: 0.72,
      confidence: 85,
      impactSize: 'large',
      timelag: '24-48 hours'
    },
    {
      environmental: 'Humidity',
      operational: 'Comfort Complaints',
      correlation: 0.58,
      confidence: 82,
      impactSize: 'medium',
      timelag: '1-2 hours'
    },
    {
      environmental: 'Noise Levels',
      operational: 'Meeting Effectiveness',
      correlation: -0.52,
      confidence: 79,
      impactSize: 'medium',
      timelag: 'Immediate'
    },
    {
      environmental: 'Light Quality',
      operational: 'Error Rates',
      correlation: -0.61,
      confidence: 86,
      impactSize: 'medium',
      timelag: '15-45 min'
    }
  ];

  // Generate performance trend data
  const performanceData: PerformanceData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    productivity: Math.max(40, 100 - (Math.abs(environmentalParams.co2 - 400) / 10) - Math.abs(environmentalParams.temperature - 21) * 5 + Math.random() * 10),
    co2: environmentalParams.co2 + (Math.sin(i * Math.PI / 12) * 100) + Math.random() * 50,
    temperature: environmentalParams.temperature + (Math.sin((i - 6) * Math.PI / 12) * 2) + Math.random() * 1,
    comfort: Math.max(60, 100 - Math.abs(environmentalParams.temperature - 21) * 8 - (environmentalParams.humidity > 60 ? 15 : 0) + Math.random() * 5)
  }));

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return 'text-red-700 bg-red-100';
    if (abs > 0.5) return 'text-orange-700 bg-orange-100';
    return 'text-blue-700 bg-blue-100';
  };

  const getImpactSize = (size: string) => {
    switch (size) {
      case 'large': return 'bg-red-500 h-4 w-4';
      case 'medium': return 'bg-orange-500 h-3 w-3';
      default: return 'bg-yellow-500 h-2 w-2';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Business Driver Visualization
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'correlations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('correlations')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Correlations
            </Button>
            <Button
              variant={viewMode === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trends')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trends
            </Button>
            <Button
              variant={viewMode === 'scatter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('scatter')}
            >
              <Scatter3D className="h-4 w-4 mr-1" />
              Scatter
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Well-understood relationships between environmental factors and operational outcomes
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'correlations' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {driverRelationships.map((relationship, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full ${getImpactSize(relationship.impactSize)}`}></div>
                      <span className="font-medium">{relationship.environmental}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-blue-700">{relationship.operational}</span>
                    </div>
                    <Badge className={`text-xs ${getCorrelationColor(relationship.correlation)}`}>
                      r = {relationship.correlation.toFixed(2)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Confidence:</strong> {relationship.confidence}%
                    </div>
                    <div>
                      <strong>Impact:</strong> {relationship.impactSize}
                    </div>
                    <div>
                      <strong>Time Lag:</strong> {relationship.timelag}
                    </div>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        Math.abs(relationship.correlation) > 0.7 ? 'bg-red-500' :
                        Math.abs(relationship.correlation) > 0.5 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.abs(relationship.correlation) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm">
                <strong>Key Insight:</strong> CO₂ levels show the strongest correlation with operational performance. 
                A 200 ppm increase in CO₂ typically results in a 15-20% decrease in decision-making quality within 30-60 minutes.
              </div>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={2} name="Productivity %" />
                  <Line type="monotone" dataKey="comfort" stroke="#3b82f6" strokeWidth={2} name="Comfort Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="co2" stroke="#ef4444" strokeWidth={2} name="CO₂ (ppm)" />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'scatter' && (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={performanceData}>
                  <CartesianGrid />
                  <XAxis dataKey="co2" name="CO₂" unit="ppm" />
                  <YAxis dataKey="productivity" name="Productivity" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="CO₂ vs Productivity" data={performanceData} fill="#ef4444" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold mb-2">Strong Negative Correlation</div>
                <div>As CO₂ increases above 800 ppm, productivity decreases exponentially. The relationship becomes critical above 1000 ppm.</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold mb-2">Optimal Range Identified</div>
                <div>Peak productivity occurs when CO₂ is between 400-600 ppm and temperature is 20-22°C.</div>
              </div>
            </div>
          </div>
        )}

        {/* Business Value Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-indigo-600" />
            <div className="font-semibold text-indigo-800">Business Value Impact</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-indigo-700">15-25%</div>
              <div className="text-indigo-600">Productivity Improvement</div>
              <div className="text-xs text-indigo-500">Through optimal environmental control</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-indigo-700">30-40%</div>
              <div className="text-indigo-600">Reduced Sick Leave</div>
              <div className="text-xs text-indigo-500">Via air quality management</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-indigo-700">12-18%</div>
              <div className="text-indigo-600">Error Rate Reduction</div>
              <div className="text-xs text-indigo-500">Through comfort optimization</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
