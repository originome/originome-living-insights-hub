
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Zap, Network, AlertTriangle, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import InteractivePlaybook from '@/components/interactive/InteractivePlaybook';
import PatternNetworkVisualization from '@/components/patterns/PatternNetworkVisualization';
import { TabType } from '../App';
import { useSharedPatternState } from '../hooks/useSharedPatternState';

interface ExecutiveDashboardViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
  onTabChange: (tab: TabType) => void;
}

const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  dateRange,
  location,
  assetFilter,
  onTabChange
}) => {
  const {
    patterns,
    selectedPattern,
    completedActions,
    selectPattern,
    completeAction
  } = useSharedPatternState();

  const [playbookActions, setPlaybookActions] = useState([
    {
      id: "pressure_compensation",
      title: "Deploy Pressure Compensation Protocol",
      description: "Counteract barometric-solar cascade amplification",
      priority: "critical" as const,
      estimatedTime: "90 minutes",
      estimatedCost: "$3,200",
      responsible: "Emergency Response",
      completed: false
    },
    {
      id: "frequency_adjustment",
      title: "Adjust Operational Frequencies",
      description: "Counter lunar-induced equipment resonance",
      priority: "high" as const,
      estimatedTime: "45 minutes",
      estimatedCost: "$1,800",
      responsible: "Grid Operations",
      completed: false
    },
    {
      id: "biomagnetic_shielding",
      title: "Activate Biomagnetic Shielding",
      description: "Protect against geomagnetic-biological coupling",
      priority: "medium" as const,
      estimatedTime: "30 minutes",
      responsible: "Safety Operations",
      completed: false
    }
  ]);

  const handlePatternClick = (patternId: string) => {
    selectPattern(selectedPattern === patternId ? null : patternId);
    
    // Navigate to relevant tab based on pattern type
    const pattern = patterns.find(p => p.id === patternId);
    if (pattern) {
      if (pattern.type === 'lunar_transformer' || pattern.type === 'barometric_solar') {
        onTabChange('assets');
      } else if (pattern.type === 'geomagnetic_biological') {
        onTabChange('geographic');
      }
    }
  };

  const handlePlaybookToggle = (actionId: string) => {
    const action = playbookActions.find(a => a.id === actionId);
    if (action && !action.completed) {
      completeAction(actionId);
      setPlaybookActions(prev => 
        prev.map(a => 
          a.id === actionId 
            ? { ...a, completed: true }
            : a
        )
      );
    }
  };

  const criticalPatterns = patterns.filter(p => p.severity === 'critical').length;
  const avgConfidence = Math.round(
    patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
  );

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Pattern Intelligence Header */}
        <Card className="border-red-500 border-l-8 bg-gradient-to-r from-red-50 to-orange-50 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-red-900 flex items-center gap-3">
                    Impossible Pattern Intelligence
                    <Badge variant="outline" className="text-sm animate-pulse">
                      {patterns.length} Active Correlations
                    </Badge>
                  </CardTitle>
                  <p className="text-lg text-red-900 opacity-80">
                    Detecting connections invisible to conventional systems
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">{avgConfidence}%</div>
                <div className="text-sm font-medium text-indigo-700">Pattern Confidence</div>
                <div className="text-xs text-indigo-600 mt-1">Multi-domain Fusion</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Interactive Pattern Network */}
        <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-6 w-6 text-indigo-600" />
              Interactive Correlation Network
            </CardTitle>
            <p className="text-sm text-slate-600">
              Click nodes to explore cross-domain impacts
            </p>
          </CardHeader>
          <CardContent className="h-[350px] p-0">
            <PatternNetworkVisualization 
              patterns={patterns} 
              selectedPattern={selectedPattern}
              onPatternClick={handlePatternClick}
            />
          </CardContent>
        </Card>

        {/* Active Pattern Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Active Pattern Intelligence
            </h2>
            <Badge variant="secondary" className="text-xs">
              Click to investigate cross-domain impacts
            </Badge>
          </div>
          
          {patterns.map((pattern) => (
            <Card 
              key={pattern.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-l-4 ${
                selectedPattern === pattern.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              } ${
                pattern.severity === 'critical' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                'border-orange-500 bg-orange-50 hover:bg-orange-100'
              }`}
              onClick={() => handlePatternClick(pattern.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className={`h-5 w-5 ${
                        pattern.severity === 'critical' ? 'text-red-600 animate-pulse' : 'text-orange-600'
                      }`} />
                      <h3 className="font-bold text-lg text-slate-900">{pattern.title}</h3>
                      <Badge className={`text-xs font-semibold ${
                        pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {pattern.confidence}% CONFIDENCE
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="font-semibold text-slate-900 mb-1">Risk Window</div>
                        <div className="text-slate-700">{pattern.riskWindow}</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="font-semibold text-slate-900 mb-1">Affected Assets</div>
                        <div className="text-slate-700">{pattern.affectedAssets.length} systems</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="font-semibold text-slate-900 mb-1">Impact Zones</div>
                        <div className="text-slate-700">{pattern.affectedZones.length} locations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-center">
                    {selectedPattern === pattern.id ? (
                      <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Response Playbook */}
        <InteractivePlaybook
          title="Pattern Response Protocols"
          description="Execute countermeasures to neutralize detected correlations"
          totalImpact="$87,000"
          actions={playbookActions}
          onActionToggle={handlePlaybookToggle}
        />
      </div>
    </TooltipProvider>
  );
};

export default ExecutiveDashboardView;
