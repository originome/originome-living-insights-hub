
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Activity } from "lucide-react";
import PatternInsightChart from "../components/patterns/PatternInsightChart";

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

const EnvironmentalVelocityView: React.FC = () => {
  const criticalPatterns = patternData.filter(p => p.compoundRiskLevel === 'critical').length;
  const avgConfidence = Math.round(patternData.reduce((sum, p) => sum + parseInt(p.confidence), 0) / patternData.length);

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
                  Compound risk pattern velocities and cross-domain fusion analytics
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  AI-driven pattern recognition beyond traditional environmental monitoring
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-sm font-medium">
              View Detailed Analysis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Velocity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{patternData.length}</div>
            <div className="text-sm font-medium text-slate-600">Active Patterns</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalPatterns}</div>
            <div className="text-sm font-medium text-slate-600">Critical Risk</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{avgConfidence}%</div>
            <div className="text-sm font-medium text-slate-600">Avg Confidence</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">37m</div>
            <div className="text-sm font-medium text-slate-600">Next Impact</div>
          </CardContent>
        </Card>
      </div>

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
