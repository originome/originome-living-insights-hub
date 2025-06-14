import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

export interface EnvironmentalVelocity {
  parameter: string;
  currentValue: number;
  velocity: number; // rate of change per hour
  acceleration: number; // rate of velocity change
  predictedValue24h: number;
  predictedValue7d: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
}

export interface RiskWindow {
  id: string;
  startTime: Date;
  endTime: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  probability: number;
  compoundFactors: string[];
  expectedImpact: string;
  mitigation: string[];
  confidence: number;
}

export interface ScenarioModel {
  id: string;
  name: string;
  description: string;
  parameters: {
    co2: { min: number; max: number; target: number };
    pm25: { min: number; max: number; target: number };
    temperature: { min: number; max: number; target: number };
    humidity: { min: number; max: number; target: number };
  };
  predictedOutcomes: {
    productivity: number;
    absenteeism: number;
    energyCosts: number;
    maintenanceNeeds: number;
  };
  timeframe: number; // days
  confidence: number;
}

export interface PredictiveAnalytics {
  velocityForecasts: EnvironmentalVelocity[];
  riskWindows: RiskWindow[];
  scenarioModels: ScenarioModel[];
  lastUpdated: Date;
}

export class PredictiveAnalyticsService {
  private static historicalData: Map<string, number[]> = new Map();
  private static forecastingModels: Map<string, any> = new Map();

  static generateEnvironmentalVelocityForecast(
    environmentalParams: EnvironmentalParams,
    externalData: ExternalData,
    cosmicData: CosmicData | null
  ): EnvironmentalVelocity[] {
    const forecasts: EnvironmentalVelocity[] = [];

    // CO2 velocity forecasting
    const co2History = this.getParameterHistory('co2', environmentalParams.co2);
    const co2Velocity = this.calculateVelocity(co2History);
    const co2Acceleration = this.calculateAcceleration(co2History);
    
    forecasts.push({
      parameter: 'CO₂ Concentration',
      currentValue: environmentalParams.co2,
      velocity: co2Velocity,
      acceleration: co2Acceleration,
      predictedValue24h: this.predictFutureValue(environmentalParams.co2, co2Velocity, 24),
      predictedValue7d: this.predictFutureValue(environmentalParams.co2, co2Velocity, 168),
      confidence: this.calculateConfidence(co2History),
      trend: this.determineTrend(co2Velocity, co2Acceleration)
    });

    // PM2.5 velocity forecasting
    const pm25History = this.getParameterHistory('pm25', environmentalParams.pm25);
    const pm25Velocity = this.calculateVelocity(pm25History);
    const pm25Acceleration = this.calculateAcceleration(pm25History);
    
    forecasts.push({
      parameter: 'PM2.5 Levels',
      currentValue: environmentalParams.pm25,
      velocity: pm25Velocity,
      acceleration: pm25Acceleration,
      predictedValue24h: this.predictFutureValue(environmentalParams.pm25, pm25Velocity, 24),
      predictedValue7d: this.predictFutureValue(environmentalParams.pm25, pm25Velocity, 168),
      confidence: this.calculateConfidence(pm25History),
      trend: this.determineTrend(pm25Velocity, pm25Acceleration)
    });

    // Temperature velocity forecasting
    const tempHistory = this.getParameterHistory('temperature', environmentalParams.temperature);
    const tempVelocity = this.calculateVelocity(tempHistory);
    const tempAcceleration = this.calculateAcceleration(tempHistory);
    
    forecasts.push({
      parameter: 'Temperature',
      currentValue: environmentalParams.temperature,
      velocity: tempVelocity,
      acceleration: tempAcceleration,
      predictedValue24h: this.predictFutureValue(environmentalParams.temperature, tempVelocity, 24),
      predictedValue7d: this.predictFutureValue(environmentalParams.temperature, tempVelocity, 168),
      confidence: this.calculateConfidence(tempHistory),
      trend: this.determineTrend(tempVelocity, tempAcceleration)
    });

    // Humidity velocity forecasting
    const humidityHistory = this.getParameterHistory('humidity', environmentalParams.humidity);
    const humidityVelocity = this.calculateVelocity(humidityHistory);
    const humidityAcceleration = this.calculateAcceleration(humidityHistory);
    
    forecasts.push({
      parameter: 'Humidity',
      currentValue: environmentalParams.humidity,
      velocity: humidityVelocity,
      acceleration: humidityAcceleration,
      predictedValue24h: this.predictFutureValue(environmentalParams.humidity, humidityVelocity, 24),
      predictedValue7d: this.predictFutureValue(environmentalParams.humidity, humidityVelocity, 168),
      confidence: this.calculateConfidence(humidityHistory),
      trend: this.determineTrend(humidityVelocity, humidityAcceleration)
    });

    return forecasts;
  }

  static generateRiskWindowPredictions(
    environmentalParams: EnvironmentalParams,
    externalData: ExternalData,
    cosmicData: CosmicData | null,
    buildingType: string
  ): RiskWindow[] {
    const riskWindows: RiskWindow[] = [];
    const now = new Date();

    // High CO2 + Poor Air Quality Risk Window
    if (environmentalParams.co2 > 700 && environmentalParams.pm25 > 15) {
      riskWindows.push({
        id: 'high_indoor_pollution',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        endTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
        riskLevel: 'high',
        probability: 0.78,
        compoundFactors: ['High CO₂', 'Poor Air Quality', 'Limited Ventilation'],
        expectedImpact: 'Reduced cognitive performance, increased fatigue, potential respiratory irritation',
        mitigation: ['Increase ventilation rates', 'Deploy air purifiers', 'Reduce occupancy temporarily'],
        confidence: 0.85
      });
    }

    // Geomagnetic Storm Risk Window
    if (cosmicData?.geomagnetic.kpIndex > 5) {
      riskWindows.push({
        id: 'geomagnetic_storm',
        startTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        endTime: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours from now
        riskLevel: 'moderate',
        probability: 0.65,
        compoundFactors: ['Geomagnetic Storm', 'Solar Activity', 'Electromagnetic Sensitivity'],
        expectedImpact: 'Potential equipment disruption, increased stress levels, circadian rhythm disruption',
        mitigation: ['Monitor sensitive equipment', 'Implement stress reduction protocols', 'Adjust lighting schedules'],
        confidence: 0.72
      });
    }

    // Temperature Extreme Risk Window
    const tempDeviation = Math.abs(environmentalParams.temperature - 21);
    if (tempDeviation > 4) {
      riskWindows.push({
        id: 'temperature_extreme',
        startTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
        endTime: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
        riskLevel: tempDeviation > 6 ? 'critical' : 'high',
        probability: 0.82,
        compoundFactors: ['Temperature Deviation', 'HVAC Stress', 'Occupant Discomfort'],
        expectedImpact: 'Thermal discomfort, reduced productivity, increased energy costs',
        mitigation: ['Adjust HVAC settings', 'Implement dress code flexibility', 'Monitor energy consumption'],
        confidence: 0.88
      });
    }

    return riskWindows.sort((a, b) => b.probability - a.probability);
  }

  static generateScenarioModels(
    currentParams: EnvironmentalParams,
    buildingType: string
  ): ScenarioModel[] {
    const scenarios: ScenarioModel[] = [];

    // Optimal Performance Scenario
    scenarios.push({
      id: 'optimal_performance',
      name: 'Optimal Performance Environment',
      description: 'Ideal environmental conditions for maximum productivity and well-being',
      parameters: {
        co2: { min: 400, max: 600, target: 500 },
        pm25: { min: 0, max: 10, target: 5 },
        temperature: { min: 20, max: 22, target: 21 },
        humidity: { min: 40, max: 50, target: 45 }
      },
      predictedOutcomes: {
        productivity: 98,
        absenteeism: 2.1,
        energyCosts: 85,
        maintenanceNeeds: 75
      },
      timeframe: 30,
      confidence: 0.92
    });

    // Energy Efficiency Scenario
    scenarios.push({
      id: 'energy_efficiency',
      name: 'Energy Efficiency Focus',
      description: 'Balanced approach prioritizing energy conservation while maintaining acceptable conditions',
      parameters: {
        co2: { min: 500, max: 800, target: 650 },
        pm25: { min: 5, max: 15, target: 10 },
        temperature: { min: 19, max: 24, target: 22 },
        humidity: { min: 35, max: 55, target: 45 }
      },
      predictedOutcomes: {
        productivity: 89,
        absenteeism: 4.2,
        energyCosts: 62,
        maintenanceNeeds: 80
      },
      timeframe: 30,
      confidence: 0.87
    });

    // Crisis Management Scenario
    scenarios.push({
      id: 'crisis_management',
      name: 'Crisis Management Mode',
      description: 'Emergency response scenario for extreme environmental conditions',
      parameters: {
        co2: { min: 800, max: 1200, target: 1000 },
        pm25: { min: 20, max: 50, target: 35 },
        temperature: { min: 16, max: 28, target: 22 },
        humidity: { min: 25, max: 70, target: 50 }
      },
      predictedOutcomes: {
        productivity: 65,
        absenteeism: 12.5,
        energyCosts: 120,
        maintenanceNeeds: 150
      },
      timeframe: 7,
      confidence: 0.78
    });

    return scenarios;
  }

  private static getParameterHistory(parameter: string, currentValue: number): number[] {
    const key = `${parameter}_history`;
    let history = this.historicalData.get(key) || [];
    
    // Add current value to history
    history.push(currentValue);
    
    // Keep only last 24 data points (simulating hourly data)
    if (history.length > 24) {
      history = history.slice(-24);
    }
    
    this.historicalData.set(key, history);
    return history;
  }

  private static calculateVelocity(history: number[]): number {
    if (history.length < 2) return 0;
    
    const recent = history.slice(-3); // Last 3 data points
    if (recent.length < 2) return 0;
    
    let totalVelocity = 0;
    for (let i = 1; i < recent.length; i++) {
      totalVelocity += recent[i] - recent[i - 1];
    }
    
    return totalVelocity / (recent.length - 1);
  }

  private static calculateAcceleration(history: number[]): number {
    if (history.length < 3) return 0;
    
    const velocities: number[] = [];
    for (let i = 1; i < history.length; i++) {
      velocities.push(history[i] - history[i - 1]);
    }
    
    if (velocities.length < 2) return 0;
    
    const recentVelocities = velocities.slice(-2);
    return recentVelocities[1] - recentVelocities[0];
  }

  private static predictFutureValue(current: number, velocity: number, hours: number): number {
    // Simple linear prediction with some randomness for realism
    const trend = velocity * hours;
    const uncertainty = Math.random() * 0.1 - 0.05; // ±5% uncertainty
    return Math.max(0, current + trend + (trend * uncertainty));
  }

  private static calculateConfidence(history: number[]): number {
    if (history.length < 5) return 0.5;
    
    // Calculate variance to determine confidence
    const mean = history.reduce((sum, val) => sum + val, 0) / history.length;
    const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length;
    const coefficient = Math.sqrt(variance) / mean;
    
    // Higher variance = lower confidence
    return Math.max(0.3, Math.min(0.95, 1 - coefficient));
  }

  private static determineTrend(velocity: number, acceleration: number): 'increasing' | 'decreasing' | 'stable' | 'volatile' {
    const velocityThreshold = 0.1;
    const accelerationThreshold = 0.05;
    
    if (Math.abs(acceleration) > accelerationThreshold) {
      return 'volatile';
    } else if (velocity > velocityThreshold) {
      return 'increasing';
    } else if (velocity < -velocityThreshold) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  static getFullPredictiveAnalytics(
    environmentalParams: EnvironmentalParams,
    externalData: ExternalData,
    cosmicData: CosmicData | null,
    buildingType: string
  ): PredictiveAnalytics {
    return {
      velocityForecasts: this.generateEnvironmentalVelocityForecast(environmentalParams, externalData, cosmicData),
      riskWindows: this.generateRiskWindowPredictions(environmentalParams, externalData, cosmicData, buildingType),
      scenarioModels: this.generateScenarioModels(environmentalParams, buildingType),
      lastUpdated: new Date()
    };
  }
}
