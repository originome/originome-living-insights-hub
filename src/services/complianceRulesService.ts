
import { ComplianceRule } from '@/types/reporting';

export class ComplianceRulesService {
  private static complianceRules: Map<string, ComplianceRule> = new Map();

  static initializeDefaultRules(): void {
    const defaultRules: ComplianceRule[] = [
      {
        id: 'osha_co2_limit',
        name: 'OSHA CO₂ Exposure Limit',
        description: 'Workplace CO₂ concentration should not exceed 5000 ppm (8-hour TWA)',
        regulation: 'OSHA 29 CFR 1910.1000',
        parameter: 'co2',
        operator: 'less_than',
        threshold: 5000,
        severity: 'violation',
        documentation: 'OSHA Permissible Exposure Limits for CO₂ in workplace environments'
      },
      {
        id: 'ashrae_co2_comfort',
        name: 'ASHRAE CO₂ Comfort Standard',
        description: 'Indoor CO₂ levels should be below 1000 ppm for acceptable indoor air quality',
        regulation: 'ASHRAE 62.1-2019',
        parameter: 'co2',
        operator: 'less_than',
        threshold: 1000,
        severity: 'warning',
        documentation: 'ASHRAE Standard 62.1 Ventilation for Acceptable Indoor Air Quality'
      },
      {
        id: 'epa_pm25_standard',
        name: 'EPA PM2.5 Air Quality Standard',
        description: 'Annual PM2.5 concentration should not exceed 12 μg/m³',
        regulation: 'EPA NAAQS',
        parameter: 'pm25',
        operator: 'less_than',
        threshold: 12,
        severity: 'violation',
        documentation: 'EPA National Ambient Air Quality Standards for PM2.5'
      },
      {
        id: 'ashrae_temperature_comfort',
        name: 'ASHRAE Temperature Comfort Zone',
        description: 'Operative temperature should be between 68-78°F (20-25.5°C) for comfort',
        regulation: 'ASHRAE 55-2020',
        parameter: 'temperature',
        operator: 'between',
        threshold: [20, 25.5],
        severity: 'warning',
        documentation: 'ASHRAE Standard 55 Thermal Environmental Conditions for Human Occupancy'
      },
      {
        id: 'ashrae_humidity_comfort',
        name: 'ASHRAE Humidity Comfort Range',
        description: 'Relative humidity should be between 30-60% for comfort and health',
        regulation: 'ASHRAE 62.1-2019',
        parameter: 'humidity',
        operator: 'between',
        threshold: [30, 60],
        severity: 'warning',
        documentation: 'ASHRAE guidance on humidity control for indoor air quality'
      }
    ];

    defaultRules.forEach(rule => {
      this.complianceRules.set(rule.id, rule);
    });
  }

  static getComplianceRules(): ComplianceRule[] {
    return Array.from(this.complianceRules.values());
  }

  static getComplianceRule(id: string): ComplianceRule | undefined {
    return this.complianceRules.get(id);
  }

  static addComplianceRule(rule: ComplianceRule): void {
    this.complianceRules.set(rule.id, rule);
  }

  static updateComplianceRule(id: string, rule: Partial<ComplianceRule>): boolean {
    const existing = this.complianceRules.get(id);
    if (!existing) return false;
    
    this.complianceRules.set(id, { ...existing, ...rule });
    return true;
  }

  static deleteComplianceRule(id: string): boolean {
    return this.complianceRules.delete(id);
  }
}
