
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, Info, Eye } from 'lucide-react';
import { DataLineageModal } from './DataLineageModal';

interface RiskEvent {
  id: string;
  timestamp: Date;
  type: 'compound_pattern' | 'velocity_alert' | 'asset_fingerprint' | 'cascade_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  assetId?: string;
  riskMultiplier: number;
  confidence: number;
  actionable: boolean;
  status: 'active' | 'acknowledged' | 'resolved';
  dataLineage: {
    publicSources: string[];
    privateSources: string[];
  };
}

interface RiskEventHorizonProps {
  environmentalParams: any;
  externalData: any;
  cosmicData: any;
  buildingType: string;
}

export const RiskEventHorizon: React.FC<RiskEventHorizonProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [lastScan, setLastScan] = useState(new Date());
  const [dataLineageModal, setDataLineageModal] = useState<{
    isOpen: boolean;
    eventId: string;
    publicSources: string[];
    privateSources: string[];
  }>({
    isOpen: false,
    eventId: '',
    publicSources: [],
    privateSources: []
  });

  useEffect(() => {
    // Perpetual monitoring - scan every 30 seconds
    const scanInterval = setInterval(() => {
      if (monitoringActive) {
        const newEvents = detectRiskEvents();
        setRiskEvents(prev => [...newEvents, ...prev].slice(0, 20)); // Keep latest 20 events
        setLastScan(new Date());
      }
    }, 30000);

    return () => clearInterval(scanInterval);
  }, [environmentalParams, cosmicData, monitoringActive]);

  const detectRiskEvents = (): RiskEvent[] => {
    const events: RiskEvent[] = [];
    const now = new Date();

    // Compound Pattern Detection
    if (cosmicData?.geomagnetic?.kpIndex >= 4 && environmentalParams.pm25 > 20) {
      events.push({
        id: `compound_${now.getTime()}`,
        timestamp: now,
        type: 'compound_pattern',
        severity: 'critical',
        title: 'Compound Pattern PP-847 Detected',
        description: '8.2x failure probability detected for HVAC systems due to Kp4+ geomagnetic activity combined with elevated particulates',
        riskMultiplier: 8.2,
        confidence: 92,
        actionable: true,
        status: 'active',
        dataLineage: {
          publicSources: ['NOAA Space Weather', 'EPA AirNow'],
          privateSources: ['Asset Maintenance Log #32A']
        }
      });
    }

    // Velocity Alert Detection
    const co2Velocity = calculateVelocity('co2');
    if (co2Velocity > 15) { // 15 ppm per minute
      events.push({
        id: `velocity_${now.getTime()}`,
        timestamp: now,
        type: 'velocity_alert',
        severity: 'high',
        title: 'CO₂ Acceleration Alert',
        description: `Rapid CO₂ increase detected: ${co2Velocity.toFixed(1)} ppm/min. Cognitive performance impact predicted in 12-18 minutes`,
        riskMultiplier: 2.4,
        confidence: 87,
        actionable: true,
        status: 'active',
        dataLineage: {
          publicSources: [],
          privateSources: ['Internal CO₂ Sensors', 'HVAC Control System']
        }
      });
    }

    return events;
  };

  const calculateVelocity = (parameter: string): number => {
    // Mock velocity calculation - in production, this would use historical data
    return Math.random() * 20;
  };

  const acknowledgeEvent = (eventId: string) => {
    setRiskEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'acknowledged' }
          : event
      )
    );
  };

  const openDataLineage = (event: RiskEvent) => {
    setDataLineageModal({
      isOpen: true,
      eventId: event.id,
      publicSources: event.dataLineage.publicSources,
      privateSources: event.dataLineage.privateSources
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Risk Event Horizon
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant={monitoringActive ? "default" : "secondary"}>
                {monitoringActive ? "Monitoring Active" : "Monitoring Paused"}
              </Badge>
              <div className="text-xs text-gray-600">
                Last scan: {lastScan.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Perpetual environmental risk detection • Event-driven intelligence
          </div>
        </CardHeader>
        <CardContent>
          {riskEvents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                No Material Risk Events Detected
              </h3>
              <p className="text-sm text-green-600">
                Originome is continuously monitoring your environment. You'll be notified immediately when risk patterns emerge.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {riskEvents.map((event) => (
                <Alert key={event.id} className={`border-l-4 ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(event.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {event.riskMultiplier}× risk
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <AlertDescription className="space-y-3">
                        <p className="text-sm text-gray-700">{event.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {event.timestamp.toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDataLineage(event)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Data Lineage
                            </Button>
                            {event.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => acknowledgeEvent(event.id)}
                                className="text-xs"
                              >
                                Acknowledge
                              </Button>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-700">
                <strong>Monitoring Status:</strong> {riskEvents.filter(e => e.status === 'active').length} active events • Next scan in 30 seconds
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMonitoringActive(!monitoringActive)}
              >
                {monitoringActive ? 'Pause' : 'Resume'} Monitoring
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataLineageModal
        isOpen={dataLineageModal.isOpen}
        onClose={() => setDataLineageModal(prev => ({ ...prev, isOpen: false }))}
        riskEventId={dataLineageModal.eventId}
        publicSources={dataLineageModal.publicSources}
        privateSources={dataLineageModal.privateSources}
      />
    </>
  );
};
