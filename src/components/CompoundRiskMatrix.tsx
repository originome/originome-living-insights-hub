import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Zap } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { CosmicData } from '@/hooks/useCosmicData';
import { MultiDomainRiskCard } from './MultiDomainRiskCard';
import { PileUpPatternAlert } from './PileUpPatternAlert';
import { AdaptiveLearningHeader } from './AdaptiveLearningHeader';
import { ContinuousLearningStatus } from './ContinuousLearningStatus';

interface CompoundRiskMatrixProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
}

interface MultiDomainRisk {
  name: string;
  domains: string[];
  exponentialFactor: number;
  riskScore: number;
  convergencePattern: string;
  biologicalImpact: string;
  probability: number;
}

interface PileUpPattern {
  id: string;
  factors: string[];
  rareOccurrence: boolean;
  historicalFrequency: number;
  exponentialMultiplier: number;
  criticalThreshold: number;
}

export const CompoundRiskMatrix: React.FC<CompoundRiskMatrixProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType
}) => {
  const [streamingActive, setStreamingActive] = useState(true);
  const [adaptiveLearning, setAdaptiveLearning] = useState({
    dataPoints: 0,
    accuracyScore: 0.73,
    patternConfidence: 0.81
  });

  // Multi-domain data fusion
  const multiDomainRisks = useMemo((): MultiDomainRisk[] => {
    const risks: MultiDomainRisk[] = [];

    // Space Weather + Air Quality + Biological Convergence
    if (cosmicData?.geomagnetic.kpIndex > 4 && 
        environmentalParams.pm25 > 20 && 
        externalData.healthSurveillance?.viralActivity === 'High') {
      risks.push({
        name: 'Tri-Domain Stress Convergence',
        domains: ['Space Weather', 'Air Quality', 'Biological'],
        exponentialFactor: 3.2,
        riskScore: 94,
        convergencePattern: 'Geomagnetic disruption amplifies pollutant sensitivity during viral peaks',
        biologicalImpact: 'Immune system suppression + respiratory stress + circadian disruption',
        probability: 0.87
      });
    }

    // Atmospheric + Electromagnetic + Operational Convergence
    if (environmentalParams.co2 > 850 && 
        cosmicData?.solar.sunspotNumber > 120 && 
        Math.abs(environmentalParams.temperature - 21) > 3) {
      risks.push({
        name: 'Atmospheric-EM Field Disruption',
        domains: ['Atmospheric', 'Electromagnetic', 'Operational'],
        exponentialFactor: 2.6,
        riskScore: 78,
        convergencePattern: 'Solar activity intensifies CO2 cognitive impact under thermal stress',
        biologicalImpact: 'Neurotransmitter disruption + oxygen transport efficiency loss',
        probability: 0.74
      });
    }

    // Seasonal + Seismic + Environmental Pile-up
    if (cosmicData?.seasonal.pollenCount.level === 'Very High' && 
        cosmicData?.seismic.riskLevel > 5 && 
        environmentalParams.humidity > 60) {
      risks.push({
        name: 'Biogeophysical Stress Matrix',
        domains: ['Seasonal', 'Seismic', 'Environmental'],
        exponentialFactor: 2.1,
        riskScore: 69,
        convergencePattern: 'Microseismic activity triggers histamine cascades in high-humidity allergen environments',
        biologicalImpact: 'Heightened inflammatory response + stress hormone elevation',
        probability: 0.62
      });
    }

    return risks.sort((a, b) => b.riskScore - a.riskScore);
  }, [environmentalParams, cosmicData, externalData]);

  // Pile-up pattern detection for rare co-occurrences
  const pileUpPatterns = useMemo((): PileUpPattern[] => {
    const patterns: PileUpPattern[] = [];

    // Rare: Full moon + geomagnetic storm + high CO2
    if (cosmicData?.seasonal.lunarIllumination > 90 && 
        cosmicData?.geomagnetic.kpIndex > 6 && 
        environmentalParams.co2 > 900) {
      patterns.push({
        id: 'lunar_geomag_co2',
        factors: ['Full Moon', 'Geomagnetic Storm', 'High CO₂'],
        rareOccurrence: true,
        historicalFrequency: 0.03, // 3% of observations
        exponentialMultiplier: 4.1,
        criticalThreshold: 95
      });
    }

    // Rare: Solar maximum + pollen peak + temperature extreme
    if (cosmicData?.solar.sunspotNumber > 150 && 
        cosmicData?.seasonal.pollenCount.level === 'Very High' && 
        Math.abs(environmentalParams.temperature - 21) > 6) {
      patterns.push({
        id: 'solar_pollen_temp',
        factors: ['Solar Maximum', 'Pollen Peak', 'Temperature Extreme'],
        rareOccurrence: true,
        historicalFrequency: 0.07, // 7% of observations
        exponentialMultiplier: 3.8,
        criticalThreshold: 89
      });
    }

    return patterns;
  }, [environmentalParams, cosmicData]);

  // Adaptive learning simulation
  useEffect(() => {
    if (!streamingActive) return;

    const interval = setInterval(() => {
      setAdaptiveLearning(prev => ({
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 15) + 5,
        accuracyScore: Math.min(0.95, prev.accuracyScore + (Math.random() * 0.02)),
        patternConfidence: Math.max(0.65, Math.min(0.92, prev.patternConfidence + (Math.random() * 0.04 - 0.02)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [streamingActive]);

  return (
    <div className="space-y-6">
      {/* Multi-Domain Data Fusion Header */}
      <AdaptiveLearningHeader 
        streamingActive={streamingActive}
        adaptiveLearning={adaptiveLearning}
      />

      {/* Multi-Domain Risk Scenarios */}
      {multiDomainRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Active Multi-Domain Convergence Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {multiDomainRisks.map((risk, index) => (
              <MultiDomainRiskCard key={index} risk={risk} index={index} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pile-Up Pattern Detection */}
      {pileUpPatterns.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Rare Pile-Up Pattern Alert
            </CardTitle>
            <div className="text-sm text-red-600">
              Detecting rare co-occurrences with exponential multiplier effects
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pileUpPatterns.map((pattern) => (
              <PileUpPatternAlert key={pattern.id} pattern={pattern} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Continuous Learning Status */}
      <ContinuousLearningStatus
        multiDomainRisksCount={multiDomainRisks.length}
        pileUpPatternsCount={pileUpPatterns.length}
        dataPoints={adaptiveLearning.dataPoints}
      />
    </div>
  );
};
