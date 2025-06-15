
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Filter, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GlobalControlBarProps {
  dateRange: string;
  location: string;
  assetFilter: string;
  onDateRangeChange: (range: string) => void;
  onLocationChange: (location: string) => void;
  onAssetFilterChange: (filter: string) => void;
}

const GlobalControlBar: React.FC<GlobalControlBarProps> = ({
  dateRange,
  location,
  assetFilter,
  onDateRangeChange,
  onLocationChange,
  onAssetFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const locations = [
    { value: "hq-campus", label: "HQ Campus", status: "active" },
    { value: "substation-b", label: "Substation B", status: "active" },
    { value: "datacenter-west", label: "Data Center West", status: "maintenance" },
    { value: "facility-north", label: "Facility North", status: "active" },
  ];

  const dateRanges = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <Card className="bg-white border-slate-200 shadow-sm sticky top-0 z-50">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Select value={dateRange} onValueChange={onDateRangeChange}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-slate-500" />
              <Select value={location} onValueChange={onLocationChange}>
                <SelectTrigger className="w-48 h-9">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {locations.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{loc.label}</span>
                        <Badge 
                          variant={loc.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2 text-xs"
                        >
                          {loc.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset Filter Search */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search assets..."
                value={assetFilter}
                onChange={(e) => onAssetFilterChange(e.target.value)}
                className="w-48 h-9"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Indicators */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">Updated 2s ago</span>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-9"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>

        {/* Expanded Filter Options */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-2">Risk Level</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                    <SelectItem value="high">High & Above</SelectItem>
                    <SelectItem value="moderate">Moderate & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">Pattern Type</label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Patterns</SelectItem>
                    <SelectItem value="velocity">Velocity Patterns</SelectItem>
                    <SelectItem value="geographic">Geographic Patterns</SelectItem>
                    <SelectItem value="asset">Asset Patterns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">Confidence Threshold</label>
                <Select defaultValue="60">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="90">90% & Above</SelectItem>
                    <SelectItem value="80">80% & Above</SelectItem>
                    <SelectItem value="70">70% & Above</SelectItem>
                    <SelectItem value="60">60% & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalControlBar;
