
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Sun, Moon, Leaf, AlertTriangle, BookOpen, Waves } from 'lucide-react';
import { GeomagneticData, SolarData, SeasonalData, SeismicData } from '@/services/cosmicDataService';

interface CosmicConditionsProps {
  geomagneticData?: GeomagneticData;
  solarData?: SolarData;
  seasonalData?: SeasonalData;
  seismicData?: SeismicData;
  isLoading: boolean;
}

export const CosmicConditions: React.FC<CosmicConditionsProps> = ({
  geomagneticData,
  solarData,
  seasonalData,
  seismicData,
  isLoading
}) => {
  const getRiskColor = (risk: number) => {
    if (risk >= 7) return 'text-red-600 bg-red-50';
    if (risk >= 5) return 'text-orange-600 bg-orange-50';
    if (risk >= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPollenColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Moderate': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Geomagnetic Activity */}
      {geomagneticData && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-purple-600" />
              Geomagnetic Activity
            </CardTitle>
            <div className="text-xs text-gray-500">
              Earth's magnetic field disturbances affecting human physiology
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {geomagneticData.kpIndex}
                </div>
                <div className="text-sm text-gray-600">Kp Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {geomagneticData.apIndex}
                </div>
                <div className="text-sm text-gray-600">Ap Index</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activity Level</span>
                <Badge className={getRiskColor(geomagneticData.riskLevel)}>
                  {geomagneticData.activity}
                </Badge>
              </div>
              <Progress value={geomagneticData.riskLevel * 10} className="h-2" />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-800 font-medium mb-1">Performance Impact:</div>
              <div className="text-xs text-blue-700">{geomagneticData.impact}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Scientific Evidence:</span>
              </div>
              <div className="text-xs text-gray-600">{geomagneticData.citation}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solar Activity */}
      {solarData && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-orange-600" />
              Solar Weather
            </CardTitle>
            <div className="text-xs text-gray-500">
              Solar electromagnetic radiation affecting circadian rhythms
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {solarData.sunspotNumber}
                </div>
                <div className="text-sm text-gray-600">Sunspots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {solarData.solarWindSpeed}
                </div>
                <div className="text-sm text-gray-600">km/s Wind</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Flare Activity</span>
                <Badge className={getRiskColor(solarData.riskLevel)}>
                  {solarData.flareActivity}
                </Badge>
              </div>
              <Progress value={solarData.riskLevel * 10} className="h-2" />
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-xs text-orange-800 font-medium mb-1">Biological Impact:</div>
              <div className="text-xs text-orange-700">{solarData.impact}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Scientific Evidence:</span>
              </div>
              <div className="text-xs text-gray-600">{solarData.citation}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seasonal & Biological Proxies */}
      {seasonalData && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-green-600" />
              Seasonal & Allergen Proxies
            </CardTitle>
            <div className="text-xs text-gray-500">
              Natural cycles and allergens affecting human biological rhythms
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <Sun className="h-4 w-4" />
                  {seasonalData.daylength}h
                </div>
                <div className="text-sm text-gray-600">Daylight Hours</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 flex items-center justify-center gap-1">
                  <Moon className="h-4 w-4" />
                  {seasonalData.lunarIllumination}%
                </div>
                <div className="text-sm text-gray-600">{seasonalData.lunarPhase}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pollen/Allergen Index</span>
                  <Badge className={getPollenColor(seasonalData.pollenCount.level)}>
                    {seasonalData.pollenCount.level}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="text-center">
                    <div className="font-bold">{seasonalData.pollenCount.tree}</div>
                    <div className="text-gray-600">Tree</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{seasonalData.pollenCount.grass}</div>
                    <div className="text-gray-600">Grass</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{seasonalData.pollenCount.weed}</div>
                    <div className="text-gray-600">Weed</div>
                  </div>
                </div>
                <div className="text-xs text-yellow-800 bg-yellow-100 p-2 rounded">
                  <strong>Impact:</strong> {seasonalData.pollenCount.impact}
                </div>
              </div>

              {seasonalData.meteorologicalAnomalies.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Weather Anomalies</span>
                  </div>
                  {seasonalData.meteorologicalAnomalies.map((anomaly, index) => (
                    <div key={index} className="text-xs text-red-700">{anomaly}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Scientific Evidence:</span>
              </div>
              <div className="text-xs text-gray-600">{seasonalData.pollenCount.citation}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seismic Activity */}
      {seismicData && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Waves className="h-5 w-5 text-indigo-600" />
              Seismic Activity
            </CardTitle>
            <div className="text-xs text-gray-500">
              Geological vibrations affecting subconscious stress levels
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {seismicData.recentActivity}
                </div>
                <div className="text-sm text-gray-600">Events (24h)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {seismicData.maxMagnitude}
                </div>
                <div className="text-sm text-gray-600">Max Magnitude</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Level</span>
                <Badge className={getRiskColor(seismicData.riskLevel)}>
                  Level {seismicData.riskLevel}/10
                </Badge>
              </div>
              <Progress value={seismicData.riskLevel * 10} className="h-2" />
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-xs text-indigo-800 font-medium mb-1">Stress Impact:</div>
              <div className="text-xs text-indigo-700">{seismicData.impact}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Scientific Evidence:</span>
              </div>
              <div className="text-xs text-gray-600">{seismicData.citation}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
