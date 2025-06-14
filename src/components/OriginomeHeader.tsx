
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Users, MapPin, Download, Share, Presentation } from 'lucide-react';

interface OriginomeHeaderProps {
  location?: {
    city: string;
    region: string;
    zipCode?: string;
  };
  buildingType: string;
  populationGroup: string;
  lastUpdated?: Date;
}

export const OriginomeHeader: React.FC<OriginomeHeaderProps> = ({
  location,
  buildingType,
  populationGroup,
  lastUpdated
}) => {
  const getBuildingTypeLabel = (type: string) => {
    const labels = {
      office: 'Office Building',
      school: 'Educational Facility',
      healthcare: 'Healthcare Facility',
      residential: 'Residential Building',
      retail: 'Retail/Commercial',
      warehouse: 'Warehouse/Industrial',
      hospitality: 'Hotel/Restaurant',
      laboratory: 'Laboratory/Research'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPopulationLabel = (group: string) => {
    const labels = {
      adults: 'Working Adults',
      children: 'Children (5-17)',
      elderly: 'Elderly (65+)',
      students: 'College Students',
      mixed: 'Mixed Population',
      vulnerable: 'Vulnerable Groups'
    };
    return labels[group as keyof typeof labels] || group;
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main Title and Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">ORIGINOME</h1>
                <p className="text-sm text-slate-300 font-medium">Environmental Pattern Intelligence</p>
              </div>
            </div>
            
            {location && (
              <div className="flex items-center gap-3 text-slate-200">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{location.city}, {location.region}</span>
                {location.zipCode && (
                  <Badge variant="outline" className="text-slate-200 border-slate-400 bg-slate-700/50 hover:bg-slate-600">
                    {location.zipCode}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Configuration Summary - Cleaner Design */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-slate-600 text-white border-slate-500 hover:bg-slate-500 transition-colors px-3 py-1">
                <Building className="h-3 w-3 mr-2" />
                {getBuildingTypeLabel(buildingType)}
              </Badge>
              <Badge className="bg-slate-600 text-white border-slate-500 hover:bg-slate-500 transition-colors px-3 py-1">
                <Users className="h-3 w-3 mr-2" />
                {getPopulationLabel(populationGroup)}
              </Badge>
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-slate-400 font-medium">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Action Buttons - Simplified */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Simplified Tagline */}
        <div className="mt-6 pt-6 border-t border-slate-600">
          <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
            Transform environmental data into actionable intelligence. Monitor air quality, space weather, 
            and operational patterns to optimize productivity, reduce costs, and prevent system failures.
          </p>
        </div>
      </div>
    </div>
  );
};
