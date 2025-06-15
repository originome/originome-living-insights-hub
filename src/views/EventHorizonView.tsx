
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Filter, Brain, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "../components/visualization/EventCard";

interface CompoundPatternEvent {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  category: 'compound_pattern' | 'cascade_risk' | 'non_obvious_correlation' | 'predictive_intelligence';
  description: string;
  patternConfidence: number;
  predictiveWindow: string;
  compoundFactors: Array<{
    factor: string;
    contribution: number;
    hidden: boolean;
  }>;
  businessImpact: {
    description: string;
    preventedCosts: number;
    timeAdvantage: string;
  };
  intelligencePlaybook: Array<{
    id: string;
    action: string;
    completed: boolean;
    priority: 'critical' | 'high' | 'medium';
    nonObvious: boolean;
  }>;
  detectedAt: Date;
  competitiveAdvantage: string;
}

const EventHorizonView: React.FC = () => {
  const [events, setEvents] = useState<CompoundPatternEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'compound' | 'predictive'>('all');

  useEffect(() => {
    // Generate sophisticated pattern intelligence events
    const generatePatternEvents = () => {
      const patternEvents: CompoundPatternEvent[] = [
        {
          id: '1',
          title: 'Compound Pattern: Cognitive Fatigue Window Imminent',
          severity: 'critical',
          category: 'compound_pattern',
          description: 'Solar wind velocity spike (720 km/s) × CO₂ acceleration (δ+18ppm/15min) × barometric drop creating compound cognitive stress pattern. Non-obvious correlation detected 67 minutes before traditional threshold breach.',
          patternConfidence: 94,
          predictiveWindow: '45-90 minutes before cognitive performance decline',
          compoundFactors: [
            { factor: 'Solar Wind Velocity Spike', contribution: 35, hidden: true },
            { factor: 'CO₂ Rate-of-Change Acceleration', contribution: 28, hidden: false },
            { factor: 'Barometric Pressure Velocity', contribution: 22, hidden: true },
            { factor: 'Circadian Vulnerability Window', contribution: 15, hidden: true }
          ],
          businessImpact: {
            description: 'Decision-making accuracy drops 15-23% during compound convergence',
            preventedCosts: 45000,
            timeAdvantage: '67 minutes early warning vs. basic CO₂ alerts'
          },
          intelligencePlaybook: [
            { id: '1', action: 'Defer critical decision meetings by 90 minutes', completed: false, priority: 'critical', nonObvious: true },
            { id: '2', action: 'Activate enhanced ventilation protocols', completed: false, priority: 'high', nonObvious: false },
            { id: '3', action: 'Send cognitive load reduction advisory to leadership', completed: false, priority: 'high', nonObvious: true },
            { id: '4', action: 'Monitor for cascade effects in adjacent zones', completed: false, priority: 'medium', nonObvious: true }
          ],
          detectedAt: new Date(Date.now() - 12 * 60 * 1000),
          competitiveAdvantage: 'Detected via non-obvious solar-cognitive correlation unavailable to standard monitoring'
        },
        {
          id: '2',
          title: 'Predictive Intelligence: Asset Vulnerability Window Opening',
          severity: 'high',
          category: 'predictive_intelligence',
          description: 'Unique asset fingerprint match: Equipment manufactured 2018-2019 shows 340% failure probability spike when geomagnetic Kp-index >4 coincides with humidity >65%. Historical pattern suggests 6-hour vulnerability window.',
          patternConfidence: 87,
          predictiveWindow: '6-hour asset stress window beginning in 23 minutes',
          compoundFactors: [
            { factor: 'Geomagnetic Storm Activity (Kp=5.2)', contribution: 42, hidden: true },
            { factor: 'Manufacturing Year Signature (2018-2019)', contribution: 31, hidden: true },
            { factor: 'Humidity Threshold Interaction', contribution: 18, hidden: false },
            { factor: 'Seasonal Electromagnetic Resonance', contribution: 9, hidden: true }
          ],
          businessImpact: {
            description: 'Asset failure during compound stress costs $18K-32K in emergency repairs',
            preventedCosts: 28000,
            timeAdvantage: 'Asset-specific fingerprint detection 4-6 hours before failure'
          },
          intelligencePlaybook: [
            { id: '1', action: 'Activate backup systems for vulnerable assets', completed: false, priority: 'critical', nonObvious: true },
            { id: '2', action: 'Deploy field technicians to high-risk units', completed: false, priority: 'high', nonObvious: false },
            { id: '3', action: 'Monitor electromagnetic field variations', completed: false, priority: 'medium', nonObvious: true }
          ],
          detectedAt: new Date(Date.now() - 28 * 60 * 1000),
          competitiveAdvantage: 'Asset fingerprinting reveals equipment-specific vulnerabilities invisible to generic monitoring'
        },
        {
          id: '3',
          title: 'Non-Obvious Correlation: Productivity Cascade Risk Pattern',
          severity: 'moderate',
          category: 'non_obvious_correlation',
          description: 'Cross-domain pattern detection: High pollen count (Very High = 9.1/10) × morning solar activity × indoor humidity creates compound biological stress. Historical data shows 19% productivity decline during this specific convergence.',
          patternConfidence: 82,
          predictiveWindow: '2-4 hour productivity impact window',
          compoundFactors: [
            { factor: 'Pollen Count Seasonal Peak', contribution: 38, hidden: false },
            { factor: 'Solar Activity Morning Spike', contribution: 29, hidden: true },
            { factor: 'Indoor Humidity Interaction', contribution: 21, hidden: false },
            { factor: 'Circadian Immune Response', contribution: 12, hidden: true }
          ],
          businessImpact: {
            description: 'Compound biological stress reduces team productivity by 19% for 2-4 hours',
            preventedCosts: 12000,
            timeAdvantage: 'Non-obvious correlation detected 3 hours before impact'
          },
          intelligencePlaybook: [
            { id: '1', action: 'Adjust meeting schedules to avoid peak stress window', completed: false, priority: 'high', nonObvious: true },
            { id: '2', action: 'Enhanced air filtration during compound convergence', completed: false, priority: 'medium', nonObvious: false },
            { id: '3', action: 'Issue biological stress advisory to HR', completed: false, priority: 'medium', nonObvious: true }
          ],
          detectedAt: new Date(Date.now() - 45 * 60 * 1000),
          competitiveAdvantage: 'Reveals hidden pollen-solar-circadian correlations missed by standard environmental monitoring'
        }
      ];
      
      setEvents(patternEvents);
      setIsLoading(false);
    };

    setTimeout(generatePatternEvents, 1500);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'compound') return event.category === 'compound_pattern';
    if (filter === 'predictive') return event.category === 'predictive_intelligence' || event.category === 'non_obvious_correlation';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Brain className="h-12 w-12 text-purple-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Analyzing Compound Pattern Intelligence...
            </h3>
            <p className="text-slate-600">
              Detecting non-obvious correlations across 47+ data streams
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                  Event Horizon - Pattern Intelligence Feed
                </CardTitle>
                <p className="text-purple-700 text-sm">
                  Non-obvious correlations • Compound pattern detection • Predictive intelligence advantages
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs"
              >
                All Patterns ({events.length})
              </Button>
              <Button
                variant={filter === 'compound' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('compound')}
                className="text-xs"
              >
                <Network className="h-3 w-3 mr-1" />
                Compound ({events.filter(e => e.category === 'compound_pattern').length})
              </Button>
              <Button
                variant={filter === 'predictive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('predictive')}
                className="text-xs"
              >
                <Filter className="h-3 w-3 mr-1" />
                Predictive
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pattern Intelligence Feed */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    No Compound Pattern Risks Detected
                  </h3>
                  <p className="text-green-700">
                    All multi-domain patterns within acceptable convergence parameters
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Pattern intelligence engine actively monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="border-l-4 border-purple-400">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg text-purple-900">{event.title}</CardTitle>
                      <p className="text-sm text-purple-700">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {event.patternConfidence}% confidence
                    </Badge>
                    <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Compound Factors</h4>
                    <div className="space-y-1">
                      {event.compoundFactors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className={factor.hidden ? "text-purple-700 font-medium" : "text-gray-600"}>
                            {factor.hidden && "🔍 "}{factor.factor}
                          </span>
                          <span className="text-gray-500">{factor.contribution}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Business Impact</h4>
                    <div className="text-xs space-y-1">
                      <div>{event.businessImpact.description}</div>
                      <div className="text-green-700 font-medium">
                        Prevented Cost: ${event.businessImpact.preventedCosts.toLocaleString()}
                      </div>
                      <div className="text-blue-700 font-medium">
                        Time Advantage: {event.businessImpact.timeAdvantage}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-semibold text-sm text-purple-900 mb-1">Competitive Intelligence Advantage</div>
                  <div className="text-xs text-purple-800">{event.competitiveAdvantage}</div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Intelligence Playbook</h4>
                  <div className="space-y-1">
                    {event.intelligencePlaybook.map((action) => (
                      <div key={action.id} className="flex items-center space-x-2 text-xs">
                        <input type="checkbox" checked={action.completed} readOnly className="h-3 w-3" />
                        <span className={action.nonObvious ? "text-purple-700 font-medium" : "text-gray-600"}>
                          {action.nonObvious && "🧠 "}{action.action}
                        </span>
                        <Badge variant="outline" className="text-xs">{action.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500 border-t pt-2">
                  Pattern detected: {event.detectedAt.toLocaleTimeString()} • 
                  Predictive window: {event.predictiveWindow}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Intelligence Engine Status */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Pattern Intelligence Engine: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Non-Obvious Correlations: 47 streams</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Compound Pattern Detection: Enabled</span>
              </div>
            </div>
            <div>
              Next intelligence scan: <span className="font-mono">00:18</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventHorizonView;
