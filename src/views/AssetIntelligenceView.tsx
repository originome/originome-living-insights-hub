
import React from "react";
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
  critical: "bg-red-50 text-red-800",
  high: "bg-orange-50 text-orange-900",
  moderate: "bg-yellow-50 text-yellow-900"
};

const AssetIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-100/80 border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Fingerprint className="h-8 w-8 text-emerald-700" />
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-serif tracking-tight">
                Asset Intelligence
              </CardTitle>
              <p className="text-emerald-700 text-base sm:text-lg font-medium mt-1">
                Vulnerability pattern fingerprints powered by cross-domain trigger analysis.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {assetPatterns.map((ap) => (
          <Card key={ap.id} className={`border-0 rounded-2xl shadow-lg flex flex-col bg-gradient-to-br from-white via-emerald-50 to-slate-100 ${riskColors[ap.riskLevel]}`}>
            <CardHeader className="pb-3 flex flex-col gap-1">
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`h-6 w-6 ${ap.riskLevel === "critical"
                  ? "text-red-600 animate-pulse"
                  : ap.riskLevel === "high"
                    ? "text-orange-600 animate-bounce"
                    : "text-yellow-600"
                  }`}
                />
                <span className="font-semibold text-lg sm:text-xl font-serif">{ap.name}</span>
              </div>
              <div className="text-xs font-mono text-emerald-700 mt-1">{ap.pattern}</div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="font-medium text-emerald-900 text-base leading-relaxed">{ap.fingerprint}</div>
                <div className="text-xs font-mono text-emerald-600 mt-1">{ap.signature}</div>
              </div>
              <div>
                <div className="text-xs text-slate-700 font-semibold mb-1">Compound Trigger</div>
                <div className="text-sm">{ap.trigger}</div>
              </div>
              <div>
                <div className="text-xs text-slate-700 font-semibold mb-1">Resilience Factors</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
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
      <Card className="bg-gradient-to-r from-emerald-100 to-teal-50 border-0 shadow-sm">
        <CardContent>
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-6 w-6 text-emerald-700" />
            <span className="font-semibold text-lg font-serif text-emerald-900">Pattern Fingerprint Overview</span>
          </div>
          <div className="text-base text-emerald-900 font-medium">
            Pattern intelligence reveals clusters and compound signatures—not just simple thresholds—
            to focus interventions on true root vulnerabilities.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetIntelligenceView;
