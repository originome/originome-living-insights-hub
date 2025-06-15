
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, AlertTriangle, Activity } from "lucide-react";
import VelocityChart from "../components/visualization/VelocityChart";

interface EnvironmentalVelocityViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
}

// Mock velocity data for different environmental parameters
const velocityData = [
  {
    id: "co2-velocity",
    title: "CO₂ Concentration Rate",
    unit: "ppm/hour",
    currentRate: 12.5,
    threshold: 8.0,
    severity: "critical" as const,
    description: "Carbon dioxide accumulation rate exceeding ventilation capacity",
    data: [
      { time: "00:00", value: 2.1 },
      { time: "02:00", value: 4.3 },
      { time: "04:00", value: 6.8 },
      { time: "06:00", value: 8.2 },
      { time: "08:00", value: 11.5 },
      { time: "10:00", value: 12.5 },
    ]
  },
  {
    id: "pressure-velocity",
    title: "Atmospheric Pressure Derivative",
    unit: "hPa/hour",
    currentRate: -2.8,
    threshold: 2.0,
    severity: "high" as const,
    description: "Rapid pressure drop indicating incoming weather system",
    data: [
      { time: "00:00", value: -0.5 },
      { time: "02:00", value: -1.2 },
      { time: "04:00", value: -1.8 },
      { time: "06:00", value: -2.1 },
      { time: "08:00", value: -2.5 },
      { time: "10:00", value: -2.8 },
    ]
  },
  {
    id: "pm25-velocity",
    title: "PM2.5 Concentration Rate",
    unit: "μg/m³/hour",
    currentRate: 4.2,
    threshold: 3.0,
    severity: "moderate" as const,
    description: "Particulate matter increase correlating with traffic patterns",
    data: [
      { time: "00:00", value: 0.8 },
      { time: "02:00", value: 1.2 },
      { time: "04:00", value: 2.1 },
      { time: "06:00", value: 3.4 },
      { time: "08:00", value: 3.9 },
      { time: "10:00", value: 4.2 },
    ]
  },
  {
    id: "temperature-velocity",
    title: "Temperature Rate of Change",
    unit: "°C/hour",
    currentRate: 1.8,
    threshold: 1.5,
    severity: "moderate" as const,
    description: "Thermal gradient indicating HVAC system response lag",
    data: [
      { time: "00:00", value: 0.2 },
      { time: "02:00", value: 0.6 },
      { time: "04:00", value: 1.1 },
      { time: "06:00", value: 1.4 },
      { time: "08:00", value: 1.6 },
      { time: "10:00", value: 1.8 },
    ]
  }
];

const EnvironmentalVelocityView: React.FC<EnvironmentalVelocityViewProps> = ({
  dateRange,
  location,
  assetFilter
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Filter data based on props (mock filtering for now)
  const filteredData = velocityData.filter(metric => {
    if (assetFilter) {
      return metric.title.toLowerCase().includes(assetFilter.toLowerCase());
    }
    return true;
  });

  const criticalMetrics = filteredData.filter(m => m.severity === 'critical').length;
  const avgRate = filteredData.reduce((sum, m) => sum + Math.abs(m.currentRate), 0) / filteredData.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-purple-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Environmental Velocity Intelligence
              </CardTitle>
              <p className="text-lg text-slate-700 leading-relaxed">
                Real-time rate-of-change analysis for {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                <span>Timeframe: {dateRange}</span>
                <span>•</span>
                <span>{filteredData.length} parameters monitored</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Velocity Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{filteredData.length}</div>
            <div className="text-sm font-medium text-slate-600">Active Monitors</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalMetrics}</div>
            <div className="text-sm font-medium text-slate-600">Critical Rates</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{avgRate.toFixed(1)}</div>
            <div className="text-sm font-medium text-slate-600">Avg Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
            <div className="text-sm font-medium text-slate-600">Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Velocity Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((metric) => (
          <VelocityChart
            key={metric.id}
            {...metric}
            isSelected={selectedMetric === metric.id}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          />
        ))}
      </div>

      {/* Detailed Analysis Panel */}
      {selectedMetric && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="py-6">
            {(() => {
              const metric = filteredData.find(m => m.id === selectedMetric);
              if (!metric) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Detailed Analysis: {metric.title}
                    </h3>
                    <button 
                      onClick={() => setSelectedMetric(null)}
                      className="text-slate-500 hover:text-slate-700 text-sm"
                    >
                      Close ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Velocity Pattern Analysis</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {metric.description}. Current rate of {Math.abs(metric.currentRate)} {metric.unit} 
                        {Math.abs(metric.currentRate) > metric.threshold ? ' exceeds' : ' is within'} 
                        normal threshold of {metric.threshold} {metric.unit}.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Predictive Insights</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div>• Pattern suggests {metric.severity} intervention needed</div>
                        <div>• Estimated impact window: 2-4 hours</div>
                        <div>• Confidence level: {85 + Math.random() * 10}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* System Insights */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50 border-slate-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Velocity Intelligence Summary</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-3">
                <span className="font-semibold text-emerald-900">Environmental velocity patterns</span> reveal 
                compound acceleration trends across {filteredData.length} monitored parameters. 
                Rate-of-change analysis enables intervention 2-4 hours before threshold breaches.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Key Insight:</strong> Focus on velocity trends rather than absolute values 
                for earlier pattern detection and more effective mitigation strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
