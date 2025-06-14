
export interface CrossSectorPattern {
  patternId: string;
  sectors: string[];
  correlationStrength: number;
  rippleEffect: {
    primarySector: string;
    secondarySectors: string[];
    impactDelay: number; // hours
    amplificationFactor: number;
  };
  historicalOccurrences: number;
  confidence: number;
  networkEffect: {
    customerCount: number;
    dataContribution: number;
    learningAcceleration: number;
  };
}

export interface EchoDetection {
  sourceEvent: {
    sector: string;
    eventType: string;
    location: { lat: number; lon: number };
    timestamp: Date;
    magnitude: number;
  };
  predictedEchoes: {
    targetSector: string;
    predictedDelay: number;
    expectedImpact: number;
    confidence: number;
    mitigationWindow: number; // hours
  }[];
  cascadeRisk: number;
}

export interface CorrelationLibrary {
  totalPatterns: number;
  activeCorrelations: number;
  networkCustomers: number;
  learningVelocity: number;
  accuracyImprovement: number;
  crossSectorInsights: string[];
}

export class CrossDomainCorrelationService {
  private static correlationDatabase: Map<string, CrossSectorPattern> = new Map();
  private static echoHistory: EchoDetection[] = [];
  private static networkCustomers = 0;

  static initializeCorrelationLibrary(): void {
    // Initialize known cross-sector patterns
    const knownPatterns: CrossSectorPattern[] = [
      {
        patternId: 'healthcare_education_viral',
        sectors: ['healthcare', 'education'],
        correlationStrength: 0.87,
        rippleEffect: {
          primarySector: 'healthcare',
          secondarySectors: ['education', 'office'],
          impactDelay: 24,
          amplificationFactor: 1.4
        },
        historicalOccurrences: 23,
        confidence: 0.89,
        networkEffect: {
          customerCount: 15,
          dataContribution: 0.73,
          learningAcceleration: 1.2
        }
      },
      {
        patternId: 'manufacturing_logistics_pollution',
        sectors: ['manufacturing', 'logistics', 'retail'],
        correlationStrength: 0.75,
        rippleEffect: {
          primarySector: 'manufacturing',
          secondarySectors: ['logistics', 'retail'],
          impactDelay: 12,
          amplificationFactor: 1.8
        },
        historicalOccurrences: 34,
        confidence: 0.82,
        networkEffect: {
          customerCount: 8,
          dataContribution: 0.65,
          learningAcceleration: 0.9
        }
      },
      {
        patternId: 'office_retail_hvac_cascade',
        sectors: ['office', 'retail', 'hospitality'],
        correlationStrength: 0.69,
        rippleEffect: {
          primarySector: 'office',
          secondarySectors: ['retail', 'hospitality'],
          impactDelay: 6,
          amplificationFactor: 1.1
        },
        historicalOccurrences: 18,
        confidence: 0.76,
        networkEffect: {
          customerCount: 22,
          dataContribution: 0.81,
          learningAcceleration: 1.5
        }
      }
    ];

    knownPatterns.forEach(pattern => {
      this.correlationDatabase.set(pattern.patternId, pattern);
    });

    this.networkCustomers = 45; // Simulated network size
  }

  static detectCrossSectorPatterns(
    currentSector: string,
    environmentalData: any,
    buildingType: string
  ): CrossSectorPattern[] {
    const relevantPatterns = Array.from(this.correlationDatabase.values())
      .filter(pattern => pattern.sectors.includes(currentSector))
      .sort((a, b) => b.correlationStrength - a.correlationStrength);

    // Enhanced pattern detection based on current conditions
    return relevantPatterns.map(pattern => {
      // Adjust confidence based on current environmental stress
      const environmentalStressFactor = this.calculateEnvironmentalStress(environmentalData);
      const adjustedConfidence = Math.min(0.95, 
        pattern.confidence * (1 + environmentalStressFactor * 0.2)
      );

      return {
        ...pattern,
        confidence: adjustedConfidence,
        networkEffect: {
          ...pattern.networkEffect,
          customerCount: this.networkCustomers,
          learningAcceleration: Math.min(2.0, 
            pattern.networkEffect.learningAcceleration * (this.networkCustomers / 30)
          )
        }
      };
    });
  }

  static predictEchoEffects(
    sourceEvent: any,
    currentSector: string
  ): EchoDetection {
    const relevantPatterns = this.detectCrossSectorPatterns(currentSector, sourceEvent, '');
    
    const predictedEchoes = relevantPatterns.flatMap(pattern => 
      pattern.rippleEffect.secondarySectors.map(targetSector => ({
        targetSector,
        predictedDelay: pattern.rippleEffect.impactDelay + (Math.random() * 6),
        expectedImpact: sourceEvent.magnitude * pattern.rippleEffect.amplificationFactor,
        confidence: pattern.confidence * 0.9,
        mitigationWindow: pattern.rippleEffect.impactDelay * 0.7
      }))
    );

    const cascadeRisk = predictedEchoes.reduce((risk, echo) => 
      risk + (echo.expectedImpact * echo.confidence), 0
    ) / predictedEchoes.length;

    const echoDetection: EchoDetection = {
      sourceEvent: {
        sector: currentSector,
        eventType: 'environmental_stress',
        location: { lat: 40.7128, lon: -74.0060 }, // Default to NYC
        timestamp: new Date(),
        magnitude: sourceEvent.magnitude || 50
      },
      predictedEchoes,
      cascadeRisk: Math.min(100, cascadeRisk)
    };

    this.echoHistory.push(echoDetection);
    return echoDetection;
  }

  static updateCorrelationLibrary(
    newCustomerData: any,
    sector: string,
    outcomes: any
  ): void {
    this.networkCustomers += 1;
    
    // Update existing patterns with new data
    Array.from(this.correlationDatabase.values()).forEach(pattern => {
      if (pattern.sectors.includes(sector)) {
        pattern.networkEffect.customerCount = this.networkCustomers;
        pattern.networkEffect.dataContribution += 0.01;
        pattern.networkEffect.learningAcceleration = Math.min(2.0,
          pattern.networkEffect.learningAcceleration * 1.02
        );
      }
    });

    // Detect new patterns if network effect threshold reached
    if (this.networkCustomers > 50 && Math.random() > 0.7) {
      this.generateNewCorrelationPattern(sector, newCustomerData);
    }
  }

  static getCorrelationLibraryStatus(): CorrelationLibrary {
    const patterns = Array.from(this.correlationDatabase.values());
    
    return {
      totalPatterns: patterns.length,
      activeCorrelations: patterns.filter(p => p.confidence > 0.7).length,
      networkCustomers: this.networkCustomers,
      learningVelocity: patterns.reduce((sum, p) => 
        sum + p.networkEffect.learningAcceleration, 0) / patterns.length,
      accuracyImprovement: patterns.reduce((sum, p) => 
        sum + p.networkEffect.dataContribution, 0) / patterns.length,
      crossSectorInsights: this.generateCrossSectorInsights(patterns)
    };
  }

  private static calculateEnvironmentalStress(data: any): number {
    let stressScore = 0;
    
    if (data.pm25 > 25) stressScore += 0.3;
    if (data.co2 > 800) stressScore += 0.2;
    if (Math.abs(data.temperature - 21) > 3) stressScore += 0.2;
    if (data.humidity > 60 || data.humidity < 30) stressScore += 0.1;
    
    return Math.min(1.0, stressScore);
  }

  private static generateNewCorrelationPattern(sector: string, data: any): void {
    const newPatternId = `${sector}_auto_${Date.now()}`;
    const potentialSecondarySectors = ['office', 'retail', 'healthcare', 'education', 'manufacturing']
      .filter(s => s !== sector);
    
    const randomSecondarySector = potentialSecondarySectors[
      Math.floor(Math.random() * potentialSecondarySectors.length)
    ];

    const newPattern: CrossSectorPattern = {
      patternId: newPatternId,
      sectors: [sector, randomSecondarySector],
      correlationStrength: 0.6 + Math.random() * 0.2,
      rippleEffect: {
        primarySector: sector,
        secondarySectors: [randomSecondarySector],
        impactDelay: 6 + Math.random() * 18,
        amplificationFactor: 1.0 + Math.random() * 0.5
      },
      historicalOccurrences: 1,
      confidence: 0.65,
      networkEffect: {
        customerCount: this.networkCustomers,
        dataContribution: 0.1,
        learningAcceleration: 1.0
      }
    };

    this.correlationDatabase.set(newPatternId, newPattern);
  }

  private static generateCrossSectorInsights(patterns: CrossSectorPattern[]): string[] {
    const insights: string[] = [];
    
    if (patterns.length > 10) {
      insights.push('Rich cross-sector pattern library enabling predictive cascading analysis');
    }
    
    const avgCorrelation = patterns.reduce((sum, p) => sum + p.correlationStrength, 0) / patterns.length;
    if (avgCorrelation > 0.75) {
      insights.push('Strong inter-sector correlations detected - high prediction accuracy');
    }
    
    if (this.networkCustomers > 30) {
      insights.push(`Network effect active: ${this.networkCustomers} customers contributing to pattern recognition`);
    }
    
    return insights;
  }

  static getEchoHistory(): EchoDetection[] {
    return this.echoHistory.slice(-10); // Return last 10 echo detections
  }
}
