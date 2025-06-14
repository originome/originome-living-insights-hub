
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'operational' | 'trend_analysis' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand';
  sections: ReportSection[];
  recipients: string[];
  isActive: boolean;
  lastGenerated: Date | null;
  createdBy: string;
  createdAt: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'summary' | 'text' | 'compliance_check';
  dataSource: string;
  configuration: {
    timeRange: string;
    filters: Record<string, any>;
    aggregation: 'hour' | 'day' | 'week' | 'month';
    chartType?: 'line' | 'bar' | 'pie' | 'scatter';
    columns?: string[];
  };
  complianceRules?: ComplianceRule[];
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  regulation: string; // e.g., "OSHA", "EPA", "ASHRAE"
  parameter: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  threshold: number | [number, number];
  severity: 'info' | 'warning' | 'violation' | 'critical';
  documentation: string;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  title: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
  };
  data: ReportData;
  complianceStatus: ComplianceStatus;
  trends: TrendAnalysis[];
  recommendations: string[];
  exportFormats: ('pdf' | 'xlsx' | 'csv' | 'json')[];
}

export interface ReportData {
  sections: {
    sectionId: string;
    title: string;
    data: any;
    charts?: ChartData[];
    tables?: TableData[];
    summaries?: SummaryData[];
  }[];
}

export interface ComplianceStatus {
  overallStatus: 'compliant' | 'warning' | 'violation';
  checks: {
    ruleId: string;
    ruleName: string;
    status: 'pass' | 'warning' | 'fail';
    currentValue: number;
    threshold: number | [number, number];
    severity: string;
    lastChecked: Date;
  }[];
}

export interface TrendAnalysis {
  parameter: string;
  timeframe: string;
  trend: 'improving' | 'stable' | 'degrading';
  changePercent: number;
  significance: 'low' | 'moderate' | 'high';
  description: string;
  projectedValue: number;
  confidence: number;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: Array<{ x: string | number; y: number; series?: string }>;
  xLabel: string;
  yLabel: string;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

export interface SummaryData {
  title: string;
  value: number | string;
  unit?: string;
  change?: {
    value: number;
    period: string;
    direction: 'up' | 'down' | 'stable';
  };
}

export class ReportingService {
  private static reportTemplates: Map<string, ReportTemplate> = new Map();
  private static generatedReports: Map<string, GeneratedReport> = new Map();
  private static complianceRules: Map<string, ComplianceRule> = new Map();

  // Initialize default compliance rules and templates
  static initializeDefaultTemplates(): void {
    this.initializeComplianceRules();
    this.initializeReportTemplates();
  }

  private static initializeComplianceRules(): void {
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

  private static initializeReportTemplates(): void {
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
            complianceRules: Array.from(this.complianceRules.values())
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

  static generateReport(
    templateId: string,
    environmentalData: any,
    timeRange: { start: Date; end: Date }
  ): string {
    const template = this.reportTemplates.get(templateId);
    if (!template) throw new Error('Template not found');

    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const reportData = this.generateReportData(template, environmentalData, timeRange);
    const complianceStatus = this.checkCompliance(environmentalData);
    const trends = this.analyzeTrends(environmentalData, timeRange);
    const recommendations = this.generateRecommendations(complianceStatus, trends);

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
    
    // Update template last generated timestamp
    template.lastGenerated = new Date();
    this.reportTemplates.set(templateId, template);

    return reportId;
  }

  static getReportTemplates(): ReportTemplate[] {
    return Array.from(this.reportTemplates.values());
  }

  static getGeneratedReports(limit?: number): GeneratedReport[] {
    const reports = Array.from(this.generatedReports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
    
    return limit ? reports.slice(0, limit) : reports;
  }

  static getComplianceRules(): ComplianceRule[] {
    return Array.from(this.complianceRules.values());
  }

  private static generateReportData(
    template: ReportTemplate,
    environmentalData: any,
    timeRange: { start: Date; end: Date }
  ): ReportData {
    const sections = template.sections.map(section => {
      let data: any;
      let charts: ChartData[] = [];
      let tables: TableData[] = [];
      let summaries: SummaryData[] = [];

      switch (section.type) {
        case 'chart':
          data = this.generateChartData(section, environmentalData, timeRange);
          charts = [data];
          break;
        case 'table':
          data = this.generateTableData(section, environmentalData, timeRange);
          tables = [data];
          break;
        case 'summary':
          data = this.generateSummaryData(section, environmentalData, timeRange);
          summaries = [data];
          break;
        case 'compliance_check':
          data = this.generateComplianceData(section, environmentalData);
          break;
        default:
          data = {};
      }

      return {
        sectionId: section.id,
        title: section.title,
        data,
        charts,
        tables,
        summaries
      };
    });

    return { sections };
  }

  private static generateChartData(section: ReportSection, data: any, timeRange: any): ChartData {
    // Simulate chart data generation
    const chartData: Array<{ x: string; y: number; series?: string }> = [];
    
    for (let i = 0; i < 24; i++) {
      chartData.push({
        x: `${i}:00`,
        y: Math.random() * 100 + data.co2 || 400,
        series: 'CO₂'
      });
    }

    return {
      type: section.configuration.chartType || 'line',
      title: section.title,
      data: chartData,
      xLabel: 'Time',
      yLabel: 'Value'
    };
  }

  private static generateTableData(section: ReportSection, data: any, timeRange: any): TableData {
    const headers = section.configuration.columns || ['Parameter', 'Current', 'Average', 'Status'];
    const rows = [
      ['CO₂', data.co2?.toString() || '400', '450', 'Normal'],
      ['PM2.5', data.pm25?.toString() || '10', '12', 'Good'],
      ['Temperature', data.temperature?.toString() || '21', '21.5', 'Optimal'],
      ['Humidity', data.humidity?.toString() || '45', '47', 'Comfortable']
    ];

    return {
      title: section.title,
      headers,
      rows
    };
  }

  private static generateSummaryData(section: ReportSection, data: any, timeRange: any): SummaryData {
    return {
      title: 'Average CO₂ Level',
      value: data.co2 || 400,
      unit: 'ppm',
      change: {
        value: -5.2,
        period: '24h',
        direction: 'down'
      }
    };
  }

  private static generateComplianceData(section: ReportSection, data: any): any {
    return this.checkCompliance(data);
  }

  private static checkCompliance(environmentalData: any): ComplianceStatus {
    const checks = Array.from(this.complianceRules.values()).map(rule => {
      const currentValue = environmentalData[rule.parameter] || 0;
      let status: 'pass' | 'warning' | 'fail' = 'pass';

      switch (rule.operator) {
        case 'less_than':
          status = currentValue < (rule.threshold as number) ? 'pass' : 
                   rule.severity === 'warning' ? 'warning' : 'fail';
          break;
        case 'greater_than':
          status = currentValue > (rule.threshold as number) ? 'pass' :
                   rule.severity === 'warning' ? 'warning' : 'fail';
          break;
        case 'between':
          const [min, max] = rule.threshold as [number, number];
          status = (currentValue >= min && currentValue <= max) ? 'pass' :
                   rule.severity === 'warning' ? 'warning' : 'fail';
          break;
      }

      return {
        ruleId: rule.id,
        ruleName: rule.name,
        status,
        currentValue,
        threshold: rule.threshold,
        severity: rule.severity,
        lastChecked: new Date()
      };
    });

    const failedChecks = checks.filter(check => check.status === 'fail');
    const warningChecks = checks.filter(check => check.status === 'warning');

    const overallStatus = failedChecks.length > 0 ? 'violation' :
                         warningChecks.length > 0 ? 'warning' : 'compliant';

    return { overallStatus, checks };
  }

  private static analyzeTrends(environmentalData: any, timeRange: any): TrendAnalysis[] {
    // Simulate trend analysis
    return [
      {
        parameter: 'CO₂',
        timeframe: '30 days',
        trend: 'improving',
        changePercent: -8.5,
        significance: 'moderate',
        description: 'CO₂ levels have decreased by 8.5% over the past month due to improved ventilation',
        projectedValue: 420,
        confidence: 0.85
      },
      {
        parameter: 'PM2.5',
        timeframe: '30 days',
        trend: 'stable',
        changePercent: 1.2,
        significance: 'low',
        description: 'PM2.5 levels remain stable with minor seasonal variations',
        projectedValue: environmentalData.pm25 || 10,
        confidence: 0.92
      }
    ];
  }

  private static generateRecommendations(compliance: ComplianceStatus, trends: TrendAnalysis[]): string[] {
    const recommendations: string[] = [];

    if (compliance.overallStatus === 'violation') {
      recommendations.push('Immediate action required to address compliance violations');
    }

    trends.forEach(trend => {
      if (trend.trend === 'degrading' && trend.significance === 'high') {
        recommendations.push(`Monitor ${trend.parameter} closely - degrading trend detected`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Continue current environmental management practices');
      recommendations.push('Consider optimization opportunities identified in trend analysis');
    }

    return recommendations;
  }
}
