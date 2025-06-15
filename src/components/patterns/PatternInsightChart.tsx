
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, TrendingUp, Clock } from "lucide-react";

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
  low: "bg-green-50 text-green-800 border-green-200",
  moderate: "bg-yellow-50 text-yellow-800 border-yellow-200",
  high: "bg-orange-50 text-orange-800 border-orange-200",
  critical: "bg-red-50 text-red-800 border-red-200",
};

const riskIcons: Record<string, React.ReactNode> = {
  low: <TrendingUp className="h-4 w-4 text-green-600" />,
  moderate: <TrendingUp className="h-4 w-4 text-yellow-600" />,
  high: <AlertTriangle className="h-4 w-4 text-orange-600" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />,
};

const PatternInsightChart: React.FC<PatternInsightChartProps> = ({
  patternId,
  compoundRiskLevel,
  anomalyDescription,
  timeToImpact,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {riskIcons[compoundRiskLevel]}
          <Badge className={`text-xs font-semibold border ${riskColors[compoundRiskLevel]}`}>
            {compoundRiskLevel.toUpperCase()} RISK
          </Badge>
        </div>
        <span className="text-xs text-slate-500 font-mono">#{patternId.slice(-6)}</span>
      </div>
      
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Pattern Fusion Detected
          </span>
        </div>
        
        <p className="text-sm text-slate-700 leading-relaxed mb-3">
          {anomalyDescription}
        </p>
        
        {timeToImpact && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">
              Time to Impact: <span className="font-bold text-slate-900">{timeToImpact}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternInsightChart;
