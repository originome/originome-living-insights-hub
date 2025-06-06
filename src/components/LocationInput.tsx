
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Building, Users, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // Enhanced validation patterns
  const validateLocation = (value: string) => {
    const trimmedValue = value.trim();
    
    // US ZIP code patterns (5 digits or 5+4 format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    
    // City, State patterns
    const cityStatePattern = /^[a-zA-Z\s,.-]{3,}(,\s*[a-zA-Z]{2,})?$/;
    
    // Coordinates pattern (lat,lon)
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    
    // Major cities for quick validation
    const majorCities = ['new york', 'chicago', 'los angeles', 'houston', 'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte', 'san francisco', 'indianapolis', 'seattle', 'denver', 'washington', 'boston', 'el paso', 'detroit', 'nashville', 'portland', 'memphis', 'oklahoma city', 'las vegas', 'louisville', 'baltimore', 'milwaukee', 'albuquerque', 'tucson', 'fresno', 'mesa', 'sacramento', 'atlanta', 'kansas city', 'colorado springs', 'omaha', 'raleigh', 'miami', 'long beach', 'virginia beach', 'oakland', 'minneapolis', 'tulsa', 'arlington', 'tampa', 'new orleans'];
    
    const isValid = zipPattern.test(trimmedValue) || 
           cityStatePattern.test(trimmedValue) || 
           coordPattern.test(trimmedValue) ||
           majorCities.some(city => trimmedValue.toLowerCase().includes(city));
    
    return isValid;
  };

  // Enhanced input handling with debounced validation
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.trim() === '') {
      setValidationStatus('idle');
      setIsValidLocation(false);
      return;
    }
    
    setValidationStatus('validating');
    
    // Debounced validation
    const timer = setTimeout(() => {
      const isValid = validateLocation(value);
      setIsValidLocation(isValid);
      setValidationStatus(isValid ? 'valid' : 'invalid');
    }, 300);
    
    return () => clearTimeout(timer);
  };

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    if (isValidLocation && trimmedValue !== location) {
      onLocationChange(trimmedValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidLocation) {
      handleSearch();
    }
  };

  // Auto-search for valid ZIP codes
  useEffect(() => {
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (zipPattern.test(inputValue.trim()) && inputValue.trim() !== location && isValidLocation) {
      const timer = setTimeout(() => {
        onLocationChange(inputValue.trim());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inputValue, location, onLocationChange, isValidLocation]);

  const getValidationIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case 'validating':
        return 'Validating location...';
      case 'valid':
        return 'Location validated - press Enter or click Search';
      case 'invalid':
        return 'Please enter a valid US ZIP code, city name, or coordinates';
      default:
        return 'ZIP codes provide the most accurate environmental data';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-600" />
          Building Configuration
        </CardTitle>
        <div className="text-sm text-gray-600">
          Configure your facility's location and characteristics for personalized analysis
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Input with Enhanced Validation */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location (Required)
          </Label>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter ZIP code (e.g., 60607), city (e.g., Chicago IL), or coordinates"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`pr-10 transition-colors ${
                    validationStatus === 'invalid' ? 'border-red-300 focus:border-red-500' :
                    validationStatus === 'valid' ? 'border-green-300 focus:border-green-500' :
                    'border-gray-300 focus:border-indigo-500'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon()}
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={!isValidLocation || inputValue.trim() === location}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`text-xs flex items-center gap-1 ${
            validationStatus === 'invalid' ? 'text-red-600' :
            validationStatus === 'valid' ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {getValidationMessage()}
          </div>
        </div>
        
        {/* Building Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="buildingType" className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Building Type
          </Label>
          <Select value={buildingType} onValueChange={onBuildingTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">
                <div className="flex flex-col">
                  <span>Office Building</span>
                  <span className="text-xs text-gray-500">Commercial workspace, productivity focus</span>
                </div>
              </SelectItem>
              <SelectItem value="school">
                <div className="flex flex-col">
                  <span>School/University</span>
                  <span className="text-xs text-gray-500">Educational facility, cognitive performance</span>
                </div>
              </SelectItem>
              <SelectItem value="healthcare">
                <div className="flex flex-col">
                  <span>Healthcare Facility</span>
                  <span className="text-xs text-gray-500">Hospital/clinic, infection control priority</span>
                </div>
              </SelectItem>
              <SelectItem value="residential">
                <div className="flex flex-col">
                  <span>Residential</span>
                  <span className="text-xs text-gray-500">Apartment/housing, comfort and health</span>
                </div>
              </SelectItem>
              <SelectItem value="retail">
                <div className="flex flex-col">
                  <span>Retail/Commercial</span>
                  <span className="text-xs text-gray-500">Store/mall, customer experience</span>
                </div>
              </SelectItem>
              <SelectItem value="warehouse">
                <div className="flex flex-col">
                  <span>Warehouse/Industrial</span>
                  <span className="text-xs text-gray-500">Storage/manufacturing, worker safety</span>
                </div>
              </SelectItem>
              <SelectItem value="hospitality">
                <div className="flex flex-col">
                  <span>Hotel/Restaurant</span>
                  <span className="text-xs text-gray-500">Guest services, satisfaction priority</span>
                </div>
              </SelectItem>
              <SelectItem value="laboratory">
                <div className="flex flex-col">
                  <span>Laboratory/Research</span>
                  <span className="text-xs text-gray-500">Scientific facility, precision environment</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Population Group Selection */}
        <div className="space-y-2">
          <Label htmlFor="populationGroup" className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Primary Occupant Group
          </Label>
          <Select value={populationGroup} onValueChange={onPopulationGroupChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adults">
                <div className="flex flex-col">
                  <span>Working Adults (18-64)</span>
                  <span className="text-xs text-gray-500">Standard workplace population</span>
                </div>
              </SelectItem>
              <SelectItem value="children">
                <div className="flex flex-col">
                  <span>Children (5-17)</span>
                  <span className="text-xs text-gray-500">School-age, enhanced sensitivity</span>
                </div>
              </SelectItem>
              <SelectItem value="elderly">
                <div className="flex flex-col">
                  <span>Elderly (65+)</span>
                  <span className="text-xs text-gray-500">Senior population, health considerations</span>
                </div>
              </SelectItem>
              <SelectItem value="students">
                <div className="flex flex-col">
                  <span>College Students (18-25)</span>
                  <span className="text-xs text-gray-500">Young adults, cognitive performance focus</span>
                </div>
              </SelectItem>
              <SelectItem value="mixed">
                <div className="flex flex-col">
                  <span>Mixed Population</span>
                  <span className="text-xs text-gray-500">Diverse age groups, balanced approach</span>
                </div>
              </SelectItem>
              <SelectItem value="vulnerable">
                <div className="flex flex-col">
                  <span>Vulnerable/At-Risk Groups</span>
                  <span className="text-xs text-gray-500">Enhanced health protections needed</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Configuration Summary */}
        {location && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Current Configuration:</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                📍 {location}
              </Badge>
              <Badge variant="outline" className="text-xs">
                🏢 {buildingType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                👥 {populationGroup}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
