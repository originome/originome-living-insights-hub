
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AssetLearningPanel } from '@/components/AssetLearningPanel';
import { Settings, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface AssetPerformanceTabProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
  isCosmicLoading: boolean;
}

export const AssetPerformanceTab: React.FC<AssetPerformanceTabProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup,
  isCosmicLoading
}) => {
  // Calculate asset health metrics
  const getAssetHealthStatus = () => {
    const issues = [];
    if (environmentalParams.co2 > 900) issues.push('HVAC strain');
    if (environmentalParams.pm25 > 30) issues.push('filter_maintenance');
    if (Math.abs(environmentalParams.temperature - 21) > 4) issues.push('temperature_control');
    
    if (issues.length === 0) return { status: 'optimal', color: 'green' };
    if (issues.length <= 1) return { status: 'monitoring', color: 'yellow' };
    return { status: 'attention', color: 'red' };
  };

  const assetHealth = getAssetHealthStatus();

  const getMaintenancePredictions = () => {
    const predictions = [];
    
    if (environmentalParams.co2 > 850) {
      predictions.push({
        system: 'HVAC System',
        prediction: 'Filter replacement needed within 7-10 days',
        confidence: 87,
        urgency: 'medium'
      });
    }
    
    if (environmentalParams.pm25 > 25) {
      predictions.push({
        system: 'Air Filtration',
        prediction: 'Pre-filter maintenance required within 3-5 days',
        confidence: 92,
        urgency: 'high'
      });
    }
    
    if (Math.abs(environmentalParams.temperature - 21) > 3) {
      predictions.push({
        system: 'Temperature Control',
        prediction: 'Thermostat calibration recommended',
        confidence: 78,
        urgency: 'low'
      });
    }

    return predictions;
  };

  const maintenancePredictions = getMaintenancePredictions();

  return (
    <div className="space-y-6">
      {/* Asset Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Asset Performance Overview
          </CardTitle>
          <p className="text-sm text-gray-600">
            Real-time monitoring and predictive maintenance for building systems
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                assetHealth.color === 'green' ? 'text-green-600' :
                assetHealth.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {assetHealth.status.toUpperCase()}
              </div>
              <p className="text-sm text-gray-600 mt-1">System Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {maintenancePredictions.length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Active Predictions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {buildingType.charAt(0).toUpperCase() + buildingType.slice(1)}
              </div>
              <p className="text-sm text-gray-600 mt-1">Asset Profile</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Maintenance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Predictive Maintenance Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenancePredictions.length > 0 ? (
            maintenancePredictions.map((prediction, index) => (
              <Alert key={index} className={`border-l-4 ${
                prediction.urgency === 'high' ? 'border-red-400 bg-red-50' :
                prediction.urgency === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                'border-blue-400 bg-blue-50'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{prediction.system}</div>
                      <div className="text-sm mt-1">{prediction.prediction}</div>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {prediction.confidence}% confidence
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <Alert className="border-l-4 border-green-400 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">All Systems Operating Optimally</div>
                <div className="text-sm mt-1">No maintenance actions required at this time</div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Asset-Specific Intelligence */}
      {externalData.location && (
        <AssetLearningPanel
          buildingType={buildingType}
          location={{ lat: externalData.location.lat, lon: externalData.location.lon }}
          currentConditions={environmentalParams}
        />
      )}
    </div>
  );
};
