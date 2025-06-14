
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
