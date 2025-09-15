'use client';

import { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Clock,
  Users,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  url?: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export function SystemHealth() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data - replace with real API calls
  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 23.5,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 70, critical: 90 },
      trend: 'stable',
      lastUpdated: '2024-01-25T12:44:00Z'
    },
    {
      name: 'Memory Usage',
      value: 67.2,
      unit: '%',
      status: 'warning',
      threshold: { warning: 80, critical: 95 },
      trend: 'up',
      lastUpdated: '2024-01-25T12:44:00Z'
    },
    {
      name: 'Disk Usage',
      value: 45.8,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 80, critical: 95 },
      trend: 'stable',
      lastUpdated: '2024-01-25T12:44:00Z'
    },
    {
      name: 'Response Time',
      value: 142,
      unit: 'ms',
      status: 'healthy',
      threshold: { warning: 500, critical: 1000 },
      trend: 'down',
      lastUpdated: '2024-01-25T12:44:00Z'
    },
    {
      name: 'Active Users',
      value: 89,
      unit: 'users',
      status: 'healthy',
      threshold: { warning: 500, critical: 1000 },
      trend: 'up',
      lastUpdated: '2024-01-25T12:44:00Z'
    },
    {
      name: 'Error Rate',
      value: 0.12,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 1, critical: 5 },
      trend: 'stable',
      lastUpdated: '2024-01-25T12:44:00Z'
    }
  ];

  const services: ServiceStatus[] = [
    {
      name: 'Web Application',
      status: 'online',
      uptime: 99.98,
      responseTime: 142,
      lastCheck: '2024-01-25T12:44:00Z',
      url: 'https://mybeing.com'
    },
    {
      name: 'API Server',
      status: 'online',
      uptime: 99.95,
      responseTime: 89,
      lastCheck: '2024-01-25T12:44:00Z',
      url: 'https://api.mybeing.com'
    },
    {
      name: 'Database',
      status: 'online',
      uptime: 100.0,
      responseTime: 23,
      lastCheck: '2024-01-25T12:44:00Z'
    },
    {
      name: 'AI Service',
      status: 'degraded',
      uptime: 97.2,
      responseTime: 1250,
      lastCheck: '2024-01-25T12:44:00Z',
      url: 'https://ai.mybeing.com'
    },
    {
      name: 'Email Service',
      status: 'online',
      uptime: 99.9,
      responseTime: 456,
      lastCheck: '2024-01-25T12:44:00Z'
    }
  ];

  const alerts: SystemAlert[] = [
    {
      id: 'alert_1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage has exceeded 65% for the past 10 minutes',
      timestamp: '2024-01-25T12:30:00Z',
      resolved: false
    },
    {
      id: 'alert_2',
      type: 'warning',
      title: 'AI Service Degraded',
      message: 'AI service response time is higher than normal',
      timestamp: '2024-01-25T11:45:00Z',
      resolved: false
    },
    {
      id: 'alert_3',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2:00 AM UTC',
      timestamp: '2024-01-25T10:00:00Z',
      resolved: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cpu usage':
        return <Cpu className="w-5 h-5" />;
      case 'memory usage':
        return <HardDrive className="w-5 h-5" />;
      case 'disk usage':
        return <Database className="w-5 h-5" />;
      case 'response time':
        return <Clock className="w-5 h-5" />;
      case 'active users':
        return <Users className="w-5 h-5" />;
      case 'error rate':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolving alert:', alertId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
          <p className="text-gray-600">Monitor system performance and service status</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric) => (
          <div key={metric.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  {getMetricIcon(metric.name)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(metric.status)}
                    <span className="text-sm text-gray-500 capitalize">{metric.status}</span>
                  </div>
                </div>
              </div>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Warning: {metric.threshold.warning}{metric.unit} | Critical: {metric.threshold.critical}{metric.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Service Status</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Uptime:</span> {service.uptime}%
                  </div>
                  <div>
                    <span className="font-medium">Response:</span> {service.responseTime}ms
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(service.lastCheck).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {alerts.filter(alert => !alert.resolved).length} Active
            </span>
          </div>
        </div>
        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Alerts</h3>
              <p className="mt-1 text-sm text-gray-500">All systems are running normally.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'bg-red-50 border-red-400' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="ml-4 px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
