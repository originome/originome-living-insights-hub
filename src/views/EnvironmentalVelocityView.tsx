
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Activity, Brain, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PatternRecognitionEngine } from '@/components/PatternRecognitionEngine';
import { CompoundRiskMatrix } from '@/components/CompoundRiskMatrix';
import { CascadeDetectionPanel } from '@/components/CascadeDetectionPanel';
import { useEnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { useApiIntegration } from '@/hooks/useApiIntegration';
import { useCosmicData } from '@/hooks/useCosmicData';
import { useLocationState } from '@/hooks/useLocationState';

const EnvironmentalVelocityView: React.FC = () => {
  const { location, buildingType, populationGroup } = useLocationState();
  const { environmentalParams } = useEnvironmentalParams();
  const { externalData } = useApiIntegration(location, buildingType, populationGroup);
  const { cosmicData } = useCosmicData(
    externalData.location?.lat,
    externalData.location?.lon
  );

  return (
    <div className="space-y-6">
      {/* Pattern Intelligence Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl text-purple-900">
                  Environmental Pattern Intelligence Engine
                </CardTitle>
                <p className="text-purple-700 text-sm">
                  Non-obvious pattern detection • Compound risk analysis • Predictive cascade intelligence
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500 animate-pulse" />
              <Badge variant="outline" className="text-green-700 border-green-300">
                Pattern Engine Active
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-purple-800">Compound Pattern Detection</div>
              <div className="text-purple-600">Identifies hidden correlations across 47+ data streams</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-purple-800">Cascade Risk Prediction</div>
              <div className="text-purple-600">Detects when single factors trigger system-wide responses</div>
            </div>
            <div className="bg-white/60 p-3 rounded-lg">
              <div className="font-semibold text-purple-800">Non-Obvious Intelligence</div>
              <div className="text-purple-600">Reveals patterns invisible to traditional monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Pattern Recognition Engine */}
      <PatternRecognitionEngine 
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
      />

      {/* Compound Risk Matrix */}
      <CompoundRiskMatrix
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />

      {/* Cascade Detection Panel */}
      <CascadeDetectionPanel
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
      />

      {/* Strategic Value Proposition */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Intelligence Advantage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-800">Traditional Monitoring vs. Pattern Intelligence</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commodity: "CO₂ = 800ppm"</span>
                  <span className="text-red-600">❌ Basic Alert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Intelligence: "Cognitive Fatigue Risk Velocity"</span>
                  <span className="text-green-600">✅ Predictive Pattern</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Our Edge: "Solar-EM-Bio Compound Convergence"</span>
                  <span className="text-blue-600">✅ Non-Obvious Intelligence</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-800">Strategic Business Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Pattern Advantage:</span> Detect risks 45-90 minutes before competitors
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Hidden Correlations:</span> Reveal compound factors others miss
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Cascade Prevention:</span> Stop single failures from spreading
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <span className="font-medium">Intelligence Moat:</span> Create defensible competitive advantage
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 p-4 rounded-lg border-l-4 border-emerald-400">
            <div className="font-semibold text-emerald-800 mb-2">
              Non-Obvious Pattern Intelligence Creates Market Category Leadership
            </div>
            <p className="text-emerald-700 text-sm">
              While competitors report basic environmental metrics, our platform reveals the hidden compound patterns 
              that create massive, predictable risks. This transforms environmental monitoring from a cost center 
              into strategic intelligence that drives measurable competitive advantage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalVelocityView;
