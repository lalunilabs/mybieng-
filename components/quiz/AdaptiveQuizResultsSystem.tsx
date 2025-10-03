'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  MessageCircle,
  Download,
  Share2,
  RotateCcw,
  ChevronRight,
  Star,
  Clock,
  Users,
  BarChart3,
  User,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Enhanced types to support all three result styles
export type QuizResultStyle = 'numeric' | 'categorical' | 'ai-narrative' | 'hybrid';

export interface NumericBandResult {
  score: number;
  maxScore: number;
  percentage: number;
  band: {
    min: number;
    max: number;
    label: string;
    advice: string;
    color?: string;
  };
  breakdown?: Record<string, number>;
}

export interface CategoricalResult {
  primaryCategory: string;
  secondaryCategory?: string;
  categoryScores: Record<string, number>;
  profile: {
    title: string;
    subtitle: string;
    description: string;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };
}

export interface AIGeneratedResult {
  personalizedNarrative: string;
  keyInsights: string[];
  behavioralPatterns: string[];
  growthAreas: string[];
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  confidence: number; // AI confidence in analysis
}

export interface AdaptiveQuizResult {
  id: string;
  quizSlug: string;
  quizTitle: string;
  resultStyle: QuizResultStyle;
  completedAt: string;
  totalTime: number;
  
  // Style-specific results
  numericResult?: NumericBandResult;
  categoricalResult?: CategoricalResult;
  aiResult?: AIGeneratedResult;
  
  // Common metadata
  researchContext: {
    methodology: string;
    sampleSize: number;
    reliability: number;
    validatedBy: string[];
  };
  
  // Related content
  recommendations: {
    articles: Array<{ title: string; slug: string; readTime: number }>;
    quizzes: Array<{ title: string; slug: string; description: string }>;
  };
}

interface AdaptiveQuizResultsProps {
  result: AdaptiveQuizResult;
  onRetake?: () => void;
  onStartChat?: () => void;
  onGenerateAIAnalysis?: () => Promise<AIGeneratedResult>;
}

export function AdaptiveQuizResultsSystem({ 
  result, 
  onRetake, 
  onStartChat,
  onGenerateAIAnalysis 
}: AdaptiveQuizResultsProps) {
  const [activeView, setActiveView] = useState<'results' | 'insights' | 'actions'>('results');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIGeneratedResult | null>(result.aiResult || null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleGenerateAIAnalysis = async () => {
    if (!onGenerateAIAnalysis || aiAnalysis) return;
    
    setIsGeneratingAI(true);
    try {
      const analysis = await onGenerateAIAnalysis();
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Failed to generate AI analysis:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getResultStyleIcon = () => {
    switch (result.resultStyle) {
      case 'numeric': return BarChart3;
      case 'categorical': return User;
      case 'ai-narrative': return Sparkles;
      case 'hybrid': return Brain;
      default: return Target;
    }
  };

  const getResultStyleLabel = () => {
    switch (result.resultStyle) {
      case 'numeric': return 'Numeric Band Scoring';
      case 'categorical': return 'Profile-Based Analysis';
      case 'ai-narrative': return 'AI Narrative Analysis';
      case 'hybrid': return 'Comprehensive Analysis';
      default: return 'Analysis';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold"
        >
          <Star className="w-4 h-4" />
          Assessment Complete
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Your {result.quizTitle} Results
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Completed in {formatTime(result.totalTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            {React.createElement(getResultStyleIcon(), { className: "w-4 h-4" })}
            <span>{getResultStyleLabel()}</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {onStartChat && (
          <Button onClick={onStartChat} className="bg-purple-600 hover:bg-purple-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat About Results
          </Button>
        )}
        
        {result.resultStyle !== 'ai-narrative' && !aiAnalysis && onGenerateAIAnalysis && (
          <Button 
            onClick={handleGenerateAIAnalysis} 
            disabled={isGeneratingAI}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGeneratingAI ? 'Generating AI Analysis...' : 'Get AI Analysis'}
          </Button>
        )}
        
        {onRetake && (
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        )}
      </motion.div>

      {/* View Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'results', label: 'Results', icon: Target },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
            { id: 'actions', label: 'Action Plan', icon: ChevronRight }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'results' && (
            <ResultsView result={result} aiAnalysis={aiAnalysis} />
          )}
          {activeView === 'insights' && (
            <InsightsView result={result} aiAnalysis={aiAnalysis} />
          )}
          {activeView === 'actions' && (
            <ActionsView result={result} aiAnalysis={aiAnalysis} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Results View Component
function ResultsView({ result, aiAnalysis }: { result: AdaptiveQuizResult; aiAnalysis: AIGeneratedResult | null }) {
  return (
    <div className="space-y-8">
      {/* Numeric Results */}
      {result.numericResult && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Score Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {result.numericResult.score}/{result.numericResult.maxScore}
                  </div>
                  <div className="text-lg text-gray-600">
                    {result.numericResult.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  result.numericResult.band.color === 'green' ? 'bg-green-50 border-green-200' :
                  result.numericResult.band.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="font-semibold text-lg mb-2">{result.numericResult.band.label}</div>
                  <p className="text-sm">{result.numericResult.band.advice}</p>
                </div>
              </div>
              
              {result.numericResult.breakdown && (
                <div>
                  <h4 className="font-semibold mb-4">Score Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(result.numericResult.breakdown).map(([dimension, score]) => (
                      <div key={dimension}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{dimension}</span>
                          <span className="text-sm text-gray-500">{score}</span>
                        </div>
                        <Progress value={(score / result.numericResult!.maxScore) * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categorical Results */}
      {result.categoricalResult && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600 mb-2">
                  {result.categoricalResult.profile.title}
                </h3>
                <p className="text-lg text-gray-600 italic">
                  {result.categoricalResult.profile.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {result.categoricalResult.profile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3">Growth Areas</h4>
                  <ul className="space-y-2">
                    {result.categoricalResult.profile.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-700 mb-3">Category Scores</h4>
                  <div className="space-y-2">
                    {Object.entries(result.categoricalResult.categoryScores).map(([category, score]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant={score >= 8 ? 'default' : score >= 5 ? 'secondary' : 'outline'}>
                          {score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generated Results */}
      {(result.aiResult || aiAnalysis) && (
        <Card className="border-0 shadow-lg border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI-Generated Analysis
              <Badge variant="secondary" className="ml-2">
                {((result.aiResult?.confidence || aiAnalysis?.confidence || 0) * 100).toFixed(0)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {result.aiResult?.personalizedNarrative || aiAnalysis?.personalizedNarrative}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Insights View Component
function InsightsView({ result, aiAnalysis }: { result: AdaptiveQuizResult; aiAnalysis: AIGeneratedResult | null }) {
  const insights = result.aiResult?.keyInsights || aiAnalysis?.keyInsights || [];
  const patterns = result.aiResult?.behavioralPatterns || aiAnalysis?.behavioralPatterns || [];
  
  return (
    <div className="space-y-6">
      {insights.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {patterns.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Behavioral Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-purple-800 font-medium">{pattern}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Actions View Component
function ActionsView({ result, aiAnalysis }: { result: AdaptiveQuizResult; aiAnalysis: AIGeneratedResult | null }) {
  const actionPlan = result.aiResult?.actionPlan || aiAnalysis?.actionPlan;
  const recommendations = result.categoricalResult?.profile.recommendations || [];
  
  return (
    <div className="space-y-6">
      {actionPlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700">Immediate Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {actionPlan.immediate.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-700">Short-term Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {actionPlan.shortTerm.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-700">Long-term Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {actionPlan.longTerm.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {recommendations.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
