import { useState, useEffect } from 'react';
import { DataPoint } from '@/types/rateOfChange';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';

export const useRateOfChangeData = (
  environmentalParams: EnvironmentalParams,
  externalData: ExternalData
) => {
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [streamingActive, setStreamingActive] = useState(true);
  const [processingRate, setProcessingRate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!streamingActive) return;

      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      
      // Simulate realistic variations with occasional sudden changes
      const suddenChangeEvent = Math.random() < 0.05; // 5% chance of sudden change
      const co2Variation = suddenChangeEvent ? (Math.random() - 0.5) * 200 : (Math.random() - 0.5) * 30;
      const pm25Variation = suddenChangeEvent ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 3;
      
      const newPoint: DataPoint = {
        timestamp,
        co2: Math.max(300, environmentalParams.co2 + co2Variation),
        pm25: Math.max(0, environmentalParams.pm25 + pm25Variation),
        temperature: environmentalParams.temperature + (Math.random() - 0.5) * 1.5,
        humidity: Math.max(0, Math.min(100, environmentalParams.humidity + (Math.random() - 0.5) * 4)),
        pressure: externalData.weather?.pressure ? externalData.weather.pressure + (Math.random() - 0.5) * 10 : 1013,
        electromagnetic: Math.random() * 100 + 50, // Simulated EM field data
        velocity_co2: 0,
        velocity_pm25: 0,
        acceleration_co2: 0,
        acceleration_pm25: 0,
        jerk_co2: 0
      };

      setHistoricalData(prev => {
        const updated = [...prev, newPoint];
        
        // Calculate first, second, and third derivatives
        if (updated.length >= 2) {
          const current = updated[updated.length - 1];
          const previous = updated[updated.length - 2];
          
          // First derivative (velocity)
          current.velocity_co2 = current.co2 - previous.co2;
          current.velocity_pm25 = current.pm25 - previous.pm25;
          
          if (updated.length >= 3) {
            const prevPrevious = updated[updated.length - 3];
            
            // Second derivative (acceleration)
            current.acceleration_co2 = current.velocity_co2 - (previous.co2 - prevPrevious.co2);
            current.acceleration_pm25 = current.velocity_pm25 - (previous.pm25 - prevPrevious.pm25);
            
            if (updated.length >= 4) {
              const prevPrevPrevious = updated[updated.length - 4];
              
              // Third derivative (jerk)
              const prevAcceleration_co2 = previous.velocity_co2 - (prevPrevious.co2 - prevPrevPrevious.co2);
              current.jerk_co2 = current.acceleration_co2 - prevAcceleration_co2;
            }
          }
        }
        
        // Update processing rate
        setProcessingRate(updated.length);
        
        // Keep only last 25 points for performance
        return updated.slice(-25);
      });
    }, 2000); // Process every 2 seconds for high-frequency analysis

    return () => clearInterval(interval);
  }, [environmentalParams, externalData, streamingActive]);

  return {
    historicalData,
    streamingActive,
    setStreamingActive,
    processingRate
  };
};
