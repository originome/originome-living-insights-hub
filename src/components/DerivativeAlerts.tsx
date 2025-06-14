
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp } from 'lucide-react';
import { FirstDerivativeAlert } from '@/types/rateOfChange';

interface DerivativeAlertsProps {
  firstDerivativeAlerts: FirstDerivativeAlert[];
}

export const DerivativeAlerts: React.FC<DerivativeAlertsProps> = ({
  firstDerivativeAlerts
}) => {
  if (firstDerivativeAlerts.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Active Derivative-Based Alerts
        </CardTitle>
        <div className="text-sm text-orange-600">
          Velocity-based triggers detecting acceleration patterns
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {firstDerivativeAlerts.map((alert) => (
          <Alert key={alert.id} className="border-l-4 border-orange-400">
            <AlertDescription>
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-orange-800">{alert.parameter}</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <Badge variant="destructive" className="text-xs">
                    Critical: {alert.criticalityScore}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-orange-700 mb-2">
                <strong>Alert Reason:</strong> {alert.alertReason} • 
                <strong> Derivative Value:</strong> {alert.derivativeValue.toFixed(2)}
              </div>
              <div className="text-xs text-orange-800 bg-white/60 p-2 rounded">
                <strong>Risk Window:</strong> {alert.riskWindow} • Pattern detected through first-derivative analysis
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
