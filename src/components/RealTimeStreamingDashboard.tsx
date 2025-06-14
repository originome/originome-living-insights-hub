
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Activity, Radio, AlertTriangle, TrendingUp } from 'lucide-react';
import { 
  StreamingAnalyticsService, 
  StreamingMetrics, 
  StreamProcessor, 
  RealTimeAlert 
} from '@/services/streamingAnalyticsService';

export const RealTimeStreamingDashboard: React.FC = () => {
  const [streamingMetrics, setStreamingMetrics] = useState<StreamingMetrics | null>(null);
  const [streamProcessors, setStreamProcessors] = useState<StreamProcessor[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<RealTimeAlert[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Initialize streaming analytics
    StreamingAnalyticsService.initializeStreamProcessing();
    setIsStreaming(true);

    // Update metrics every second
    const interval = setInterval(() => {
      const metrics = StreamingAnalyticsService.getStreamingMetrics();
      const processors = StreamingAnalyticsService.getStreamProcessors();
      const alerts = StreamingAnalyticsService.getRealTimeAlerts();

      setStreamingMetrics(metrics);
      setStreamProcessors(processors);
      setRealtimeAlerts(alerts);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'environmental': return '🌍';
      case 'space_weather': return '🌌';
      case 'operational': return '⚙️';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Streaming Status Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Real-Time Streaming Analytics Engine
            <Badge variant={isStreaming ? "default" : "secondary"} className="text-xs">
              {isStreaming ? "LIVE STREAMING" : "OFFLINE"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-green-600">
            Enterprise-grade stream processing • 60,000+ parameters/second capacity
          </div>
        </CardHeader>
        {streamingMetrics && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">
                  {streamingMetrics.parametersPerSecond.toLocaleString()}
                </div>
                <div className="text-green-600">Parameters/Second</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">
                  {streamingMetrics.totalProcessed.toLocaleString()}
                </div>
                <div className="text-green-600">Total Processed</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">
                  {streamingMetrics.latency.toFixed(1)}ms
                </div>
                <div className="text-green-600">Latency</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">
                  {(streamingMetrics.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-green-600">Accuracy</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Stream Processors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-600" />
            Active Data Streams
          </CardTitle>
          <div className="text-sm text-blue-600">
            Real-time data fusion: Environmental • Space Weather • Operational
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {streamProcessors.map((processor) => (
            <Alert key={processor.streamId} className="border-blue-200 bg-blue-50">
              <Radio className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getDataTypeIcon(processor.dataType)}</span>
                    <div className="font-semibold capitalize">
                      {processor.dataType.replace('_', ' ')} Stream
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {processor.processingRate.toLocaleString()}/sec
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      Buffer: {processor.bufferSize}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-blue-700">
                  <strong>Stream ID:</strong> {processor.streamId} • 
                  <strong> Last Processed:</strong> {processor.lastProcessed.toLocaleTimeString()}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Real-Time Alerts */}
      {realtimeAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Real-Time Environmental Alerts
            </CardTitle>
            <div className="text-sm text-orange-600">
              Immediate response alerts • Processing environmental data as it's created
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {realtimeAlerts.slice(0, 10).map((alert) => (
              <Alert key={alert.alertId} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{alert.parameter} Alert</div>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="text-xs capitalize">
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.timestamp.toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>Current:</strong> {alert.currentValue.toFixed(1)} • 
                    <strong> Threshold:</strong> {alert.threshold.toFixed(1)} • 
                    <strong> Source:</strong> {alert.source}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Data Fusion Status */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-700">
              <strong>Data Fusion Active:</strong> Combining space weather, air quality, and operational streams • 
              {streamingMetrics?.activeStreams || 0} active streams • 
              Processing rate: {streamingMetrics?.parametersPerSecond.toLocaleString() || 0}/second
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Enterprise-grade stream processing • Latency: {streamingMetrics?.latency.toFixed(1) || 0}ms • 
            Next fusion cycle: ~100ms
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
