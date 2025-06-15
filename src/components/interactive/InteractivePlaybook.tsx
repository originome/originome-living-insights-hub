
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Users, DollarSign } from "lucide-react";

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

interface InteractivePlaybookProps {
  title: string;
  description: string;
  totalImpact: string;
  actions: PlaybookAction[];
  onActionToggle: (actionId: string) => void;
}

const InteractivePlaybook: React.FC<InteractivePlaybookProps> = ({
  title,
  description,
  totalImpact,
  actions,
  onActionToggle
}) => {
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  const toggleExpanded = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
  };

  const completedActions = actions.filter(action => action.completed).length;
  const progressPercentage = (completedActions / actions.length) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">{totalImpact}</div>
            <div className="text-sm text-slate-600">Potential Impact</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">
              Progress: {completedActions}/{actions.length} actions completed
            </span>
            <span className="text-sm font-bold text-blue-700">
              {Math.round(progressPercentage)}%
            </span>
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
                ? 'bg-green-50 border-green-200 opacity-75' 
                : 'bg-white border-slate-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id={action.id}
                checked={action.completed}
                onCheckedChange={() => onActionToggle(action.id)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${action.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {action.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(action.priority)}
                    <Badge className={`text-xs border ${getPriorityColor(action.priority)}`}>
                      {action.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-sm mb-3 ${action.completed ? 'text-slate-500' : 'text-slate-700'}`}>
                  {action.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{action.estimatedTime}</span>
                    </div>
                    {action.estimatedCost && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{action.estimatedCost}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{action.responsible}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(action.id)}
                    className="h-6 px-2 text-xs"
                  >
                    {expandedActions.has(action.id) ? 'Less' : 'More'} Info
                  </Button>
                </div>
                
                {expandedActions.has(action.id) && (
                  <div className="mt-3 p-3 bg-slate-50 rounded border text-xs text-slate-700">
                    <div className="space-y-2">
                      <div><strong>Expected Outcome:</strong> Risk reduction of 15-25% within implementation timeframe</div>
                      <div><strong>Dependencies:</strong> Requires coordination with facilities team</div>
                      <div><strong>Success Metrics:</strong> CO₂ levels below 800ppm, improved cognitive performance indicators</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InteractivePlaybook;
