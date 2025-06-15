
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Fingerprint } from "lucide-react";

// Simulated asset pattern fingerprints
const assetPatterns = [
  {
    id: "pt001",
    name: "Transformer Unit 034",
    pattern: "Cascade Failure Pattern",
    fingerprint:
      "Nonlinear risk window triggered by the intersection of solar geomagnetic surge and grid phase oscillator anomaly.",
    signature:
      "Failure pattern emerges when >2 environmental axes trend negative within 90-minute window. Pattern forecast: 72% probability of cascading failure within 17 hours.",
    riskLevel: "critical",
    resilience: ["Thermal surge rejection", "Partial humidity immunity"],
    trigger: "Solar Wind >600km/s + Grid Frequency Dip",
  },
  {
    id: "hvac023",
    name: "HVAC System 023",
    pattern: "Humidity Deviation Syndrome",
    fingerprint:
      "Compound failure signature involving hyperlocal humidity oscillation and operational vibration harmonics.",
    signature:
      "Resilience breached when humidity kinetic ~4x standard deviation aligns with >0.5g vibration. Pattern forecast: acute risk window in 5.5 hours.",
    riskLevel: "high",
    resilience: ["Electromagnetic resilience under typical load"],
    trigger: "Humidity Derivative + Vibration Spike",
  },
  {
    id: "rack058",
    name: "Server Rack 058",
    pattern: "Electromagnetic Degradation",
    fingerprint:
      "Trigger combination of air composition divergence and electromagnetic flux detected, typically preceding hardware failure.",
    signature:
      "Flashpoint occurs when cross-domain triggers intersect for >14 mins. 61% pattern-match to historical failure fingerprints.",
    riskLevel: "moderate",
    resilience: ["Humidity-tolerant", "Stable thermal performance"],
    trigger: "PM2.5 Oscillation + EM Flux",
  },
];

const riskColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  moderate: "bg-yellow-100 text-yellow-700"
};

const AssetIntelligenceView: React.FC = () => {
  // Remove all legacy loading and metrics logic; everything is patterns now

  return (
    <div className="space-y-7">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Fingerprint className="h-6 w-6 text-emerald-600" />
            <div>
              <CardTitle className="text-xl text-emerald-900">
                Asset Intelligence – Vulnerability Pattern Fingerprinting
              </CardTitle>
              <p className="text-emerald-700 text-sm">
                Non-obvious failure fingerprints • Compound signature detection • Cross-domain trigger analysis 
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assetPatterns.map((ap) => (
          <Card key={ap.id} className={`border shadow-sm flex flex-col bg-gradient-to-br from-slate-50 to-emerald-50 ${riskColors[ap.riskLevel]} border-emerald-100`}>
            <CardHeader className="pb-2 flex flex-col gap-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-5 w-5 ${ap.riskLevel === "critical" ? "text-red-600 animate-pulse" : ap.riskLevel === "high" ? "text-orange-600 animate-bounce" : "text-yellow-600"}`} />
                <span className="font-bold text-emerald-900">{ap.name}</span>
              </div>
              <div className="text-xs text-emerald-700">{ap.pattern}</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="font-medium text-emerald-900">{ap.fingerprint}</div>
                <div className="text-xs font-mono text-emerald-600 mt-1">{ap.signature}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-semibold">Compound Trigger:</div>
                <div className="text-sm">{ap.trigger}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-semibold">Resilience Factors:</div>
                <ul className="list-disc pl-5 text-sm">
                  {ap.resilience.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Narrative */}
      <Card className="bg-gradient-to-r from-emerald-100 to-teal-50 border-emerald-200">
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            <span className="font-medium text-emerald-900">Vulnerability Pattern Overview</span>
          </div>
          <div className="text-sm text-emerald-800">
            Real-time asset vulnerability mapping is powered by cross-domain pattern intelligence. Focus on non-obvious fingerprint clusters and compound failure triggers, not simple thresholds.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetIntelligenceView;

