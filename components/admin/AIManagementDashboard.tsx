'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Activity, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Clock,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AIProvider {
  name: string;
  enabled: boolean;
  model: string;
  priority: number;
  hasApiKey: boolean;
  status?: 'healthy' | 'unhealthy' | 'unknown';
}

interface AIStats {
  totalRequests: number;
  totalTokens: number;
  averageResponseTime: number;
  successRate: number;
  topProvider: string;
  costEstimate: number;
}

export function AIManagementDashboard() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    setLoading(true);
    try {
      // Load AI configuration and health status
      const [configResponse, healthResponse] = await Promise.all([
        fetch('/api/admin/ai/config'),
        fetch('/api/ai/chat', { method: 'GET' })
      ]);

      if (configResponse.ok) {
        const configData = await configResponse.json();
        setProviders(configData.providers || []);
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealthStatus(healthData.health || {});
      }

      // Mock stats for demonstration
      setStats({
        totalRequests: 1247,
        totalTokens: 892340,
        averageResponseTime: 1850,
        successRate: 98.5,
        topProvider: 'OpenAI',
        costEstimate: 24.67
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'openai':
        return '🤖';
      case 'claude':
      case 'anthropic':
        return '🧠';
      case 'gemini':
      case 'google':
        return '💎';
      default:
        return '🔮';
    }
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <Clock className="w-4 h-4 text-gray-400" />;
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: boolean | undefined) => {
    if (status === undefined) return 'gray';
    return status ? 'green' : 'red';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI System Overview</h2>
          <p className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={loadAIData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tokens Used</p>
                    <p className="text-2xl font-bold text-gray-900">{(stats.totalTokens / 1000).toFixed(0)}K</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}ms</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* AI Providers Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getProviderIcon(provider.name)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Model: {provider.model}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Priority: {provider.priority}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={provider.enabled ? 'default' : 'secondary'}>
                        {provider.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Badge variant={provider.hasApiKey ? 'default' : 'error'}>
                        {provider.hasApiKey ? 'API Key Set' : 'No API Key'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(healthStatus[provider.name])}
                    <span className={`text-sm font-medium text-${getStatusColor(healthStatus[provider.name])}-600`}>
                      {healthStatus[provider.name] === undefined ? 'Unknown' :
                       healthStatus[provider.name] ? 'Healthy' : 'Unhealthy'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Environment Variables</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>OPENAI_API_KEY:</span>
                  <Badge variant={process.env.OPENAI_API_KEY ? 'success' : 'error'}>
                    {process.env.OPENAI_API_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>ANTHROPIC_API_KEY:</span>
                  <Badge variant={process.env.ANTHROPIC_API_KEY ? 'success' : 'error'}>
                    {process.env.ANTHROPIC_API_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>GOOGLE_AI_API_KEY:</span>
                  <Badge variant={process.env.GOOGLE_AI_API_KEY ? 'success' : 'error'}>
                    {process.env.GOOGLE_AI_API_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure Providers
              </Button>
              <Button className="w-full" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                View Usage Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">System Operational</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All AI providers are responding normally
                </p>
              </div>

              {stats && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Monthly Cost:</span>
                    <span className="font-medium">${stats.costEstimate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Top Performing Provider:</span>
                    <span className="font-medium">{stats.topProvider}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium text-green-600">{stats.successRate}%</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
