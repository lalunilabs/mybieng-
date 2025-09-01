'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Mail, BookOpen, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('cognitive-dissonance');

  const reports = [
    {
      id: 'cognitive-dissonance',
      title: 'Cognitive Dissonance Assessment',
      description: 'Your patterns of mental conflict and resolution',
      completedDate: '2024-08-28',
      score: 72,
      insights: [
        'High tendency for instant justification',
        'Moderate belief shift patterns',
        'Strong identity protection mechanisms'
      ]
    },
    {
      id: 'personality-patterns',
      title: 'Personality Patterns',
      description: 'Core behavioral and thinking patterns',
      completedDate: '2024-08-25',
      score: 85,
      insights: [
        'Strong analytical thinking',
        'Moderate social engagement',
        'High creative problem solving'
      ]
    }
  ];

  const readingMaterials = [
    {
      title: 'When Prophecy Fails',
      author: 'Leon Festinger',
      type: 'Book',
      relevance: 'Cognitive Dissonance',
      description: 'Classic study on how people handle conflicting beliefs',
      link: '#'
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      type: 'Book',
      relevance: 'Decision Making',
      description: 'Understanding your dual-process thinking patterns',
      link: '#'
    },
    {
      title: 'The Righteous Mind',
      author: 'Jonathan Haidt',
      type: 'Book',
      relevance: 'Moral Psychology',
      description: 'How moral reasoning affects your decisions',
      link: '#'
    },
    {
      title: 'Cognitive Dissonance Theory',
      author: 'Research Paper',
      type: 'Article',
      relevance: 'Psychology',
      description: 'Latest research on cognitive dissonance mechanisms',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Reports</h1>
            <p className="text-xl text-gray-600">
              Interactive insights from your assessments with personalized reading recommendations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Your Assessments
                  </CardTitle>
                  <CardDescription>
                    Click on any report to view detailed charts and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reports.map((report) => (
                    <motion.div
                      key={report.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedReport === report.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Completed: {report.completedDate}</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Score: {report.score}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chart Visualization */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Interactive Chart View
                  </CardTitle>
                  <CardDescription>
                    Visual breakdown of your assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mock Chart Area */}
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <p className="text-purple-700 font-medium">Interactive Chart</p>
                      <p className="text-purple-600 text-sm">
                        {reports.find(r => r.id === selectedReport)?.title} Results
                      </p>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reports.find(r => r.id === selectedReport)?.insights.map((insight, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">Key Insight</span>
                        </div>
                        <p className="text-sm text-gray-600">{insight}</p>
                      </div>
                    ))}
                  </div>

                  {/* Email Report Button */}
                  <div className="mt-6 flex gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Detailed Report
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reading Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recommended Reading
                </CardTitle>
                <CardDescription>
                  Books and articles to deepen your understanding based on your results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {readingMaterials.map((material, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{material.title}</h3>
                          <p className="text-sm text-gray-600">by {material.author}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {material.type}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {material.relevance}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Resource
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
