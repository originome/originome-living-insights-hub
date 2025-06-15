
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingUp, 
  Map, 
  Server,
  Clock,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TabType } from "../../App";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'executive' as TabType,
      label: 'Executive Dashboard',
      icon: Briefcase,
      description: 'Business Intelligence',
      badge: 'ROI Focus',
      badgeVariant: 'default' as const
    },
    {
      id: 'event-horizon' as TabType,
      label: 'Event Horizon',
      icon: AlertTriangle,
      description: 'Live Risk Detection',
      badge: '3 Active',
      badgeVariant: 'destructive' as const
    },
    {
      id: 'velocity' as TabType,
      label: 'Environmental Velocity',
      icon: TrendingUp,
      description: 'Rate-of-Change Analytics',
      badge: 'Real-time',
      badgeVariant: 'default' as const
    },
    {
      id: 'geographic' as TabType,
      label: 'Geographic Intelligence',
      icon: Map,
      description: 'Micro-Anomaly Detection',
      badge: '12 Hotspots',
      badgeVariant: 'outline' as const
    },
    {
      id: 'assets' as TabType,
      label: 'Asset Intelligence',
      icon: Server,
      description: 'Legacy-Asset Fingerprinting',
      badge: '8 Assets',
      badgeVariant: 'secondary' as const
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
      
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <Clock className="h-3 w-3" />
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span>•</span>
        <span>Next refresh in 28s</span>
      </div>
    </div>
  );
};

export default TabNavigation;
