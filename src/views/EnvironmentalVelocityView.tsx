
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import PatternInsightChart from "../components/patterns/PatternInsightChart";

// Only pattern fingerprints, no raw metrics
const patternData = [
  {
    patternId: "cognitive-fatigue-velocity",
    title: "Cognitive Fatigue Risk Velocity",
    gradient: "from-fuchsia-50 to-blue-50 border-fuchsia-200",
    compoundRiskLevel: "high" as const,
    anomalyDescription:
      "Upward surge in cross-domain risk kinetics. A non-obvious convergence of air composition, thermal, and luminosity patterns forecast cognitive fatigue window.",
    timeToImpact: "68 minutes"
  },
  {
    patternId: "mechanical-stress-index",
    title: "Mechanical Stress Index Pattern",
    gradient: "from-blue-50 to-emerald-50 border-emerald-200",
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Compound stress pattern identified: Environmental and operational vectors intersecting, indicating heightened probability of mechanical performance degradation.",
    timeToImpact: "120 minutes"
  },
  {
    patternId: "respiratory-sensitivity-window",
    title: "Respiratory Sensitivity Window",
    gradient: "from-orange-50 to-yellow-50 border-yellow-200",
    compoundRiskLevel: "critical" as const,
    anomalyDescription:
      "Pattern fusion: Combined surge in airborne irritants and humidity-pressure kinetics predicts acute sensitivity risk window.",
    timeToImpact: "49 minutes"
  },
  {
    patternId: "metabolic-disruption-forecast",
    title: "Metabolic Disruption Forecast",
    gradient: "from-red-50 to-pink-50 border-pink-200",
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Signature match: Metabolic timing disruption window forming from compound photonic and atmospheric instabilities.",
    timeToImpact: "37 minutes"
  },
];

const EnvironmentalVelocityView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Pattern Intelligence Engine */}
      <Card className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">
            Pattern Intelligence Engine: Compound Risk Velocities
          </CardTitle>
          <div className="text-fuchsia-700 text-sm">
            Visualizing cross-domain risk pattern velocities—AI-driven fusion analytics beyond commodity metrics.
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {patternData.map((pattern) => (
              <div
                key={pattern.patternId}
                className={`bg-gradient-to-br ${pattern.gradient} border rounded-lg p-4 flex flex-col gap-2 shadow-sm`}
              >
                <div className="mb-2">
                  <div className="font-bold text-fuchsia-800 text-base">
                    {pattern.title}
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
      {/* Cross-Pattern Convergence Narrative */}
      <Card className="bg-gradient-to-r from-indigo-100 to-fuchsia-50 border-indigo-200">
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Compound Pattern Convergence</span>
          </div>
          <div className="text-sm text-indigo-800">
            Current velocity pattern intelligence highlights a convergence of multiple environmental domains.
            Risk kinetics indicate a <span className="font-bold text-fuchsia-700">74% probability</span> of
            intersecting performance thresholds across cognitive, mechanical, and metabolic axes within the next 60 minutes. Intervene on the pattern—not the individual metrics.
          </div>
        </CardContent>
      </Card>
      {/* Pattern-Driven Detailed Analysis Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="text-xs">
          View Pattern-Driven Analysis
        </Button>
      </div>
    </div>
  );
};

export default EnvironmentalVelocityView;

