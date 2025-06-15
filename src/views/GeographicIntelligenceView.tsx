
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, TrendingUp } from "lucide-react";

// Simulated micro-pattern convergence data
const patternZones = [
  {
    id: "fusion-01",
    title: "Cognitive Fatigue Convergence Zone",
    riskLevel: "critical",
    fusionNarrative:
      "Non-obvious convergence detected: risk pattern formed by intersecting airborne irritant surge, temperature derivative, and local geomagnetic activity.",
    geographicDescription:
      "78-meter zone centered near Site Alpha—pattern fusion marks a 'fatigue window' predicted within 42 minutes.",
    factors: [
      "Airborne Irritant Spike",
      "Thermal Kinetics (+2.1°C/hr)",
      "Geomagnetic Kp >4"
    ]
  },
  {
    id: "fusion-02",
    title: "Respiratory Sensitivity Pattern Zone",
    riskLevel: "high",
    fusionNarrative:
      "Pattern cluster: Humidity-pressure cross-domain spike correlates with particulate fluctuations, forecasting micro-respiratory risk.",
    geographicDescription:
      "192-meter zone at East Sector—acute pattern detected, next impact window within 31 minutes.",
    factors: [
      "Humidity/Pressure Oscillation",
      "Particulate Velocity",
      "Temporal Risk Fusion"
    ]
  },
  {
    id: "fusion-03",
    title: "Mechanical Instability Zone",
    riskLevel: "moderate",
    fusionNarrative:
      "Pattern fusion: Environmental, operational, and grid vectors converging—predicts increased asset failure probability.",
    geographicDescription:
      "128-meter strip, South Facility perimeter. Convergence window detected in next 1-2 hours.",
    factors: [
      "Operational Oscillation",
      "Grid Frequency Dip",
      "Vibration/Temperature Compound Surge"
    ]
  }
];

const riskColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  moderate: "bg-yellow-100 text-yellow-700"
};

const GeographicIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div>
              <CardTitle className="text-xl text-purple-900">
                Geographic Pattern Intelligence – Micro-Convergence Detection
              </CardTitle>
              <p className="text-purple-700 text-sm">
                Real-time mapping of pattern fusion zones and compound risk convergence—no weather or metric overlays, only actionable pattern intelligence.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Micro-Pattern Convergence Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patternZones.map((zone) => (
          <Card
            key={zone.id}
            className={`border shadow-sm flex flex-col bg-gradient-to-br from-slate-50 to-fuchsia-50 ${riskColors[zone.riskLevel]} border-fuchsia-100`}
          >
            <CardHeader className="pb-2 flex flex-col gap-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-5 w-5 ${zone.riskLevel === "critical" ? "text-red-600 animate-pulse" : zone.riskLevel === "high" ? "text-orange-600 animate-bounce" : "text-yellow-600"}`} />
                <span className="font-bold text-fuchsia-900">{zone.title}</span>
              </div>
              <div className="text-xs text-fuchsia-700">Pattern Zone: {zone.id}</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-3">
              <div className="font-medium text-fuchsia-900">{zone.fusionNarrative}</div>
              <div className="text-xs font-mono text-fuchsia-600">{zone.geographicDescription}</div>
              <div className="mt-2">
                <div className="text-xs text-slate-600 font-semibold">Pattern Convergence Factors:</div>
                <ul className="list-disc pl-5 text-sm">
                  {zone.factors.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Narrative */}
      <Card className="bg-gradient-to-r from-indigo-100 to-fuchsia-50 border-indigo-200">
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-fuchsia-600" />
            <span className="font-medium text-fuchsia-900">Compound Fusion Map</span>
          </div>
          <div className="text-sm text-fuchsia-800">
            <span className="font-bold text-fuchsia-900">Hyperlocal pattern convergence</span> detected across multiple geographic vectors. Real-time mapping enables preemptive action before visible events occur. Focus interventions where patterns—not individual metrics—intersect.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicIntelligenceView;

