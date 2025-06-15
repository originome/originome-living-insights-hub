
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/core/Header";
import TabNavigation from "./components/core/TabNavigation";
import EventHorizonView from "./views/EventHorizonView";
import EnvironmentalVelocityView from "./views/EnvironmentalVelocityView";
import GeographicIntelligenceView from "./views/GeographicIntelligenceView";
import AssetIntelligenceView from "./views/AssetIntelligenceView";
import ExecutiveDashboardView from "./views/ExecutiveDashboardView";

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

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('executive');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveDashboardView />;
      case 'event-horizon':
        return <EventHorizonView />;
      case 'velocity':
        return <EnvironmentalVelocityView />;
      case 'geographic':
        return <GeographicIntelligenceView />;
      case 'assets':
        return <AssetIntelligenceView />;
      default:
        return <ExecutiveDashboardView />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header />
          <div className="container mx-auto px-4 py-6 space-y-6">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
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
