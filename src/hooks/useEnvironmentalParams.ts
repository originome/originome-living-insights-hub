
import { useState } from 'react';

export interface EnvironmentalParams {
  co2: number;
  pm25: number;
  temperature: number;
  light: number;
  noise: number;
  humidity: number;
}

export const useEnvironmentalParams = () => {
  const [environmentalParams, setEnvironmentalParams] = useState<EnvironmentalParams>({
    co2: 800,
    pm25: 25,
    temperature: 22,
    light: 500,
    noise: 45,
    humidity: 45
  });

  const handleParamChange = (param: string, value: number) => {
    setEnvironmentalParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return {
    environmentalParams,
    handleParamChange
  };
};
