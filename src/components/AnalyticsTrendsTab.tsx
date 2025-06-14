
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisDatabase } from '@/components/AnalysisDatabase';
import { CrossDomainCorrelationPanel } from '@/components/CrossDomainCorrelationPanel';
import { HistoricalInsightPanel } from '@/components/HistoricalInsightPanel';
import { LiteratureDatabase } from '@/components/LiteratureDatabase';
import { TrendingUp, BarChart3, Database, BookOpen } from 'lucide-react';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

interface AnalyticsTrendsTabProps {
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  buildingType: string;
  populationGroup: string;
  isCosmicLoading: boolean;
}

export const AnalyticsTrendsTab: React.FC<AnalyticsTrendsTabProps> = ({
  environmentalParams,
  externalData,
  cosmicData,
  buildingType,
  populationGroup,
  isCosmicLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Analytics Overview Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Environmental Analytics & Trend Intelligence
          </CardTitle>
          <p className="text-sm text-gray-600">
            Historical pattern analysis, cross-domain correlations, and scientific literature integration
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-900">Pattern Analysis</div>
              <div className="text-sm text-blue-700">Historical trends</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-900">Cross-Domain</div>
              <div className="text-sm text-green-700">Sector correlations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-900">Literature</div>
              <div className="text-sm text-purple-700">Scientific evidence</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-medium text-orange-900">Insights</div>
              <div className="text-sm text-orange-700">Predictive patterns</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Intelligence */}
      <HistoricalInsightPanel />

      {/* Cross-Domain Analysis */}
      <CrossDomainCorrelationPanel
        currentSector={buildingType}
        environmentalData={environmentalParams}
        buildingType={buildingType}
      />

      {/* Comprehensive Analysis Database */}
      <AnalysisDatabase
        environmentalParams={environmentalParams}
        externalData={externalData}
        cosmicData={cosmicData}
        buildingType={buildingType}
        populationGroup={populationGroup}
        isCosmicLoading={isCosmicLoading}
      />

      {/* Scientific Literature Integration */}
      <LiteratureDatabase />
    </div>
  );
};
