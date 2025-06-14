
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, FileText, Zap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { EnterpriseIntegrationService, ApiIntegration, WorkOrder, User } from '@/services/enterpriseIntegrationService';

interface EnterpriseIntegrationDashboardProps {
  environmentalParams: any;
}

export const EnterpriseIntegrationDashboard: React.FC<EnterpriseIntegrationDashboardProps> = ({
  environmentalParams
}) => {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize services
    EnterpriseIntegrationService.initializeDefaultIntegrations();
    EnterpriseIntegrationService.initializeRoles();
    
    // Load data
    setIntegrations(EnterpriseIntegrationService.getApiIntegrations());
    setWorkOrders(EnterpriseIntegrationService.getWorkOrders());
    setUsers(EnterpriseIntegrationService.getUsers());

    // Check for environmental thresholds and generate work orders
    checkEnvironmentalThresholds();
  }, [environmentalParams]);

  const checkEnvironmentalThresholds = () => {
    const thresholds = [
      { parameter: 'co2', value: environmentalParams.co2, limit: 1000 },
      { parameter: 'pm25', value: environmentalParams.pm25, limit: 25 },
      { parameter: 'temperature', value: Math.abs(environmentalParams.temperature - 21), limit: 3 }
    ];

    thresholds.forEach(threshold => {
      if (threshold.value > threshold.limit) {
        const workOrderId = EnterpriseIntegrationService.generateAutomaticWorkOrder(
          environmentalParams,
          threshold
        );
        console.log(`Generated work order: ${workOrderId}`);
      }
    });

    // Refresh work orders
    setWorkOrders(EnterpriseIntegrationService.getWorkOrders());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Enterprise Integration Dashboard
          <Badge variant="default" className="text-xs">
            ENTERPRISE
          </Badge>
        </CardTitle>
        <div className="text-sm text-blue-600">
          API integrations, work order management, and user access control
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="integrations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations">API Integrations</TabsTrigger>
            <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <div className="font-medium text-sm">{integration.name}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {integration.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge 
                          variant={integration.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {integration.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sync Interval:</span>
                        <span>{integration.configuration.syncInterval} min</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync:</span>
                        <span>
                          {integration.lastSync 
                            ? integration.lastSync.toLocaleTimeString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auth Method:</span>
                        <span>{integration.configuration.authMethod.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <strong>Endpoint:</strong> {integration.endpoint}
                    </div>
                    
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant={integration.status === 'active' ? 'outline' : 'default'}
                        className="w-full text-xs"
                        onClick={() => {
                          const newStatus = integration.status === 'active' ? 'inactive' : 'active';
                          EnterpriseIntegrationService.updateIntegrationStatus(integration.id, newStatus);
                          setIntegrations(EnterpriseIntegrationService.getApiIntegrations());
                        }}
                      >
                        {integration.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="work-orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card className="border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {workOrders.filter(wo => wo.status === 'open').length}
                  </div>
                  <div className="text-sm text-gray-600">Open</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {workOrders.filter(wo => wo.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {workOrders.filter(wo => wo.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card className="border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {workOrders.filter(wo => wo.priority === 'critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Critical</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              {workOrders.slice(0, 10).map((workOrder) => (
                <Alert key={workOrder.id} className={`border-l-4 ${getPriorityColor(workOrder.priority)}`}>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{workOrder.title}</div>
                      <div className="flex gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {workOrder.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {workOrder.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm mb-2">{workOrder.description}</div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong>Environmental Trigger:</strong><br />
                        {workOrder.environmentalTrigger.parameter}: {workOrder.environmentalTrigger.actualValue} 
                        (threshold: {workOrder.environmentalTrigger.threshold})
                      </div>
                      <div>
                        <strong>Cost Estimate:</strong> ${workOrder.estimatedCost.toLocaleString()}<br />
                        <strong>Due Date:</strong> {workOrder.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Created: {workOrder.createdAt.toLocaleString()} • Asset: {workOrder.assetId}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="access-control" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {EnterpriseIntegrationService.getRoles().map((role) => (
                      <div key={role.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{role.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {EnterpriseIntegrationService.getUsersByRole(role.id).length} users
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{role.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((perm, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {perm.resource}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Access Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {users.filter(u => u.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Active Users</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Recent Activity</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Admin login</span>
                          <span>2 minutes ago</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Work order created</span>
                          <span>15 minutes ago</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Integration activated</span>
                          <span>1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
