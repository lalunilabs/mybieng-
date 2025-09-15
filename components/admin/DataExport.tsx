'use client';

import { useState } from 'react';
import { 
  Download, 
  FileText, 
  Database, 
  Users, 
  MessageSquare, 
  BarChart3,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
  Archive
} from 'lucide-react';

interface ExportJob {
  id: string;
  name: string;
  type: 'users' | 'content' | 'subscriptions' | 'ai_chats' | 'analytics' | 'system_logs';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadUrl?: string;
  filters: Record<string, any>;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'users' | 'content' | 'subscriptions' | 'ai_chats' | 'analytics' | 'system_logs';
  format: 'csv' | 'json' | 'xlsx';
  icon: React.ComponentType<any>;
  fields: string[];
  estimatedSize: string;
}

export function DataExport() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);

  const exportTemplates: ExportTemplate[] = [
    {
      id: 'users_export',
      name: 'User Data Export',
      description: 'Export user profiles, subscription status, and activity data',
      type: 'users',
      format: 'csv',
      icon: Users,
      fields: ['id', 'email', 'name', 'subscription_status', 'created_at', 'last_login'],
      estimatedSize: '2.5 MB'
    },
    {
      id: 'content_export',
      name: 'Content Export',
      description: 'Export blogs, quizzes, and related metadata',
      type: 'content',
      format: 'json',
      icon: FileText,
      fields: ['id', 'title', 'type', 'status', 'created_at', 'updated_at', 'author'],
      estimatedSize: '1.8 MB'
    },
    {
      id: 'subscriptions_export',
      name: 'Subscription Data',
      description: 'Export subscription details and billing information',
      type: 'subscriptions',
      format: 'xlsx',
      icon: BarChart3,
      fields: ['subscription_id', 'user_id', 'plan', 'status', 'amount', 'billing_cycle'],
      estimatedSize: '850 KB'
    },
    {
      id: 'ai_chats_export',
      name: 'AI Chat Logs',
      description: 'Export AI conversation data and analytics',
      type: 'ai_chats',
      format: 'json',
      icon: MessageSquare,
      fields: ['chat_id', 'user_id', 'mode', 'messages', 'feedback', 'created_at'],
      estimatedSize: '12.3 MB'
    },
    {
      id: 'analytics_export',
      name: 'Analytics Data',
      description: 'Export usage analytics and performance metrics',
      type: 'analytics',
      format: 'csv',
      icon: BarChart3,
      fields: ['date', 'page_views', 'unique_users', 'quiz_completions', 'ai_interactions'],
      estimatedSize: '3.2 MB'
    },
    {
      id: 'system_logs_export',
      name: 'System Logs',
      description: 'Export system logs and error reports',
      type: 'system_logs',
      format: 'json',
      icon: Database,
      fields: ['timestamp', 'level', 'message', 'source', 'user_id', 'ip_address'],
      estimatedSize: '45.7 MB'
    }
  ];

  const recentExports: ExportJob[] = [
    {
      id: 'export_1',
      name: 'User Data Export',
      type: 'users',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-25T10:30:00Z',
      completedAt: '2024-01-25T10:32:15Z',
      fileSize: '2.4 MB',
      downloadUrl: '/api/exports/download/export_1',
      filters: { dateRange: '2024-01-01 to 2024-01-25' }
    },
    {
      id: 'export_2',
      name: 'AI Chat Logs',
      type: 'ai_chats',
      status: 'processing',
      progress: 67,
      createdAt: '2024-01-25T11:15:00Z',
      filters: { dateRange: '2024-01-20 to 2024-01-25', mode: 'all' }
    },
    {
      id: 'export_3',
      name: 'Analytics Data',
      type: 'analytics',
      status: 'failed',
      progress: 0,
      createdAt: '2024-01-25T09:45:00Z',
      filters: { dateRange: '2024-01-01 to 2024-01-25' }
    }
  ];

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'json':
        return <FileJson className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleExport = () => {
    if (!selectedTemplate) return;

    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log('Export started for template:', selectedTemplate);
    }, 2000);
  };

  const handleDownload = (downloadUrl: string) => {
    console.log('Downloading file from:', downloadUrl);
  };

  const handleRetry = (exportId: string) => {
    console.log('Retrying export:', exportId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Export & Reports</h2>
          <p className="text-gray-600">Export platform data and generate custom reports</p>
        </div>
      </div>

      {/* Export Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Export Templates</h3>
          <p className="text-sm text-gray-600">Choose a data export template to get started</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <template.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getFormatIcon(template.format)}
                        <span>{template.format.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Archive className="w-3 h-3" />
                        <span>{template.estimatedSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Configuration */}
      {selectedTemplate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Export Configuration</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Starting Export...' : 'Start Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Exports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Exports</h3>
        </div>
        <div className="p-6">
          {recentExports.length === 0 ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exports yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start your first data export using the templates above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExports.map((exportJob) => (
                <div key={exportJob.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(exportJob.status)}
                        <div>
                          <h4 className="font-medium text-gray-900">{exportJob.name}</h4>
                          <p className="text-sm text-gray-600">
                            Created {new Date(exportJob.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exportJob.status)}`}>
                        {exportJob.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {exportJob.status === 'processing' && (
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${exportJob.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{exportJob.progress}%</span>
                        </div>
                      )}
                      {exportJob.status === 'completed' && exportJob.downloadUrl && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{exportJob.fileSize}</span>
                          <button
                            onClick={() => handleDownload(exportJob.downloadUrl!)}
                            className="flex items-center gap-1 px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      )}
                      {exportJob.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(exportJob.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Retry
                        </button>
                      )}
                    </div>
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
