
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, ArrowRight, Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface CascadePreventionPlaybookProps {
  currentRiskLevel: number;
  activeAlerts: string[];
}

interface PreventionScenario {
  id: string;
  title: string;
  trigger: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  steps: PreventionStep[];
  timeToComplete: string;
  successRate: number;
}

interface PreventionStep {
  id: string;
  action: string;
  description: string;
  timeframe: string;
  responsible: string;
  completed: boolean;
  critical: boolean;
}

export const CascadePreventionPlaybook: React.FC<CascadePreventionPlaybookProps> = ({
  currentRiskLevel,
  activeAlerts
}) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scenarioProgress, setScenarioProgress] = useState<{ [key: string]: number }>({});
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const preventionScenarios: PreventionScenario[] = [
    {
      id: 'air_quality_cascade',
      title: 'Air Quality Degradation Cascade',
      trigger: 'PM2.5 > 25 μg/m³ + Rising CO₂',
      riskLevel: 'high',
      timeToComplete: '15-30 minutes',
      successRate: 92,
      steps: [
        {
          id: 'aq_step1',
          action: 'Activate Enhanced Filtration',
          description: 'Switch HVAC to maximum filtration mode and close external air intakes',
          timeframe: '2 minutes',
          responsible: 'Facilities Team',
          completed: false,
          critical: true
        },
        {
          id: 'aq_step2',
          action: 'Deploy Portable Air Purifiers',
          description: 'Activate portable HEPA units in high-occupancy areas',
          timeframe: '5 minutes',
          responsible: 'Facilities Team',
          completed: false,
          critical: false
        },
        {
          id: 'aq_step3',
          action: 'Notify Occupants',
          description: 'Send air quality advisory and recommend reducing physical exertion',
          timeframe: '1 minute',
          responsible: 'Operations Team',
          completed: false,
          critical: false
        },
        {
          id: 'aq_step4',
          action: 'Monitor and Adjust',
          description: 'Continuously monitor air quality metrics and adjust filtration as needed',
          timeframe: 'Ongoing',
          responsible: 'Environmental Systems',
          completed: false,
          critical: true
        }
      ]
    },
    {
      id: 'thermal_hvac_cascade',
      title: 'Thermal-HVAC System Cascade',
      trigger: 'Temperature deviation > 4°C + High solar activity',
      riskLevel: 'medium',
      timeToComplete: '20-45 minutes',
      successRate: 88,
      steps: [
        {
          id: 'th_step1',
          action: 'Preemptive HVAC Adjustment',
          description: 'Reduce setpoint by 1-2°C to compensate for anticipated thermal load',
          timeframe: '3 minutes',
          responsible: 'Building Automation',
          completed: false,
          critical: true
        },
        {
          id: 'th_step2',
          action: 'Activate Shading Systems',
          description: 'Deploy automated blinds and window films to reduce solar heat gain',
          timeframe: '5 minutes',
          responsible: 'Facilities Team',
          completed: false,
          critical: false
        },
        {
          id: 'th_step3',
          action: 'Redistribute Occupancy',
          description: 'Suggest movement to cooler zones if available',
          timeframe: '10 minutes',
          responsible: 'Operations Team',
          completed: false,
          critical: false
        },
        {
          id: 'th_step4',
          action: 'Backup System Standby',
          description: 'Prepare secondary cooling systems for potential activation',
          timeframe: '15 minutes',
          responsible: 'Maintenance Team',
          completed: false,
          critical: true
        }
      ]
    },
    {
      id: 'cognitive_performance_cascade',
      title: 'Cognitive Performance Cascade',
      trigger: 'CO₂ > 1000 ppm + Geomagnetic activity',
      riskLevel: 'critical',
      timeToComplete: '10-20 minutes',
      successRate: 95,
      steps: [
        {
          id: 'cp_step1',
          action: 'Emergency Ventilation Boost',
          description: 'Increase fresh air intake to maximum safe levels immediately',
          timeframe: '2 minutes',
          responsible: 'Building Automation',
          completed: false,
          critical: true
        },
        {
          id: 'cp_step2',
          action: 'Defer Critical Decisions',
          description: 'Recommend postponing important meetings and decision-making sessions',
          timeframe: '5 minutes',
          responsible: 'Management Team',
          completed: false,
          critical: true
        },
        {
          id: 'cp_step3',
          action: 'Implement Break Protocol',
          description: 'Encourage frequent breaks and movement to areas with better air quality',
          timeframe: '1 minute',
          responsible: 'HR Team',
          completed: false,
          critical: false
        },
        {
          id: 'cp_step4',
          action: 'Monitor Occupant Wellness',
          description: 'Check for signs of cognitive fatigue and provide support as needed',
          timeframe: 'Ongoing',
          responsible: 'Wellness Team',
          completed: false,
          critical: false
        }
      ]
    }
  ];

  const relevantScenarios = preventionScenarios.filter(scenario => {
    if (currentRiskLevel > 60 && scenario.riskLevel === 'critical') return true;
    if (currentRiskLevel > 40 && (scenario.riskLevel === 'high' || scenario.riskLevel === 'critical')) return true;
    if (currentRiskLevel > 20 && scenario.riskLevel !== 'low') return true;
    return false;
  });

  const toggleStepCompletion = (scenarioId: string, stepId: string) => {
    const key = `${scenarioId}_${stepId}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Update scenario progress
    const scenario = preventionScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      const totalSteps = scenario.steps.length;
      const completedCount = scenario.steps.filter(step => 
        completedSteps[`${scenarioId}_${step.id}`] || step.id === stepId && !completedSteps[key]
      ).length;
      const progress = (completedCount / totalSteps) * 100;
      setScenarioProgress(prev => ({
        ...prev,
        [scenarioId]: progress
      }));
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Cascade Prevention Playbook
          {relevantScenarios.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {relevantScenarios.length} scenarios active
            </Badge>
          )}
        </CardTitle>
        <div className="text-sm text-gray-600">
          Interactive guidance systems for risk mitigation • Prevent cascade failures
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {relevantScenarios.length > 0 ? (
          relevantScenarios.map(scenario => (
            <div key={scenario.id} className="border rounded-lg overflow-hidden">
              <div 
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${getRiskLevelColor(scenario.riskLevel)}`}
                onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{scenario.title}</h3>
                    <div className="text-sm opacity-90">
                      <strong>Trigger:</strong> {scenario.trigger}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-center">
                      <div className="font-bold">{scenario.successRate}%</div>
                      <div>Success Rate</div>
                    </div>
                    <div className="text-xs text-center">
                      <div className="font-bold">{scenario.timeToComplete}</div>
                      <div>Duration</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {activeScenario === scenario.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {scenarioProgress[scenario.id] > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{scenarioProgress[scenario.id]?.toFixed(0)}%</span>
                    </div>
                    <Progress value={scenarioProgress[scenario.id]} className="h-2" />
                  </div>
                )}
              </div>
              
              {activeScenario === scenario.id && (
                <div className="p-4 bg-white border-t">
                  <div className="space-y-3">
                    {scenario.steps.map((step, index) => {
                      const stepKey = `${scenario.id}_${step.id}`;
                      const isCompleted = completedSteps[stepKey];
                      
                      return (
                        <div key={step.id} className={`border rounded-lg p-3 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStepCompletion(scenario.id, step.id)}
                              className="mt-1 p-1 h-6 w-6"
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <div className="h-4 w-4 border-2 border-gray-400 rounded-full"></div>
                              )}
                            </Button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{index + 1}. {step.action}</span>
                                {step.critical && (
                                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">{step.description}</div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  {step.timeframe}
                                </div>
                                <div>
                                  <strong>Responsible:</strong> {step.responsible}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset Progress
                    </Button>
                    <div className="text-xs text-gray-500">
                      Complete all critical steps to prevent cascade failure
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div className="font-medium">No Active Prevention Scenarios</div>
            <div className="text-sm">Current risk levels are within acceptable ranges</div>
          </div>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Prevention Philosophy:</strong> These playbooks are designed to interrupt cascade failures 
            before they impact operations. Early intervention when risk levels are moderate prevents 
            exponential degradation of environmental conditions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
