
import { AccelerationPattern, FirstDerivativeAlert, DataPoint } from '@/types/rateOfChange';

export const analyzeAccelerationPatterns = (historicalData: DataPoint[]): AccelerationPattern[] => {
  if (historicalData.length < 4) return [];

  const patterns: AccelerationPattern[] = [];
  const latest = historicalData[historicalData.length - 1];
  const previous = historicalData[historicalData.length - 2];

  // CO2 acceleration analysis
  const co2SuddenChange = Math.abs(latest.velocity_co2) > 50;
  patterns.push({
    parameter: 'CO₂ Concentration',
    velocity: latest.velocity_co2,
    acceleration: latest.acceleration_co2,
    jerk: latest.jerk_co2,
    suddenChange: co2SuddenChange,
    riskLevel: co2SuddenChange ? 'critical' : 
              Math.abs(latest.acceleration_co2) > 10 ? 'high' : 
              Math.abs(latest.acceleration_co2) > 5 ? 'moderate' : 'low',
    alertType: co2SuddenChange ? 'sudden_shift' : 
              Math.abs(latest.jerk_co2) > 8 ? 'jerk' : 
              Math.abs(latest.acceleration_co2) > 5 ? 'acceleration' : 'velocity'
  });

  // PM2.5 acceleration analysis
  const pm25SuddenChange = Math.abs(latest.velocity_pm25) > 8;
  patterns.push({
    parameter: 'PM2.5 Levels',
    velocity: latest.velocity_pm25,
    acceleration: latest.acceleration_pm25,
    jerk: 0, // Simplified for PM2.5
    suddenChange: pm25SuddenChange,
    riskLevel: pm25SuddenChange ? 'critical' : 
              Math.abs(latest.acceleration_pm25) > 2 ? 'high' : 
              Math.abs(latest.acceleration_pm25) > 1 ? 'moderate' : 'low',
    alertType: pm25SuddenChange ? 'sudden_shift' : 
              Math.abs(latest.acceleration_pm25) > 1.5 ? 'acceleration' : 'velocity'
  });

  // Atmospheric pressure jumps
  if (latest.pressure && previous.pressure) {
    const pressureVelocity = latest.pressure - previous.pressure;
    const pressureSuddenChange = Math.abs(pressureVelocity) > 5;
    patterns.push({
      parameter: 'Atmospheric Pressure',
      velocity: pressureVelocity,
      acceleration: 0, // Simplified
      jerk: 0,
      suddenChange: pressureSuddenChange,
      riskLevel: pressureSuddenChange ? 'high' : 
                Math.abs(pressureVelocity) > 3 ? 'moderate' : 'low',
      alertType: pressureSuddenChange ? 'sudden_shift' : 'velocity'
    });
  }

  // Electromagnetic field variations
  if (latest.electromagnetic && previous.electromagnetic) {
    const emVelocity = latest.electromagnetic - previous.electromagnetic;
    const emSuddenChange = Math.abs(emVelocity) > 15;
    patterns.push({
      parameter: 'EM Field Intensity',
      velocity: emVelocity,
      acceleration: 0,
      jerk: 0,
      suddenChange: emSuddenChange,
      riskLevel: emSuddenChange ? 'high' : 'low',
      alertType: emSuddenChange ? 'sudden_shift' : 'velocity'
    });
  }

  return patterns.filter(p => p.riskLevel !== 'low');
};

export const generateFirstDerivativeAlerts = (accelerationPatterns: AccelerationPattern[]): FirstDerivativeAlert[] => {
  const alerts: FirstDerivativeAlert[] = [];

  accelerationPatterns.forEach((pattern, index) => {
    if (pattern.riskLevel === 'critical' || pattern.riskLevel === 'high') {
      alerts.push({
        id: `alert_${index}`,
        parameter: pattern.parameter,
        derivativeValue: pattern.alertType === 'acceleration' ? pattern.acceleration : pattern.velocity,
        alertReason: pattern.suddenChange ? 
          `Sudden ${pattern.velocity > 0 ? 'spike' : 'drop'} detected` :
          `${pattern.alertType} threshold exceeded`,
        riskWindow: pattern.suddenChange ? '5-15 minutes' : '15-30 minutes',
        criticalityScore: pattern.riskLevel === 'critical' ? 95 : 75
      });
    }
  });

  return alerts.sort((a, b) => b.criticalityScore - a.criticalityScore);
};
