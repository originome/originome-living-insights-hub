
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Filter, Zap, TrendingUp } from 'lucide-react';
import { IntelligentAlertSystem } from '@/components/IntelligentAlertSystem';

interface InteractivePatternExplorerProps {
  environmentalParams: any;
  externalData: any;
  cosmicData: any;
  buildingType: string;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (buildingType: string) => void;
  onPopulationGroupChange: (populationGroup: string) => void;
  onParamChange: (param: string, value: number) => void;
  location: string;
  populationGroup: string;
}

export const InteractivePatternExplorer: React.FC<InteractivePatternExplorerProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange,
  onParamChange,
  location,
  populationGroup
}) => {
  const [timeframe, setTimeframe] = useState('24h');
  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [activeFilters, setActiveFilters] = useState<string[]>(['compound', 'velocity']);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="space-y-4">
      {/* Interactive Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Eye className="h-5 w-5" />
            Interactive Pattern Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Control */}
            <div>
              <label className="text-sm font-medium text-blue-800 mb-2 block">Location</label>
              <Select value={location} onValueChange={onLocationChange}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                  <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                  <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                  <SelectItem value="Houston, TX">Houston, TX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Building Type Control */}
            <div>
              <label className="text-sm font-medium text-blue-800 mb-2 block">Asset Type</label>
              <Select value={buildingType} onValueChange={onBuildingTypeChange}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timeframe Control */}
            <div>
              <label className="text-sm font-medium text-blue-800 mb-2 block">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Threshold */}
            <div>
              <label className="text-sm font-medium text-blue-800 mb-2 block">
                Risk Threshold: {riskThreshold[0]}%
              </label>
              <Slider
                value={riskThreshold}
                onValueChange={setRiskThreshold}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Pattern Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-blue-800">Pattern Filters:</span>
            {[
              { key: 'compound', label: 'Compound Risk', icon: Zap },
              { key: 'velocity', label: 'Rate of Change', icon: TrendingUp },
              { key: 'geographic', label: 'Geographic', icon: Filter },
              { key: 'cosmic', label: 'Space Weather', icon: Eye }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeFilters.includes(key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(key)}
                className="h-6 text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intelligent Alert System - Contextual to Filters */}
      <IntelligentAlertSystem
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />
    </div>
  );
};
