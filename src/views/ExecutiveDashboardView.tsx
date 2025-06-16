
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, DollarSign, ArrowRight, Info, MapPin } from 'lucide-react';
import InteractivePlaybook from '@/components/interactive/InteractivePlaybook';
import HurricaneVelocityMap from '@/components/hurricane/HurricaneVelocityMap';
import PreLandfallPlaybook from '@/components/hurricane/PreLandfallPlaybook';
import { TabType } from '../App';
import { useHurricaneVelocityData } from '../hooks/useHurricaneVelocityData';

interface ExecutiveDashboardViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
  onTabChange: (tab: TabType) => void;
}

const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  dateRange,
  location,
  assetFilter,
  onTabChange
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<string | null>(null);
  
  const {
    vulnerabilityMap,
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

  // Hurricane-specific compound pattern intelligence
  const getGridFailureRisk = () => {
    const windAcceleration = 8.5; // mph/hr increase
    const soilSaturation = 78; // %
    const avgAssetAge = 12; // years
    
    // Compound risk calculation: Wind + Soil + Age
    const compoundRisk = (windAcceleration * 10) + (soilSaturation * 0.8) + (avgAssetAge * 2);
    return Math.min(Math.round(compoundRisk), 100);
  };

  const gridFailureRisk = getGridFailureRisk();
  const criticalAssets = vulnerabilityMap.filter(asset => asset.riskScore >= 80).length;

  const getPatternInsights = () => [
    {
      id: 'grid-failure',
      title: 'Grid Failure Risk - Compound Pattern',
      description: `${gridFailureRisk}% risk based on wind gust acceleration (8.5 mph/hr), soil saturation (78%), and asset age convergence`,
      impact: '$2.3M potential equipment loss prevention',
      action: 'Deploy crews to 12 highest-risk feeders before landfall',
      targetTab: 'velocity' as TabType,
      severity: gridFailureRisk >= 80 ? 'critical' : gridFailureRisk >= 60 ? 'high' : 'moderate',
      dataLineage: {
        public: 'NOAA Wind-Field Data, NHC Storm Track',
        private: 'Asset Age Database, Historical Outage Logs',
        precursor: 'USGS Soil Moisture, Real-Time Tide Gauges'
      }
    },
    {
      id: 'cascade-risk',
      title: 'Transformer Cascade Failure Pattern',
      description: 'Heat stress + electrical load convergence creates 73% secondary failure risk',
      impact: '40% faster restoration if prevented',
      action: 'Pre-stage replacement transformers at 5 key substations',
      targetTab: 'assets' as TabType,
      severity: 'high',
      dataLineage: {
        public: 'Day-Ahead Load Forecasts',
        private: 'Transformer Specifications, Maintenance Records',
        precursor: 'Real-Time Load Monitoring, Temperature Sensors'
      }
    }
  ];

  const patterns = getPatternInsights();

  const DataLineageTooltip = ({ pattern }: { pattern: any }) => (
    <TooltipContent className="bg-white border shadow-lg max-w-sm">
      <div className="p-3 text-xs space-y-2">
        <div className="font-semibold text-slate-900">Data Fusion Sources:</div>
        <div>
          <span className="font-medium text-blue-600">Public Data:</span>
          <div className="text-slate-700 ml-2">{pattern.dataLineage.public}</div>
        </div>
        <div>
          <span className="font-medium text-orange-600">Private Asset Data:</span>
          <div className="text-slate-700 ml-2">{pattern.dataLineage.private}</div>
        </div>
        <div>
          <span className="font-medium text-green-600">Proprietary Precursors:</span>
          <div className="text-slate-700 ml-2">{pattern.dataLineage.precursor}</div>
        </div>
        <div className="pt-1 border-t border-gray-200 text-slate-600">
          Three-layer fusion creates non-obvious risk insights
        </div>
      </div>
    </TooltipContent>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Executive Summary with Hurricane Focus */}
        <Card className={`border-l-4 ${
          gridFailureRisk >= 80 ? 'border-red-400 bg-red-50' :
          gridFailureRisk >= 60 ? 'border-orange-400 bg-orange-50' :
          'border-blue-400 bg-blue-50'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3">
                Hurricane Grid Intelligence
                <Badge variant="outline" className="text-sm">
                  {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {timeToLandfall} to Landfall
                </Badge>
              </CardTitle>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{criticalAssets}</div>
                <div className="text-sm font-medium text-slate-600">Critical Assets</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-gray-800 mb-4">
              Hurricane Impact Velocity Platform is tracking {vulnerabilityMap.length} critical infrastructure assets. 
              Real-time data fusion identifies compound failure patterns invisible to traditional storm tracking.
            </p>
          </CardContent>
        </Card>

        {/* Primary Interactive Vulnerability Map */}
        <Card className="h-[500px]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Live Asset Vulnerability Map</span>
              <Badge variant="outline" className="ml-2">
                Primary Operations Interface
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Click any asset for detailed risk analysis and Pre-Landfall Playbooks
            </p>
          </CardHeader>
          <CardContent className="h-[420px] p-0">
            <HurricaneVelocityMap
              vulnerabilityData={vulnerabilityMap}
              stormTrack={stormData.track}
              onAssetSelect={handleAssetSelect}
              selectedAsset={selectedAsset}
            />
          </CardContent>
        </Card>

        {/* Hurricane-Specific Pattern Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hurricane Pattern Intelligence
              <Badge variant="outline" className="text-xs">
                Three-Layer Data Fusion
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Non-obvious compound patterns detected through fusion of public weather, private asset, and precursor data
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {patterns.map((pattern) => (
              <Card 
                key={pattern.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-l-4 ${
                  pattern.severity === 'critical' ? 'border-red-400 bg-red-50' :
                  pattern.severity === 'high' ? 'border-orange-400 bg-orange-50' :
                  'border-yellow-400 bg-yellow-50'
                }`}
                onClick={() => onTabChange(pattern.targetTab)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className={`h-5 w-5 ${
                          pattern.severity === 'critical' ? 'text-red-600 animate-pulse' :
                          pattern.severity === 'high' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <h3 className="font-semibold text-slate-900">{pattern.title}</h3>
                        <Badge className={`text-xs ${
                          pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pattern.severity.toUpperCase()}
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-slate-500 hover:text-slate-700 cursor-help" />
                          </TooltipTrigger>
                          <DataLineageTooltip pattern={pattern} />
                        </Tooltip>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-2">{pattern.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-slate-900">{pattern.impact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-slate-700">{pattern.action}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Interactive Pre-Landfall Playbook */}
        {activePlaybook && selectedAsset && (
          <PreLandfallPlaybook
            playbookType={activePlaybook}
            assetId={selectedAsset}
            timeToLandfall={timeToLandfall}
            onClose={() => setActivePlaybook(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExecutiveDashboardView;
