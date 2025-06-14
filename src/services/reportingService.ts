
import { ReportTemplate, GeneratedReport, ComplianceRule } from '@/types/reporting';
import { ComplianceRulesService } from './complianceRulesService';
import { ReportTemplateService } from './reportTemplateService';
import { ReportDataService } from './reportDataService';

export class ReportingService {
  private static generatedReports: Map<string, GeneratedReport> = new Map();

  static initializeDefaultTemplates(): void {
    ComplianceRulesService.initializeDefaultRules();
    ReportTemplateService.initializeDefaultTemplates();
  }

  static createReportTemplate(template: Omit<ReportTemplate, 'id' | 'createdAt' | 'lastGenerated'>): string {
    return ReportTemplateService.createReportTemplate(template);
  }

  static generateReport(
    templateId: string,
    environmentalData: any,
    timeRange: { start: Date; end: Date }
  ): string {
    const template = ReportTemplateService.getReportTemplate(templateId);
    if (!template) throw new Error('Template not found');

    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const reportData = ReportDataService.generateReportData(template.sections, environmentalData, timeRange);
    const complianceStatus = ReportDataService.checkCompliance(environmentalData);
    const trends = ReportDataService.analyzeTrends(environmentalData, timeRange);
    const recommendations = ReportDataService.generateRecommendations(complianceStatus, trends);

    const generatedReport: GeneratedReport = {
      id: reportId,
      templateId,
      title: `${template.name} - ${new Date().toLocaleDateString()}`,
      generatedAt: new Date(),
      timeRange,
      data: reportData,
      complianceStatus,
      trends,
      recommendations,
      exportFormats: ['pdf', 'xlsx', 'csv']
    };

    this.generatedReports.set(reportId, generatedReport);
    ReportTemplateService.updateLastGenerated(templateId);

    return reportId;
  }

  static getReportTemplates(): ReportTemplate[] {
    return ReportTemplateService.getReportTemplates();
  }

  static getGeneratedReports(limit?: number): GeneratedReport[] {
    const reports = Array.from(this.generatedReports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    
    return limit ? reports.slice(0, limit) : reports;
  }

  static getComplianceRules(): ComplianceRule[] {
    return ComplianceRulesService.getComplianceRules();
  }

  static getGeneratedReport(id: string): GeneratedReport | undefined {
    return this.generatedReports.get(id);
  }

  static deleteGeneratedReport(id: string): boolean {
    return this.generatedReports.delete(id);
  }
}

// Re-export types and services for backward compatibility
export * from '@/types/reporting';
export { ComplianceRulesService } from './complianceRulesService';
export { ReportTemplateService } from './reportTemplateService';
export { ReportDataService } from './reportDataService';
