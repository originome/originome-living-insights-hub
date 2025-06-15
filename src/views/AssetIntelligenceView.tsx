
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fingerprint, Search, Filter, Grid, List } from "lucide-react";
import AssetCard from "../components/visualization/AssetCard";

interface AssetIntelligenceViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
}

// Mock asset data
const assetData = [
  {
    id: "PT-001",
    name: "Transformer Unit 034",
    type: "Power Transformer",
    status: "critical" as const,
    fingerprint: "Nonlinear risk window triggered by the intersection of solar geomagnetic surge and grid phase oscillator anomaly. Pattern forecast: 72% probability of cascading failure within 17 hours.",
    riskScore: 89,
    lastUpdated: "2 min ago",
    metrics: { uptime: 94, efficiency: 78, predictedFailure: "17h" }
  },
  {
    id: "HVAC-023",
    name: "HVAC System 023",
    type: "Climate Control",
    status: "at-risk" as const,
    fingerprint: "Compound failure signature involving hyperlocal humidity oscillation and operational vibration harmonics. Resilience breached when humidity kinetic ~4x standard deviation aligns with >0.5g vibration.",
    riskScore: 76,
    lastUpdated: "5 min ago",
    metrics: { uptime: 98, efficiency: 85, predictedFailure: "5.5h" }
  },
  {
    id: "RACK-058",
    name: "Server Rack 058",
    type: "IT Infrastructure",
    status: "optimal" as const,
    fingerprint: "Electromagnetic degradation pattern detected when air composition divergence and electromagnetic flux intersect for >14 mins. 61% pattern-match to historical failure fingerprints.",
    riskScore: 41,
    lastUpdated: "1 min ago",
    metrics: { uptime: 99.8, efficiency: 92, predictedFailure: "72h" }
  },
  {
    id: "GEN-012",
    name: "Backup Generator 012",
    type: "Power Generation",
    status: "maintenance" as const,
    fingerprint: "Fuel consumption anomaly correlates with atmospheric pressure variations. Pattern indicates 15% efficiency loss during low-pressure system convergence.",
    riskScore: 58,
    lastUpdated: "12 min ago",
    metrics: { uptime: 87, efficiency: 73, predictedFailure: "48h" }
  },
  {
    id: "UPS-007",
    name: "UPS System 007",
    type: "Power Backup",
    status: "optimal" as const,
    fingerprint: "Battery thermal pattern shows resilience to ambient temperature fluctuations. Optimal performance window maintained across 85% of operational scenarios.",
    riskScore: 23,
    lastUpdated: "3 min ago",
    metrics: { uptime: 99.9, efficiency: 96, predictedFailure: "120h" }
  },
  {
    id: "CHILLER-15",
    name: "Chiller Unit 15",
    type: "Cooling System",
    status: "at-risk" as const,
    fingerprint: "Compound risk signature: Refrigerant pressure oscillation combined with external temperature gradient creates efficiency degradation pattern.",
    riskScore: 67,
    lastUpdated: "8 min ago",
    metrics: { uptime: 91, efficiency: 79, predictedFailure: "24h" }
  }
];

const AssetIntelligenceView: React.FC<AssetIntelligenceViewProps> = ({
  dateRange,
  location,
  assetFilter
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'updated'>('risk');
  const [localSearch, setLocalSearch] = useState('');

  // Filter and sort assets
  const filteredAssets = assetData
    .filter(asset => {
      const searchTerm = (assetFilter + ' ' + localSearch).toLowerCase().trim();
      const matchesSearch = !searchTerm || 
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.type.toLowerCase().includes(searchTerm) ||
        asset.id.toLowerCase().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'risk': return b.riskScore - a.riskScore;
        case 'updated': return a.lastUpdated.localeCompare(b.lastUpdated);
        default: return 0;
      }
    });

  const criticalAssets = filteredAssets.filter(a => a.status === 'critical').length;
  const avgRiskScore = Math.round(
    filteredAssets.reduce((sum, a) => sum + a.riskScore, 0) / filteredAssets.length
  );

  const handleAssetClick = (assetId: string) => {
    setSelectedAsset(selectedAsset === assetId ? null : assetId);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Fingerprint className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                  Asset Intelligence Dashboard
                </CardTitle>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Interactive asset monitoring for {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                  <span>Timeframe: {dateRange}</span>
                  <span>•</span>
                  <span>{filteredAssets.length} assets monitored</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Controls */}
      <Card className="bg-white border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Local Search */}
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search assets..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-48 h-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="optimal">Optimal</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={(value: 'name' | 'risk' | 'updated') => setSortBy(value)}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="risk">Sort by Risk</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="updated">Sort by Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">{filteredAssets.length}</div>
            <div className="text-sm font-medium text-slate-600">Assets Tracked</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalAssets}</div>
            <div className="text-sm font-medium text-slate-600">Critical Status</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{avgRiskScore}%</div>
            <div className="text-sm font-medium text-slate-600">Avg Risk Score</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="py-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
            <div className="text-sm font-medium text-slate-600">Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Asset Gallery */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-slate-600" />
              <CardTitle className="text-xl font-bold text-slate-900">
                Asset Intelligence Gallery
              </CardTitle>
            </div>
            <div className="text-sm text-slate-600">
              {filteredAssets.length} of {assetData.length} assets shown
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  {...asset}
                  onClick={handleAssetClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleAssetClick(asset.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      asset.status === 'critical' ? 'bg-red-500 animate-pulse' :
                      asset.status === 'at-risk' ? 'bg-yellow-500' :
                      asset.status === 'maintenance' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-semibold text-slate-900">{asset.name}</div>
                      <div className="text-sm text-slate-600">{asset.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{asset.riskScore}</div>
                      <div className="text-slate-600">Risk Score</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{asset.metrics.uptime}%</div>
                      <div className="text-slate-600">Uptime</div>
                    </div>
                    <div className="text-slate-600">{asset.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">No assets found</div>
              <div className="text-slate-600 text-sm">
                Try adjusting your search criteria or filters
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            {(() => {
              const asset = filteredAssets.find(a => a.id === selectedAsset);
              if (!asset) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Detailed Analysis: {asset.name}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedAsset(null)}
                    >
                      Close Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Asset Intelligence Profile</h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded border">
                        {asset.fingerprint}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Performance Metrics</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-lg font-bold text-slate-900">{asset.metrics.uptime}%</div>
                            <div className="text-xs text-slate-600">Uptime</div>
                          </div>
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-lg font-bold text-slate-900">{asset.metrics.efficiency}%</div>
                            <div className="text-xs text-slate-600">Efficiency</div>
                          </div>
                          <div className="bg-white p-3 rounded border text-center">
                            <div className="text-lg font-bold text-slate-900">{asset.metrics.predictedFailure}</div>
                            <div className="text-xs text-slate-600">Next Risk</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Risk Assessment</h4>
                        <div className="bg-white p-4 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Risk Score</span>
                            <span className="text-lg font-bold text-slate-900">{asset.riskScore}/100</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                asset.riskScore >= 80 ? 'bg-red-500' :
                                asset.riskScore >= 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${asset.riskScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetIntelligenceView;
