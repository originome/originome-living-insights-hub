
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingUp, 
  Map, 
  Server,
  Clock,
  Briefcase,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TabType } from "../../App";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  systemIntelligence: {
    riskLevel: string;
    activeFactors: number;
    confidence: number;
  };
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  systemIntelligence 
}) => {
  // Dynamic tab content based on system intelligence
  const getTabBadge = (tabId: TabType) => {
    const baseRisk = systemIntelligence.activeFactors;
    
    switch (tabId) {
      case 'executive':
        return systemIntelligence.riskLevel === 'optimal' ? 'Peak Performance' : 'Action Required';
      case 'event-horizon':
        return baseRisk > 2 ? `${baseRisk} Critical` : `${baseRisk} Active`;
      case 'velocity':
        return 'Real-time';
      case 'geographic':
        return baseRisk > 1 ? `${baseRisk * 4} Hotspots` : '2 Hotspots';
      case 'assets':
        return '8 Assets';
      default:
        return 'Active';
    }
  };

  const getTabBadgeVariant = (tabId: TabType) => {
    if (tabId === 'event-horizon' && systemIntelligence.activeFactors > 2) {
      return 'destructive' as const;
    }
    if (tabId === 'executive' && systemIntelligence.riskLevel === 'optimal') {
      return 'default' as const;
    }
    return 'outline' as const;
  };

  const tabs = [
    {
      id: 'executive' as TabType,
      label: 'Pattern Intelligence Engine',
      icon: Briefcase,
      description: 'Strategic Risk Intelligence',
      badge: getTabBadge('executive'),
      badgeVariant: getTabBadgeVariant('executive')
    },
    {
      id: 'event-horizon' as TabType,
      label: 'Event Horizon',
      icon: AlertTriangle,
      description: 'Live Risk Detection',
      badge: getTabBadge('event-horizon'),
      badgeVariant: getTabBadgeVariant('event-horizon')
    },
    {
      id: 'velocity' as TabType,
      label: 'Environmental Velocity',
      icon: TrendingUp,
      description: 'Rate-of-Change Analytics',
      badge: getTabBadge('velocity'),
      badgeVariant: getTabBadgeVariant('velocity')
    },
    {
      id: 'geographic' as TabType,
      label: 'Geographic Intelligence',
      icon: Map,
      description: 'Micro-Anomaly Detection',
      badge: getTabBadge('geographic'),
      badgeVariant: getTabBadgeVariant('geographic')
    },
    {
      id: 'assets' as TabType,
      label: 'Asset Intelligence',
      icon: Server,
      description: 'Legacy-Asset Fingerprinting',
      badge: getTabBadge('assets'),
      badgeVariant: getTabBadgeVariant('assets')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1">
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              className={`flex-1 flex flex-col items-center space-y-2 h-auto py-4 px-3 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs opacity-80">{tab.description}</span>
                <Badge 
                  variant={tab.badgeVariant}
                  className="text-xs"
                >
                  {tab.badge}
                </Badge>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>System synchronized: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-3 w-3" />
          <span>Intelligence Network: {systemIntelligence.confidence}% confidence</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Cross-domain learning active</span>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
