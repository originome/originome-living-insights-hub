
import { ReportTemplate, ComplianceRule } from '@/types/reporting';
import { ComplianceRulesService } from './complianceRulesService';

export class ReportTemplateService {
  private static reportTemplates: Map<string, ReportTemplate> = new Map();

  static initializeDefaultTemplates(): void {
    const defaultTemplates: ReportTemplate[] = [
      {
        id: 'daily_compliance_report',
        name: 'Daily Compliance Report',
        description: 'Daily environmental compliance status and violations',
        type: 'compliance',
        frequency: 'daily',
        sections: [
          {
            id: 'compliance_summary',
            title: 'Compliance Status Summary',
            type: 'compliance_check',
            dataSource: 'environmental_data',
            configuration: {
              timeRange: '24h',
              filters: {},
              aggregation: 'hour'
            },
            complianceRules: ComplianceRulesService.getComplianceRules()
          },
          {
            id: 'parameter_trends',
            title: 'Environmental Parameter Trends',
            type: 'chart',
            dataSource: 'environmental_data',
            configuration: {
              timeRange: '24h',
              filters: {},
              aggregation: 'hour',
              chartType: 'line'
            }
          }
        ],
        recipients: ['facilities@company.com', 'compliance@company.com'],
        isActive: true,
        lastGenerated: null,
        createdBy: 'system',
        createdAt: new Date()
      },
      {
        id: 'monthly_trend_analysis',
        name: 'Monthly Environmental Trend Analysis',
        description: 'Comprehensive monthly analysis of environmental trends and patterns',
        type: 'trend_analysis',
        frequency: 'monthly',
        sections: [
          {
            id: 'trend_summary',
            title: 'Monthly Trend Summary',
            type: 'summary',
            dataSource: 'historical_data',
            configuration: {
              timeRange: '30d',
              filters: {},
              aggregation: 'day'
            }
          },
          {
            id: 'parameter_analysis',
            title: 'Parameter Trend Analysis',
            type: 'chart',
            dataSource: 'historical_data',
            configuration: {
              timeRange: '30d',
              filters: {},
              aggregation: 'day',
              chartType: 'line'
            }
          },
          {
            id: 'cost_impact',
            title: 'Environmental Cost Impact Analysis',
            type: 'table',
            dataSource: 'cost_data',
            configuration: {
              timeRange: '30d',
              filters: {},
              aggregation: 'week',
              columns: ['parameter', 'deviation_cost', 'optimization_savings', 'total_impact']
            }
          }
        ],
        recipients: ['management@company.com', 'facilities@company.com'],
        isActive: true,
        lastGenerated: null,
        createdBy: 'system',
        createdAt: new Date()
      }
    ];

    defaultTemplates.forEach(template => {
      this.reportTemplates.set(template.id, template);
    });
  }

  static createReportTemplate(template: Omit<ReportTemplate, 'id' | 'createdAt' | 'lastGenerated'>): string {
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTemplate: ReportTemplate = {
      ...template,
      id: templateId,
      createdAt: new Date(),
      lastGenerated: null
    };
    
    this.reportTemplates.set(templateId, newTemplate);
    return templateId;
  }

  static getReportTemplates(): ReportTemplate[] {
    return Array.from(this.reportTemplates.values());
  }

  static getReportTemplate(id: string): ReportTemplate | undefined {
    return this.reportTemplates.get(id);
  }

  static updateReportTemplate(id: string, updates: Partial<ReportTemplate>): boolean {
    const existing = this.reportTemplates.get(id);
    if (!existing) return false;

    this.reportTemplates.set(id, { ...existing, ...updates });
    return true;
  }

  static deleteReportTemplate(id: string): boolean {
    return this.reportTemplates.delete(id);
  }

  static updateLastGenerated(templateId: string): void {
    const template = this.reportTemplates.get(templateId);
    if (template) {
      template.lastGenerated = new Date();
      this.reportTemplates.set(templateId, template);
    }
  }
}
