
import { DataEstimationUtils } from '../utils/dataEstimationUtils';

export interface HealthSurveillanceData {
  viralActivity: 'Low' | 'Medium' | 'High';
  respiratoryIllness: number;
  fluActivity: 'Minimal' | 'Low' | 'Moderate' | 'High';
  riskLevel: number;
}

export class HealthSurveillanceService {
  static async fetchHealthSurveillance(
    region: string, 
    country: string, 
    buildingType?: string, 
    populationGroup?: string
  ): Promise<HealthSurveillanceData | null> {
    try {
      // Enhanced health surveillance with building/population context
      const currentMonth = new Date().getMonth();
      const isWinterMonth = currentMonth >= 10 || currentMonth <= 2;
      
      // Building type risk factors
      const buildingRiskFactors = {
        'school': 1.3, // Higher transmission in schools
        'healthcare': 1.2,
        'office': 1.0,
        'residential': 0.8,
        'retail': 1.1,
        'warehouse': 0.7,
        'hospitality': 1.4,
        'laboratory': 0.9
      };
      
      // Population group risk factors
      const populationRiskFactors = {
        'children': 1.2,
        'elderly': 1.4,
        'vulnerable': 1.5,
        'students': 1.1,
        'adults': 1.0,
        'mixed': 1.1
      };
      
      const buildingFactor = buildingRiskFactors[buildingType as keyof typeof buildingRiskFactors] || 1.0;
      const populationFactor = populationRiskFactors[populationGroup as keyof typeof populationRiskFactors] || 1.0;
      const combinedFactor = (buildingFactor + populationFactor) / 2;
      
      let baseViralLevel = isWinterMonth ? 2 : 1; // 0=Low, 1=Medium, 2=High
      baseViralLevel = Math.min(2, Math.round(baseViralLevel * combinedFactor));
      
      const viralLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
      const fluLevels: Array<'Minimal' | 'Low' | 'Moderate' | 'High'> = ['Minimal', 'Low', 'Moderate', 'High'];
      
      const viralActivity = viralLevels[baseViralLevel];
      const fluActivity = isWinterMonth ? 
        fluLevels[Math.min(3, baseViralLevel + 1)] : 
        fluLevels[Math.max(0, baseViralLevel - 1)];
      
      // Use consistent seed for health data too
      const healthSeed = DataEstimationUtils.simpleHash(`health_${region}_${buildingType}_${populationGroup}`);
      
      return {
        viralActivity,
        respiratoryIllness: Math.round(DataEstimationUtils.seededRandom(healthSeed, 5, 15) * combinedFactor),
        fluActivity,
        riskLevel: Math.round(DataEstimationUtils.seededRandom(healthSeed + 1, 3, 8) * combinedFactor)
      };
    } catch (err) {
      console.error('Health surveillance fetch error:', err);
      return null;
    }
  }
}
