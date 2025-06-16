
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Filter, Zap, Shield, AlertTriangle, Info, Calendar, MapPin } from "lucide-react";

interface AssetFingerprint {
  id: string;
  name: string;
  type: 'substation' | 'feeder_line' | 'transformer' | 'transmission_tower';
  riskScore: number;
  failureProbability: number;
  location: { lat: number; lon: number };
  installDate: string;
  uniqueVulnerabilityProfile: {
    soilMoisture: number;
    windExposure: number;
    assetAge: number;
    floodRisk: number;
    vegetationScore: number;
  };
  criticalFactors: string[];
  maintenanceHistory: string;
  lastInspection: string;
}

interface AssetIntelligenceGalleryProps {
  assets: any[];
}

const AssetIntelligenceGallery: React.FC<AssetIntelligenceGalleryProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Convert assets to detailed fingerprints
  const assetFingerprints: AssetFingerprint[] = assets.map((asset, index) => ({
    id: asset.id,
    name: asset.name,
    type: asset.type,
    riskScore: asset.riskScore,
    failureProbability: asset.failureProbability,
    location: { lat: asset.latitude, lon: asset.longitude },
    installDate: `${2010 + (index * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
    uniqueVulnerabilityProfile: {
      soilMoisture: Math.round(60 + Math.random() * 30),
      windExposure: Math.round(asset.riskScore * 0.8 + Math.random() * 20),
      assetAge: 2024 - (2010 + (index * 2)),
      floodRisk: Math.round(30 + Math.random() * 50),
      vegetationScore: Math.round(20 + Math.random() * 60)
    },
    criticalFactors: asset.criticalFactors,
    maintenanceHistory: index % 3 === 0 ? 'Recent' : index % 3 === 1 ? 'Scheduled' : 'Overdue',
    lastInspection: `2024-${String(Math.floor(Math.random() * 6) + 7).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  }));

  // Filter assets
  const filteredAssets = assetFingerprints.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || 
                       (riskFilter === 'critical' && asset.riskScore >= 80) ||
                       (riskFilter === 'high' && asset.riskScore >= 60 && asset.riskScore < 80) ||
                       (riskFilter === 'moderate' && asset.riskScore >= 40 && asset.riskScore < 60)
    
    return matchesSearch && matchesType && matchesRisk;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'substation': return <Zap className="h-5 w-5 text-blue-600" />;
      case 'transformer': return <Zap className="h-5 w-5 text-green-600" />;
      case 'feeder_line': return <Shield className="h-5 w-5 text-purple-600" />;
      case 'transmission_tower': return <Shield className="h-5 w-5 text-orange-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const VulnerabilityProfileTooltip = ({ profile }: { profile: any }) => (
    <TooltipContent className="bg-white border shadow-lg max-w-sm">
      <div className="p-3 text-xs space-y-2">
        <div className="font-semibold text-slate-900">Legacy-Asset Fingerprint:</div>
        <div className="space-y-1">
          <div>Soil Moisture: <span className="font-bold">{profile.soilMoisture}%</span></div>
          <div>Wind Exposure: <span className="font-bold">{profile.windExposure}/100</span></div>
          <div>Asset Age: <span className="font-bold">{profile.assetAge} years</span></div>
          <div>Flood Risk: <span className="font-bold">{profile.floodRisk}%</span></div>
          <div>Vegetation Management: <span className="font-bold">{profile.vegetationScore}/100</span></div>
        </div>
        <div className="pt-1 border-t border-gray-200 text-slate-600">
          Unique vulnerability signature for this asset
        </div>
      </div>
    </TooltipContent>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Asset Intelligence Gallery</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {filteredAssets.length} Assets
              </Badge>
            </CardTitle>
            <p className="text-sm text-slate-600">
              Explore unique vulnerability fingerprints for each infrastructure asset
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="substation">Substations</SelectItem>
                  <SelectItem value="transformer">Transformers</SelectItem>
                  <SelectItem value="feeder_line">Feeder Lines</SelectItem>
                  <SelectItem value="transmission_tower">Transmission Towers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="critical">Critical (80+)</SelectItem>
                  <SelectItem value="high">High (60-79)</SelectItem>
                  <SelectItem value="moderate">Moderate (40-59)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Asset Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getAssetIcon(asset.type)}
                    <div>
                      <CardTitle className="text-base font-semibold">{asset.name}</CardTitle>
                      <p className="text-sm text-slate-600 capitalize">
                        {asset.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs border ${getRiskColor(asset.riskScore)}`}>
                      RISK: {asset.riskScore}
                    </Badge>
                    <div className="text-xs text-slate-600 mt-1">
                      {asset.failureProbability}% failure
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Asset Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    <span className="text-slate-600">Installed: {asset.installDate.split('-')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="text-slate-600">
                      {asset.location.lat.toFixed(3)}, {asset.location.lon.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* Vulnerability Fingerprint */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-800">Legacy-Asset Fingerprint</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-slate-500" />
                      </TooltipTrigger>
                      <VulnerabilityProfileTooltip profile={asset.uniqueVulnerabilityProfile} />
                    </Tooltip>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Soil Moisture:</span>
                      <span className="font-medium">{asset.uniqueVulnerabilityProfile.soilMoisture}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind Exposure:</span>
                      <span className="font-medium">{asset.uniqueVulnerabilityProfile.windExposure}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asset Age:</span>
                      <span className="font-medium">{asset.uniqueVulnerabilityProfile.assetAge} yrs</span>
                    </div>
                  </div>
                </div>

                {/* Critical Factors */}
                <div>
                  <div className="text-xs font-semibold text-slate-800 mb-1">Critical Factors:</div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {asset.criticalFactors.slice(0, 2).join(' • ')}
                    {asset.criticalFactors.length > 2 && ' • ...'}
                  </div>
                </div>

                {/* Maintenance Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="text-xs">
                    <span className="text-slate-600">Maintenance:</span>
                    <Badge variant="outline" className={`ml-1 text-xs ${
                      asset.maintenanceHistory === 'Overdue' ? 'text-red-700 border-red-300' :
                      asset.maintenanceHistory === 'Recent' ? 'text-green-700 border-green-300' :
                      'text-yellow-700 border-yellow-300'
                    }`}>
                      {asset.maintenanceHistory}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Last: {asset.lastInspection}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <div className="text-sm font-medium text-slate-600 mb-2">No assets match current filters</div>
              <div className="text-xs text-slate-500">Try adjusting your search criteria</div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AssetIntelligenceGallery;
