
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DataPoint } from '@/types/rateOfChange';

interface DerivativeVisualizationProps {
  historicalData: DataPoint[];
}

export const DerivativeVisualization: React.FC<DerivativeVisualizationProps> = ({
  historicalData
}) => {
  if (historicalData.length <= 8) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Velocity & Acceleration Streams</CardTitle>
        <div className="text-xs text-gray-600">
          Real-time first and second derivative monitoring
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historicalData.slice(-15)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="velocity_co2" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="CO₂ Velocity"
            />
            <Line 
              type="monotone" 
              dataKey="acceleration_co2" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="CO₂ Acceleration"
            />
            <Line 
              type="monotone" 
              dataKey="velocity_pm25" 
              stroke="#10b981" 
              strokeWidth={1}
              name="PM2.5 Velocity"
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
