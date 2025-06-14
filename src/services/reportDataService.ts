
import { ReportSection, ReportData, ChartData, TableData, SummaryData, ComplianceStatus, TrendAnalysis } from '@/types/reporting';
import { ComplianceRulesService } from './complianceRulesService';

export class ReportDataService {
  static generateReportData(
    sections: ReportSection[],
    environmentalData: any,
    timeRange: { start: Date; end: Date }
  ): ReportData {
    const generatedSections = sections.map(section => {
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

    return { sections: generatedSections };
  }

  private static generateChartData(section: ReportSection, data: any, timeRange: any): ChartData {
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

  static checkCompliance(environmentalData: any): ComplianceStatus {
    const rules = ComplianceRulesService.getComplianceRules();
    const checks = rules.map(rule => {
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

  static analyzeTrends(environmentalData: any, timeRange: any): TrendAnalysis[] {
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

  static generateRecommendations(compliance: ComplianceStatus, trends: TrendAnalysis[]): string[] {
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
