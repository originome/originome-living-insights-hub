
import React, { useState, useEffect } from 'react';
import { LocationInput } from '@/components/LocationInput';
import { CurrentConditions } from '@/components/CurrentConditions';
import { OriginomeHeader } from '@/components/OriginomeHeader';
import { EnvironmentalControls } from '@/components/EnvironmentalControls';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { ChartAnalysis } from '@/components/ChartAnalysis';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { CostBenefitAnalysis } from '@/components/CostBenefitAnalysis';
import { LiteratureDatabase } from '@/components/LiteratureDatabase';
import { LiteratureCitations } from '@/components/LiteratureCitations';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useToast } from '@/hooks/use-toast';
import { LiteratureService } from '@/services/literatureService';

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

  // Get relevant literature citations for current parameters
  const getRelevantCitations = () => {
    const citations = [];
    
    // CO2 studies if elevated
    if (environmentalParams.co2 > 600) {
      const co2Studies = LiteratureService.getStudiesForParameter('co2');
      citations.push(...co2Studies.map(study => ({
        study,
        relevantTo: `CO₂ levels of ${environmentalParams.co2}ppm impact cognitive performance`
      })));
    }

    // PM2.5 studies if concerning
    if (environmentalParams.pm25 > 12) {
      const pm25Studies = LiteratureService.getStudiesForParameter('pm25');
      citations.push(...pm25Studies.map(study => ({
        study,
        relevantTo: `PM2.5 levels of ${environmentalParams.pm25}μg/m³ affect health and cognition`
      })));
    }

    // Temperature studies if suboptimal
    if (Math.abs(environmentalParams.temperature - 21) > 1) {
      const tempStudies = LiteratureService.getStudiesForParameter('temperature');
      citations.push(...tempStudies.map(study => ({
        study,
        relevantTo: `Temperature of ${environmentalParams.temperature}°C impacts productivity`
      })));
    }

    return citations.slice(0, 3); // Show top 3 most relevant
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Originome Branded Header */}
      <OriginomeHeader 
        location={externalData.location}
        buildingType={buildingType}
        populationGroup={populationGroup}
        lastUpdated={lastUpdated}
      />
      
      {/* Original Dashboard Header */}
      <DashboardHeader 
        lastUpdated={lastUpdated}
        onRefresh={refreshData}
        isLoading={isLoading}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Configuration Row */}
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

        {/* Analysis and Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ChartAnalysis 
              environmentalParams={environmentalParams}
              externalData={externalData}
              buildingType={buildingType}
            />
            
            <LiteratureCitations citations={getRelevantCitations()} />
          </div>
          
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
