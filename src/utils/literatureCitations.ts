
import { LiteratureService } from '@/services/literatureService';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

export const getRelevantCitations = (environmentalParams: EnvironmentalParams) => {
  const citations = [];
  
  // CO2 studies if elevated
  if (environmentalParams.co2 > 600) {
    const co2Studies = LiteratureService.getStudiesForParameter('co2');
    citations.push(...co2Studies.map(study => ({
      study,
      relevantTo: `CO₂ levels of ${environmentalParams.co2}ppm impact cognitive performance`
    })));
  }

  // PM2.5 studies if concerning
  if (environmentalParams.pm25 > 12) {
    const pm25Studies = LiteratureService.getStudiesForParameter('pm25');
    citations.push(...pm25Studies.map(study => ({
      study,
      relevantTo: `PM2.5 levels of ${environmentalParams.pm25}μg/m³ affect health and cognition`
    })));
  }

  // Temperature studies if suboptimal
  if (Math.abs(environmentalParams.temperature - 21) > 1) {
    const tempStudies = LiteratureService.getStudiesForParameter('temperature');
    citations.push(...tempStudies.map(study => ({
      study,
      relevantTo: `Temperature of ${environmentalParams.temperature}°C impacts productivity`
    })));
  }

  return citations.slice(0, 3); // Show top 3 most relevant
};
