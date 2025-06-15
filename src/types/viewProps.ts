
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

export interface SharedViewProps {
  location: string;
  buildingType: string;
  populationGroup: string;
  environmentalParams: EnvironmentalParams;
  externalData: ExternalData;
  cosmicData: CosmicData | null;
  isLoading: boolean;
  isCosmicLoading: boolean;
  systemIntelligence: {
    riskLevel: string;
    activeFactors: number;
    confidence: number;
  };
  onParamChange: (param: string, value: number) => void;
  onRefresh: () => void;
}
