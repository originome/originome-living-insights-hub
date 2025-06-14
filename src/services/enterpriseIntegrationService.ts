
export interface ApiIntegration {
  id: string;
  name: string;
  type: 'environmental' | 'asset_management' | 'weather' | 'cosmic' | 'custom';
  endpoint: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync: Date | null;
  configuration: {
    authMethod: 'api_key' | 'oauth' | 'basic' | 'none';
    headers: Record<string, string>;
    params: Record<string, any>;
    syncInterval: number; // minutes
  };
  dataMapping: {
    sourceField: string;
    targetField: string;
    transformation?: string;
  }[];
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  assetId: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate: Date;
  environmentalTrigger: {
    parameter: string;
    threshold: number;
    actualValue: number;
    riskLevel: string;
  };
  estimatedCost: number;
  actualCost?: number;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  department: string;
  lastLogin: Date | null;
  isActive: boolean;
  preferences: {
    alertThresholds: Record<string, number>;
    reportFrequency: 'daily' | 'weekly' | 'monthly';
    dashboardLayout: string;
  };
}

export class EnterpriseIntegrationService {
  private static apiIntegrations: Map<string, ApiIntegration> = new Map();
  private static workOrders: Map<string, WorkOrder> = new Map();
  private static userRoles: Map<string, UserRole> = new Map();
  private static users: Map<string, User> = new Map();

  // API Integration Management
  static initializeDefaultIntegrations(): void {
    const defaultIntegrations: ApiIntegration[] = [
      {
        id: 'building_automation_system',
        name: 'Building Automation System',
        type: 'asset_management',
        endpoint: 'https://api.buildingautomation.com/v1',
        status: 'inactive',
        lastSync: null,
        configuration: {
          authMethod: 'api_key',
          headers: { 'Authorization': 'Bearer {{API_KEY}}' },
          params: { format: 'json', version: 'v1' },
          syncInterval: 15
        },
        dataMapping: [
          { sourceField: 'hvac_status', targetField: 'hvacStatus' },
          { sourceField: 'energy_consumption', targetField: 'energyUsage' },
          { sourceField: 'maintenance_alerts', targetField: 'maintenanceAlerts' }
        ]
      },
      {
        id: 'weather_service',
        name: 'Weather Service API',
        type: 'weather',
        endpoint: 'https://api.weather.com/v1',
        status: 'active',
        lastSync: new Date(),
        configuration: {
          authMethod: 'api_key',
          headers: { 'X-API-Key': '{{WEATHER_API_KEY}}' },
          params: { units: 'metric', lang: 'en' },
          syncInterval: 60
        },
        dataMapping: [
          { sourceField: 'temperature', targetField: 'externalTemperature' },
          { sourceField: 'humidity', targetField: 'externalHumidity' },
          { sourceField: 'pressure', targetField: 'atmosphericPressure' }
        ]
      },
      {
        id: 'iot_sensors',
        name: 'IoT Sensor Network',
        type: 'environmental',
        endpoint: 'https://api.iotsensors.com/v2',
        status: 'active',
        lastSync: new Date(),
        configuration: {
          authMethod: 'oauth',
          headers: { 'Authorization': 'Bearer {{OAUTH_TOKEN}}' },
          params: { resolution: 'minute', aggregation: 'avg' },
          syncInterval: 5
        },
        dataMapping: [
          { sourceField: 'co2_ppm', targetField: 'co2' },
          { sourceField: 'pm25_ugm3', targetField: 'pm25' },
          { sourceField: 'temp_celsius', targetField: 'temperature' }
        ]
      }
    ];

    defaultIntegrations.forEach(integration => {
      this.apiIntegrations.set(integration.id, integration);
    });
  }

  static createApiIntegration(integration: Omit<ApiIntegration, 'id' | 'lastSync'>): string {
    const id = `integration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newIntegration: ApiIntegration = {
      ...integration,
      id,
      lastSync: null
    };
    
    this.apiIntegrations.set(id, newIntegration);
    return id;
  }

  static getApiIntegrations(): ApiIntegration[] {
    return Array.from(this.apiIntegrations.values());
  }

  static updateIntegrationStatus(id: string, status: ApiIntegration['status']): boolean {
    const integration = this.apiIntegrations.get(id);
    if (!integration) return false;
    
    integration.status = status;
    if (status === 'active') {
      integration.lastSync = new Date();
    }
    
    this.apiIntegrations.set(id, integration);
    return true;
  }

  // Work Order Management
  static generateAutomaticWorkOrder(
    environmentalData: any,
    threshold: { parameter: string; value: number; limit: number }
  ): string {
    const workOrderId = `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const priority = this.calculateWorkOrderPriority(threshold.value, threshold.limit);
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + this.getPriorityDueHours(priority));
    
    const workOrder: WorkOrder = {
      id: workOrderId,
      title: `Environmental Alert: ${threshold.parameter} Threshold Exceeded`,
      description: `Automatic work order generated due to ${threshold.parameter} reading of ${threshold.value} exceeding threshold of ${threshold.limit}`,
      priority,
      status: 'open',
      assetId: 'building_main',
      createdBy: 'system_automated',
      createdAt: new Date(),
      dueDate,
      environmentalTrigger: {
        parameter: threshold.parameter,
        threshold: threshold.limit,
        actualValue: threshold.value,
        riskLevel: priority
      },
      estimatedCost: this.estimateWorkOrderCost(priority, threshold.parameter)
    };
    
    this.workOrders.set(workOrderId, workOrder);
    return workOrderId;
  }

  static getWorkOrders(status?: WorkOrder['status']): WorkOrder[] {
    const allOrders = Array.from(this.workOrders.values());
    return status ? allOrders.filter(order => order.status === status) : allOrders;
  }

  static updateWorkOrder(id: string, updates: Partial<WorkOrder>): boolean {
    const workOrder = this.workOrders.get(id);
    if (!workOrder) return false;
    
    Object.assign(workOrder, updates);
    this.workOrders.set(id, workOrder);
    return true;
  }

  // User Access Management
  static initializeRoles(): void {
    const defaultRoles: UserRole[] = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access and configuration rights',
        permissions: [
          { resource: 'dashboard', actions: ['read', 'write', 'admin'] },
          { resource: 'users', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'integrations', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'reports', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'work_orders', actions: ['read', 'write', 'delete', 'admin'] }
        ]
      },
      {
        id: 'facilities_manager',
        name: 'Facilities Manager',
        description: 'Building operations and maintenance oversight',
        permissions: [
          { resource: 'dashboard', actions: ['read', 'write'] },
          { resource: 'work_orders', actions: ['read', 'write'] },
          { resource: 'reports', actions: ['read', 'write'] },
          { resource: 'integrations', actions: ['read'] }
        ]
      },
      {
        id: 'operator',
        name: 'System Operator',
        description: 'Daily monitoring and basic operations',
        permissions: [
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'work_orders', actions: ['read'] },
          { resource: 'reports', actions: ['read'] }
        ]
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to dashboards and reports',
        permissions: [
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'reports', actions: ['read'] }
        ]
      }
    ];

    defaultRoles.forEach(role => {
      this.userRoles.set(role.id, role);
    });
  }

  static createUser(userData: Omit<User, 'id' | 'lastLogin'>): string {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      ...userData,
      id: userId,
      lastLogin: null
    };
    
    this.users.set(userId, newUser);
    return userId;
  }

  static getUsersByRole(roleId: string): User[] {
    return Array.from(this.users.values()).filter(user => 
      user.roles.includes(roleId)
    );
  }

  static checkUserPermission(userId: string, resource: string, action: string): boolean {
    const user = this.users.get(userId);
    if (!user || !user.isActive) return false;
    
    for (const roleId of user.roles) {
      const role = this.userRoles.get(roleId);
      if (!role) continue;
      
      const permission = role.permissions.find(p => p.resource === resource);
      if (permission && permission.actions.includes(action as any)) {
        return true;
      }
    }
    
    return false;
  }

  static getUsers(): User[] {
    return Array.from(this.users.values());
  }

  static getRoles(): UserRole[] {
    return Array.from(this.userRoles.values());
  }

  // Private helper methods
  private static calculateWorkOrderPriority(actual: number, threshold: number): WorkOrder['priority'] {
    const deviation = Math.abs(actual - threshold) / threshold;
    
    if (deviation > 0.5) return 'critical';
    if (deviation > 0.3) return 'high';
    if (deviation > 0.1) return 'medium';
    return 'low';
  }

  private static getPriorityDueHours(priority: WorkOrder['priority']): number {
    switch (priority) {
      case 'critical': return 2;
      case 'high': return 8;
      case 'medium': return 24;
      case 'low': return 72;
    }
  }

  private static estimateWorkOrderCost(priority: WorkOrder['priority'], parameter: string): number {
    const baseCosts = {
      'critical': 5000,
      'high': 2000,
      'medium': 800,
      'low': 300
    };
    
    const parameterMultipliers = {
      'co2': 1.2,
      'pm25': 1.5,
      'temperature': 1.0,
      'humidity': 0.8
    };
    
    const baseCost = baseCosts[priority];
    const multiplier = parameterMultipliers[parameter as keyof typeof parameterMultipliers] || 1.0;
    
    return Math.round(baseCost * multiplier);
  }
}
