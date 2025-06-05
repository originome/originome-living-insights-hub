
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Thermometer, Droplet, Wind, Eye, MapPin, Wifi, WifiOff } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';

interface CurrentConditionsProps {
  externalData: ExternalData;
  isLoading: boolean;
  onRefresh: () => void;
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = ({
  externalData,
  isLoading,
  onRefresh
}) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    return 'text-red-600';
  };

  const getViralActivityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const isRealTimeData = externalData.airQuality?.source && 
    !externalData.airQuality.source.includes('Estimated');

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-indigo-600" />
            Current Conditions
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-indigo-600" />
            Current Conditions
            {isRealTimeData ? (
              <Wifi className="h-4 w-4 text-green-600" title="Real-time data" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" title="Estimated data" />
            )}
          </CardTitle>
          {externalData.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Badge variant="outline" className="text-xs">
                {externalData.location.city}, {externalData.location.region}
              </Badge>
            </div>
          )}
        </div>
        {externalData.airQuality?.source && (
          <div className="text-xs text-gray-500">
            Data source: {externalData.airQuality.source}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAQIColor(externalData.airQuality?.aqi || 0)}`}>
              {externalData.airQuality?.aqi || '--'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Wind className="h-3 w-3" />
              Outdoor AQI
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getViralActivityColor(externalData.healthSurveillance?.viralActivity || 'Low')}`}>
              {externalData.healthSurveillance?.viralActivity || 'Low'}
            </div>
            <div className="text-sm text-gray-600">Viral Activity</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Thermometer className="h-5 w-5" />
              {externalData.weather?.temperature || '--'}°C
            </div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Droplet className="h-5 w-5" />
              {externalData.weather?.humidity || '--'}%
            </div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
        </div>

        {externalData.weather && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>UV Index:</span>
              <span className="font-medium">{externalData.weather.uvIndex}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Wind:</span>
              <span className="font-medium">{externalData.weather.windSpeed} m/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pressure:</span>
              <span className="font-medium">{externalData.weather.pressure} hPa</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Visibility:</span>
              <span className="font-medium">{externalData.weather.visibility} km</span>
            </div>
          </div>
        )}

        {externalData.airQuality && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs text-gray-600">
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{externalData.airQuality.pm25}</div>
              <div>PM2.5</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{externalData.airQuality.pm10}</div>
              <div>PM10</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900 dark:text-white">{externalData.airQuality.o3}</div>
              <div>O₃</div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Live Data
        </Button>
      </CardContent>
    </Card>
  );
};
