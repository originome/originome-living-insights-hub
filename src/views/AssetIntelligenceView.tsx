
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Zap, Calendar, AlertCircle, TrendingUp, Fingerprint } from "lucide-react";
import AssetCard from "../components/visualization/AssetCard";

interface AssetFingerprint {
  id: string;
  name: string;
  type: 'power_transformer' | 'hvac_system' | 'server_rack' | 'manufacturing_unit' | 'solar_panel';
  manufactureYear: number;
  model: string;
  location: string;
  riskScore: number;
  healthStatus: 'optimal' | 'good' | 'degraded' | 'critical';
  vulnerabilitySignature: {
    narrative: string;
    factors: Array<{
      domain: 'Space Weather' | 'Grid' | 'Environmental' | 'Operational';
      parameter: string;
      condition: string;
    }>;
    failurePattern: string;
    resilience: string[];
    primaryTriggers: string[];
    riskConditions: string[];
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
}

const AssetIntelligenceView: React.FC = () => {
  const [assets, setAssets] = useState<AssetFingerprint[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetFingerprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'degraded'>('all');

  useEffect(() => {
    // Generate realistic asset fingerprint data
    const generateAssetData = () => {
      const assetTypes = ['power_transformer', 'hvac_system', 'server_rack', 'manufacturing_unit', 'solar_panel'] as const;
      const locations = ['Building A - Floor 3', 'Main Facility - East Wing', 'Data Center - Rack 47', 'Production Line 2', 'Rooftop Array - Section C'];
      const healthStatuses = ['optimal', 'good', 'degraded', 'critical'] as const;

      const signatures = [
        {
          narrative: 'This asset exhibits a unique vulnerability to compound stress events where solar wind speed exceeds 600 km/s while local grid frequency dips below 59.97 Hz.',
          factors: [
            { domain: 'Space Weather', parameter: 'Solar Wind Speed', condition: '> 600 km/s' },
            { domain: 'Grid', parameter: 'Frequency', condition: '< 59.97 Hz' },
          ],
          failurePattern: 'Sudden cascading electronic failure under compound stress.',
          resilience: ['High thermal tolerance', 'Immune to humidity shifts'],
        },
        {
          narrative: 'Vulnerability is triggered by rapid atmospheric pressure drops (> 4 hPa/hr) occurring during periods of high internal vibration (> 0.5g).',
          factors: [
            { domain: 'Environmental', parameter: 'Pressure Drop Rate', condition: '> 4 hPa/hr' },
            { domain: 'Operational', parameter: 'Internal Vibration', condition: '> 0.5g' },
          ],
          failurePattern: 'Seal and gasket failure leading to gradual performance degradation.',
          resilience: ['Stable under electromagnetic interference'],
        }
      ] as const;
      
      const demoAssets: AssetFingerprint[] = Array.from({ length: 8 }, (_, index) => {
        const type = assetTypes[index % assetTypes.length];
        const manufactureYear = 2015 + Math.floor(Math.random() * 8);
        const healthStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
        const signature = signatures[index % signatures.length];
        
        return {
          id: `asset-${index + 1}`,
          name: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Unit ${String(index + 1).padStart(3, '0')}`,
          type,
          manufactureYear,
          model: `Model ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}`,
          location: locations[index % locations.length],
          riskScore: Math.floor(Math.random() * 100),
          healthStatus,
          vulnerabilitySignature: {
            ...signature,
            factors: [...signature.factors],
            resilience: [...signature.resilience], // Create a mutable copy here
            primaryTriggers: signature.factors.map(f => f.parameter),
            riskConditions: signature.factors.map(f => `${f.parameter} ${f.condition}`),
            historicalEvents: Math.floor(Math.random() * 5),
          },
          environmentalSensitivity: {
            temperature: { min: 5, max: 45, optimal: 22 },
            humidity: { min: 20, max: 80, optimal: 45 },
            customFactors: [
              'Electromagnetic field variations',
              'Vibration levels',
              'Air quality index',
              'Barometric pressure changes'
            ].slice(0, Math.floor(Math.random() * 3) + 1)
          },
          predictiveInsights: {
            nextMaintenanceWindow: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            failureRiskWindow: ['Next 2-4 weeks', 'Next 30-60 days', 'Next 6 months', 'Low risk - next 12 months'][Math.floor(Math.random() * 4)],
            costAvoidancePotential: Math.floor(Math.random() * 50000) + 5000,
            recommendedActions: [
              'Schedule preventive maintenance',
              'Monitor temperature closely during peak hours',
              'Install additional environmental sensors',
              'Update firmware to latest version',
              'Inspect electrical connections'
            ].slice(0, Math.floor(Math.random() * 3) + 2)
          },
          realTimeMetrics: {
            currentTemperature: 18 + Math.random() * 15,
            currentHumidity: 35 + Math.random() * 30,
            operatingHours: Math.floor(Math.random() * 50000) + 10000,
            efficiency: 75 + Math.random() * 20
          }
        };
      });

      setAssets(demoAssets);
      setIsLoading(false);
    };

    setTimeout(generateAssetData, 1000);
  }, []);

  const filteredAssets = assets.filter(asset => {
    if (filterStatus === 'critical') return asset.healthStatus === 'critical';
    if (filterStatus === 'degraded') return asset.healthStatus === 'degraded';
    return true;
  });

  const criticalAssets = assets.filter(a => a.healthStatus === 'critical').length;
  const degradedAssets = assets.filter(a => a.healthStatus === 'degraded').length;
  const avgRiskScore = Math.round(assets.reduce((sum, a) => sum + a.riskScore, 0) / assets.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Server className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Generating Asset Fingerprints...
            </h3>
            <p className="text-slate-600">
              Analyzing legacy systems and building vulnerability profiles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fingerprint className="h-6 w-6 text-emerald-600" />
              <div>
                <CardTitle className="text-xl text-emerald-900">
                  Asset Intelligence - Vulnerability Fingerprinting
                </CardTitle>
                <p className="text-emerald-700 text-sm">
                  Cross-domain risk signatures • Predictive failure analysis • Non-obvious vulnerability mapping
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-red-700">{criticalAssets} Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-700">{degradedAssets} Degraded</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All Assets ({assets.length})
                </Button>
                <Button
                  variant={filterStatus === 'critical' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('critical')}
                >
                  Critical ({criticalAssets})
                </Button>
                <Button
                  variant={filterStatus === 'degraded' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('degraded')}
                >
                  Degraded ({degradedAssets})
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isSelected={selectedAsset?.id === asset.id}
            onSelect={() => setSelectedAsset(asset)}
          />
        ))}
      </div>

      {/* Asset Intelligence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Assets', 
            value: assets.length, 
            icon: Server, 
            color: 'blue',
            description: 'Monitored systems'
          },
          { 
            label: 'Average Risk Score', 
            value: avgRiskScore, 
            icon: AlertCircle, 
            color: avgRiskScore > 70 ? 'red' : avgRiskScore > 40 ? 'yellow' : 'green',
            description: 'Compound risk metric'
          },
          { 
            label: 'Maintenance Due', 
            value: assets.filter(a => new Date(a.predictiveInsights.nextMaintenanceWindow).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000).length, 
            icon: Calendar, 
            color: 'orange',
            description: 'Next 7 days'
          },
          { 
            label: 'Cost Avoidance', 
            value: `$${Math.round(assets.reduce((sum, a) => sum + a.predictiveInsights.costAvoidancePotential, 0) / 1000)}K`, 
            icon: Zap, 
            color: 'green',
            description: 'Potential savings'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <div className={`text-xl font-bold text-${stat.color}-600`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-900">{stat.label}</div>
                    <div className="text-xs text-slate-600">{stat.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AssetIntelligenceView;

