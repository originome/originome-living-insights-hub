
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

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
  const [inputValue, setInputValue] = useState(location);
  const [isValidLocation, setIsValidLocation] = useState(false);

  // Validate location input
  const validateLocation = (value: string) => {
    const trimmedValue = value.trim();
    
    // US ZIP code (5 digits or 5+4 format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    
    // At least 2 characters for city names or coordinates
    const cityPattern = /^[a-zA-Z\s,.-]{2,}$/;
    
    // Coordinates pattern (lat,lon)
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    
    return zipPattern.test(trimmedValue) || 
           cityPattern.test(trimmedValue) || 
           coordPattern.test(trimmedValue);
  };

  // Handle input changes with validation
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsValidLocation(validateLocation(value));
  };

  // Handle search/submit
  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    if (isValidLocation && trimmedValue !== location) {
      onLocationChange(trimmedValue);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search for valid US zip codes
  useEffect(() => {
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (zipPattern.test(inputValue.trim()) && inputValue.trim() !== location) {
      const timer = setTimeout(() => {
        onLocationChange(inputValue.trim());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputValue, location, onLocationChange]);

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
            Location (US Zip Code, City, or Coordinates)
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="location"
              type="text"
              placeholder="e.g., 60607, Chicago IL, or 41.8781,-87.6298"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 ${!isValidLocation && inputValue ? 'border-red-300' : ''}`}
            />
            <Button 
              onClick={handleSearch}
              disabled={!isValidLocation || inputValue.trim() === location}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {inputValue && !isValidLocation ? 
              'Please enter a valid US ZIP code (e.g., 60607), city name, or coordinates' :
              'ZIP codes provide the most accurate results'
            }
          </div>
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
          <Select value={populationGroup} onValueChange={onPopulationGroupChange}>
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
