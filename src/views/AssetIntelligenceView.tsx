
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Fingerprint, Shield, Clock } from "lucide-react";

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
    confidence: "89%",
    timeToRisk: "17 hours",
    failureProbability: "72%"
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
    confidence: "76%",
    timeToRisk: "5.5 hours",
    failureProbability: "58%"
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
    confidence: "61%",
    timeToRisk: "72 hours",
    failureProbability: "41%"
  },
];

const riskStyles = {
  critical: {
    border: "border-red-200",
    bg: "bg-gradient-to-br from-red-50 to-orange-50",
    text: "text-red-900",
    badge: "bg-red-100 text-red-800 border-red-200",
    icon: "text-red-600"
  },
  high: {
    border: "border-orange-200",
    bg: "bg-gradient-to-br from-orange-50 to-yellow-50",
    text: "text-orange-900",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "text-orange-600"
  },
  moderate: {
    border: "border-yellow-200",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
    text: "text-yellow-900",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "text-yellow-600"
  }
};

const AssetIntelligenceView: React.FC = () => {
  const criticalAssets = assetPatterns.filter(a => a.riskLevel === 'critical').length;
  const avgConfidence = Math.round(assetPatterns.reduce((sum, a) => sum + parseInt(a.confidence), 0) / assetPatterns.length);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Fingerprint className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Asset Intelligence Dashboard
              </CardTitle>
              <p className="text-lg text-slate-700 leading-relaxed">
                Vulnerability pattern fingerprinting and compound signature detection
              </p>
              <p className="text-sm text-slate-600 mt-2">
                AI-powered analysis identifies non-obvious failure patterns before equipment degradation
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{assetPatterns.length}</div>
            <div className="text-sm font-medium text-slate-600">Assets Monitored</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalAssets}</div>
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
            <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
            <div className="text-sm font-medium text-slate-600">Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Pattern Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Asset Vulnerability Patterns</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {assetPatterns.map((asset) => {
            const styles = riskStyles[asset.riskLevel];
            return (
              <Card 
                key={asset.id} 
                className={`${styles.border} ${styles.bg} shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-6 w-6 ${styles.icon} ${asset.riskLevel === "critical" ? "animate-pulse" : ""}`} />
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
                        {asset.riskLevel.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{asset.confidence}</div>
                      <div className="text-xs text-slate-600">confidence</div>
                    </div>
                  </div>
                  
                  <CardTitle className={`text-lg font-bold ${styles.text} leading-tight mb-1`}>
                    {asset.name}
                  </CardTitle>
                  
                  <div className="text-sm font-medium text-slate-700 mb-3">
                    {asset.pattern}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-600">Risk in {asset.timeToRisk}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-600">{asset.failureProbability} failure risk</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Pattern Fingerprint</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {asset.fingerprint}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Risk Signature</h4>
                    <p className="text-xs font-mono text-slate-600 bg-white/60 p-2 rounded border">
                      {asset.signature}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Compound Trigger</h4>
                    <div className="bg-slate-100 p-2 rounded text-sm font-medium text-slate-800">
                      {asset.trigger}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Resilience Factors</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {asset.resilience.map((factor, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Shield className="h-3 w-3 text-green-600" />
                          <span className="text-sm text-slate-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Vulnerability Overview */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50 border-slate-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Vulnerability Pattern Overview</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-3">
                Real-time asset vulnerability mapping powered by <span className="font-semibold text-emerald-900">cross-domain pattern intelligence</span>. 
                Our system identifies compound failure triggers that traditional monitoring misses.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Key Insight:</strong> Focus on non-obvious fingerprint clusters and compound failure triggers, not simple threshold violations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetIntelligenceView;
