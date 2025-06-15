
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';
import { ExternalData } from '@/hooks/useApiIntegration';
import { CosmicData } from '@/hooks/useCosmicData';

export type TabType = 'executive' | 'event-horizon' | 'velocity' | 'geographic' | 'assets';

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
  onParamChange: (param: keyof EnvironmentalParams, value: number) => void;
  onRefresh: () => void;
  onTabChange?: (tab: TabType) => void;
}
