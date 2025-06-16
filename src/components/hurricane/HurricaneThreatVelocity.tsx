
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Wind, Droplets, TrendingDown, Info, AlertTriangle } from "lucide-react";

interface HurricaneThreatVelocityProps {
  stormData: {
    category: number;
    forwardSpeed: number;
    windSpeed: number;
    pressure: number;
  };
}

const HurricaneThreatVelocity: React.FC<HurricaneThreatVelocityProps> = ({ stormData }) => {
  // Mock velocity data - in production, this would come from real-time APIs
  const windGustAccelerationData = [
    { time: '00:00', velocity: 2.1, gusts: 85 },
    { time: '03:00', velocity: 4.3, gusts: 95 },
    { time: '06:00', velocity: 6.8, gusts: 108 },
    { time: '09:00', velocity: 8.5, gusts: 125 },
    { time: '12:00', velocity: 11.2, gusts: 145 },
    { time: '15:00', velocity: 9.8, gusts: 138 },
    { time: '18:00', velocity: 7.4, gusts: 128 }
  ];

  const pressureDropData = [
    { time: '00:00', rate: -0.8, pressure: 978 },
    { time: '03:00', rate: -1.2, pressure: 974 },
    { time: '06:00', rate: -2.1, pressure: 968 },
    { time: '09:00', rate: -3.4, pressure: 958 },
    { time: '12:00', rate: -4.8, pressure: 943 },
    { time: '15:00', rate: -3.1, pressure: 934 },
    { time: '18:00', rate: -1.9, pressure: 928 }
  ];

  const surgeInundationData = [
    { time: '00:00', rate: 0.1, level: 1.2 },
    { time: '03:00', rate: 0.3, level: 2.1 },
    { time: '06:00', rate: 0.8, level: 3.8 },
    { time: '09:00', rate: 1.4, level: 6.2 },
    { time: '12:00', rate: 2.1, level: 9.8 },
    { time: '15:00', rate: 1.8, level: 12.4 },
    { time: '18:00', rate: 0.9, level: 13.9 }
  ];

  const getVelocityStatus = (current: number, threshold: number) => {
    const ratio = current / threshold;
    if (ratio >= 1.5) return { status: 'critical', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (ratio >= 1.0) return { status: 'high', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (ratio >= 0.7) return { status: 'moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { status: 'normal', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const windStatus = getVelocityStatus(8.5, 5.0);
  const pressureStatus = getVelocityStatus(4.8, 2.0);
  const surgeStatus = getVelocityStatus(2.1, 1.0);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Velocity Status Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-blue-600" />
              <span>Hurricane Threat Velocity Analysis</span>
            </CardTitle>
            <p className="text-sm text-slate-600">
              Real-time rate-of-change analysis for infrastructure failure prediction
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${windStatus.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Wind Gust Acceleration</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Rate of wind speed increase. Threshold: 5.0 mph/hr for infrastructure stress
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className={`text-2xl font-bold ${windStatus.color}`}>8.5 mph/hr</div>
                <Badge className={`mt-1 text-xs ${windStatus.color}`}>
                  {windStatus.status.toUpperCase()}
                </Badge>
              </div>

              <div className={`p-4 rounded-lg border ${pressureStatus.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pressure Drop Rate</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Barometric pressure decline rate. Threshold: -2.0 mb/hr for rapid intensification
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className={`text-2xl font-bold ${pressureStatus.color}`}>-4.8 mb/hr</div>
                <Badge className={`mt-1 text-xs ${pressureStatus.color}`}>
                  {pressureStatus.status.toUpperCase()}
                </Badge>
              </div>

              <div className={`p-4 rounded-lg border ${surgeStatus.bgColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Surge Inundation Rate</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Storm surge rise rate. Threshold: 1.0 ft/hr for substation flooding risk
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className={`text-2xl font-bold ${surgeStatus.color}`}>2.1 ft/hr</div>
                <Badge className={`mt-1 text-xs ${surgeStatus.color}`}>
                  {surgeStatus.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Velocity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wind Gust Acceleration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Wind className="h-5 w-5 text-blue-600" />
                <span>Wind Gust Acceleration</span>
                {windStatus.status === 'critical' && (
                  <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                )}
              </CardTitle>
              <p className="text-xs text-slate-600">
                Rate of wind speed increase - predicts pole failure timing
              </p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={windGustAccelerationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Area 
                      type="monotone" 
                      dataKey="velocity" 
                      stroke="#2563eb" 
                      fill="#dbeafe" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Current: <span className="font-bold">8.5 mph/hr</span> | 
                Infrastructure Threshold: <span className="font-bold text-red-600">5.0 mph/hr</span>
              </div>
            </CardContent>
          </Card>

          {/* Pressure Drop Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <span>Barometric Pressure Drop</span>
                {pressureStatus.status === 'critical' && (
                  <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                )}
              </CardTitle>
              <p className="text-xs text-slate-600">
                Rapid intensification indicator - affects equipment stability
              </p>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={pressureDropData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#ea580c" 
                      strokeWidth={3}
                      dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Current: <span className="font-bold">-4.8 mb/hr</span> | 
                Rapid Intensification: <span className="font-bold text-red-600">-2.0 mb/hr</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storm Surge Inundation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span>Storm Surge Inundation Rate</span>
              {surgeStatus.status === 'critical' && (
                <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
              )}
            </CardTitle>
            <p className="text-sm text-slate-600">
              Coastal substation flooding prediction based on surge velocity and tide convergence
            </p>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={surgeInundationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#0891b2" 
                    fill="#cffafe" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Current Rate:</span>
                <div className="font-bold text-cyan-700">2.1 ft/hr</div>
              </div>
              <div>
                <span className="text-slate-600">Flood Threshold:</span>
                <div className="font-bold text-red-600">1.0 ft/hr</div>
              </div>
              <div>
                <span className="text-slate-600">Peak Surge Est:</span>
                <div className="font-bold text-slate-900">13.9 ft</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Impact Summary */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="py-4">
            <div className="text-sm font-semibold text-slate-800 mb-2">
              Infrastructure Impact Analysis:
            </div>
            <div className="text-sm text-slate-700 leading-relaxed space-y-1">
              <div>• <strong>Wind Acceleration:</strong> Exceeding pole failure threshold by 70% - expect widespread distribution failures</div>
              <div>• <strong>Pressure Drop:</strong> Rapid intensification detected - storm strengthening faster than forecast models</div>
              <div>• <strong>Surge Rate:</strong> Critical flooding velocity for 3 coastal substations within 4-hour window</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default HurricaneThreatVelocity;
