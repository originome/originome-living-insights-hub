
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin,
  CheckCircle,
  XCircle,
  Activity
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'moderate' | 'low';
    category: 'environmental' | 'operational' | 'cascade' | 'compound';
    description: string;
    riskScore: number;
    confidence: number;
    dataSources: Array<{
      type: 'public' | 'private';
      name: string;
      icon: string;
    }>;
    playbook: Array<{
      id: string;
      action: string;
      completed: boolean;
      priority: 'high' | 'medium' | 'low';
    }>;
    detectedAt: Date;
    estimatedImpact: string;
    geographicScope: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [playbook, setPlaybook] = useState(event.playbook);
  const [eventStatus, setEventStatus] = useState<'active' | 'averted' | 'occurred'>('active');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'moderate': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'moderate': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-blue-700 bg-blue-100';
    }
  };

  const handlePlaybookToggle = (itemId: string) => {
    setPlaybook(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedActions = playbook.filter(item => item.completed).length;
  const totalActions = playbook.length;
  const completionPercentage = Math.round((completedActions / totalActions) * 100);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  };

  return (
    <Card className={`border-l-4 ${getSeverityColor(event.severity)} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-5 w-5 ${
                event.severity === 'critical' ? 'text-red-600' : 
                event.severity === 'high' ? 'text-orange-600' :
                event.severity === 'moderate' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
              <h3 className="font-semibold text-slate-900 text-lg">{event.title}</h3>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(event.detectedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{event.geographicScope}</span>
              </div>
              <Badge variant={getSeverityBadge(event.severity) as any} className="text-xs">
                {event.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="font-bold text-lg text-slate-900">{event.riskScore}</div>
              <div className="text-slate-600">Risk Score</div>
              <div className="text-xs text-slate-500">{event.confidence}% confidence</div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setShowDataSources(!showDataSources)}
            >
              <Info className="h-4 w-4" />
              {showDataSources && (
                <div className="absolute top-8 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10 min-w-64">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-slate-900">Data Lineage</h4>
                    {event.dataSources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-lg">{source.icon}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          source.type === 'public' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {source.type === 'public' ? 'Public' : 'Private'}
                        </span>
                        <span className="text-slate-700">{source.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-700">{event.description}</p>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="text-sm">
            <strong>Estimated Impact:</strong> {event.estimatedImpact}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Cascade Prevention Playbook</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          <div className="text-sm text-slate-600">
            {completedActions}/{totalActions} actions completed ({completionPercentage}%)
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* Interactive Playbook */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Actionable Workflow</h4>
              {playbook.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handlePlaybookToggle(item.id)}
                  />
                  <div className="flex-1">
                    <div className={`text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.action}
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs ${getPriorityColor(item.priority)}`}
                    variant="outline"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator />

            {/* Feedback Loop */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Risk Verification Feedback</h4>
              <div className="flex space-x-3">
                <Button
                  variant={eventStatus === 'averted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEventStatus('averted')}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Risk Averted</span>
                </Button>
                
                <Button
                  variant={eventStatus === 'occurred' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setEventStatus('occurred')}
                  className="flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Event Occurred</span>
                </Button>
              </div>
              
              {eventStatus !== 'active' && (
                <div className={`p-3 rounded-lg text-sm ${
                  eventStatus === 'averted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {eventStatus === 'averted' 
                    ? '✓ Feedback recorded. This helps improve our pattern recognition accuracy.'
                    : '⚠ Event occurrence logged. Analysis will be used to refine future predictions.'
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
