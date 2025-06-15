
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

export interface DemoLocation {
  id: string;
  name: string;
  city: string;
  region: string;
  coordinates: { lat: number; lng: number };
  industry: string;
  description: string;
}

interface LocationSelectorProps {
  locations: DemoLocation[];
  selectedLocation: DemoLocation;
  onLocationChange: (location: DemoLocation) => void;
  onUseCurrentLocation?: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocation,
  onLocationChange,
  onUseCurrentLocation
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Demo Location:</span>
      </div>
      
      <Select 
        value={selectedLocation.id} 
        onValueChange={(value) => {
          const location = locations.find(l => l.id === value);
          if (location) onLocationChange(location);
        }}
      >
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              <div>
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-slate-500">{location.industry} • {location.city}, {location.region}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onUseCurrentLocation && (
        <Button
          variant="outline"
          size="sm"
          onClick={onUseCurrentLocation}
          className="flex items-center space-x-1"
        >
          <Navigation className="h-3 w-3" />
          <span className="text-xs">Use My Location</span>
        </Button>
      )}
    </div>
  );
};

export default LocationSelector;
