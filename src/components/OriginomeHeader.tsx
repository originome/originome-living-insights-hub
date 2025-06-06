
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Main Title and Branding */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">ORIGINOME</h1>
                <p className="text-sm text-white/80">Bio-Adaptive Infrastructure Intelligence</p>
              </div>
            </div>
            
            {location && (
              <div className="flex items-center gap-2 text-sm text-white/90">
                <MapPin className="h-4 w-4" />
                <span>{location.city}, {location.region}</span>
                {location.zipCode && (
                  <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                    {location.zipCode}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Configuration Summary */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Building className="h-3 w-3 mr-1" />
                {getBuildingTypeLabel(buildingType)}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Users className="h-3 w-3 mr-1" />
                {getPopulationLabel(populationGroup)}
              </Badge>
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-white/70">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="bg-white text-indigo-600 hover:bg-white/90"
            >
              <Presentation className="h-4 w-4 mr-1" />
              Demo Mode
            </Button>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/80 max-w-3xl">
            Unlock your building's hidden impact on people and profits. See live data on how air, light, and noise 
            inside your facility silently shape productivity, health, and costs — all benchmarked against your peers.
          </p>
        </div>
      </div>
    </div>
  );
};
