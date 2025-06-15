import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Filter, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "../components/visualization/EventCard";

interface RiskEvent {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  category: 'environmental' | 'operational' | 'cascade' | 'compound';
  patternDescription: string;
  riskScore: number;
  confidence: number;
  dataSources: Array<{
    type: 'public' | 'private' | 'proprietary';
    name: string;
    icon: string;
  }>;
  mitigationInsights: string[];
  detectedAt: Date;
  predictiveWindow: string;
  geographicScope: string;
}

const EventHorizonView: React.FC = () => {
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'active'>('all');

  useEffect(() => {
    // Simulate loading and generating live risk events
    const generateDemoEvents = () => {
      const demoEvents: RiskEvent[] = [
        {
          id: '1',
          title: 'Compound Pattern: Electromagnetic-Weather Cascade Risk',
          severity: 'critical',
          category: 'compound',
          patternDescription: 'Pattern identified: Solar wind velocity spike (>700 km/s) is converging with a rapid atmospheric pressure drop. This pattern historically precedes cascade failures in electrical infrastructure by 45-90 minutes.',
          riskScore: 91,
          confidence: 94,
          dataSources: [
            { type: 'public', name: 'NOAA Space Weather', icon: '🌎' },
            { type: 'public', name: 'ECMWF Pressure Model', icon: '🌎' },
            { type: 'proprietary', name: 'Originome Pattern DB', icon: '🧠' }
          ],
          mitigationInsights: [
            'Activate grid-stabilizing protocols immediately',
            'Pre-position maintenance teams to high-risk substations',
            'Isolate non-critical loads to preserve grid integrity',
          ],
          detectedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          predictiveWindow: 'Impact probability peaks in 45-90 mins',
          geographicScope: 'Northern Grid Sector, 15km radius'
        },
        {
          id: '2',
          title: 'Cascade Risk: Air Quality Degradation Front',
          severity: 'high',
          category: 'environmental',
          patternDescription: 'High-velocity PM2.5 front (δ+15 μg/m³/hour) coupled with low wind shear indicates an imminent, persistent air quality event. This pattern is correlated with a 40% increase in unscheduled absenteeism.',
          riskScore: 78,
          confidence: 89,
          dataSources: [
            { type: 'public', name: 'EPA AirNow', icon: '🌎' },
            { type: 'private', name: 'Local Sensor Network', icon: '🔒' },
            { type: 'proprietary', name: 'Absenteeism Correlation Model', icon: '🧠' }
          ],
          mitigationInsights: [
            'Upgrade HVAC filtration to MERV 13 or higher',
            'Advise remote work for sensitive employee groups',
            'Reschedule non-essential outdoor operations',
          ],
          detectedAt: new Date(Date.now() - 42 * 60 * 1000), // 42 minutes ago
          predictiveWindow: 'Health risk window opens in 2 hours',
          geographicScope: 'Metropolitan area, wind-dependent spread'
        },
        {
          id: '3',
          title: 'Fingerprint Match: Environmental Stress on Legacy Asset',
          severity: 'moderate',
          category: 'operational',
          patternDescription: 'Asset vulnerability fingerprint match: A combination of high humidity (>75%) and micro-vibrations from nearby construction is creating a known failure pattern for 2018-era HVAC units.',
          riskScore: 62,
          confidence: 81,
          dataSources: [
            { type: 'private', name: 'Asset Management System', icon: '🔒' },
            { type: 'public', name: 'Local Seismic Data', icon: '🌎' },
            { type: 'private', name: 'Internal Maintenance Logs', icon: '🔒' }
          ],
          mitigationInsights: [
            'Inspect HVAC unit 7 for early signs of harmonic fatigue',
            'Install vibration dampers as a preventative measure',
            'Divert maintenance resources from low-risk assets',
          ],
          detectedAt: new Date(Date.now() - 68 * 60 * 1000), // 1 hour 8 minutes ago
          predictiveWindow: 'Failure risk elevated over next 72 hours',
          geographicScope: 'Facility assets manufactured 2017-2019'
        }
      ];
      
      setEvents(demoEvents);
      setIsLoading(false);
    };

    // Simulate data loading
    setTimeout(generateDemoEvents, 1500);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'critical') return event.severity === 'critical';
    if (filter === 'active') {
      // NOTE: This logic needs to be updated based on the new `mitigationInsights`
      // For now, we'll consider all events with insights as 'active'.
      return event.mitigationInsights && event.mitigationInsights.length > 0;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Scanning Environmental Patterns...
            </h3>
            <p className="text-slate-600">
              Analyzing real-time data streams for risk verification
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Horizon Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl text-blue-900">
                  Event Horizon - Compound Risk Feed
                </CardTitle>
                <p className="text-blue-700 text-sm">
                  Cross-domain pattern detection • Predictive intelligence • Non-obvious threat analysis
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
                variant={filter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('critical')}
                className="text-xs"
              >
                Critical ({events.filter(e => e.severity === 'critical').length})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
                className="text-xs"
              >
                <Filter className="h-3 w-3 mr-1" />
                Actionable
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Risk Events Feed */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    No Material Risk Events Detected
                  </h3>
                  <p className="text-green-700">
                    All environmental patterns within acceptable parameters
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Continuous monitoring active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>

      {/* System Status Footer */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Pattern Engine: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Data Streams: 47 sources</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Learning Mode: Enabled</span>
              </div>
            </div>
            <div>
              Next pattern scan: <span className="font-mono">00:23</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventHorizonView;
