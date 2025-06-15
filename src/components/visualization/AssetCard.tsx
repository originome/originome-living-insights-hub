
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Thermometer, 
  Droplets, 
  Zap, 
  Calendar, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  Settings
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    type: 'power_transformer' | 'hvac_system' | 'server_rack' | 'manufacturing_unit' | 'solar_panel';
    manufactureYear: number;
    model: string;
    location: string;
    riskScore: number;
    healthStatus: 'optimal' | 'good' | 'degraded' | 'critical';
    vulnerabilitySignature: {
      primaryTriggers: string[];
      riskConditions: string[];
      failurePattern: string;
      historicalEvents: number;
    };
    environmentalSensitivity: {
      temperature: { min: number; max: number; optimal: number };
      humidity: { min: number; max: number; optimal: number };
      customFactors: string[];
    };
    predictiveInsights: {
      nextMaintenanceWindow: Date;
      failureRiskWindow: string;
      costAvoidancePotential: number;
      recommendedActions: string[];
    };
    realTimeMetrics: {
      currentTemperature: number;
      currentHumidity: number;
      operatingHours: number;
      efficiency: number;
    };
  };
  isSelected: boolean;
  onSelect: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'degraded': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'good': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'power_transformer': return '⚡';
      case 'hvac_system': return '❄️';
      case 'server_rack': return '💻';
      case 'manufacturing_unit': return '🏭';
      case 'solar_panel': return '☀️';
      default: return '📊';
    }
  };

  const getTemperatureStatus = (current: number, optimal: number, min: number, max: number) => {
    if (current < min || current > max) return 'critical';
    if (Math.abs(current - optimal) > 5) return 'warning';
    return 'good';
  };

  const getHumidityStatus = (current: number, optimal: number, min: number, max: number) => {
    if (current < min || current > max) return 'critical';
    if (Math.abs(current - optimal) > 10) return 'warning';
    return 'good';
  };

  const tempStatus = getTemperatureStatus(
    asset.realTimeMetrics.currentTemperature,
    asset.environmentalSensitivity.temperature.optimal,
    asset.environmentalSensitivity.temperature.min,
    asset.environmentalSensitivity.temperature.max
  );

  const humidityStatus = getHumidityStatus(
    asset.realTimeMetrics.currentHumidity,
    asset.environmentalSensitivity.humidity.optimal,
    asset.environmentalSensitivity.humidity.min,
    asset.environmentalSensitivity.humidity.max
  );

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    } ${asset.healthStatus === 'critical' ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardHeader className="pb-3" onClick={onSelect}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getTypeIcon(asset.type)}</div>
            <div>
              <h3 className="font-semibold text-slate-900">{asset.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <span>{asset.model}</span>
                <span>•</span>
                <span>{asset.manufactureYear}</span>
                <span>•</span>
                <span>{asset.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getHealthColor(asset.healthStatus)}`}>
              {asset.healthStatus.toUpperCase()}
            </Badge>
            <div className="text-right">
              <div className={`text-lg font-bold ${getRiskColor(asset.riskScore)}`}>
                {asset.riskScore}
              </div>
              <div className="text-xs text-slate-600">Risk Score</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Real-time Environmental Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Thermometer className={`h-4 w-4 ${
                tempStatus === 'critical' ? 'text-red-500' : 
                tempStatus === 'warning' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <div className="text-lg font-bold">
              {asset.realTimeMetrics.currentTemperature.toFixed(1)}°C
            </div>
            <div className="text-xs text-slate-600">
              Optimal: {asset.environmentalSensitivity.temperature.optimal}°C
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Droplets className={`h-4 w-4 ${
                humidityStatus === 'critical' ? 'text-red-500' : 
                humidityStatus === 'warning' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <span className="text-sm font-medium">Humidity</span>
            </div>
            <div className="text-lg font-bold">
              {asset.realTimeMetrics.currentHumidity.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-600">
              Optimal: {asset.environmentalSensitivity.humidity.optimal}%
            </div>
          </div>
        </div>

        {/* Efficiency & Operating Hours */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>Efficiency</span>
            </div>
            <span className="font-semibold">{asset.realTimeMetrics.efficiency.toFixed(1)}%</span>
          </div>
          <Progress value={asset.realTimeMetrics.efficiency} className="h-2" />
          <div className="text-xs text-slate-600">
            Operating Hours: {asset.realTimeMetrics.operatingHours.toLocaleString()}
          </div>
        </div>

        {/* Vulnerability Signature Preview */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-slate-900">Vulnerability Signature</h4>
            <Badge variant="outline" className="text-xs">
              {asset.vulnerabilitySignature.historicalEvents} events
            </Badge>
          </div>
          <div className="text-sm text-slate-700">
            <strong>High Risk When:</strong> {asset.vulnerabilitySignature.primaryTriggers[0]}
            {asset.vulnerabilitySignature.primaryTriggers.length > 1 && 
              ` + ${asset.vulnerabilitySignature.primaryTriggers.length - 1} more conditions`
            }
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">Next Maintenance</div>
              <div className="text-xs text-slate-600">
                {asset.predictiveInsights.nextMaintenanceWindow.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-medium">Cost Avoidance</div>
              <div className="text-xs text-slate-600">
                ${asset.predictiveInsights.costAvoidancePotential.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Full Asset Profile</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <div className="text-xs text-slate-600">
            Risk Window: {asset.predictiveInsights.failureRiskWindow}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* Complete Vulnerability Profile */}
            <div>
              <h5 className="font-semibold text-sm mb-3 text-slate-900">Complete Vulnerability Signature</h5>
              <div className="space-y-3">
                <div>
                  <h6 className="text-xs font-medium text-slate-700 mb-1">Primary Risk Triggers:</h6>
                  <div className="space-y-1">
                    {asset.vulnerabilitySignature.primaryTriggers.map((trigger, index) => (
                      <div key={index} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                        • {trigger}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="text-xs font-medium text-slate-700 mb-1">Compound Risk Conditions:</h6>
                  <div className="space-y-1">
                    {asset.vulnerabilitySignature.riskConditions.map((condition, index) => (
                      <div key={index} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        • {condition}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="text-xs font-medium text-slate-700 mb-1">Failure Pattern:</h6>
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {asset.vulnerabilitySignature.failurePattern}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Environmental Sensitivity Details */}
            <div>
              <h5 className="font-semibold text-sm mb-3 text-slate-900">Environmental Sensitivity Profile</h5>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-medium">Temperature Range</div>
                    <div className="text-slate-600">
                      {asset.environmentalSensitivity.temperature.min}°C - {asset.environmentalSensitivity.temperature.max}°C
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Humidity Range</div>
                    <div className="text-slate-600">
                      {asset.environmentalSensitivity.humidity.min}% - {asset.environmentalSensitivity.humidity.max}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-xs mb-1">Custom Environmental Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {asset.environmentalSensitivity.customFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Recommended Actions */}
            <div>
              <h5 className="font-semibold text-sm mb-3 text-slate-900">Recommended Actions</h5>
              <div className="space-y-2">
                {asset.predictiveInsights.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-slate-700">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetCard;
