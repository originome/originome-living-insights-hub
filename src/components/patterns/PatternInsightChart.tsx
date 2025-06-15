
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, TrendingUp } from "lucide-react";

/**
 * Props for a pattern-driven chart that visualizes compound risk intelligence,
 * not raw commodity signals.
 */
interface PatternInsightChartProps {
  patternId: string;
  inputs: Array<{ name: string; value: number; unit: string }>;
  compoundRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  anomalyDescription: string;
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
  inputs,
  compoundRiskLevel,
  anomalyDescription,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 mb-2">
        {icons[compoundRiskLevel]}
        <Badge className={`${riskColors[compoundRiskLevel]} text-xs px-2 py-1`}>
          Compound Risk: {compoundRiskLevel.toUpperCase()}
        </Badge>
        <span className="text-xs text-slate-500 font-mono">#{patternId}</span>
      </div>
      <div className="bg-slate-50 p-3 rounded border border-fuchsia-100 mb-2">
        <div className="text-xs font-medium uppercase text-fuchsia-600 mb-1 tracking-wide">
          Input Signal Fusions
        </div>
        <div className="flex flex-wrap gap-3">
          {inputs.map((input) => (
            <div key={input.name} className="flex items-center gap-1 bg-white border border-fuchsia-100 rounded px-2 py-1 text-xs shadow-sm">
              <Brain className="h-3 w-3 text-fuchsia-600" />
              <span>{input.name}:</span>
              <span className="font-mono">{input.value}</span>
              <span className="font-mono text-gray-500">{input.unit}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm text-fuchsia-900 font-semibold">
        {anomalyDescription}
      </div>
    </div>
  );
};

export default PatternInsightChart;
