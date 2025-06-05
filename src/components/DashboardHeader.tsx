
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface DashboardHeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  onRefresh,
  isLoading
}) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Originome Living Dashboard
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Real-time environmental impact on human performance and health
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <WifiOff className="h-4 w-4 text-orange-300" />
              ) : (
                <Wifi className="h-4 w-4 text-green-300" />
              )}
              <Badge variant="secondary" className="bg-white/20 text-white">
                Live Data Mode
              </Badge>
            </div>
            
            <div className="text-sm text-blue-100">
              {lastUpdated ? (
                <>Last updated: {lastUpdated.toLocaleTimeString()}</>
              ) : (
                'No data yet'
              )}
            </div>
            
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
