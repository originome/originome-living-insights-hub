
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  onLocationChange: (location: string) => void;
  onBuildingTypeChange: (type: string) => void;
  onPopulationGroupChange: (group: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  buildingType,
  populationGroup,
  onLocationChange,
  onBuildingTypeChange,
  onPopulationGroupChange
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-600" />
          Location & Building
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter city name or coordinates"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="buildingType" className="text-sm font-medium">
            Building Type
          </Label>
          <Select value={buildingType} onValueChange={onBuildingTypeChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="populationGroup" className="text-sm font-medium">
            Population Group
          </Label>
          <Select value={populationGroup} onValueChange={onPopulationGroupChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adults">Adults (18-64)</SelectItem>
              <SelectItem value="children">Children (5-17)</SelectItem>
              <SelectItem value="elderly">Elderly (65+)</SelectItem>
              <SelectItem value="mixed">Mixed Population</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
