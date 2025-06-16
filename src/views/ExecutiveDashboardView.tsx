
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Zap, Network, AlertTriangle, Eye, ArrowRight } from 'lucide-react';
import InteractivePlaybook from '@/components/interactive/InteractivePlaybook';
import PatternNetworkVisualization from '@/components/patterns/PatternNetworkVisualization';
import { TabType } from '../App';

interface ExecutiveDashboardViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
  onTabChange: (tab: TabType) => void;
}

interface PlaybookAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  estimatedCost?: string;
  responsible: string;
  completed: boolean;
}

const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  dateRange,
  location,
  assetFilter,
  onTabChange
}) => {
  const [playbookActions, setPlaybookActions] = useState([
    {
      id: "cascade-prevention",
      title: "Prevent Barometric-Solar Cascade",
      description: "Deploy countermeasures for detected pressure-radiation coupling before it amplifies into system-wide failure.",
      priority: "critical" as const,
      estimatedTime: "90 minutes",
      estimatedCost: "$3,200",
      responsible: "Emergency Response",
      completed: false
    },
    {
      id: "tidal-disruption",
      title: "Neutralize Tidal Interference Pattern",
      description: "Adjust operational frequency to counteract lunar-induced equipment resonance detected in Grid Sector 7.",
      priority: "high" as const,
      estimatedTime: "45 minutes",
      estimatedCost: "$1,800",
      responsible: "Grid Operations",
      completed: false
    },
    {
      id: "biomagnetic-shield",
      title: "Activate Biomagnetic Shielding Protocol",
      description: "Initialize countermeasures for geomagnetic-biological stress convergence affecting critical personnel.",
      priority: "medium" as const,
      estimatedTime: "30 minutes",
      responsible: "Safety Operations",
      completed: false
    }
  ]);

  const getImpossiblePatterns = () => [
    {
      id: 'barometric_solar',
      title: 'Barometric Pressure × Solar Radiation Cascade',
      description: 'AI detected impossible correlation: 10.7cm solar flux amplifying pressure drop effects by 340%',
      confidence: 89,
      impact: 'Infrastructure failure cascade imminent',
      action: 'Deploy pressure compensation protocols',
      targetTab: 'velocity' as TabType,
      severity: 'critical'
    },
    {
      id: 'lunar_transformer',
      title: 'Lunar Tidal Forces → Transformer Stress Pattern',
      description: 'Gravitational micro-variations correlating with equipment failure patterns across 47km radius',
      confidence: 76,
      impact: 'Equipment degradation accelerating',
      action: 'Adjust operational frequencies to counter tidal interference',
      targetTab: 'assets' as TabType,
      severity: 'high'
    },
    {
      id: 'geomagnetic_biological',
      title: 'Geomagnetic Field × Human Performance Coupling',
      description: 'Kp-index fluctuations creating personnel error rate spikes - pattern invisible to conventional monitoring',
      confidence: 84,
      impact: 'Critical decision accuracy compromised',
      action: 'Activate biomagnetic stress protocols',
      targetTab: 'geographic' as TabType,
      severity: 'high'
    }
  ];

  const getPatternStatus = () => {
    const criticalPatterns = getImpossiblePatterns().filter(p => p.severity === 'critical').length;
    if (criticalPatterns > 0) return 'cascade_detected';
    return 'patterns_active';
  };

  const handlePlaybookToggle = (actionId: string) => {
    setPlaybookActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      )
    );
  };

  const patterns = getImpossiblePatterns();
  const status = getPatternStatus();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'cascade_detected':
        return {
          border: 'border-red-500 border-l-8',
          bg: 'bg-gradient-to-r from-red-50 to-orange-50',
          text: 'text-red-900'
        };
      default:
        return {
          border: 'border-blue-500 border-l-8',
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          text: 'text-blue-900'
        };
    }
  };

  const statusStyles = getStatusStyles(status);

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Pattern Intelligence Header */}
        <Card className={`${statusStyles.border} ${statusStyles.bg} shadow-xl`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Brain className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className={`text-2xl font-bold ${statusStyles.text} flex items-center gap-3`}>
                    Non-Obvious Pattern Intelligence
                    <Badge variant="outline" className="text-sm animate-pulse">
                      {patterns.length} Impossible Correlations Active
                    </Badge>
                  </CardTitle>
                  <p className={`text-lg ${statusStyles.text} opacity-80`}>
                    Detecting connections invisible to conventional monitoring systems
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">87%</div>
                <div className="text-sm font-medium text-indigo-700">Pattern Confidence</div>
                <div className="text-xs text-indigo-600 mt-1">Multi-domain Fusion</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pattern Network Visualization */}
        <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-6 w-6 text-indigo-600" />
              Impossible Correlation Network
            </CardTitle>
            <p className="text-sm text-slate-600">
              AI-detected connections between seemingly unrelated phenomena
            </p>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <PatternNetworkVisualization patterns={patterns} />
          </CardContent>
        </Card>

        {/* Critical Pattern Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Detection Results
            </h2>
            <Badge variant="secondary" className="text-xs">
              Click to investigate
            </Badge>
          </div>
          
          {patterns.map((pattern) => (
            <Card 
              key={pattern.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-l-4 ${
                pattern.severity === 'critical' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                'border-orange-500 bg-orange-50 hover:bg-orange-100'
              }`}
              onClick={() => onTabChange(pattern.targetTab)}
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
                    
                    <p className="text-slate-700 mb-4 text-base leading-relaxed">
                      {pattern.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="font-semibold text-slate-900 mb-1">Impact Detected</div>
                        <div className="text-slate-700">{pattern.impact}</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <div className="font-semibold text-slate-900 mb-1">Recommended Action</div>
                        <div className="text-slate-700">{pattern.action}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <ArrowRight className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Response Playbook */}
        <InteractivePlaybook
          title="Pattern Response Protocols"
          description="Immediate actions to counteract detected impossible correlations"
          totalImpact="$87,000"
          actions={playbookActions}
          onActionToggle={handlePlaybookToggle}
        />
      </div>
    </TooltipProvider>
  );
};

export default ExecutiveDashboardView;
