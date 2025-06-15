
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Settings } from "lucide-react";

interface AssetCardProps {
  id: string;
  name: string;
  type: string;
  status: 'optimal' | 'at-risk' | 'maintenance' | 'critical';
  fingerprint: string;
  riskScore: number;
  lastUpdated: string;
  metrics: {
    uptime: number;
    efficiency: number;
    predictedFailure: string;
  };
  onClick?: (assetId: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  id,
  name,
  type,
  status,
  fingerprint,
  riskScore,
  lastUpdated,
  metrics,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-300';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-blue-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isHovered ? 'ring-2 ring-blue-200' : ''
      } ${status === 'critical' ? 'ring-1 ring-red-200' : 'border-slate-200'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <Badge className={`text-xs border ${getStatusColor(status)}`}>
              {status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getRiskColor(riskScore)}`}>
              {riskScore}
            </div>
            <div className="text-xs text-slate-500">Risk Score</div>
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
          {name}
        </CardTitle>
        <div className="text-sm text-slate-600">{type}</div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Asset Fingerprint */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Legacy-Asset Fingerprint</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border">
            {fingerprint}
          </p>
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-2 rounded border">
            <div className="text-lg font-bold text-slate-900">{metrics.uptime}%</div>
            <div className="text-xs text-slate-600">Uptime</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-lg font-bold text-slate-900">{metrics.efficiency}%</div>
            <div className="text-xs text-slate-600">Efficiency</div>
          </div>
          <div className="bg-white p-2 rounded border">
            <div className="text-sm font-bold text-slate-900">{metrics.predictedFailure}</div>
            <div className="text-xs text-slate-600">Next Risk</div>
          </div>
        </div>
        
        {/* Real-time Status Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <div className={`w-2 h-2 rounded-full ${
              status === 'optimal' ? 'bg-green-500 animate-pulse' :
              status === 'critical' ? 'bg-red-500 animate-pulse' :
              'bg-blue-500'
            }`}></div>
            <span>Updated {lastUpdated}</span>
          </div>
          
          {isHovered && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;
