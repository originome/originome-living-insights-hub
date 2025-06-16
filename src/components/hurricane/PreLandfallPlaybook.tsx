
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  X, Shield, Users, Zap, Route, AlertTriangle, Clock, CheckCircle, DollarSign 
} from "lucide-react";

interface PlaybookAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedTime: string;
  responsible: string;
  costImpact?: string;
  completed: boolean;
}

interface PreLandfallPlaybookProps {
  playbookType: string;
  assetId: string;
  timeToLandfall: string;
  onClose: () => void;
}

const PreLandfallPlaybook: React.FC<PreLandfallPlaybookProps> = ({
  playbookType,
  assetId,
  timeToLandfall,
  onClose
}) => {
  const [actions, setActions] = useState<PlaybookAction[]>(() => {
    // Generate playbook actions based on type
    switch (playbookType) {
      case 'flood_protection':
        return [
          {
            id: '1',
            title: 'Deploy Transformer Flood Barriers',
            description: 'Install sandbag barriers around transformer bases predicted to flood based on storm surge + high tide convergence',
            priority: 'critical',
            estimatedTime: '45 min',
            responsible: 'Field Ops Team Alpha',
            costImpact: '$2,500',
            completed: false
          },
          {
            id: '2',
            title: 'Raise Critical Relay Equipment',
            description: 'Elevate relay control panels above predicted 3.2ft surge level at Substation 7',
            priority: 'critical',
            estimatedTime: '90 min',
            responsible: 'Substation Tech Team',
            costImpact: '$800',
            completed: false
          },
          {
            id: '3',
            title: 'Install Temporary Pumping Systems',
            description: 'Deploy portable pumps at low-lying transformer yards with high soil saturation scores',
            priority: 'high',
            estimatedTime: '60 min',
            responsible: 'Field Ops Team Beta',
            costImpact: '$1,200',
            completed: false
          }
        ];
      
      case 'crew_prestaging':
        return [
          {
            id: '1',
            title: 'Stage Line Crews at High-Risk Feeders',
            description: 'Position crews near Feeder 7A-12 where wind gust acceleration + low vegetation management scores predict 85% failure probability',
            priority: 'critical',
            estimatedTime: '30 min',
            responsible: 'Dispatch Operations',
            completed: false
          },
          {
            id: '2',
            title: 'Pre-Deploy Bucket Trucks',
            description: 'Position mobile units at strategic access points for pole-heavy corridors with saturated soil conditions',
            priority: 'high',
            estimatedTime: '45 min',
            responsible: 'Fleet Management',
            completed: false
          },
          {
            id: '3',
            title: 'Activate Emergency Materials Staging',
            description: 'Deploy replacement transformers and poles to predicted high-impact zones',
            priority: 'medium',
            estimatedTime: '60 min',
            responsible: 'Materials Management',
            costImpact: '$15,000',
            completed: false
          }
        ];
      
      case 'strategic_deenergization':
        return [
          {
            id: '1',
            title: 'De-energize Flood-Vulnerable Transformers',
            description: 'Safely shut down transformers in surge zones during 2-hour window before peak tide to prevent saltwater damage',
            priority: 'critical',
            estimatedTime: '20 min',
            responsible: 'System Operations',
            completed: false
          },
          {
            id: '2',
            title: 'Isolate High-Risk Feeder Sections',
            description: 'Isolate feeder segments where failure probability exceeds 70% to prevent cascade failures',
            priority: 'high',
            estimatedTime: '15 min',
            responsible: 'System Operations',
            completed: false
          }
        ];
      
      case 'load_rerouting':
        return [
          {
            id: '1',
            title: 'Reroute Hospital Power Feeds',
            description: 'Switch Memorial Hospital to Feeder 12B (18% failure risk) from current Feeder 9A (78% failure risk)',
            priority: 'critical',
            estimatedTime: '30 min',
            responsible: 'System Operations',
            completed: false
          },
          {
            id: '2',
            title: 'Emergency Shelter Load Transfer',
            description: 'Reroute emergency shelters to most resilient feeder lines identified by multi-factor analysis',
            priority: 'critical',
            estimatedTime: '25 min',
            responsible: 'System Operations',
            completed: false
          }
        ];
      
      case 'cascade_prevention':
        return [
          {
            id: '1',
            title: 'Monitor Secondary Heat Stress Risk',
            description: 'Implement real-time monitoring of transformers at risk of secondary failure from heat stress on damaged grid',
            priority: 'high',
            estimatedTime: '15 min',
            responsible: 'System Monitoring',
            completed: false
          },
          {
            id: '2',
            title: 'Prepare Isolation Protocols',
            description: 'Pre-configure rapid isolation procedures for equipment showing stress indicators post-landfall',
            priority: 'medium',
            estimatedTime: '45 min',
            responsible: 'System Operations',
            completed: false
          }
        ];
      
      default:
        return [];
    }
  });

  const toggleAction = (actionId: string) => {
    setActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: !action.completed }
          : action
      )
    );
  };

  const completedActions = actions.filter(action => action.completed).length;
  const progressPercentage = actions.length > 0 ? (completedActions / actions.length) * 100 : 0;

  const getPlaybookTitle = (type: string) => {
    switch (type) {
      case 'flood_protection': return 'Hardware Flood Protection';
      case 'crew_prestaging': return 'Optimized Crew Pre-Staging';
      case 'strategic_deenergization': return 'Strategic De-Energization';
      case 'load_rerouting': return 'Critical Load Rerouting';
      case 'cascade_prevention': return 'Post-Storm Cascade Prevention';
      default: return 'Pre-Landfall Playbook';
    }
  };

  const getPlaybookIcon = (type: string) => {
    switch (type) {
      case 'flood_protection': return <Shield className="h-6 w-6 text-blue-600" />;
      case 'crew_prestaging': return <Users className="h-6 w-6 text-green-600" />;
      case 'strategic_deenergization': return <Zap className="h-6 w-6 text-red-600" />;
      case 'load_rerouting': return <Route className="h-6 w-6 text-purple-600" />;
      case 'cascade_prevention': return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      default: return <Shield className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const totalCostImpact = actions
    .filter(action => action.costImpact)
    .reduce((sum, action) => sum + parseFloat(action.costImpact!.replace(/[^0-9.]/g, '')), 0);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlaybookIcon(playbookType)}
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {getPlaybookTitle(playbookType)}
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Asset: {assetId} • Time to Landfall: {timeToLandfall}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-slate-600">Complete</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">
              Progress: {completedActions}/{actions.length} actions completed
            </span>
            {totalCostImpact > 0 && (
              <span className="text-sm font-medium text-green-700">
                Cost Impact: ${totalCostImpact.toLocaleString()}
              </span>
            )}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div 
            key={action.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              action.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id={action.id}
                checked={action.completed}
                onCheckedChange={() => toggleAction(action.id)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${action.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {action.title}
                  </h4>
                  <Badge className={`text-xs border ${getPriorityColor(action.priority)}`}>
                    {action.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <p className={`text-sm mb-3 leading-relaxed ${action.completed ? 'text-slate-500' : 'text-slate-700'}`}>
                  {action.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{action.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{action.responsible}</span>
                    </div>
                    {action.costImpact && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{action.costImpact}</span>
                      </div>
                    )}
                  </div>
                  
                  {action.completed && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Action Summary */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 mt-4">
          <div className="text-xs font-semibold text-slate-800 mb-2">Playbook Impact Summary:</div>
          <div className="text-xs text-slate-700 leading-relaxed">
            This playbook targets the specific vulnerability factors identified for this asset. 
            Completion of these actions will reduce failure probability by an estimated 40-60% 
            and minimize restoration time by pre-positioning resources at optimal locations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreLandfallPlaybook;
