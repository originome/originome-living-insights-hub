
import React, { useState, useEffect } from 'react';
import { LocationInput } from '@/components/LocationInput';
import { CurrentConditions } from '@/components/CurrentConditions';
import { EnvironmentalControls } from '@/components/EnvironmentalControls';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { ChartAnalysis } from '@/components/ChartAnalysis';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { CostBenefitAnalysis } from '@/components/CostBenefitAnalysis';
import { LiteratureDatabase } from '@/components/LiteratureDatabase';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useToast } from '@/hooks/use-toast';

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
  } = useApiIntegration(location);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    if (newLocation) {
      toast({
        title: "Location Updated",
        description: "Fetching real-time environmental data...",
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
        {/* Location and Building Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LocationInput
            location={location}
            buildingType={buildingType}
            populationGroup={populationGroup}
            onLocationChange={handleLocationChange}
            onBuildingTypeChange={setBuildingType}
            onPopulationGroupChange={setPopulationGroup}
          />
          
          <CurrentConditions 
            externalData={externalData}
            isLoading={isLoading}
            onRefresh={refreshData}
          />
          
          <PerformanceMetrics 
            environmentalParams={environmentalParams}
            externalData={externalData}
            buildingType={buildingType}
            populationGroup={populationGroup}
          />
        </div>

        {/* Environmental Controls */}
        <EnvironmentalControls
          params={environmentalParams}
          onParamChange={handleParamChange}
          externalData={externalData}
        />

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartAnalysis 
            environmentalParams={environmentalParams}
            externalData={externalData}
            buildingType={buildingType}
          />
          
          <div className="space-y-6">
            <SmartRecommendations 
              environmentalParams={environmentalParams}
              externalData={externalData}
              buildingType={buildingType}
              populationGroup={populationGroup}
            />
            
            <CostBenefitAnalysis 
              environmentalParams={environmentalParams}
              externalData={externalData}
              buildingType={buildingType}
            />
          </div>
        </div>

        {/* Literature Database */}
        <LiteratureDatabase />
      </div>
    </div>
  );
};

export default Index;
