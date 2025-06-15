import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Activity, Filter } from "lucide-react";
import PatternInsightChart from "../components/patterns/PatternInsightChart";
import VelocityChart from "../components/visualization/VelocityChart";

interface EnvironmentalVelocityViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
}

// Mock velocity data for different parameters
const velocityData = [
  {
    parameter: "CO₂ Concentration",
    currentValue: 850,
    velocity: 12.5,
    acceleration: 2.1,
    unit: "ppm",
    velocityUnit: "ppm/hr",
    riskLevel: "high" as const,
    trend: "increasing" as const,
    alertThreshold: 15,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 800 + Math.sin(i * 0.3) * 50 + Math.random() * 20,
      velocity: 8 + Math.sin(i * 0.2) * 6 + Math.random() * 4
    }))
  },
  {
    parameter: "Atmospheric Pressure",
    currentValue: 1013.2,
    velocity: -0.8,
    acceleration: -0.15,
    unit: "hPa",
    velocityUnit: "hPa/hr",
    riskLevel: "moderate" as const,
    trend: "decreasing" as const,
    alertThreshold: 2.0,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 1013 + Math.sin(i * 0.4) * 3 + Math.random() * 2,
      velocity: -0.5 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.5
    }))
  },
  {
    parameter: "PM2.5 Particulates",
    currentValue: 28.5,
    velocity: 3.2,
    acceleration: 0.8,
    unit: "μg/m³",
    velocityUnit: "μg/m³/hr",
    riskLevel: "critical" as const,
    trend: "increasing" as const,
    alertThreshold: 5.0,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 25 + Math.sin(i * 0.5) * 8 + Math.random() * 5,
      velocity: 2 + Math.sin(i * 0.4) * 3 + Math.random() * 2
    }))
  },
  {
    parameter: "Temperature Gradient",
    currentValue: 21.8,
    velocity: 0.15,
    acceleration: -0.05,
    unit: "°C",
    velocityUnit: "°C/hr",
    riskLevel: "low" as const,
    trend: "stable" as const,
    alertThreshold: 1.0,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 21.5 + Math.sin(i * 0.6) * 2 + Math.random() * 1,
      velocity: 0.1 + Math.sin(i * 0.5) * 0.3 + Math.random() * 0.2
    }))
  },
  {
    parameter: "Humidity Variance",
    currentValue: 45.2,
    velocity: -1.8,
    acceleration: 0.3,
    unit: "%RH",
    velocityUnit: "%RH/hr",
    riskLevel: "moderate" as const,
    trend: "decreasing" as const,
    alertThreshold: 3.0,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 45 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
      velocity: -1.5 + Math.sin(i * 0.6) * 2 + Math.random() * 1
    }))
  },
  {
    parameter: "EM Field Fluctuation",
    currentValue: 2.4,
    velocity: 0.8,
    acceleration: 0.12,
    unit: "nT",
    velocityUnit: "nT/hr",
    riskLevel: "high" as const,
    trend: "increasing" as const,
    alertThreshold: 1.5,
    historicalData: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: 2.2 + Math.sin(i * 0.8) * 0.8 + Math.random() * 0.4,
      velocity: 0.6 + Math.sin(i * 0.7) * 0.5 + Math.random() * 0.3
    }))
  }
];

// Only pattern fingerprints, no raw metrics
const patternData = [
  {
    patternId: "cognitive-fatigue-velocity",
    title: "Cognitive Fatigue Risk Velocity",
    gradient: "from-red-50 to-orange-50 border-red-200",
    compoundRiskLevel: "high" as const,
    anomalyDescription:
      "Upward surge in cross-domain risk kinetics. A non-obvious convergence of air composition, thermal, and luminosity patterns forecast cognitive fatigue window.",
    timeToImpact: "68 minutes",
    confidence: "91%",
    trendDirection: "increasing"
  },
  {
    patternId: "mechanical-stress-index",
    title: "Mechanical Stress Index Pattern",
    gradient: "from-blue-50 to-indigo-50 border-blue-200",
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Compound stress pattern identified: Environmental and operational vectors intersecting, indicating heightened probability of mechanical performance degradation.",
    timeToImpact: "120 minutes",
    confidence: "74%",
    trendDirection: "stable"
  },
  {
    patternId: "respiratory-sensitivity-window",
    title: "Respiratory Sensitivity Window",
    gradient: "from-orange-50 to-yellow-50 border-orange-200",
    compoundRiskLevel: "critical" as const,
    anomalyDescription:
      "Pattern fusion: Combined surge in airborne irritants and humidity-pressure kinetics predicts acute sensitivity risk window.",
    timeToImpact: "49 minutes",
    confidence: "96%",
    trendDirection: "increasing"
  },
  {
    patternId: "metabolic-disruption-forecast",
    title: "Metabolic Disruption Forecast",
    gradient: "from-purple-50 to-pink-50 border-purple-200",
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Signature match: Metabolic timing disruption window forming from compound photonic and atmospheric instabilities.",
    timeToImpact: "37 minutes",
    confidence: "68%",
    trendDirection: "decreasing"
  },
];

const EnvironmentalVelocityView: React.FC<EnvironmentalVelocityViewProps> = ({
  dateRange,
  location,
  assetFilter
}) => {
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'focused'>('grid');

  const filteredVelocityData = velocityData.filter(data => {
    if (assetFilter) {
      return data.parameter.toLowerCase().includes(assetFilter.toLowerCase());
    }
    return true;
  });

  const criticalParameters = filteredVelocityData.filter(p => p.riskLevel === 'critical').length;
  const avgVelocity = Math.round(
    filteredVelocityData.reduce((sum, p) => sum + Math.abs(p.velocity), 0) / filteredVelocityData.length * 10
  ) / 10;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Environmental Velocity Intelligence
                </CardTitle>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Real-time rate-of-change analytics for {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                  <span>Timeframe: {dateRange}</span>
                  <span>•</span>
                  <span>{filteredVelocityData.length} active parameters</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </Button>
              <Button 
                variant={viewMode === 'focused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('focused')}
                disabled={!selectedParameter}
              >
                Focused View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Velocity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{filteredVelocityData.length}</div>
            <div className="text-sm font-medium text-slate-600">Parameters Tracked</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalParameters}</div>
            <div className="text-sm font-medium text-slate-600">Critical Velocity</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{avgVelocity}</div>
            <div className="text-sm font-medium text-slate-600">Avg Rate Change</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">Live</div>
            <div className="text-sm font-medium text-slate-600">Data Stream</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Velocity Charts */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Real-Time Velocity Analysis
                </CardTitle>
                <p className="text-slate-600 mt-1">
                  Interactive rate-of-change visualization - click any chart for detailed analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {assetFilter ? `Filtered: ${assetFilter}` : 'All Parameters'}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVelocityData.map((data, index) => (
                <div
                  key={data.parameter}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedParameter === data.parameter 
                      ? 'ring-2 ring-blue-200 bg-blue-50' 
                      : 'bg-white border-slate-200'
                  }`}
                  onClick={() => {
                    setSelectedParameter(data.parameter);
                    setViewMode('focused');
                  }}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{data.parameter}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">
                          {data.velocity > 0 ? '+' : ''}{data.velocity} {data.velocityUnit}
                        </div>
                        <div className="text-xs text-slate-600">velocity</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-slate-600">Current: {data.currentValue} {data.unit}</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        data.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        data.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                        data.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {data.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <VelocityChart data={data} />
                </div>
              ))}
            </div>
          ) : selectedParameter && (
            <div className="space-y-6">
              {/* Focused Parameter Details */}
              <div className="bg-slate-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedParameter}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewMode('grid')}
                  >
                    Back to Grid
                  </Button>
                </div>
                
                {(() => {
                  const focusedData = filteredVelocityData.find(d => d.parameter === selectedParameter);
                  if (!focusedData) return null;
                  
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="h-96">
                          <VelocityChart data={focusedData} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-semibold text-slate-900 mb-2">Current Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Value:</span>
                              <span className="font-medium">{focusedData.currentValue} {focusedData.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Velocity:</span>
                              <span className="font-medium">{focusedData.velocity} {focusedData.velocityUnit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Acceleration:</span>
                              <span className="font-medium">{focusedData.acceleration} {focusedData.velocityUnit}/hr</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-semibold text-slate-900 mb-2">Risk Assessment</h4>
                          <div className={`px-3 py-2 rounded text-sm font-medium mb-2 ${
                            focusedData.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                            focusedData.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                            focusedData.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {focusedData.riskLevel.toUpperCase()} RISK LEVEL
                          </div>
                          <p className="text-sm text-slate-600">
                            Current velocity trend indicates {focusedData.trend} pattern. 
                            Alert threshold: ±{focusedData.alertThreshold} {focusedData.velocityUnit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pattern Intelligence Engine */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Real-Time Pattern Velocity Analysis
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Cross-domain risk pattern velocities updated every 30 seconds
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {patternData.map((pattern) => (
              <div
                key={pattern.patternId}
                className={`bg-gradient-to-br ${pattern.gradient} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {pattern.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{pattern.confidence}</div>
                      <div className="text-xs text-slate-600">confidence</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-slate-600">Impact in {pattern.timeToImpact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`h-3 w-3 ${
                        pattern.trendDirection === 'increasing' ? 'text-red-500' : 
                        pattern.trendDirection === 'decreasing' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className="text-slate-600 capitalize">{pattern.trendDirection}</span>
                    </div>
                  </div>
                </div>
                
                <PatternInsightChart
                  patternId={pattern.patternId}
                  compoundRiskLevel={pattern.compoundRiskLevel}
                  anomalyDescription={pattern.anomalyDescription}
                  timeToImpact={pattern.timeToImpact}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cross-Pattern Convergence Analysis */}
      <Card className="bg-gradient-to-r from-slate-50 to-indigo-50 border-slate-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pattern Convergence Intelligence</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-3">
                Current velocity pattern intelligence highlights a convergence of multiple environmental domains.
                Risk kinetics indicate a <span className="font-bold text-indigo-900">74% probability</span> of
                intersecting performance thresholds across cognitive, mechanical, and metabolic axes within the next 60 minutes.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Strategic Recommendation:</strong> Intervene on the compound patterns—not individual metrics—for maximum operational impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
