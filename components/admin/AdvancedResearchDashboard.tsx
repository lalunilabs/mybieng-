'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Brain, 
  Target, 
  Download, 
  Filter,
  Calendar,
  PieChart,
  Activity,
  Zap,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface PatternDistribution {
  instant_justification: number;
  gradual_belief_shift: number;
  selective_evidence: number;
  identity_protection: number;
  social_reality_distortion: number;
}

interface ResearchMetrics {
  totalAssessments: number;
  activeUsers: number;
  completionRate: number;
  avgEngagementTime: number;
  patternDistribution: PatternDistribution;
  demographicBreakdown: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    engagementLevels: Record<string, number>;
  };
  longitudinalTrends: {
    date: string;
    assessments: number;
    patterns: PatternDistribution;
  }[];
  correlationInsights: {
    pattern: string;
    correlatedFactors: string[];
    strength: number;
  }[];
}

export function AdvancedResearchDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setMetrics({
        totalAssessments: 12847,
        activeUsers: 8934,
        completionRate: 87.3,
        avgEngagementTime: 342,
        patternDistribution: {
          instant_justification: 28.4,
          gradual_belief_shift: 22.1,
          selective_evidence: 19.8,
          identity_protection: 16.7,
          social_reality_distortion: 13.0
        },
        demographicBreakdown: {
          ageGroups: {
            '18-24': 15.2,
            '25-34': 34.7,
            '35-44': 28.9,
            '45-54': 16.1,
            '55+': 5.1
          },
          locations: {
            'North America': 42.3,
            'Europe': 31.7,
            'Asia': 18.9,
            'Other': 7.1
          },
          engagementLevels: {
            'High': 23.4,
            'Medium': 51.2,
            'Low': 25.4
          }
        },
        longitudinalTrends: [
          {
            date: '2024-01',
            assessments: 1200,
            patterns: {
              instant_justification: 30.1,
              gradual_belief_shift: 20.5,
              selective_evidence: 18.9,
              identity_protection: 17.2,
              social_reality_distortion: 13.3
            }
          },
          // More data points...
        ],
        correlationInsights: [
          {
            pattern: 'instant_justification',
            correlatedFactors: ['High stress levels', 'Time pressure', 'Decision fatigue'],
            strength: 0.73
          },
          {
            pattern: 'identity_protection',
            correlatedFactors: ['Major life changes', 'Social pressure', 'Career transitions'],
            strength: 0.68
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const patternColors = {
    instant_justification: 'bg-red-500',
    gradual_belief_shift: 'bg-blue-500',
    selective_evidence: 'bg-green-500',
    identity_protection: 'bg-purple-500',
    social_reality_distortion: 'bg-orange-500'
  };

  const patternLabels = {
    instant_justification: 'Instant Justification',
    gradual_belief_shift: 'Gradual Belief Shift',
    selective_evidence: 'Selective Evidence',
    identity_protection: 'Identity Protection',
    social_reality_distortion: 'Social Reality Distortion'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12"
        >
          <Brain className="w-full h-full text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Advanced analytics and insights from MyBeing assessments
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalAssessments.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+12.3% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.activeUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+8.7% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+2.1% from last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor(metrics.avgEngagementTime / 60)}m</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">-1.2% from last month</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pattern Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Pattern Distribution</h3>
              <PieChart className="w-6 h-6 text-gray-600" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(metrics.patternDistribution).map(([pattern, percentage]) => (
                <div key={pattern} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {patternLabels[pattern as keyof typeof patternLabels]}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${patternColors[pattern as keyof typeof patternColors]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Demographic Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Demographics</h3>
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Age Groups</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.demographicBreakdown.ageGroups).map(([age, percentage]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{age}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(percentage / 35) * 100}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Engagement Levels</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.demographicBreakdown.engagementLevels).map(([level, percentage]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              level === 'High' ? 'bg-green-500' : 
                              level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(percentage / 52) * 100}%` }}
                            transition={{ duration: 1, delay: 0.7 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Correlation Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Correlation Insights</h3>
            <Zap className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.correlationInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {patternLabels[insight.pattern as keyof typeof patternLabels]}
                  </h4>
                  <span className="text-sm font-bold text-indigo-600">
                    {Math.round(insight.strength * 100)}% correlation
                  </span>
                </div>
                <div className="space-y-2">
                  {insight.correlatedFactors.map((factor, factorIndex) => (
                    <div key={factorIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      <span className="text-sm text-gray-600">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Research Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Research Opportunities</h3>
          <p className="text-indigo-100 mb-6">
            Based on current data patterns, here are potential research directions and publication opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Pattern Evolution Study</h4>
              <p className="text-sm text-indigo-100">
                Longitudinal analysis of how cognitive dissonance patterns change over time
              </p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Demographic Correlations</h4>
              <p className="text-sm text-indigo-100">
                Age and cultural factors in pattern distribution and intervention effectiveness
              </p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl">
              <h4 className="font-semibold mb-2">Intervention Outcomes</h4>
              <p className="text-sm text-indigo-100">
                Effectiveness of personalized recommendations on pattern modification
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
