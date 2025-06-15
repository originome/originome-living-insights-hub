
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface VelocityChartProps {
  id: string;
  title: string;
  unit: string;
  currentRate: number;
  threshold: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
  data: Array<{
    time: string;
    value: number;
  }>;
  isSelected?: boolean;
  onClick?: () => void;
}

const VelocityChart: React.FC<VelocityChartProps> = ({
  id,
  title,
  unit,
  currentRate,
  threshold,
  severity,
  description,
  data,
  isSelected = false,
  onClick
}) => {
  const chartData = data.map((point, index) => ({
    time: point.time,
    value: point.value,
    index
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'; // red-500
      case 'high': return '#f59e0b'; // amber-500
      case 'moderate': return '#eab308'; // yellow-500
      case 'low': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-50 to-red-100 border-red-200';
      case 'high': return 'from-orange-50 to-orange-100 border-orange-200';
      case 'moderate': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'low': return 'from-green-50 to-green-100 border-green-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 bg-gradient-to-br ${getSeverityBg(severity)} ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle 
              className={`h-5 w-5 ${severity === 'critical' ? 'animate-pulse' : ''}`}
              style={{ color: getSeverityColor(severity) }}
            />
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border`}
                 style={{ backgroundColor: getSeverityColor(severity) + '20', color: getSeverityColor(severity) }}>
              {severity.toUpperCase()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-900">{Math.abs(currentRate)}</div>
            <div className="text-xs text-slate-600">{unit}</div>
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
          {title}
        </CardTitle>
        
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="h-32 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                tickLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              
              {/* Threshold lines */}
              <ReferenceLine 
                y={threshold} 
                stroke="#ef4444" 
                strokeDasharray="2 2" 
                strokeOpacity={0.6}
              />
              
              {/* Velocity line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke={getSeverityColor(severity)}
                strokeWidth={2}
                dot={{ r: 2, fill: getSeverityColor(severity) }}
                activeDot={{ r: 4, fill: getSeverityColor(severity) }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">
              Threshold: {threshold} {unit}
            </span>
          </div>
          <div className={`font-medium ${Math.abs(currentRate) > threshold ? 'text-red-600' : 'text-green-600'}`}>
            {Math.abs(currentRate) > threshold ? 'Above Limit' : 'Within Range'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VelocityChart;
