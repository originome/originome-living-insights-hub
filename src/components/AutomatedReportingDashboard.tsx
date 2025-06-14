
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, TrendingUp, Calendar, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { ReportingService, ReportTemplate, GeneratedReport, ComplianceRule } from '@/services/reportingService';
import { EnvironmentalParams } from '@/hooks/useEnvironmentalParams';

interface AutomatedReportingDashboardProps {
  environmentalParams: EnvironmentalParams;
  buildingType: string;
}

export const AutomatedReportingDashboard: React.FC<AutomatedReportingDashboardProps> = ({
  environmentalParams,
  buildingType
}) => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);

  useEffect(() => {
    // Initialize reporting service
    ReportingService.initializeDefaultTemplates();
    
    // Load data
    setTemplates(ReportingService.getReportTemplates());
    setReports(ReportingService.getGeneratedReports(10));
    setComplianceRules(ReportingService.getComplianceRules());
  }, []);

  const generateReport = (templateId: string) => {
    const timeRange = {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      end: new Date()
    };
    
    const reportId = ReportingService.generateReport(templateId, environmentalParams, timeRange);
    console.log(`Generated report: ${reportId}`);
    
    // Refresh reports list
    setReports(ReportingService.getGeneratedReports(10));
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'violation': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'violation': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-green-600" />
          Automated Reporting & Compliance
          <Badge variant="default" className="text-xs">
            AUTO-GENERATED
          </Badge>
        </CardTitle>
        <div className="text-sm text-green-600">
          Automated report generation, trend analysis, and regulatory compliance documentation
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Rules</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="flex gap-2">
                        <Badge className={`text-xs ${getFrequencyColor(template.frequency)}`}>
                          {template.frequency.toUpperCase()}
                        </Badge>
                        <Badge variant={template.isActive ? 'default' : 'secondary'} className="text-xs">
                          {template.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3">{template.description}</div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span>{template.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sections:</span>
                        <span>{template.sections.length} sections</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipients:</span>
                        <span>{template.recipients.length} recipients</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Generated:</span>
                        <span>
                          {template.lastGenerated 
                            ? template.lastGenerated.toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => generateReport(template.id)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Generate Report Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {reports.filter(r => r.complianceStatus.overallStatus === 'compliant').length}
                  </div>
                  <div className="text-sm text-gray-600">Compliant</div>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {reports.filter(r => r.complianceStatus.overallStatus === 'violation').length}
                  </div>
                  <div className="text-sm text-gray-600">Violations</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {reports.map((report) => (
                <Alert key={report.id} className="border-l-4 border-green-300">
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{report.title}</div>
                      <div className="flex gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getComplianceStatusColor(report.complianceStatus.overallStatus)}`}
                        >
                          {report.complianceStatus.overallStatus.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {report.data.sections.length} sections
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                      <div>
                        <strong>Generated:</strong> {report.generatedAt.toLocaleString()}
                      </div>
                      <div>
                        <strong>Time Range:</strong> {report.timeRange.start.toLocaleDateString()} - {report.timeRange.end.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-xs mb-3">
                      <strong>Key Recommendations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {report.recommendations.slice(0, 2).map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      {report.exportFormats.map((format) => (
                        <Button key={format} size="sm" variant="outline" className="text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {complianceRules.map((rule) => (
                <Card key={rule.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-sm">{rule.name}</div>
                      <Badge className={`text-xs ${getSeverityColor(rule.severity)}`}>
                        {rule.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3">{rule.description}</div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Regulation:</span>
                        <span className="font-medium">{rule.regulation}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parameter:</span>
                        <span>{rule.parameter.toUpperCase()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threshold:</span>
                        <span>
                          {Array.isArray(rule.threshold) 
                            ? `${rule.threshold[0]} - ${rule.threshold[1]}`
                            : `${rule.operator.replace('_', ' ')} ${rule.threshold}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <strong>Documentation:</strong> {rule.documentation}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      {environmentalParams[rule.parameter] !== undefined && (
                        <>
                          {(() => {
                            const currentValue = environmentalParams[rule.parameter];
                            let isCompliant = false;
                            
                            if (rule.operator === 'less_than') {
                              isCompliant = currentValue < (rule.threshold as number);
                            } else if (rule.operator === 'between') {
                              const [min, max] = rule.threshold as [number, number];
                              isCompliant = currentValue >= min && currentValue <= max;
                            }
                            
                            return (
                              <>
                                {isCompliant ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`text-xs ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                                  Current: {currentValue} - {isCompliant ? 'Compliant' : 'Non-compliant'}
                                </span>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reports.slice(0, 1).map((report) => (
                <div key={report.id} className="space-y-4">
                  {report.trends.map((trend, idx) => (
                    <Card key={idx} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium text-sm">{trend.parameter} Trend</div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`h-4 w-4 ${
                              trend.trend === 'improving' ? 'text-green-500' :
                              trend.trend === 'degrading' ? 'text-red-500' : 'text-blue-500'
                            }`} />
                            <Badge variant="outline" className="text-xs">
                              {trend.significance.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-3">{trend.description}</div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-gray-600">Change</div>
                            <div className={`font-bold ${
                              trend.changePercent > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Confidence</div>
                            <div className="font-bold">{(trend.confidence * 100).toFixed(0)}%</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Timeframe</div>
                            <div className="font-medium">{trend.timeframe}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Projected</div>
                            <div className="font-medium">{trend.projectedValue.toFixed(1)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
