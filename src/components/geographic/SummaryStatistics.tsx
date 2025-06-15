
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MicroAnomaly } from '@/services/demoDataService';

interface SummaryStatisticsProps {
  microAnomalies: MicroAnomaly[];
  selectedLocation: { industry: string };
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  microAnomalies,
  selectedLocation
}) => {
  const criticalAnomalies = microAnomalies.filter(a => a.severity === 'critical').length;
  const averageRiskScore = microAnomalies.length > 0 
    ? Math.round(microAnomalies.reduce((sum, a) => sum + a.riskScore, 0) / microAnomalies.length)
    : 0;

  const stats = [
    { label: 'Total Anomalies', value: microAnomalies.length, color: 'blue' },
    { label: 'Critical Risk Zones', value: criticalAnomalies, color: 'red' },
    { label: 'Average Risk Score', value: averageRiskScore, color: 'orange' },
    { label: 'Industry Focus', value: selectedLocation.industry, color: 'green' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="py-4 text-center">
            <div className={`text-2xl font-bold text-${stat.color}-600`}>
              {typeof stat.value === 'number' ? stat.value : stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryStatistics;
