'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { 
  Trophy, 
  Target, 
  Calendar, 
  Lightbulb, 
  Share2, 
  Download,
  BarChart3,
  TrendingUp,
  Brain,
  Heart,
  Zap
} from 'lucide-react';
import { QuizBand } from '@/data/quizzes';

interface QuizReportVisualizationProps {
  score: number;
  maxScore: number;
  band: QuizBand;
  quizTitle: string;
  quizSlug: string;
  responses: Array<{
    questionId: string;
    questionText: string;
    answer: string | number;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>;
  onRetake?: () => void;
  onShare?: () => void;
}

export function QuizReportVisualization({
  score,
  maxScore,
  band,
  quizTitle,
  quizSlug,
  responses,
  onRetake,
  onShare,
}: QuizReportVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'insights'>('overview');
  const percentage = Math.round((score / maxScore) * 100);

  // Generate visualization data
  const visualizationData = generateVisualizationData(responses, band);

  const downloadReport = async () => {
    // Generate and download PDF report
    const reportData = {
      quizTitle,
      score,
      maxScore,
      percentage,
      band,
      responses,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizSlug}-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Header with Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your {quizTitle} Report
          </h1>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-gray-600">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{percentage}%</div>
              <div className="text-gray-600">Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{band.label}</div>
              <div className="text-gray-600">Category</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'detailed', label: 'Detailed Analysis', icon: Brain },
              { id: 'insights', label: 'Insights & Actions', icon: Lightbulb },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab 
              score={score} 
              maxScore={maxScore} 
              band={band} 
              percentage={percentage}
              visualizationData={visualizationData}
            />
          )}
          {activeTab === 'detailed' && (
            <DetailedTab responses={responses} band={band} />
          )}
          {activeTab === 'insights' && (
            <InsightsTab band={band} score={score} />
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button onClick={downloadReport} variant="outline" size="lg" className="group">
            <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Download Report
          </Button>
          <Button onClick={onShare} variant="outline" size="lg" className="group">
            <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Share Results
          </Button>
          <Button onClick={onRetake} variant="outline" size="lg">
            Retake Quiz
          </Button>
          <Button variant="gradient" size="lg" className="shadow-glow hover:shadow-glow-lg">
            Explore More Quizzes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function OverviewTab({ 
  score, 
  maxScore, 
  band, 
  percentage, 
  visualizationData 
}: {
  score: number;
  maxScore: number;
  band: QuizBand;
  percentage: number;
  visualizationData: any;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Score Visualization */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            {/* Circular Progress */}
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-purple-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${percentage * 2.51} 251`}
                className="text-purple-600"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2">{band.label}</h3>
            <p className="text-purple-700">{band.advice}</p>
          </div>
        </div>
      </Card>

      {/* Pattern Visualization */}
      <Card className="p-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Response Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visualizationData.patterns.map((pattern: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{pattern.category}</span>
                  <span className="text-gray-600">{pattern.value}%</span>
                </div>
                <Progress value={pattern.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="lg:col-span-2 p-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visualizationData.metrics.map((metric: any, index: number) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailedTab({ responses, band }: { responses: any[]; band: QuizBand }) {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <CardHeader>
          <CardTitle>Response Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div key={index} className="border-l-4 border-purple-200 pl-6 py-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Question {index + 1}
                </h4>
                <p className="text-gray-700 mb-3">{response.questionText}</p>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your Response:</span>
                    <span className="font-medium text-purple-700">{response.answer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightsTab({ band, score }: { band: QuizBand; score: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Weekly Actions */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="w-5 h-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed">
            {getWeeklyAction(band.label, score)}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Actions */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Target className="w-5 h-5" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-800 leading-relaxed">
            {getMonthlyAction(band.label, score)}
          </p>
        </CardContent>
      </Card>

      {/* Personalized Insights */}
      <Card className="lg:col-span-2 p-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Cognitive Patterns
              </h4>
              <p className="text-purple-800 text-sm leading-relaxed">
                Your responses suggest strong analytical thinking with balanced emotional awareness. 
                Consider exploring areas where intuition and logic can work together.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Emotional Intelligence
              </h4>
              <p className="text-orange-800 text-sm leading-relaxed">
                You demonstrate good self-awareness and empathy. Focus on developing emotional 
                regulation strategies for high-stress situations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateVisualizationData(responses: any[], band: QuizBand) {
  // Generate mock visualization data based on responses
  const patterns = [
    { category: 'Self-Awareness', value: Math.floor(Math.random() * 30) + 60 },
    { category: 'Decision Making', value: Math.floor(Math.random() * 30) + 50 },
    { category: 'Emotional Regulation', value: Math.floor(Math.random() * 30) + 40 },
    { category: 'Social Patterns', value: Math.floor(Math.random() * 30) + 70 },
  ];

  const metrics = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      value: '85%',
      label: 'Cognitive Clarity',
      description: 'Clear thinking patterns'
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      value: '72%',
      label: 'Emotional Balance',
      description: 'Emotional stability'
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      value: '68%',
      label: 'Action Alignment',
      description: 'Values-behavior match'
    },
  ];

  return { patterns, metrics };
}

function getWeeklyAction(bandLabel: string, score: number): string {
  const actions: Record<string, string> = {
    'Low dissonance': 'Choose one decision this week to examine more deeply. Ask yourself: "What value am I honoring with this choice?"',
    'Moderate dissonance': 'Identify one small action you can take that better aligns with a value you care about. Make it specific and achievable.',
    'High dissonance': 'Pick one area where you feel the most tension between values and actions. Write down the specific behavior and the value it conflicts with.',
  };

  return actions[bandLabel] || 'Focus on one small, specific action that moves you toward better alignment.';
}

function getMonthlyAction(bandLabel: string, score: number): string {
  const actions: Record<string, string> = {
    'Low dissonance': 'Deepen your self-awareness by exploring one area where you might have blind spots. Consider a 360-degree feedback process.',
    'Moderate dissonance': 'Create a simple system to track decisions and their alignment with your values. Review patterns monthly.',
    'High dissonance': 'Work with a coach or therapist to explore the deeper patterns behind your value-behavior gaps.',
  };

  return actions[bandLabel] || 'Create a systematic approach to personal growth and pattern recognition.';
}
