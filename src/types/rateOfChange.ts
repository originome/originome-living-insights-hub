
export interface AccelerationPattern {
  parameter: string;
  velocity: number;
  acceleration: number;
  jerk: number; // third derivative
  suddenChange: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  alertType: 'velocity' | 'acceleration' | 'jerk' | 'sudden_shift';
}

export interface FirstDerivativeAlert {
  id: string;
  parameter: string;
  derivativeValue: number;
  alertReason: string;
  riskWindow: string;
  criticalityScore: number;
}

export interface DataPoint {
  timestamp: string;
  co2: number;
  pm25: number;
  temperature: number;
  humidity: number;
  velocity_co2: number;
  velocity_pm25: number;
  acceleration_co2: number;
  acceleration_pm25: number;
  jerk_co2: number;
  pressure?: number;
  electromagnetic?: number;
}
