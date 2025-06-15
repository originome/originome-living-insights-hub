
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "../components/visualization/EventCard";

interface RiskEvent {
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
          title: 'Compound Electromagnetic-Weather Risk Pattern',
          severity: 'critical',
          category: 'compound',
          description: 'Solar wind velocity spike (720 km/s) coinciding with atmospheric pressure drop creating cascade risk for electrical infrastructure.',
          riskScore: 87,
          confidence: 92,
          dataSources: [
            { type: 'public', name: 'NOAA Space Weather', icon: '🌎' },
            { type: 'public', name: 'ECMWF Weather Model', icon: '🌎' },
            { type: 'private', name: 'Client Grid Monitoring', icon: '🔒' }
          ],
          playbook: [
            { id: '1', action: 'Activate backup power systems', completed: false, priority: 'high' },
            { id: '2', action: 'Notify field maintenance teams', completed: false, priority: 'high' },
            { id: '3', action: 'Monitor transformer temperatures', completed: false, priority: 'medium' },
            { id: '4', action: 'Prepare emergency response protocols', completed: false, priority: 'medium' }
          ],
          detectedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          estimatedImpact: 'Equipment failure risk: 34% | Duration: 4-6 hours',
          geographicScope: 'Northern Grid Sector, 15km radius'
        },
        {
          id: '2',
          title: 'Accelerating Air Quality Degradation',
          severity: 'high',
          category: 'environmental',
          description: 'PM2.5 velocity indicates rapid deterioration (δ+15 μg/m³/hour) suggesting incoming pollution front.',
          riskScore: 72,
          confidence: 89,
          dataSources: [
            { type: 'public', name: 'EPA AirNow', icon: '🌎' },
            { type: 'private', name: 'Local Sensor Network', icon: '🔒' },
            { type: 'public', name: 'Wind Pattern Analysis', icon: '🌎' }
          ],
          playbook: [
            { id: '1', action: 'Issue health advisory to workforce', completed: true, priority: 'high' },
            { id: '2', action: 'Adjust HVAC filtration systems', completed: false, priority: 'high' },
            { id: '3', action: 'Postpone outdoor maintenance activities', completed: false, priority: 'medium' }
          ],
          detectedAt: new Date(Date.now() - 42 * 60 * 1000), // 42 minutes ago
          estimatedImpact: 'Health risk window: 2-4 hours | Operations impact: Moderate',
          geographicScope: 'Metropolitan area, wind-dependent spread'
        },
        {
          id: '3',
          title: 'Legacy Asset Vulnerability Window',
          severity: 'moderate',
          category: 'operational',
          description: 'Asset fingerprint match: High humidity (78%) + temperature differential creates stress pattern for 2018-era equipment.',
          riskScore: 58,
          confidence: 76,
          dataSources: [
            { type: 'private', name: 'Asset Management System', icon: '🔒' },
            { type: 'public', name: 'Local Weather Station', icon: '🌎' },
            { type: 'private', name: 'Historical Failure Database', icon: '🔒' }
          ],
          playbook: [
            { id: '1', action: 'Inspect Unit 7 cooling system', completed: false, priority: 'medium' },
            { id: '2', action: 'Check expansion joint tolerances', completed: false, priority: 'low' },
            { id: '3', action: 'Schedule preventive maintenance window', completed: false, priority: 'low' }
          ],
          detectedAt: new Date(Date.now() - 68 * 60 * 1000), // 1 hour 8 minutes ago
          estimatedImpact: 'Maintenance cost avoidance: $12,000-18,000',
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
    if (filter === 'active') return event.playbook.some(item => !item.completed);
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
              <AlertTriangle className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl text-blue-900">
                  Event Horizon - Live Risk Detection
                </CardTitle>
                <p className="text-blue-700 text-sm">
                  Proactive monitoring • Pattern-based verification • Real-time intelligence
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
                All Events ({events.length})
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
                Active
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
