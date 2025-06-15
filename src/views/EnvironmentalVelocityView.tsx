
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RateOfChangeAnalytics } from '@/components/RateOfChangeAnalytics';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useLocationState } from '@/hooks/useLocationState';

const EnvironmentalVelocityView: React.FC = () => {
  const { location, buildingType, populationGroup } = useLocationState();
  const { environmentalParams } = useEnvironmentalParams();
  const { externalData } = useApiIntegration(location, buildingType, populationGroup);

  return (
    <div className="space-y-6">
      {/* Predictive Intelligence Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-cyan-600" />
              <div>
                <CardTitle className="text-xl text-cyan-900">
                  Predictive Environmental Intelligence
                </CardTitle>
                <p className="text-cyan-700 text-sm">
                  Advanced derivative analytics • Pattern-based risk prediction • Cascade detection before traditional thresholds
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500 animate-pulse" />
              <Badge variant="outline" className="text-green-700 border-green-300">
                Real-time Intelligence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-cyan-800">First-Derivative Detection</div>
              <div className="text-cyan-600">Identifies risks 15-30 minutes before traditional monitoring</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-cyan-800">Cascade Prevention</div>
              <div className="text-cyan-600">Detects when one parameter triggers system-wide changes</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-cyan-800">Predictive ROI</div>
              <div className="text-cyan-600">Quantifies cost savings from early intervention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Rate-of-Change Analytics */}
      <RateOfChangeAnalytics 
        environmentalParams={environmentalParams}
        externalData={externalData}
      />

      {/* Value Proposition Summary */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Why This Intelligence Matters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-800">Traditional Monitoring vs. Velocity Intelligence</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Traditional: CO₂ = 800ppm</span>
                  <span className="text-red-600">❌ Reactive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Velocity: δCO₂/δt = +12ppm/min</span>
                  <span className="text-green-600">✅ Predictive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acceleration: δ²CO₂/δt² = +2.3ppm/min²</span>
                  <span className="text-blue-600">✅ Cascade Detection</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-800">Business Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Early Warning:</span> 15-30 minute advance notice
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Cost Savings:</span> Prevent reactive HVAC overload
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Compliance:</span> Stay ahead of regulatory thresholds
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Productivity:</span> Maintain optimal conditions proactively
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg border-l-4 border-emerald-400">
            <div className="font-semibold text-emerald-800 mb-2">
              Competitive Advantage Through Pattern Intelligence
            </div>
            <p className="text-emerald-700 text-sm">
              While traditional systems react to problems, Originome's velocity analytics predict and prevent them. 
              This transforms environmental monitoring from a cost center into a strategic asset that drives measurable ROI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
