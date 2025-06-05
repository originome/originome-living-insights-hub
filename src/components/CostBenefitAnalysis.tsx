
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
    // Get evidence-based productivity value
    const baseProductivity = LiteratureService.calculateProductivityValue(buildingType, 'adults');
    
    // Calculate impacts using literature data
    const cognitiveImpact = Math.abs(LiteratureService.calculateCognitiveImpact(environmentalParams.co2));
    const pm25Impact = LiteratureService.calculatePM25Impact(environmentalParams.pm25);
    const temperatureImpact = Math.abs(LiteratureService.calculateTemperatureImpact(environmentalParams.temperature, buildingType));
    const lightingImpact = LiteratureService.calculateLightingImpact(environmentalParams.light, buildingType);

    // Total productivity impact (literature-based)
    const totalProductivityImpact = cognitiveImpact + Math.abs(pm25Impact.cognitive) + temperatureImpact + Math.abs(lightingImpact);
    
    // Calculate annual costs
    const annualProductivityLoss = baseProductivity * (totalProductivityImpact / 100);
    
    // Health costs based on PM2.5 literature (Zhang et al.)
    const outdoorPM25 = externalData.airQuality?.pm25 || 0;
    const effectivePM25 = Math.max(environmentalParams.pm25, outdoorPM25 * 0.6);
    const healthcareMultiplier = 150; // $/year per % health risk increase
    const annualHealthcareCost = Math.abs(pm25Impact.health) * healthcareMultiplier;
    
    // Absenteeism costs (literature-based)
    const absenteeismRate = Math.abs(pm25Impact.health) * 0.3; // Convert health impact to absenteeism
    const annualAbsenteeismCost = baseProductivity * (absenteeismRate / 100) * 0.25; // 25% of salary for replacement costs
    
    const totalAnnualLoss = annualProductivityLoss + annualHealthcareCost + annualAbsenteeismCost;

    // Calculate implementation costs using literature-based estimates
    const optimalTargets = {
      co2: 600,     // ASHRAE standard
      pm25: 10,     // WHO guideline
      temperature: buildingType === 'school' ? 20 : 21, // Literature-based optimal
      light: buildingType === 'school' ? 750 : 500      // Evidence-based optimal
    };

    const ventilationCost = environmentalParams.co2 > 800 ? 
      LiteratureService.getImplementationCosts('co2', environmentalParams.co2, optimalTargets.co2) : 0;
    
    const filtrationCost = effectivePM25 > 15 ? 
      LiteratureService.getImplementationCosts('pm25', effectivePM25, optimalTargets.pm25) : 0;
    
    const hvacOptimization = Math.abs(environmentalParams.temperature - optimalTargets.temperature) > 2 ? 
      LiteratureService.getImplementationCosts('temperature', environmentalParams.temperature, optimalTargets.temperature) : 0;
    
    const lightingUpgrade = environmentalParams.light < optimalTargets.light ? 
      LiteratureService.getImplementationCosts('light', environmentalParams.light, optimalTargets.light) : 0;
    
    const totalImplementationCost = ventilationCost + filtrationCost + hvacOptimization + lightingUpgrade;

    // Potential savings with optimization (90% improvement based on literature)
    const optimizationEfficiency = 0.90;
    const potentialSavings = totalAnnualLoss * optimizationEfficiency;

    // ROI calculation
    const monthsToROI = totalImplementationCost > 0 ? (totalImplementationCost / (potentialSavings / 12)) : 0;

    return {
      productivityLoss: Math.round(annualProductivityLoss),
      healthcareCost: Math.round(annualHealthcareCost),
      absenteeismCost: Math.round(annualAbsenteeismCost),
      totalLoss: Math.round(totalAnnualLoss),
      potentialSavings: Math.round(potentialSavings),
      implementationCost: Math.round(totalImplementationCost),
      roiMonths: monthsToROI,
      breakdownCosts: {
        ventilation: ventilationCost,
        filtration: filtrationCost,
        hvac: hvacOptimization,
        lighting: lightingUpgrade
      }
    };
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
        <Badge variant="outline" className="w-fit text-xs">
          Per occupant annually
        </Badge>
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

        {/* Implementation Breakdown */}
        {analysis.implementationCost > 0 && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recommended Investments:
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {analysis.breakdownCosts.ventilation > 0 && (
                <div>• Ventilation enhancement: {formatCurrency(analysis.breakdownCosts.ventilation)}</div>
              )}
              {analysis.breakdownCosts.filtration > 0 && (
                <div>• Air filtration system: {formatCurrency(analysis.breakdownCosts.filtration)}</div>
              )}
              {analysis.breakdownCosts.hvac > 0 && (
                <div>• HVAC optimization: {formatCurrency(analysis.breakdownCosts.hvac)}</div>
              )}
              {analysis.breakdownCosts.lighting > 0 && (
                <div>• Lighting upgrade: {formatCurrency(analysis.breakdownCosts.lighting)}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
