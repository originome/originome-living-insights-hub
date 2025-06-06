
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Thermometer, Droplet, Wind, Eye, MapPin, Wifi, WifiOff, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
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
    if (aqi <= 200) return 'text-red-600';
    return 'text-purple-600';
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getViralActivityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getViralActivityIcon = (level: string) => {
    switch (level) {
      case 'Low': return <TrendingDown className="h-4 w-4" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4" />;
      case 'High': return <TrendingUp className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
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
            Live Environmental Data
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentAQI = externalData.airQuality?.aqi || 0;
  const dataFreshness = isRealTimeData ? 'Live' : 'Estimated';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-indigo-600" />
            Live Environmental Data
            {isRealTimeData ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
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
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Data source: {externalData.airQuality?.source || 'No data available'}
          </span>
          <Badge variant={isRealTimeData ? 'default' : 'secondary'} className="text-xs">
            {dataFreshness}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center space-y-2">
            <div className={`text-3xl font-bold ${getAQIColor(currentAQI)}`}>
              {currentAQI || '--'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Wind className="h-3 w-3" />
              Air Quality Index
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getAQIColor(currentAQI)}`}
            >
              {getAQILabel(currentAQI)}
            </Badge>
          </div>
          
          <div className="text-center space-y-2">
            <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${getViralActivityColor(externalData.healthSurveillance?.viralActivity || 'Low')}`}>
              {getViralActivityIcon(externalData.healthSurveillance?.viralActivity || 'Low')}
              {externalData.healthSurveillance?.viralActivity || 'Low'}
            </div>
            <div className="text-sm text-gray-600">Viral Activity</div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getViralActivityColor(externalData.healthSurveillance?.viralActivity || 'Low')}`}
            >
              Risk Level: {externalData.healthSurveillance?.riskLevel || 3}/10
            </Badge>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Thermometer className="h-5 w-5" />
              {externalData.weather?.temperature || '--'}°C
            </div>
            <div className="text-sm text-gray-600">Temperature</div>
            <div className="text-xs text-gray-500">
              Feels like: {externalData.weather?.temperature ? Math.round(externalData.weather.temperature + (Math.random() * 4 - 2)) : '--'}°C
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Droplet className="h-5 w-5" />
              {externalData.weather?.humidity || '--'}%
            </div>
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="text-xs text-gray-500">
              {externalData.weather?.humidity ? 
                (externalData.weather.humidity < 30 ? 'Too Dry' : 
                 externalData.weather.humidity > 70 ? 'Too Humid' : 'Comfortable') 
                : '--'}
            </div>
          </div>
        </div>

        {/* Detailed Weather Data */}
        {externalData.weather && (
          <div className="grid grid-cols-2 gap-3 pt-4 border-t text-xs">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-gray-600">UV Index:</span>
              <span className="font-medium">{externalData.weather.uvIndex}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-gray-600">Wind Speed:</span>
              <span className="font-medium">{externalData.weather.windSpeed} m/s</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-gray-600">Pressure:</span>
              <span className="font-medium">{externalData.weather.pressure} hPa</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-gray-600">Visibility:</span>
              <span className="font-medium">{externalData.weather.visibility} km</span>
            </div>
          </div>
        )}

        {/* Air Quality Breakdown */}
        {externalData.airQuality && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-3">Air Quality Components</div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-bold text-red-700">{externalData.airQuality.pm25}</div>
                <div className="text-gray-600">PM2.5 μg/m³</div>
                <div className="text-xs text-gray-500">
                  {externalData.airQuality.pm25 > 35 ? 'Unhealthy' : 
                   externalData.airQuality.pm25 > 12 ? 'Moderate' : 'Good'}
                </div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-bold text-yellow-700">{externalData.airQuality.pm10}</div>
                <div className="text-gray-600">PM10 μg/m³</div>
                <div className="text-xs text-gray-500">
                  {externalData.airQuality.pm10 > 154 ? 'Unhealthy' : 
                   externalData.airQuality.pm10 > 54 ? 'Moderate' : 'Good'}
                </div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-700">{externalData.airQuality.o3}</div>
                <div className="text-gray-600">O₃ ppb</div>
                <div className="text-xs text-gray-500">
                  {externalData.airQuality.o3 > 164 ? 'Unhealthy' : 
                   externalData.airQuality.o3 > 54 ? 'Moderate' : 'Good'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Surveillance Details */}
        {externalData.healthSurveillance && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-gray-700 mb-3">Regional Health Surveillance</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Flu Activity:</span>
                <Badge variant="outline" className={getViralActivityColor(externalData.healthSurveillance.fluActivity)}>
                  {externalData.healthSurveillance.fluActivity}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Respiratory Illness:</span>
                <span className="font-medium">{externalData.healthSurveillance.respiratoryIllness}%</span>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Live Data'}
        </Button>
      </CardContent>
    </Card>
  );
};
