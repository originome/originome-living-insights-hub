
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useLocationState = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [buildingType, setBuildingType] = useState('office');
  const [populationGroup, setPopulationGroup] = useState('adults');

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (newLocation) {
      toast({
        title: "Location Updated",
        description: "Fetching real-time environmental data and peer benchmarks...",
      });
    }
  };

  const handleBuildingTypeChange = (newType: string) => {
    setBuildingType(newType);
    if (location) {
      toast({
        title: "Building Type Updated",
        description: "Recalculating health risks and productivity impacts...",
      });
    }
  };

  const handlePopulationGroupChange = (newGroup: string) => {
    setPopulationGroup(newGroup);
    if (location) {
      toast({
        title: "Population Group Updated", 
        description: "Adjusting risk assessments for target demographics...",
      });
    }
  };

  return {
    location,
    buildingType,
    populationGroup,
    handleLocationChange,
    handleBuildingTypeChange,
    handlePopulationGroupChange
  };
};
