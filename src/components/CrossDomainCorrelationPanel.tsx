
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Network, Zap, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { 
  CrossDomainCorrelationService,
  CrossSectorPattern,
  EchoDetection,
  CorrelationLibrary
} from '@/services/crossDomainCorrelationService';

interface CrossDomainCorrelationPanelProps {
  currentSector: string;
  environmentalData: any;
  buildingType: string;
}

export const CrossDomainCorrelationPanel: React.FC<CrossDomainCorrelationPanelProps> = ({
  currentSector,
  environmentalData,
  buildingType
}) => {
  const [crossSectorPatterns, setCrossSectorPatterns] = useState<CrossSectorPattern[]>([]);
  const [echoDetection, setEchoDetection] = useState<EchoDetection | null>(null);
  const [correlationLibrary, setCorrelationLibrary] = useState<CorrelationLibrary | null>(null);
  const [networkGrowth, setNetworkGrowth] = useState(0);

  useEffect(() => {
    // Initialize correlation library
    CrossDomainCorrelationService.initializeCorrelationLibrary();
    
    // Detect cross-sector patterns
    const patterns = CrossDomainCorrelationService.detectCrossSectorPatterns(
      currentSector,
      environmentalData,
      buildingType
    );
    setCrossSectorPatterns(patterns);

    // Predict echo effects
    const sourceEvent = {
      magnitude: environmentalData.pm25 || 50,
      temperature: environmentalData.temperature || 22,
      co2: environmentalData.co2 || 400
    };
    const echo = CrossDomainCorrelationService.predictEchoEffects(sourceEvent, currentSector);
    setEchoDetection(echo);

    // Get correlation library status
    const library = CrossDomainCorrelationService.getCorrelationLibraryStatus();
    setCorrelationLibrary(library);

    // Simulate network growth
    const interval = setInterval(() => {
      setNetworkGrowth(prev => prev + Math.random() * 2);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSector, environmentalData, buildingType]);

  const getCorrelationStrengthColor = (strength: number) => {
    if (strength > 0.8) return 'text-green-800 bg-green-100 border-green-300';
    if (strength > 0.6) return 'text-yellow-800 bg-yellow-100 border-yellow-300';
    return 'text-red-800 bg-red-100 border-red-300';
  };

  const getSectorIcon = (sector: string) => {
    const icons: { [key: string]: string } = {
      healthcare: '🏥',
      education: '🏫',
      office: '🏢',
      retail: '🏪',
      manufacturing: '🏭',
      logistics: '🚛',
      hospitality: '🏨'
    };
    return icons[sector] || '🏢';
  };

  return (
    <div className="space-y-4">
      {/* Correlation Library Status */}
      {correlationLibrary && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-emerald-600" />
              Cross-Domain Correlation Engine
              <Badge variant="default" className="text-xs">
                NETWORK ACTIVE
              </Badge>
            </CardTitle>
            <div className="text-sm text-emerald-600">
              Sector pattern recognition • Network effects • Predictive cascading
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {correlationLibrary.totalPatterns}
                </div>
                <div className="text-emerald-600">Total Patterns</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {correlationLibrary.networkCustomers + Math.floor(networkGrowth)}
                </div>
                <div className="text-emerald-600">Network Size</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {correlationLibrary.learningVelocity.toFixed(1)}x
                </div>
                <div className="text-emerald-600">Learning Rate</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-emerald-700">
                  {(correlationLibrary.accuracyImprovement * 100).toFixed(1)}%
                </div>
                <div className="text-emerald-600">Accuracy</div>
              </div>
            </div>
            
            {correlationLibrary.crossSectorInsights.length > 0 && (
              <div className="mt-4 text-xs text-emerald-700">
                <strong>Network Insights:</strong> {correlationLibrary.crossSectorInsights.join(' • ')}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cross-Sector Pattern Detection */}
      {crossSectorPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Cross-Sector Pattern Recognition
            </CardTitle>
            <div className="text-sm text-blue-600">
              {crossSectorPatterns.length} active correlations detected across industries
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {crossSectorPatterns.slice(0, 3).map((pattern, index) => (
              <Alert key={index} className={`border-l-4 ${getCorrelationStrengthColor(pattern.correlationStrength)}`}>
                <Network className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {pattern.sectors.map(sector => (
                        <span key={sector} className="text-lg">
                          {getSectorIcon(sector)}
                        </span>
                      ))}
                      <div className="font-semibold">
                        {pattern.sectors.join(' ↔ ')} Correlation
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {(pattern.correlationStrength * 100).toFixed(0)}% strength
                      </Badge>
                      <Badge variant={pattern.confidence > 0.8 ? "default" : "secondary"} className="text-xs">
                        {(pattern.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <strong>Primary Sector:</strong> {getSectorIcon(pattern.rippleEffect.primarySector)} {pattern.rippleEffect.primarySector}
                    </div>
                    <div>
                      <strong>Impact Delay:</strong> {pattern.rippleEffect.impactDelay}h
                    </div>
                  </div>
                  
                  <div className="text-sm mb-2">
                    <strong>Amplification Factor:</strong> {pattern.rippleEffect.amplificationFactor}x • 
                    <strong> Historical Occurrences:</strong> {pattern.historicalOccurrences}
                  </div>
                  
                  <div className="text-xs bg-white/60 p-2 rounded">
                    <strong>Network Effect:</strong> {pattern.networkEffect.customerCount} customers contributing • 
                    Learning acceleration: {pattern.networkEffect.learningAcceleration.toFixed(1)}x
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Echo Detection System */}
      {echoDetection && echoDetection.predictedEchoes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Zap className="h-5 w-5" />
              Echo Detection Alert
            </CardTitle>
            <div className="text-sm text-orange-600">
              Predicting cross-sector environmental impacts • Cascade risk: {echoDetection.cascadeRisk.toFixed(0)}%
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/60 p-3 rounded border border-orange-200">
              <div className="font-semibold text-orange-800 mb-2">Source Event</div>
              <div className="text-sm text-orange-700">
                <strong>Sector:</strong> {getSectorIcon(echoDetection.sourceEvent.sector)} {echoDetection.sourceEvent.sector} • 
                <strong> Magnitude:</strong> {echoDetection.sourceEvent.magnitude} • 
                <strong> Type:</strong> {echoDetection.sourceEvent.eventType}
              </div>
            </div>
            
            {echoDetection.predictedEchoes.map((echo, index) => (
              <Alert key={index} className="border-l-4 border-orange-400 bg-white">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSectorIcon(echo.targetSector)}</span>
                      <div className="font-semibold">
                        {echo.targetSector} Impact Prediction
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {echo.expectedImpact.toFixed(0)} magnitude
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(echo.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong>Predicted Delay:</strong> {echo.predictedDelay.toFixed(1)} hours
                    </div>
                    <div>
                      <strong>Mitigation Window:</strong> {echo.mitigationWindow.toFixed(1)} hours
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-orange-800 bg-orange-100 p-2 rounded">
                    ⚡ <strong>Action Window:</strong> {echo.mitigationWindow.toFixed(1)} hours to implement 
                    prevent risk measures before impact occurs
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Network Growth Indicator */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-700">
              <strong>Network Effect Active:</strong> {correlationLibrary?.networkCustomers || 0} organizations 
              contributing cross-sector intelligence • Pattern library growing continuously
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Cross-domain insights improving • Next correlation update: ~5 minutes • 
            Network customers: +{Math.floor(networkGrowth)} this session
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
