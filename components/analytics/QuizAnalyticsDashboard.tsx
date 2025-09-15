'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface QuizAnalytics {
  totalCompletions: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  completionTrend: { date: string; count: number }[];
  questionAnalytics: Array<{
    questionId: string;
    questionText: string;
    averageResponse: number;
    responseDistribution: Record<string, number>;
  }>;
  bandDistribution: Array<{
    band: string;
    count: number;
    percentage: number;
  }>;
}

export function QuizAnalyticsDashboard({ quizSlug }: { quizSlug?: string }) {
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const url = quizSlug 
          ? `/api/admin/research/quiz/${quizSlug}?timeRange=${timeRange}`
          : `/api/admin/research/analytics?timeRange=${timeRange}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [quizSlug, timeRange]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data</div>;
  }

  // Chart data preparation
  const scoreData = {
    labels: Object.keys(analytics.scoreDistribution),
    datasets: [
      {
        label: 'Number of Responses',
        data: Object.values(analytics.scoreDistribution),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const trendData = {
    labels: analytics.completionTrend.map((item) => item.date),
    datasets: [
      {
        label: 'Daily Completions',
        data: analytics.completionTrend.map((item) => item.count),
        borderColor: 'rgba(79, 70, 229, 1)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const bandData = {
    labels: analytics.bandDistribution.map((item) => item.band),
    datasets: [
      {
        data: analytics.bandDistribution.map((item) => item.percentage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const question = selectedQuestion 
    ? analytics.questionAnalytics.find((q) => q.questionId === selectedQuestion)
    : analytics.questionAnalytics[0];

  const questionData = question ? {
    labels: Object.keys(question.responseDistribution),
    datasets: [
      {
        label: 'Responses',
        data: Object.values(question.responseDistribution),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {quizSlug ? `${quizSlug} Analytics` : 'Quiz Analytics Dashboard'}
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCompletions}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '24h' ? 'In the last 24 hours' : 
               timeRange === '7d' ? 'In the last 7 days' :
               timeRange === '30d' ? 'In the last 30 days' :
               timeRange === '90d' ? 'In the last 90 days' : 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of {Object.keys(analytics.scoreDistribution).length} possible points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Band</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.bandDistribution[0]?.band || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.bandDistribution[0]?.percentage.toFixed(1)}% of responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.questionAnalytics.length}</div>
            <p className="text-xs text-muted-foreground">
              Questions in this quiz
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="scores">Score Distribution</TabsTrigger>
          <TabsTrigger value="bands">Band Distribution</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
              <CardDescription>
                Number of quiz completions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
              <Line 
                data={trendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                How scores are distributed across all completions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
              <Bar 
                data={scoreData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Band Distribution</CardTitle>
              <CardDescription>
                Percentage of respondents in each result band
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
              <div className="flex">
                <div className="w-1/2">
                  <Pie 
                    data={bandData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
                <div className="w-1/2 pl-4">
                  <div className="space-y-2">
                    {analytics.bandDistribution.map((band) => (
                      <div key={band.band} className="flex items-center">
                        <div 
                          className="h-4 w-4 rounded-full mr-2"
                          style={{
                            backgroundColor: bandData.datasets[0].backgroundColor[
                              analytics.bandDistribution.indexOf(band) % 
                              bandData.datasets[0].backgroundColor.length
                            ]
                          }}
                        />
                        <span className="text-sm">
                          {band.band}: {band.percentage.toFixed(1)}% ({band.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Question Analysis</CardTitle>
                  <CardDescription>
                    Detailed analysis of responses to each question
                  </CardDescription>
                </div>
                <select
                  value={selectedQuestion || ''}
                  onChange={(e) => setSelectedQuestion(e.target.value || null)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  {analytics.questionAnalytics.map((q) => (
                    <option key={q.questionId} value={q.questionId}>
                      {q.questionText.length > 50 
                        ? `${q.questionText.substring(0, 50)}...` 
                        : q.questionText}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
              {question && questionData ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">{question.questionText}</h3>
                  <div className="h-64">
                    <Bar 
                      data={questionData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Average response: {question.averageResponse.toFixed(1)}
                    </p>
                  </div>
                </div>
              ) : (
                <p>No question selected or data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
