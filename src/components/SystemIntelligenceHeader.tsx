
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, RefreshCw, MapPin, Building, Users, Zap, Activity, TrendingUp } from 'lucide-react';

interface SystemIntelligenceHeaderProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  lastUpdated: Date | null;
  cosmicLastUpdated: Date | null;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (type: string) => void;
  onPopulationGroupChange: (group: string) => void;
  onRefresh: () => void;
}

export const SystemIntelligenceHeader: React.FC<SystemIntelligenceHeaderProps> = ({
  location,
  buildingType,
  populationGroup,
  lastUpdated,
  cosmicLastUpdated,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getDataFreshness = () => {
    if (!lastUpdated) return 'Initializing...';
    const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (minutes < 1) return 'Live';
    if (minutes < 5) return `${minutes}m ago`;
    return 'Updating...';
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-indigo-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Originome Intelligence Platform</h1>
              <p className="text-sm text-gray-600">System of Intelligence for Operational Risk Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{getDataFreshness()}</span>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Intelligence
            </Button>
          </div>
        </div>

        {/* System Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 block mb-1">Location Context</label>
              <Select value={location} onValueChange={onLocationChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                  <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                  <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                  <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                  <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 block mb-1">Asset Type</label>
              <Select value={buildingType} onValueChange={onBuildingTypeChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Corporate Office</SelectItem>
                  <SelectItem value="school">Educational Facility</SelectItem>
                  <SelectItem value="healthcare">Healthcare Facility</SelectItem>
                  <SelectItem value="retail">Retail Location</SelectItem>
                  <SelectItem value="hotel">Hospitality Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 block mb-1">Population Profile</label>
              <Select value={populationGroup} onValueChange={onPopulationGroupChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adults">General Adult Population</SelectItem>
                  <SelectItem value="elderly">Senior Population</SelectItem>
                  <SelectItem value="children">Pediatric Population</SelectItem>
                  <SelectItem value="mixed">Mixed Demographics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 block mb-1">Intelligence Status</label>
              <div className="flex gap-1">
                <Badge variant="default" className="text-xs bg-green-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Learning
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Indicators */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>Intelligence Sources: Environmental • Cosmic • Operational • Cross-Sector</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Pattern Library: 847,000+ signatures</span>
              <span>Network Effect: Multi-tenant learning</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
