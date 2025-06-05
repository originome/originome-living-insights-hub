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
            Location (Zip Code, City, or Coordinates)
          </Label>
          <Input
            id="location"
            name="location"     // <--- ADDED name attribute
            type="text"
            placeholder="e.g., 10001, New York, or 40.7128,-74.0060"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="mt-1"
            autoComplete="address-level2" // helps browser autofill (optional)
          />
          <div className="text-xs text-gray-500 mt-1">
            Enter zip code for fastest results, or city name/coordinates
          </div>
        </div>
        
        <div>
          <Label htmlFor="buildingType" className="text-sm font-medium">
            Building Type
          </Label>
          <Select
            id="buildingType"
            name="buildingType"  // <--- ADD these to pass through to the <select>
            value={buildingType}
            onValueChange={onBuildingTypeChange}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office Building</SelectItem>
              <SelectItem value="school">School/University</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="healthcare">Healthcare Facility</SelectItem>
              <SelectItem value="retail">Retail/Commercial</SelectItem>
              <SelectItem value="warehouse">Warehouse/Industrial</SelectItem>
              <SelectItem value="hospitality">Hotel/Restaurant</SelectItem>
              <SelectItem value="laboratory">Laboratory/Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="populationGroup" className="text-sm font-medium">
            Primary Occupant Group
          </Label>
          <Select
            id="populationGroup"
            name="populationGroup" // <--- ADD these to pass through to the <select>
            value={populationGroup}
            onValueChange={onPopulationGroupChange}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adults">Working Adults (18-64)</SelectItem>
              <SelectItem value="children">Children (5-17)</SelectItem>
              <SelectItem value="elderly">Elderly (65+)</SelectItem>
              <SelectItem value="students">College Students (18-25)</SelectItem>
              <SelectItem value="mixed">Mixed Population</SelectItem>
              <SelectItem value="vulnerable">Vulnerable/At-Risk Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
