'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { getBandForScore } from '@/data/quizzes';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('cognitive-dissonance');
  const [showEmailField, setShowEmailField] = useState(false);
  const [emailField, setEmailField] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();

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

  // Derive selected report convenience values
  const selected = reports.find((r) => r.id === selectedReport);
  const maxScore = 100;
  const band = selected ? getBandForScore(selected.score, maxScore) : null;

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

  const base = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: 'Reports', item: `${base}/reports` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      
      <div className="pb-12 px-4 sm:px-6 lg:px-8">
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
                  <CardTitle>Your Assessments</CardTitle>
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
                          {(() => { const b = getBandForScore(report.score, 100); return `Summary: ${b ? b.label : '—'}`; })()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Actions for selected report */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <PrimaryCTA
                  href={`/reports/${selectedReport}?score=${selected?.score ?? 0}&maxScore=${maxScore}`}
                  surface="reports_page"
                  eventName="view_report_detail"
                  variant="outline"
                  className="flex-1"
                >
                  View full report
                </PrimaryCTA>
                <PrimaryCTA
                  surface="reports_page"
                  eventName="ask_ai_from_reports"
                  className="flex-1"
                  variant="uiverse"
                  onClick={() => {
                    const id = (globalThis as any)?.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
                    const params = new URLSearchParams({
                      quizId: selectedReport,
                      score: String(selected?.score ?? 0),
                      maxScore: String(maxScore),
                      ...(band ? { band: band.label } : {}),
                    });
                    router.push(`/chat/${id}?${params.toString()}`);
                  }}
                >
                  Ask AI about this
                </PrimaryCTA>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Interactive Chart View</CardTitle>
                  <CardDescription>
                    Visual breakdown of your assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mock Chart Area */}
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
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
                        <div className="mb-1 text-sm font-medium text-gray-900">Key Insight</div>
                        <p className="text-sm text-gray-600">{insight}</p>
                      </div>
                    ))}
                  </div>

                  {/* Email Report Button */}
                  <div className="mt-6 space-y-3">
                    <div className="flex gap-4">
                      <PrimaryCTA 
                        surface="reports_page" 
                        eventName="email_report_click"
                        onClick={() => setShowEmailField((v) => !v)}
                      >
                        Email Detailed Report
                      </PrimaryCTA>
                      <PrimaryCTA surface="reports_page" eventName="download_report" variant="outline">
                        Download PDF
                      </PrimaryCTA>
                    </div>
                    {showEmailField && (
                      <form
                        className="flex flex-col sm:flex-row gap-3"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!emailField || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
                            toast.error('Please enter a valid email');
                            return;
                          }
                          try {
                            setSending(true);
                            const res = await fetch('/api/quiz/email-results', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                email: emailField,
                                quizId: selectedReport,
                                quizTitle: selected?.title || selectedReport,
                                score: selected?.score ?? 0,
                                maxScore: maxScore,
                                band: band?.label,
                              }),
                            });
                            if (res.ok) {
                              toast.success('Detailed report will arrive by email shortly.');
                              setShowEmailField(false);
                              setEmailField('');
                            } else {
                              const j = await res.json().catch(() => ({}));
                              toast.error(j.error || 'Failed to queue email');
                            }
                          } catch {
                            toast.error('Network error. Please try again.');
                          } finally {
                            setSending(false);
                          }
                        }}
                      >
                        <input
                          type="email"
                          inputMode="email"
                          placeholder="Enter your email"
                          value={emailField}
                          onChange={(e) => setEmailField(e.target.value)}
                          className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          aria-label="Email address"
                          required
                        />
                        <Button type="submit" disabled={sending} className="px-5">
                          {sending ? 'Sending…' : 'Send report'}
                        </Button>
                      </form>
                    )}
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
                <CardTitle>Recommended Reading</CardTitle>
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
                      <PrimaryCTA href={material.link} surface="reports_resources" eventName="view_resource" variant="outline" size="sm" className="w-full">
                        View Resource
                      </PrimaryCTA>
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
