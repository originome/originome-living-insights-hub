
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

interface VelocityChartProps {
  data: {
    parameter: string;
    currentValue: number;
    velocity: number;
    acceleration: number;
    unit: string;
    velocityUnit: string;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    trend: 'increasing' | 'decreasing' | 'stable';
    alertThreshold: number;
    historicalData: Array<{
      timestamp: string;
      value: number;
      velocity: number;
    }>;
  };
}

const VelocityChart: React.FC<VelocityChartProps> = ({ data }) => {
  const chartData = data.historicalData.map((point, index) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: point.value,
    velocity: point.velocity,
    index
  }));

  const getVelocityColor = (velocity: number, threshold: number) => {
    if (Math.abs(velocity) > threshold) return '#ef4444'; // red-500
    if (Math.abs(velocity) > threshold * 0.7) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="h-48 w-full">
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
          
          {/* Alert threshold lines */}
          <ReferenceLine 
            y={data.alertThreshold} 
            stroke="#ef4444" 
            strokeDasharray="2 2" 
            strokeOpacity={0.6}
          />
          <ReferenceLine 
            y={-data.alertThreshold} 
            stroke="#ef4444" 
            strokeDasharray="2 2" 
            strokeOpacity={0.6}
          />
          
          {/* Velocity line */}
          <Line
            type="monotone"
            dataKey="velocity"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!payload) return null;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={getVelocityColor(payload.velocity, data.alertThreshold)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 4, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VelocityChart;
