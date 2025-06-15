import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, TrendingUp } from "lucide-react";

/**
 * Props for a pattern-driven chart that visualizes compound risk intelligence,
 * removing all raw/commodity metric displays per new spec.
 */
interface PatternInsightChartProps {
  patternId: string;
  compoundRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  anomalyDescription: string;
  timeToImpact?: string;
}

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const icons: Record<string, React.ReactNode> = {
  low: <TrendingUp className="h-5 w-5 text-green-600" />,
  moderate: <TrendingUp className="h-5 w-5 text-yellow-600" />,
  high: <AlertTriangle className="h-5 w-5 text-orange-600 animate-bounce" />,
  critical: <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />,
};

const PatternInsightChart: React.FC<PatternInsightChartProps> = ({
  patternId,
  compoundRiskLevel,
  anomalyDescription,
  timeToImpact,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 mb-2">
        {icons[compoundRiskLevel]}
        <span className={`rounded px-2 py-1 font-semibold text-xs ${riskColors[compoundRiskLevel]}`}>
          Pattern Risk: {compoundRiskLevel.toUpperCase()}
        </span>
        <span className="text-xs text-slate-500 font-mono">#{patternId}</span>
      </div>
      <div className="bg-gradient-to-br from-fuchsia-50 to-blue-50 p-3 rounded border border-fuchsia-100 mb-2">
        <div className="text-sm font-semibold uppercase text-fuchsia-700 mb-1 tracking-wide">
          Pattern Fusion Detected
        </div>
        <div className="text-fuchsia-900 font-medium">
          {anomalyDescription}
        </div>
        {timeToImpact && (
          <div className="mt-2 text-xs text-fuchsia-600 font-mono">
            <span className="font-bold">Time to Impact: </span>
            {timeToImpact}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternInsightChart;
