
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, TrendingUp, Clock } from "lucide-react";

// Simulated micro-pattern convergence data
const patternZones = [
  {
    id: "fusion-01",
    title: "Cognitive Fatigue Convergence Zone",
    riskLevel: "critical",
    fusionNarrative:
      "Non-obvious convergence detected: Risk pattern formed by intersecting airborne irritant surge, temperature derivative, and local geomagnetic activity.",
    geographicDescription:
      "78-meter zone centered near Site Alpha—pattern fusion marks a 'fatigue window' predicted within 42 minutes.",
    factors: [
      "Airborne Irritant Spike",
      "Thermal Kinetics (+2.1°C/hr)",
      "Geomagnetic Kp >4"
    ],
    timeWindow: "42 minutes",
    confidence: "94%"
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
    ],
    timeWindow: "31 minutes",
    confidence: "87%"
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
    ],
    timeWindow: "1-2 hours",
    confidence: "72%"
  }
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

const GeographicIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Geographic Pattern Intelligence
              </CardTitle>
              <p className="text-lg text-slate-700 leading-relaxed">
                Real-time mapping of pattern fusion zones and compound risk convergence
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Advanced detection algorithms identify non-obvious threat patterns before they manifest
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pattern Zone Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
            <div className="text-sm font-medium text-slate-600">Active Zones</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">1</div>
            <div className="text-sm font-medium text-slate-600">Critical Risk</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">84%</div>
            <div className="text-sm font-medium text-slate-600">Avg Confidence</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">31m</div>
            <div className="text-sm font-medium text-slate-600">Next Impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Micro-Pattern Convergence Zones */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Active Pattern Zones</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {patternZones.map((zone) => {
            const styles = riskStyles[zone.riskLevel];
            return (
              <Card
                key={zone.id}
                className={`${styles.border} ${styles.bg} shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-6 w-6 ${styles.icon} ${zone.riskLevel === "critical" ? "animate-pulse" : ""}`} />
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles.badge}`}>
                        {zone.riskLevel.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{zone.confidence}</div>
                      <div className="text-xs text-slate-600">confidence</div>
                    </div>
                  </div>
                  
                  <CardTitle className={`text-lg font-bold ${styles.text} leading-tight`}>
                    {zone.title}
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Impact in {zone.timeWindow}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Pattern Analysis</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {zone.fusionNarrative}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Geographic Scope</h4>
                    <p className="text-xs font-mono text-slate-600 bg-white/60 p-2 rounded border">
                      {zone.geographicDescription}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Convergence Factors</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {zone.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
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

      {/* System Insights */}
      <Card className="bg-gradient-to-r from-slate-50 to-indigo-50 border-slate-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pattern Intelligence Summary</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-3">
                <span className="font-semibold text-indigo-900">Hyperlocal pattern convergence</span> detected across multiple geographic vectors. 
                Real-time mapping enables proactive intervention before visible events occur.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Recommended Action:</strong> Focus interventions where patterns—not individual metrics—intersect for maximum impact.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicIntelligenceView;
