
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, Wind, Droplets, Clock } from "lucide-react";

interface VelocityAlert {
  id: string;
  parameter: string;
  currentValue: number;
  threshold: number;
  velocityRate: number;
  unit: string;
  severity: 'critical' | 'high' | 'moderate';
  utilityImpact: string;
  actionRequired: string;
  timeToThreshold?: string;
}

interface StormData {
  category: number;
  forwardSpeed: number;
  windSpeed: number;
  pressure: number;
  rainfall: number;
}

interface VelocityThresholdAlertsProps {
  alerts: VelocityAlert[];
  stormData: StormData;
}

const VelocityThresholdAlerts: React.FC<VelocityThresholdAlertsProps> = ({
  alerts,
  stormData
}) => {
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getParameterIcon = (parameter: string) => {
    if (parameter.toLowerCase().includes('wind')) return <Wind className="h-4 w-4" />;
    if (parameter.toLowerCase().includes('flood') || parameter.toLowerCase().includes('surge')) return <Droplets className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">
              All velocity thresholds within operational limits
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
          <span className="text-red-900">Critical Velocity Threshold Breaches</span>
          <Badge variant="destructive" className="ml-2">
            {criticalAlerts.length} CRITICAL
          </Badge>
          {highAlerts.length > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {highAlerts.length} HIGH
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getParameterIcon(alert.parameter)}
                <div>
                  <div className="font-bold text-sm">{alert.parameter}</div>
                  <div className="text-xs opacity-80">
                    Rate of Change: {alert.velocityRate > 0 ? '+' : ''}{alert.velocityRate} {alert.unit}/hr
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {alert.currentValue} {alert.unit}
                </div>
                <div className="text-xs">
                  Threshold: {alert.threshold} {alert.unit}
                </div>
                {alert.timeToThreshold && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-medium">{alert.timeToThreshold}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-xs font-semibold mb-1">Utility Infrastructure Impact:</div>
                <div className="text-xs leading-relaxed">{alert.utilityImpact}</div>
              </div>
              
              <div>
                <div className="text-xs font-semibold mb-1">Immediate Action Required:</div>
                <div className="text-xs leading-relaxed font-medium">{alert.actionRequired}</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Storm Context */}
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 mt-4">
          <div className="text-xs font-semibold text-slate-800 mb-2">Current Storm Parameters:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="font-medium">Category</div>
              <div className="text-slate-700">{stormData.category}</div>
            </div>
            <div>
              <div className="font-medium">Forward Speed</div>
              <div className="text-slate-700">{stormData.forwardSpeed} mph</div>
            </div>
            <div>
              <div className="font-medium">Max Winds</div>
              <div className="text-slate-700">{stormData.windSpeed} mph</div>
            </div>
            <div>
              <div className="font-medium">Pressure</div>
              <div className="text-slate-700">{stormData.pressure} mb</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VelocityThresholdAlerts;
