'use client';

import { useState, useEffect } from 'react';
import type { ResearchAnalytics } from '@/lib/research';

export function ResearchDashboard() {
  const [analytics, setAnalytics] = useState<ResearchAnalytics | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [quizInsights, setQuizInsights] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'all'>('all');

  useEffect(() => {
    // Load research analytics from admin API (DB-backed)
    (async () => {
      try {
        const res = await fetch(`/api/admin/research/analytics?timeRange=${timeRange}`);
        if (res.ok) {
          const j = await res.json();
          setAnalytics(j);
        }
      } catch {}
    })();
  }, [timeRange]);

  const handleQuizSelect = async (quizSlug: string) => {
    setSelectedQuiz(quizSlug);
    try {
      const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(quizSlug)}/insights?timeRange=${timeRange}`);
      if (res.ok) {
        const j = await res.json();
        setQuizInsights(j);
      }
    } catch {}
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/research/export?format=${exportFormat}&timeRange=${timeRange}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-data-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      // Use safe removal to avoid NotFoundError if unmounted during navigation
      try {
        a.remove();
      } catch {}
      URL.revokeObjectURL(url);
    } catch {}
  };

  const handlePerQuizExport = async (format: 'json' | 'csv') => {
    if (!selectedQuiz) return;
    try {
      const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(selectedQuiz)}/export?format=${format}&timeRange=${timeRange}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedQuiz}-research-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      try {
        a.remove();
      } catch {}
      URL.revokeObjectURL(url);
    } catch {}
  };

  const handleDownloadReport = async () => {
    if (!selectedQuiz) return;
    try {
      const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(selectedQuiz)}/report?timeRange=${timeRange}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedQuiz}-research-report-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      try {
        a.remove();
      } catch {}
      URL.revokeObjectURL(url);
    } catch {}
  };

  useEffect(() => {
    if (selectedQuiz) {
      (async () => {
        try {
          const res = await fetch(`/api/admin/research/quiz/${encodeURIComponent(selectedQuiz)}/insights?timeRange=${timeRange}`);
          if (res.ok) setQuizInsights(await res.json());
        } catch {}
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading research data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Dashboard</h2>
          <p className="text-gray-600">Anonymous data analysis for quiz improvement</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            aria-label="Time range"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
            <option value="90d">Last 90d</option>
            <option value="all">All time</option>
          </select>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalResponses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">🧠</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(analytics.quizBreakdown).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm">⏰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Peak Hours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.timeAnalytics.peakUsageHours.slice(0, 2).join(', ')}h
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-sm">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Questions Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.responsePatterns.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Response Distribution</h3>
        <div className="space-y-3">
          {Object.entries(analytics.quizBreakdown).map(([quizSlug, count]) => (
            <div key={quizSlug} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuizSelect(quizSlug)}
                  className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                >
                  {quizSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
                {selectedQuiz === quizSlug && (
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">
                    Selected
                  </span>
                )}
                <a
                  href={`/quizzes/${quizSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View
                </a>
                <a
                  href={`/admin/quizzes?slug=${encodeURIComponent(quizSlug)}`}
                  className="text-xs text-gray-700 hover:underline"
                >
                  Edit
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{count} responses</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-brand-600 h-2 rounded-full" 
                    style={{ width: `${(count / analytics.totalResponses) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Insights */}
      {quizInsights && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-3">
            <span>Insights: {selectedQuiz.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            <a
              href={`/quizzes/${selectedQuiz}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View page
            </a>
            <a
              href={`/admin/quizzes?slug=${encodeURIComponent(selectedQuiz)}`}
              className="text-xs text-gray-700 hover:underline"
            >
              Edit in Admin
            </a>
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-gray-600">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="30d">Last 30d</option>
              <option value="90d">Last 90d</option>
              <option value="all">All time</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => handlePerQuizExport('json')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
              >
                Export Selected (JSON)
              </button>
              <button
                onClick={() => handlePerQuizExport('csv')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm"
              >
                Export Selected (CSV)
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm"
              >
                Download Report (.md)
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Completions:</span>
                  <span className="text-sm font-medium">{quizInsights.totalCompletions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className="text-sm font-medium">{quizInsights.averageScore.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Score Distribution</h4>
              <div className="space-y-2">
                {Object.entries(quizInsights.scoreDistribution).map(([band, count]) => (
                  <div key={band} className="flex justify-between">
                    <span className="text-sm text-gray-600">{band}:</span>
                    <span className="text-sm font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {quizInsights.commonResponsePatterns.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Response Patterns</h4>
              <div className="flex flex-wrap gap-2">
                {quizInsights.commonResponsePatterns.map((pattern: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {quizInsights.improvementSuggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Improvement Suggestions</h4>
              <ul className="space-y-2">
                {quizInsights.improvementSuggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-0.5">💡</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Response Patterns Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Analysis</h3>
        <div className="space-y-4">
          {analytics.responsePatterns.slice(0, 5).map((pattern, index) => (
            <div key={index} className="border-l-4 border-brand-200 pl-4">
              <h4 className="font-medium text-gray-900 text-sm mb-2">
                {pattern.questionText}
              </h4>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                {pattern.averageScore && (
                  <span>Avg Score: {pattern.averageScore.toFixed(1)}</span>
                )}
                <span>Responses: {Object.values(pattern.responseDistribution).reduce((a, b) => a + b, 0)}</span>
                {pattern.commonPatterns.length > 0 && (
                  <span>Patterns: {pattern.commonPatterns.join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 mt-0.5">🔒</span>
          <div>
            <h4 className="font-medium text-blue-900">Privacy & Research Ethics</h4>
            <p className="text-sm text-blue-800 mt-1">
              All data collected is completely anonymous. No personal information, email addresses, 
              or identifying details are stored. This research data helps improve quiz quality and 
              provides insights into behavioral patterns for academic research purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
