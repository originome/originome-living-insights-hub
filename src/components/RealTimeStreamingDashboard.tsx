
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Pause, Play, Zap } from 'lucide-react';
import { StreamingAnalyticsService } from '@/services/streamingAnalyticsService';

interface RealTimeStreamingDashboardProps {
  environmentalParams: any;
  externalData: any;
  cosmicData: any;
  buildingType: string;
  streamingActive: boolean;
  onToggleStreaming: () => void;
}

export const RealTimeStreamingDashboard: React.FC<RealTimeStreamingDashboardProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  streamingActive,
  onToggleStreaming
}) => {
  const [streamingMetrics, setStreamingMetrics] = useState({
    parametersPerSecond: 0,
    totalProcessed: 0,
    latency: 0,
    accuracy: 0,
    activeStreams: 0
  });

  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Initialize streaming service
    StreamingAnalyticsService.initializeStreamProcessing();

    const interval = setInterval(() => {
      if (streamingActive) {
        const metrics = StreamingAnalyticsService.getStreamingMetrics();
        const alerts = StreamingAnalyticsService.getRealTimeAlerts();
        
        setStreamingMetrics(metrics);
        setRealtimeAlerts(alerts.slice(0, 5)); // Show latest 5 alerts
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [streamingActive]);

  const getLatencyColor = (latency: number) => {
    if (latency < 3) return 'text-green-600';
    if (latency < 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Activity className="h-5 w-5" />
            Real-Time Environmental Intelligence Engine
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={streamingActive ? "default" : "secondary"}>
              {streamingActive ? "LIVE" : "PAUSED"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStreaming}
              className="h-7"
            >
              {streamingActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Real-Time Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(streamingMetrics.parametersPerSecond).toLocaleString()}
            </div>
            <div className="text-xs text-blue-700">Parameters/sec</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(streamingMetrics.totalProcessed).toLocaleString()}
            </div>
            <div className="text-xs text-green-700">Total Processed</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getLatencyColor(streamingMetrics.latency)}`}>
              {streamingMetrics.latency.toFixed(1)}ms
            </div>
            <div className="text-xs text-gray-600">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(streamingMetrics.accuracy * 100)}%
            </div>
            <div className="text-xs text-purple-700">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {streamingMetrics.activeStreams}
            </div>
            <div className="text-xs text-orange-700">Active Streams</div>
          </div>
        </div>

        {/* Processing Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Processing Status</span>
            <span className="text-xs text-blue-600">
              {streamingActive ? 'Real-time processing active' : 'Processing paused'}
            </span>
          </div>
          <Progress 
            value={streamingActive ? streamingMetrics.accuracy * 100 : 0} 
            className="h-2"
          />
        </div>

        {/* Real-Time Alerts */}
        {realtimeAlerts.length > 0 && (
          <div>
            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Latest Pattern Detections
            </div>
            <div className="space-y-1">
              {realtimeAlerts.map((alert, index) => (
                <div key={alert.alertId} className="flex items-center justify-between bg-white/50 rounded px-2 py-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={alert.severity === 'critical' ? 'destructive' : 'outline'} 
                      className="text-xs h-4"
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-xs font-medium">{alert.parameter}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
