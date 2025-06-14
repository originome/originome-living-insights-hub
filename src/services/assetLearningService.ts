
export interface AssetFingerprint {
  assetId: string;
  buildingType: string;
  location: { lat: number; lon: number };
  vulnerabilitySignature: {
    hvacSensitivity: number;
    thermalInertia: number;
    airQualityResponse: number;
    humidityTolerance: number;
    occupantSensitivity: number;
  };
  operationalHistory: {
    totalDays: number;
    avgTemperature: number;
    avgHumidity: number;
    avgAirQuality: number;
    incidentCount: number;
    maintenanceEvents: number;
  };
  riskProfile: {
    currentRisk: number;
    predictedRisk: number;
    riskTrend: 'improving' | 'stable' | 'degrading';
    criticalThresholds: Record<string, number>;
  };
  learningMetrics: {
    dataPoints: number;
    accuracyScore: number;
    lastUpdated: Date;
    learningVelocity: number;
  };
}

export interface DynamicAssetCard {
  assetId: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  currentExposure: {
    temperature: number;
    humidity: number;
    airQuality: number;
    noise: number;
  };
  riskProbability: {
    next24h: number;
    next7days: number;
    next30days: number;
  };
  predictiveInsights: string[];
  recommendedActions: string[];
  confidenceLevel: number;
}

export class AssetLearningService {
  private static assetDatabase: Map<string, AssetFingerprint> = new Map();
  private static learningInterval = 30; // days

  static createAssetFingerprint(
    assetId: string,
    buildingType: string,
    location: { lat: number; lon: number }
  ): AssetFingerprint {
    const fingerprint: AssetFingerprint = {
      assetId,
      buildingType,
      location,
      vulnerabilitySignature: {
        hvacSensitivity: 0.5 + Math.random() * 0.5,
        thermalInertia: 0.3 + Math.random() * 0.4,
        airQualityResponse: 0.4 + Math.random() * 0.6,
        humidityTolerance: 0.2 + Math.random() * 0.8,
        occupantSensitivity: 0.3 + Math.random() * 0.7
      },
      operationalHistory: {
        totalDays: Math.floor(Math.random() * 365) + 30,
        avgTemperature: 20 + Math.random() * 5,
        avgHumidity: 40 + Math.random() * 30,
        avgAirQuality: 10 + Math.random() * 40,
        incidentCount: Math.floor(Math.random() * 10),
        maintenanceEvents: Math.floor(Math.random() * 5) + 1
      },
      riskProfile: {
        currentRisk: Math.random() * 100,
        predictedRisk: Math.random() * 100,
        riskTrend: ['improving', 'stable', 'degrading'][Math.floor(Math.random() * 3)] as any,
        criticalThresholds: {
          temperature: 25 + Math.random() * 5,
          humidity: 60 + Math.random() * 20,
          airQuality: 50 + Math.random() * 50,
          noise: 55 + Math.random() * 15
        }
      },
      learningMetrics: {
        dataPoints: Math.floor(Math.random() * 1000) + 100,
        accuracyScore: 0.6 + Math.random() * 0.3,
        lastUpdated: new Date(),
        learningVelocity: Math.random() * 10 + 2
      }
    };

    this.assetDatabase.set(assetId, fingerprint);
    return fingerprint;
  }

  static updateAssetLearning(
    assetId: string,
    currentConditions: any,
    observedOutcomes: any
  ): AssetFingerprint | null {
    const asset = this.assetDatabase.get(assetId);
    if (!asset) return null;

    // Update vulnerability signatures based on observed responses
    const learningRate = 0.05; // 5% learning rate
    
    if (observedOutcomes.hvacFailure) {
      asset.vulnerabilitySignature.hvacSensitivity += learningRate;
    }
    
    if (observedOutcomes.occupantComplaints > 2) {
      asset.vulnerabilitySignature.occupantSensitivity += learningRate;
    }

    // Update operational history
    asset.operationalHistory.totalDays += 1;
    asset.learningMetrics.dataPoints += 1;
    asset.learningMetrics.accuracyScore = Math.min(0.95, 
      asset.learningMetrics.accuracyScore + (Math.random() * 0.01)
    );
    asset.learningMetrics.lastUpdated = new Date();

    // Recalculate risk profile
    asset.riskProfile.currentRisk = this.calculateRiskScore(asset, currentConditions);
    asset.riskProfile.predictedRisk = this.predictFutureRisk(asset, currentConditions);

    this.assetDatabase.set(assetId, asset);
    return asset;
  }

  static generateDynamicAssetCard(
    assetId: string,
    currentConditions: any
  ): DynamicAssetCard | null {
    const asset = this.assetDatabase.get(assetId);
    if (!asset) return null;

    const currentRisk = this.calculateRiskScore(asset, currentConditions);
    
    return {
      assetId,
      name: `${asset.buildingType} Asset ${assetId.slice(-4)}`,
      status: currentRisk > 80 ? 'critical' : currentRisk > 60 ? 'warning' : 'optimal',
      currentExposure: {
        temperature: currentConditions.temperature || 22,
        humidity: currentConditions.humidity || 50,
        airQuality: currentConditions.pm25 || 15,
        noise: currentConditions.noise || 45
      },
      riskProbability: {
        next24h: Math.min(100, currentRisk * 0.8),
        next7days: Math.min(100, currentRisk * 1.2),
        next30days: Math.min(100, currentRisk * 1.5)
      },
      predictiveInsights: this.generatePredictiveInsights(asset, currentConditions),
      recommendedActions: this.generateRecommendations(asset, currentConditions),
      confidenceLevel: asset.learningMetrics.accuracyScore * 100
    };
  }

  private static calculateR asset, conditions: any): number {
    let riskScore = 0;
    
    // Temperature risk
    const tempDiff = Math.abs(conditions.temperature - asset.riskProfile.criticalThresholds.temperature);
    riskScore += tempDiff * asset.vulnerabilitySignature.thermalInertia * 10;
    
    // Air quality risk
    const aqRisk = (conditions.pm25 || 0) * asset.vulnerabilitySignature.airQualityResponse * 2;
    riskScore += aqRisk;
    
    // Humidity risk
    const humidityRisk = Math.abs(conditions.humidity - 50) * asset.vulnerabilitySignature.humidityTolerance * 1.5;
    riskScore += humidityRisk;

    return Math.min(100, riskScore);
  }

  private static predictFutureRisk(asset: AssetFingerprint, conditions: any): number {
    const currentRisk = this.calculateRiskScore(asset, conditions);
    const trendMultiplier = asset.riskProfile.riskTrend === 'degrading' ? 1.3 : 
                           asset.riskProfile.riskTrend === 'improving' ? 0.8 : 1.0;
    
    return Math.min(100, currentRisk * trendMultiplier);
  }

  private static generatePredictiveInsights(asset: AssetFingerprint, conditions: any): string[] {
    const insights: string[] = [];
    
    if (asset.vulnerabilitySignature.hvacSensitivity > 0.7) {
      insights.push('HVAC system showing high sensitivity to temperature variations');
    }
    
    if (asset.riskProfile.riskTrend === 'degrading') {
      insights.push('Risk profile showing degradation over past 30 days');
    }
    
    if (asset.learningMetrics.accuracyScore > 0.8) {
      insights.push('High-confidence predictions based on extensive operational data');
    }

    return insights;
  }

  private static generateRecommendations(asset: AssetFingerprint, conditions: any): string[] {
    const recommendations: string[] = [];
    
    if (conditions.temperature > asset.riskProfile.criticalThresholds.temperature) {
      recommendations.push('Immediate cooling intervention recommended');
    }
    
    if (asset.operationalHistory.incidentCount > 5) {
      recommendations.push('Schedule preventive maintenance review');
    }
    
    if (asset.vulnerabilitySignature.occupantSensitivity > 0.6) {
      recommendations.push('Enhanced environmental monitoring for occupant comfort');
    }

    return recommendations;
  }

  static getAllAssets(): AssetFingerprint[] {
    return Array.from(this.assetDatabase.values());
  }
}
