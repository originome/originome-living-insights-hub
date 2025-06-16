
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, MapPin, Clock, Shield } from "lucide-react";
import { ViewProps } from "../types/viewProps";
import HurricaneVelocityMap from "../components/hurricane/HurricaneVelocityMap";
import VulnerabilityRankingPanel from "../components/hurricane/VulnerabilityRankingPanel";
import PreLandfallPlaybook from "../components/hurricane/PreLandfallPlaybook";
import VelocityThresholdAlerts from "../components/hurricane/VelocityThresholdAlerts";
import { useHurricaneVelocityData } from "../hooks/useHurricaneVelocityData";

const EnvironmentalVelocityView: React.FC<ViewProps> = ({
  dateRange,
  location,
  assetFilter
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<string | null>(null);
  
  const {
    vulnerabilityMap,
    velocityThresholds,
    stormData,
    criticalAlerts,
    timeToLandfall
  } = useHurricaneVelocityData(location, assetFilter);

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    const asset = vulnerabilityMap.find(a => a.id === assetId);
    if (asset && asset.riskScore >= 70) {
      setActivePlaybook(asset.recommendedPlaybook);
    }
  };

  const criticalAssets = vulnerabilityMap.filter(asset => asset.riskScore >= 80).length;
  const highRiskAssets = vulnerabilityMap.filter(asset => asset.riskScore >= 60 && asset.riskScore < 80).length;

  return (
    <div className="space-y-6 max-w-full mx-auto">
      {/* Hurricane Operations Header */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Hurricane Impact Velocity Dashboard
                </CardTitle>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Real-time infrastructure failure prediction for {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <Badge variant="destructive" className="animate-pulse">
                    {timeToLandfall} TO LANDFALL
                  </Badge>
                  <span className="text-slate-600">Storm Category: {stormData.category}</span>
                  <span className="text-slate-600">Forward Speed: {stormData.forwardSpeed} mph</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">{criticalAssets}</div>
              <div className="text-sm font-medium text-slate-600">Critical Risk Assets</div>
              <div className="text-xl font-bold text-orange-600 mt-1">{highRiskAssets}</div>
              <div className="text-sm font-medium text-slate-600">High Risk Assets</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Velocity Threshold Alerts */}
      <VelocityThresholdAlerts 
        alerts={criticalAlerts}
        stormData={stormData}
      />

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Vulnerability Map */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Ranked Vulnerability Map</span>
                <Badge variant="outline" className="ml-2">
                  Live Asset Intelligence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[520px] p-0">
              <HurricaneVelocityMap
                vulnerabilityData={vulnerabilityMap}
                stormTrack={stormData.track}
                onAssetSelect={handleAssetSelect}
                selectedAsset={selectedAsset}
              />
            </CardContent>
          </Card>
        </div>

        {/* Vulnerability Rankings Panel */}
        <div>
          <VulnerabilityRankingPanel
            vulnerabilityData={vulnerabilityMap}
            onAssetSelect={handleAssetSelect}
            selectedAsset={selectedAsset}
          />
        </div>
      </div>

      {/* Pre-Landfall Playbook */}
      {activePlaybook && selectedAsset && (
        <PreLandfallPlaybook
          playbookType={activePlaybook}
          assetId={selectedAsset}
          timeToLandfall={timeToLandfall}
          onClose={() => setActivePlaybook(null)}
        />
      )}

      {/* Operational Status Footer */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700">Three-Layer Fusion Engine: ACTIVE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">Next Update: 2 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">Monitoring {vulnerabilityMap.length} Critical Assets</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Hurricane Ops Mode: ACTIVE
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
