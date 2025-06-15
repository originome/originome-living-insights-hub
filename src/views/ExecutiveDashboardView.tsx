import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, DollarSign, ArrowRight } from 'lucide-react';
import InteractivePlaybook from '@/components/interactive/InteractivePlaybook';
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
      id: "ventilation-upgrade",
      title: "Immediate Ventilation Enhancement",
      description: "Increase fresh air intake by 40% and optimize HVAC filtration to reduce CO₂ concentration below 800ppm threshold.",
      priority: "critical" as const,
      estimatedTime: "2-4 hours",
      estimatedCost: "$1,200",
      responsible: "Facilities Team",
      completed: false
    },
    {
      id: "air-quality-monitoring",
      title: "Deploy Advanced Air Quality Sensors",
      description: "Install continuous PM2.5 and VOC monitoring throughout facility to enable real-time environmental optimization.",
      priority: "high" as const,
      estimatedTime: "1-2 days",
      estimatedCost: "$3,500",
      responsible: "IT & Facilities",
      completed: false
    },
    {
      id: "schedule-optimization",
      title: "Optimize Meeting Schedules",
      description: "Reschedule high-cognitive demand activities during optimal environmental windows (10AM-2PM).",
      priority: "medium" as const,
      estimatedTime: "30 minutes",
      responsible: "HR & Management",
      completed: false
    },
    {
      id: "space-weather-alerts",
      title: "Implement Space Weather Monitoring",
      description: "Set up automated alerts for geomagnetic events that may affect sensitive operations and staff wellbeing.",
      priority: "medium" as const,
      estimatedTime: "4-6 hours",
      estimatedCost: "$800",
      responsible: "IT Team",
      completed: false
    }
  ]);

  // Mock environmental data
  const environmentalData = {
    co2: 850,
    pm25: 28,
    temperature: 19.5,
    humidity: 65,
    pressure: 1012.8
  };

  const getBusinessImpact = () => {
    const issues = [];
    if (environmentalData.co2 > 800) issues.push('cognitive_decline');
    if (environmentalData.pm25 > 25) issues.push('health_risks');
    if (Math.abs(environmentalData.temperature - 21) > 3) issues.push('comfort_issues');
    
    if (issues.length === 0) return 'peak_performance';
    if (issues.length <= 1) return 'good_conditions';
    if (issues.length <= 2) return 'moderate_risk';
    return 'high_risk';
  };

  const getBusinessInsights = () => {
    const impact = getBusinessImpact();
    const insights = {
      peak_performance: "Your environment is optimized for maximum ROI. Current conditions support 18-23% above-baseline productivity across all operations.",
      good_conditions: "Business conditions are favorable with minor optimization opportunities. Maintaining current performance levels with 95% reliability.",
      moderate_risk: "Environmental factors may impact bottom-line performance. Proactive adjustments recommended to maintain competitive advantage.",
      high_risk: "Multiple risk factors detected. Immediate action required to prevent significant productivity losses and associated revenue impact."
    };
    
    return insights[impact];
  };

  const getKeyBusinessMetrics = () => {
    const impact = getBusinessImpact();
    
    const metrics = {
      peak_performance: { productivity: 122, risk: 5, savings: 184000 },
      good_conditions: { productivity: 108, risk: 15, savings: 89000 },
      moderate_risk: { productivity: 87, risk: 35, savings: -43000 },
      high_risk: { productivity: 73, risk: 65, savings: -127000 }
    };
    
    return metrics[impact];
  };

  const getPatternInsights = () => [
    {
      id: 'velocity',
      title: 'Environmental Velocity Alert',
      description: 'CO₂ concentration rising at 12.5 ppm/hr - above critical threshold',
      impact: '$28,500 weekly productivity impact',
      action: 'Immediate ventilation adjustment required',
      targetTab: 'velocity' as TabType,
      severity: 'high'
    },
    {
      id: 'geographic',
      title: 'Geographic Micro-Anomaly',
      description: 'Hyperlocal particulate surge detected in 78m radius zone',
      impact: '15% absenteeism risk increase',
      action: 'Deploy targeted filtration in affected area',
      targetTab: 'geographic' as TabType,
      severity: 'critical'
    },
    {
      id: 'asset',
      title: 'Asset Intelligence Warning',
      description: 'Transformer Unit 034 showing cascade failure pattern',
      impact: '72% failure probability within 17 hours',
      action: 'Schedule immediate maintenance inspection',
      targetTab: 'assets' as TabType,
      severity: 'critical'
    }
  ];

  const handlePlaybookToggle = (actionId: string) => {
    setPlaybookActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      )
    );
  };

  const impact = getBusinessImpact();
  const metrics = getKeyBusinessMetrics();
  const patterns = getPatternInsights();

  const getStatusColor = (impact: string) => {
    switch (impact) {
      case 'peak_performance': return 'text-green-700 bg-green-50 border-green-200';
      case 'good_conditions': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'moderate_risk': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'high_risk': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Executive Summary */}
        <Card className={`border-l-4 ${getStatusColor(impact)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3">
                Business Intelligence Summary
                <Badge variant="outline" className="text-sm">
                  {location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {dateRange}
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-gray-800 mb-4">
              {getBusinessInsights()}
            </p>
          </CardContent>
        </Card>

        {/* Key Business Metrics with Tooltips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Productivity Index
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metrics.productivity}%
                  </div>
                  <p className="text-sm text-gray-600">vs. baseline performance</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-white border shadow-lg">
              <div className="p-2 text-sm">
                <div className="font-semibold mb-1">Calculation Breakdown:</div>
                <div>• Environmental factors: {impact === 'high_risk' ? '-18%' : '+8%'}</div>
                <div>• Cognitive load optimization: +12%</div>
                <div>• Air quality impact: {environmentalData.co2 > 800 ? '-15%' : '+3%'}</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metrics.risk}%
                  </div>
                  <p className="text-sm text-gray-600">operational risk exposure</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-white border shadow-lg">
              <div className="p-2 text-sm">
                <div className="font-semibold mb-1">Risk Factors:</div>
                <div>• Air quality degradation: {environmentalData.co2 > 800 ? '25%' : '5%'}</div>
                <div>• Temperature variance: {Math.abs(environmentalData.temperature - 21) > 3 ? '15%' : '3%'}</div>
                <div>• Equipment failure probability: 12%</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-help hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Financial Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold mb-2 ${metrics.savings >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ${Math.abs(metrics.savings).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">
                    {metrics.savings >= 0 ? 'annual value creation' : 'potential annual losses'}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="bg-white border shadow-lg">
              <div className="p-2 text-sm">
                <div className="font-semibold mb-1">Impact Sources:</div>
                <div>• Productivity changes: ${Math.round(metrics.savings * 0.6).toLocaleString()}</div>
                <div>• Health/absenteeism: ${Math.round(metrics.savings * 0.25).toLocaleString()}</div>
                <div>• Equipment efficiency: ${Math.round(metrics.savings * 0.15).toLocaleString()}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Interactive Pattern Intelligence Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Pattern Intelligence
              <Badge variant="outline" className="text-xs">
                Click to explore
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              AI-detected patterns requiring executive attention - click any card to drill down
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {patterns.map((pattern) => (
              <Card 
                key={pattern.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-l-4 ${
                  pattern.severity === 'critical' ? 'border-red-400 bg-red-50' :
                  pattern.severity === 'high' ? 'border-orange-400 bg-orange-50' :
                  'border-yellow-400 bg-yellow-50'
                }`}
                onClick={() => onTabChange(pattern.targetTab)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className={`h-5 w-5 ${
                          pattern.severity === 'critical' ? 'text-red-600 animate-pulse' :
                          pattern.severity === 'high' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <h3 className="font-semibold text-slate-900">{pattern.title}</h3>
                        <Badge className={`text-xs ${
                          pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pattern.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-2">{pattern.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-slate-900">{pattern.impact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-slate-700">{pattern.action}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Interactive Action Playbook */}
        <InteractivePlaybook
          title="Executive Action Playbook"
          description="Strategic interventions to optimize environmental performance and business outcomes"
          totalImpact="$127,000"
          actions={playbookActions}
          onActionToggle={handlePlaybookToggle}
        />
      </div>
    </TooltipProvider>
  );
};

export default ExecutiveDashboardView;
