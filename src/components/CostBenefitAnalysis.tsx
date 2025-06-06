
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';
import { ExternalData } from '@/hooks/useApiIntegration';
import { LiteratureService } from '@/services/literatureService';

interface CostBenefitAnalysisProps {
  environmentalParams: {
    co2: number;
    pm25: number;
    temperature: number;
    light: number;
    noise: number;
    humidity: number;
  };
  externalData: ExternalData;
  buildingType: string;
}

export const CostBenefitAnalysis: React.FC<CostBenefitAnalysisProps> = ({
  environmentalParams,
  externalData,
  buildingType
}) => {
  const analysis = useMemo(() => {
    // Use real location data for cost calculations
    const location = externalData.location;
    const effectiveOutdoorPM25 = externalData.airQuality?.pm25 || 25;
    const effectiveOutdoorAQI = externalData.airQuality?.aqi || 50;
    const effectiveTemperature = externalData.weather?.temperature || environmentalParams.temperature;
    
    console.log('Cost-benefit calculation inputs:', {
      location: location?.city,
      outdoorAQI: effectiveOutdoorAQI,
      outdoorPM25: effectiveOutdoorPM25,
      buildingType,
      indoorParams: environmentalParams
    });

    // Location-specific salary data (Bureau of Labor Statistics 2024)
    const locationSalaryMultipliers = {
      'California': 1.4,  // San Francisco, Los Angeles
      'New York': 1.35,   // NYC
      'Illinois': 1.1,    // Chicago
      'Texas': 1.0,       // Dallas, Houston
      'Florida': 0.9,     // Miami, Tampa
      'North Carolina': 0.85, // Charlotte
      'default': 1.0
    };

    const salaryMultiplier = locationSalaryMultipliers[location?.region as keyof typeof locationSalaryMultipliers] || locationSalaryMultipliers.default;

    // Evidence-based productivity value adjusted for location
    const baseProductivity = LiteratureService.calculateProductivityValue(buildingType, 'adults');
    const locationAdjustedProductivity = baseProductivity * salaryMultiplier;

    // Calculate impacts using real outdoor data
    const buildingFilterEfficiency = {
      'office': 0.7, 'school': 0.6, 'healthcare': 0.8, 'residential': 0.4,
      'retail': 0.5, 'warehouse': 0.3, 'hospitality': 0.6, 'laboratory': 0.9
    };
    
    const filterEff = buildingFilterEfficiency[buildingType as keyof typeof buildingFilterEfficiency] || 0.5;
    const effectiveIndoorPM25 = Math.max(
      environmentalParams.pm25,
      effectiveOutdoorPM25 * (1 - filterEff)
    );

    // Literature-based impact calculations
    const cognitiveImpact = Math.abs(LiteratureService.calculateCognitiveImpact(environmentalParams.co2));
    const pm25Impact = LiteratureService.calculatePM25Impact(effectiveIndoorPM25);
    const temperatureImpact = Math.abs(LiteratureService.calculateTemperatureImpact(effectiveTemperature, buildingType));
    const lightingImpact = LiteratureService.calculateLightingImpact(environmentalParams.light, buildingType);

    // Total productivity impact
    const totalProductivityImpact = cognitiveImpact + Math.abs(pm25Impact.cognitive) + temperatureImpact + Math.abs(lightingImpact);
    
    // Annual costs calculations
    const annualProductivityLoss = locationAdjustedProductivity * (totalProductivityImpact / 100);
    
    // Healthcare costs with location adjustments
    const locationHealthcareMultipliers = {
      'California': 1.5, 'New York': 1.4, 'Illinois': 1.2, 'Texas': 1.0, 
      'Florida': 1.1, 'default': 1.0
    };
    const healthcareMultiplier = locationHealthcareMultipliers[location?.region as keyof typeof locationHealthcareMultipliers] || 1.0;
    
    const baseHealthcareCost = Math.abs(pm25Impact.health) * 200; // $/year per % health risk
    const annualHealthcareCost = baseHealthcareCost * healthcareMultiplier;
    
    // Absenteeism costs with seasonal adjustments
    const seasonalFactor = new Date().getMonth() >= 10 || new Date().getMonth() <= 2 ? 1.3 : 1.0;
    const viralActivity = externalData.healthSurveillance?.viralActivity || 'Low';
    const viralMultiplier = { 'Low': 1, 'Medium': 1.3, 'High': 1.6 }[viralActivity];
    
    const absenteeismRate = Math.abs(pm25Impact.health) * 0.4 * seasonalFactor * viralMultiplier;
    const annualAbsenteeismCost = locationAdjustedProductivity * (absenteeismRate / 100) * 0.3;
    
    const totalAnnualLoss = annualProductivityLoss + annualHealthcareCost + annualAbsenteeismCost;

    // Implementation costs with location adjustments
    const locationCostMultipliers = {
      'California': 1.3, 'New York': 1.25, 'Illinois': 1.1, 'Texas': 0.95,
      'Florida': 1.0, 'default': 1.0
    };
    const costMultiplier = locationCostMultipliers[location?.region as keyof typeof locationCostMultipliers] || 1.0;

    // Calculate needed improvements
    const optimalTargets = {
      co2: 600,
      pm25: Math.min(10, effectiveOutdoorPM25 * 0.5), // Can't be better than 50% of outdoor
      temperature: buildingType === 'school' ? 20 : 21,
      light: buildingType === 'school' ? 750 : 500
    };

    const co2Improvement = Math.max(0, environmentalParams.co2 - optimalTargets.co2);
    const pm25Improvement = Math.max(0, effectiveIndoorPM25 - optimalTargets.pm25);
    const tempImprovement = Math.abs(effectiveTemperature - optimalTargets.temperature);
    const lightImprovement = Math.max(0, optimalTargets.light - environmentalParams.light);

    // Location-adjusted implementation costs
    const ventilationCost = co2Improvement > 200 ? (co2Improvement * 0.8 * costMultiplier) : 0;
    const filtrationCost = pm25Improvement > 5 ? (pm25Improvement * 120 * costMultiplier) : 0;
    const hvacOptimization = tempImprovement > 2 ? (tempImprovement * 300 * costMultiplier) : 0;
    const lightingUpgrade = lightImprovement > 100 ? (lightImprovement * 0.6 * costMultiplier) : 0;
    
    const totalImplementationCost = ventilationCost + filtrationCost + hvacOptimization + lightingUpgrade;

    // Potential savings (85% improvement based on literature)
    const optimizationEfficiency = 0.85;
    const potentialSavings = totalAnnualLoss * optimizationEfficiency;

    // ROI calculation
    const monthsToROI = totalImplementationCost > 0 ? (totalImplementationCost / (potentialSavings / 12)) : 0;

    const result = {
      productivityLoss: Math.round(annualProductivityLoss),
      healthcareCost: Math.round(annualHealthcareCost),
      absenteeismCost: Math.round(annualAbsenteeismCost),
      totalLoss: Math.round(totalAnnualLoss),
      potentialSavings: Math.round(potentialSavings),
      implementationCost: Math.round(totalImplementationCost),
      roiMonths: monthsToROI,
      breakdownCosts: {
        ventilation: Math.round(ventilationCost),
        filtration: Math.round(filtrationCost),
        hvac: Math.round(hvacOptimization),
        lighting: Math.round(lightingUpgrade)
      }
    };

    console.log('Cost-benefit analysis result:', result);
    return result;
  }, [environmentalParams, externalData, buildingType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getROIColor = (months: number) => {
    if (months <= 6) return 'text-green-600';
    if (months <= 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          Cost-Benefit Analysis
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            Per occupant annually
          </Badge>
          {externalData.location && (
            <Badge variant="outline" className="text-xs">
              {externalData.location.city}, {externalData.location.region}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Costs */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Productivity Loss
            </span>
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(analysis.productivityLoss)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              Healthcare Costs
            </span>
            <span className="text-lg font-semibold text-orange-600">
              {formatCurrency(analysis.healthcareCost)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              Absenteeism Costs
            </span>
            <span className="text-lg font-semibold text-yellow-600">
              {formatCurrency(analysis.absenteeismCost)}
            </span>
          </div>
        </div>

        {/* Potential Improvements */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border">
            <span className="text-sm text-gray-600">Potential Annual Savings</span>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(analysis.potentialSavings)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border">
            <span className="text-sm text-gray-600">Implementation Cost</span>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(analysis.implementationCost)}
            </span>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-lg border">
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                ROI Timeline
              </div>
              {analysis.implementationCost > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Break-even analysis
                </div>
              )}
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${getROIColor(analysis.roiMonths)}`}>
                {analysis.implementationCost > 0 ? (
                  analysis.roiMonths < 1 ? '< 1 month' : `${analysis.roiMonths.toFixed(1)} months`
                ) : (
                  'Immediate'
                )}
              </div>
              {analysis.implementationCost > 0 && (
                <div className="text-xs text-gray-600">
                  {((analysis.potentialSavings / analysis.implementationCost) * 100).toFixed(0)}% annual ROI
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Environmental Data Summary */}
        {externalData.airQuality && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Environmental Factors:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>Outdoor AQI: {externalData.airQuality.aqi}</div>
              <div>Outdoor PM2.5: {externalData.airQuality.pm25} μg/m³</div>
              <div>Temperature: {externalData.weather?.temperature || '--'}°C</div>
              <div>Viral Activity: {externalData.healthSurveillance?.viralActivity || 'Low'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
