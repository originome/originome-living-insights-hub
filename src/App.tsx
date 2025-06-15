
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/core/Header";
import { SystemIntelligenceHeader } from "./components/SystemIntelligenceHeader";
import TabNavigation from "./components/core/TabNavigation";
import EventHorizonView from "./views/EventHorizonView";
import EnvironmentalVelocityView from "./views/EnvironmentalVelocityView";
import GeographicIntelligenceView from "./views/GeographicIntelligenceView";
import AssetIntelligenceView from "./views/AssetIntelligenceView";
import ExecutiveDashboardView from "./views/ExecutiveDashboardView";
import { useLocationState } from "./hooks/useLocationState";
import { useApiIntegration } from "./hooks/useApiIntegration";
import { useCosmicData } from "./hooks/useCosmicData";
import { useEnvironmentalParams } from "./hooks/useEnvironmentalParams";
import { SharedViewProps } from "./types/viewProps";

// Create QueryClient with proper configuration for real-time data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // Auto-refresh every 30 seconds for live monitoring
    },
  },
});

export type TabType = 'executive' | 'event-horizon' | 'velocity' | 'geographic' | 'assets';

// Create wrapper components that accept SharedViewProps
const EventHorizonViewWrapper: React.FC<SharedViewProps> = (props) => <EventHorizonView {...props} />;
const EnvironmentalVelocityViewWrapper: React.FC<SharedViewProps> = (props) => <EnvironmentalVelocityView {...props} />;
const GeographicIntelligenceViewWrapper: React.FC<SharedViewProps> = (props) => <GeographicIntelligenceView {...props} />;
const AssetIntelligenceViewWrapper: React.FC<SharedViewProps> = (props) => <AssetIntelligenceView {...props} />;

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('executive');

  // Global state management - single source of truth for entire system
  const {
    location,
    buildingType,
    populationGroup,
    handleLocationChange,
    handleBuildingTypeChange,
    handlePopulationGroupChange
  } = useLocationState();

  const { environmentalParams, handleParamChange } = useEnvironmentalParams();

  // Global data integration - all tabs use this same data context
  const {
    externalData,
    isLoading,
    lastUpdated,
    error,
    refreshData
  } = useApiIntegration(location, buildingType, populationGroup);

  const {
    cosmicData,
    isLoading: isCosmicLoading,
    error: cosmicError,
    lastUpdated: cosmicLastUpdated,
    refreshData: refreshCosmicData
  } = useCosmicData(
    externalData.location?.lat,
    externalData.location?.lon
  );

  // System-wide refresh function
  const handleSystemRefresh = () => {
    refreshData();
    refreshCosmicData();
  };

  // Calculate system-wide intelligence metrics
  const getSystemIntelligence = () => {
    const riskFactors = [];
    if (environmentalParams.co2 > 800) riskFactors.push('cognitive_decline');
    if (environmentalParams.pm25 > 25) riskFactors.push('health_risks');
    if (cosmicData?.geomagnetic?.kpIndex > 4) riskFactors.push('system_sensitivity');
    
    const overallRiskLevel = riskFactors.length === 0 ? 'optimal' : 
                           riskFactors.length <= 1 ? 'low' :
                           riskFactors.length <= 2 ? 'moderate' : 'high';
    
    return {
      riskLevel: overallRiskLevel,
      activeFactors: riskFactors.length,
      confidence: 95 - (riskFactors.length * 5)
    };
  };

  const systemIntelligence = getSystemIntelligence();

  const renderActiveView = () => {
    // Pass shared context to all views
    const sharedProps: SharedViewProps = {
      location,
      buildingType,
      populationGroup,
      environmentalParams,
      externalData,
      cosmicData,
      isLoading,
      isCosmicLoading,
      systemIntelligence,
      onParamChange: handleParamChange,
      onRefresh: handleSystemRefresh
    };

    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboardView {...sharedProps} />;
      case 'event-horizon':
        return <EventHorizonViewWrapper {...sharedProps} />;
      case 'velocity':
        return <EnvironmentalVelocityViewWrapper {...sharedProps} />;
      case 'geographic':
        return <GeographicIntelligenceViewWrapper {...sharedProps} />;
      case 'assets':
        return <AssetIntelligenceViewWrapper {...sharedProps} />;
      default:
        return <ExecutiveDashboardView {...sharedProps} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header />
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Unified System Intelligence Header - Single Source of Truth */}
            <SystemIntelligenceHeader
              location={location}
              buildingType={buildingType}
              populationGroup={populationGroup}
              lastUpdated={lastUpdated}
              cosmicLastUpdated={cosmicLastUpdated}
              systemIntelligence={systemIntelligence}
              onLocationChange={handleLocationChange}
              onBuildingTypeChange={handleBuildingTypeChange}
              onPopulationGroupChange={handlePopulationGroupChange}
              onRefresh={handleSystemRefresh}
            />
            
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              systemIntelligence={systemIntelligence}
            />
            
            <main className="min-h-[600px]">
              {renderActiveView()}
            </main>
          </div>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
