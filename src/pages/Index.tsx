import React, { useState, useEffect } from 'react';
import { LocationInput } from '@/components/LocationInput';
import { CurrentConditions } from '@/components/CurrentConditions';
// ... other imports

import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/DashboardHeader';

const Index = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [buildingType, setBuildingType] = useState('office');
  const [populationGroup, setPopulationGroup] = useState('adults');
  const [environmentalParams, setEnvironmentalParams] = useState({
    co2: 800,
    pm25: 25,
    temperature: 22,
    light: 500,
    noise: 45,
    humidity: 45
  });

  const {
    externalData,
    isLoading,
    lastUpdated,
    error,
    refreshData
  } = useApiIntegration(location, buildingType, populationGroup);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (newLocation) {
      toast({
        title: "Location Updated",
        description: "Fetching real-time environmental data...",
      });
    }
  };

  const handleBuildingTypeChange = (newType: string) => {
    setBuildingType(newType);
    if (location) {
      toast({
        title: "Building Type Updated",
        description: "Recalculating health risks and recommendations...",
      });
    }
  };

  const handlePopulationGroupChange = (newGroup: string) => {
    setPopulationGroup(newGroup);
    if (location) {
      toast({
        title: "Population Group Updated", 
        description: "Adjusting risk assessments for target population...",
      });
    }
  };

  const handleParamChange = (param: string, value: number) => {
    setEnvironmentalParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Data Fetch Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader 
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
        isLoading={isLoading}
      />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LocationInput
            location={location}
            buildingType={buildingType}
            populationGroup={populationGroup}
            onLocationChange={handleLocationChange}
            onBuildingTypeChange={handleBuildingTypeChange}
            onPopulationGroupChange={handlePopulationGroupChange}
          />
          <CurrentConditions 
            externalData={externalData}
            isLoading={isLoading}
            onRefresh={refreshData}
          />
          {/* ...other dashboard components */}
        </div>
        {/* ...other dashboard components */}
      </div>
    </div>
  );
};

export default Index;
