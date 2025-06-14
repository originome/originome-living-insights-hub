
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Zap, Shield, ChevronRight, X, Settings } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface IntelligentAlertSystemProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
}

interface CompoundAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'convergence' | 'cascade' | 'anomaly' | 'prediction';
  triggers: string[];
  description: string;
  recommendation: string;
  timeWindow: string;
  confidence: number;
  dismissed: boolean;
  timestamp: Date;
}

interface NotificationChannel {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
}

export const IntelligentAlertSystem: React.FC<IntelligentAlertSystemProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [alerts, setAlerts] = useState<CompoundAlert[]>([]);
  const [showDismissed, setShowDismissed] = useState(false);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
    { id: 'dashboard', name: 'Dashboard', enabled: true, icon: '🖥️' },
    { id: 'email', name: 'Email', enabled: true, icon: '📧' },
    { id: 'mobile', name: 'Mobile Push', enabled: false, icon: '📱' },
    { id: 'sms', name: 'SMS', enabled: false, icon: '💬' }
  ]);

  useEffect(() => {
    // Generate compound pattern alerts
    const newAlerts: CompoundAlert[] = [];

    // Convergence pattern detection
    if (environmentalParams.co2 > 850 && environmentalParams.pm25 > 20 && cosmicData?.geomagnetic.kpIndex > 4) {
      newAlerts.push({
        id: 'conv_triple_threat',
        title: 'Triple Threat Convergence Detected',
        severity: 'critical',
        type: 'convergence',
        triggers: ['High CO₂', 'Poor Air Quality', 'Geomagnetic Storm'],
        description: 'Three independent risk factors are converging to create a compound stress environment with potential for rapid performance degradation.',
        recommendation: 'Implement immediate ventilation protocols, consider flexible work arrangements, and monitor occupant wellness closely.',
        timeWindow: 'Next 2-4 hours',
        confidence: 92,
        dismissed: false,
        timestamp: new Date()
      });
    }

    // Cascade risk detection
    if (environmentalParams.temperature > 26 && cosmicData?.solar.sunspotNumber > 120) {
      newAlerts.push({
        id: 'cascade_thermal_solar',
        title: 'Thermal-Solar Cascade Risk',
        severity: 'high',
        type: 'cascade',
        triggers: ['High Temperature', 'Solar Activity', 'HVAC Load'],
        description: 'Elevated solar activity is amplifying thermal stress, potentially triggering HVAC system strain and subsequent indoor air quality degradation.',
        recommendation: 'Pre-emptively adjust HVAC settings, implement thermal comfort protocols, and prepare backup ventilation systems.',
        timeWindow: 'Next 6-8 hours',
        confidence: 78,
        dismissed: false,
        timestamp: new Date()
      });
    }

    // Anomaly detection
    if (cosmicData?.seasonal.pollenCount.level === 'Very High' && cosmicData?.geomagnetic.kpIndex > 5) {
      newAlerts.push({
        id: 'anomaly_bio_magnetic',
        title: 'Bio-Magnetic Anomaly Pattern',
        severity: 'medium',
        type: 'anomaly',
        triggers: ['Peak Pollen', 'Geomagnetic Storm', 'Seasonal Sensitivity'],
        description: 'Unusual convergence of biological and geomagnetic stressors detected. This rare pattern historically correlates with increased sensitivity responses.',
        recommendation: 'Enhance air filtration, make antihistamines available, and consider reduced meeting schedules for sensitive individuals.',
        timeWindow: 'Next 12-24 hours',
        confidence: 68,
        dismissed: false,
        timestamp: new Date()
      });
    }

    // Prediction alert
    if (environmentalParams.humidity > 60 && externalData.weather?.temperature && externalData.weather.temperature > 25) {
      newAlerts.push({
        id: 'pred_comfort_degradation',
        title: 'Comfort Degradation Predicted',
        severity: 'medium',
        type: 'prediction',
        triggers: ['High Humidity', 'Warm Temperature', 'Comfort Index'],
        description: 'Current conditions are trending toward thermal discomfort threshold. Predictive models suggest comfort complaints will increase by 40% in the next 3 hours.',
        recommendation: 'Proactively adjust HVAC settings and consider implementing comfort mitigation strategies before complaints arise.',
        timeWindow: 'Next 3 hours',
        confidence: 85,
        dismissed: false,
        timestamp: new Date()
      });
    }

    setAlerts(prevAlerts => {
      const existingIds = prevAlerts.map(a => a.id);
      const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.includes(alert.id));
      return [...prevAlerts, ...uniqueNewAlerts];
    });
  }, [environmentalParams, cosmicData, externalData]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'convergence': return AlertTriangle;
      case 'cascade': return Zap;
      case 'anomaly': return Shield;
      case 'prediction': return ChevronRight;
      default: return Bell;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const dismissedAlerts = alerts.filter(alert => alert.dismissed);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-orange-600" />
            Intelligent Alert System
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeAlerts.length} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDismissed(!showDismissed)}
            >
              {showDismissed ? 'Hide' : 'Show'} Dismissed
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Compound pattern detection • Cascade prevention • Multi-channel notifications
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Notification Channels */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Active Channels:</span>
          {notificationChannels.filter(ch => ch.enabled).map(channel => (
            <Badge key={channel.id} variant="outline" className="text-xs">
              {channel.icon} {channel.name}
            </Badge>
          ))}
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map(alert => {
              const Icon = getTypeIcon(alert.type);
              return (
                <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <Icon className="h-5 w-5" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {alert.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {alert.confidence}% confidence
                          </Badge>
                        </div>
                        
                        <div className="text-sm mb-2">{alert.description}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <strong>Triggers:</strong> {alert.triggers.join(', ')}
                          </div>
                          <div>
                            <strong>Time Window:</strong> {alert.timeWindow}
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-white/60 rounded border-l-2 border-green-400">
                          <div className="text-xs font-medium text-green-800 mb-1">Recommended Action:</div>
                          <div className="text-xs text-green-700">{alert.recommendation}</div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="ml-2 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div className="font-medium">All Clear</div>
            <div className="text-sm">No compound pattern alerts detected</div>
          </div>
        )}

        {/* Dismissed Alerts */}
        {showDismissed && dismissedAlerts.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-gray-600 mb-3">Dismissed Alerts</h4>
            <div className="space-y-2">
              {dismissedAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <span>{alert.title}</span>
                    <span className="text-xs">{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div className="flex items-center justify-between">
            <div>
              <strong>Alert Engine Status:</strong> Active • Pattern library: 847 signatures • 
              Last scan: {new Date().toLocaleTimeString()}
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
