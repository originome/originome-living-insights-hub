
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import PatternInsightChart from "../components/patterns/PatternInsightChart";

// Derivative-based pattern cards data
const patternData = [
  {
    patternId: "cognitive-fatigue-velocity",
    title: "Cognitive Fatigue Risk Velocity",
    gradient: "from-fuchsia-50 to-blue-50 border-fuchsia-200",
    inputs: [
      { name: "CO₂ Rate", value: 22, unit: "ppm/hr" },
      { name: "Temp Rate", value: 0.7, unit: "°C/hr" },
      { name: "Light Rate", value: -55, unit: "lux/hr" },
      { name: "Barometric Rate", value: -0.3, unit: "hPa/hr" },
    ],
    compoundRiskLevel: "high" as const,
    anomalyDescription:
      "Non-obvious risk surge: Upward CO₂ + decrease in light + slight thermal rise = cognitive fatigue window forecast in 68 minutes.",
  },
  {
    patternId: "mechanical-stress-index",
    title: "Mechanical Stress Index Pattern",
    gradient: "from-blue-50 to-emerald-50 border-emerald-200",
    inputs: [
      { name: "Temp Rate", value: 1.3, unit: "°C/hr" },
      { name: "Barometric Rate", value: -1.6, unit: "hPa/hr" },
      { name: "Vibration Δ", value: 2.7, unit: "mm/s²" },
    ],
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Compound stress index elevated: Temperature and barometric pressure shifts plus vibration spike → mechanical failure zone likely within 120 minutes.",
  },
  {
    patternId: "respiratory-sensitivity-window",
    title: "Respiratory Sensitivity Window",
    gradient: "from-orange-50 to-yellow-50 border-yellow-200",
    inputs: [
      { name: "PM2.5 Rate", value: 15.5, unit: "μg/m³/hr" },
      { name: "Humidity Rate", value: 4.1, unit: "%/hr" },
      { name: "Barometric Rate", value: -0.7, unit: "hPa/hr" },
    ],
    compoundRiskLevel: "critical" as const,
    anomalyDescription:
      "Respiratory risk surge: Combined spike in particle velocity + rapid humidity rise + pressure drop forecasts acute sensitivity window in 49 minutes.",
  },
  {
    patternId: "metabolic-disruption-forecast",
    title: "Metabolic Disruption Forecast",
    gradient: "from-red-50 to-pink-50 border-pink-200",
    inputs: [
      { name: "Light Rate", value: -100, unit: "lux/hr" },
      { name: "CO₂ Rate", value: 10, unit: "ppm/hr" },
      { name: "Temp Rate", value: 0.3, unit: "°C/hr" },
    ],
    compoundRiskLevel: "moderate" as const,
    anomalyDescription:
      "Metabolic timing disruption: Light suppression mixed with rising CO₂ and temp shifts creates a metabolic window in 37 minutes—support interventions strongly suggested.",
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
            Visualizing cross-domain risk pattern velocities—AI-driven fusion analytics beyond conventional thresholds.
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
                  inputs={pattern.inputs}
                  compoundRiskLevel={pattern.compoundRiskLevel}
                  anomalyDescription={pattern.anomalyDescription}
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
            intersecting performance thresholds across cognitive, mechanical, and metabolic axes within the next 60 minutes. Intervene on the pattern—not the individual inputs.
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
