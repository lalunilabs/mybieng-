import { QuizBand } from '@/data/quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AIChat } from '@/components/ui/AIChat';
import { motion } from 'framer-motion';
import { Trophy, Target, Calendar, Lightbulb, Share2, RotateCcw, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface QuizResultsProps {
  score: number;
  maxScore: number;
  band: QuizBand;
  quizTitle: string;
  quizSlug: string;
  answers: Record<string, any>;
  onRetake?: () => void;
  onShare?: () => void;
}

export function QuizResults({
  score,
  maxScore,
  band,
  quizTitle,
  quizSlug,
  answers,
  onRetake,
  onShare,
}: QuizResultsProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Celebration Header */}
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
            Assessment Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've completed the <strong>{quizTitle}</strong>. Here are your personalized insights.
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card variant="elevated" className="text-center overflow-hidden border-2 border-purple-100 shadow-brutal">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {score}
                  </div>
                  <p className="text-lg text-gray-600">
                    out of {maxScore} points
                  </p>
                </div>
                
                <div className="w-full max-w-md mx-auto">
                  <Progress value={percentage} className="h-4 shadow-inner" />
                  <p className="text-sm text-gray-500 mt-3 font-medium">
                    {percentage}% Score
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card variant="elevated" className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-brutal">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-900">{band.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 text-lg leading-relaxed">
                {band.advice}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card variant="elevated" className="shadow-brutal">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl">Your Action Plan</CardTitle>
              </div>
              <p className="text-gray-600">
                Personalized steps based on your assessment results
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🏃</span>
                    <h4 className="font-bold text-blue-900">This Week</h4>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    {getWeeklyAction(band.label, score)}
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-bold text-green-900">This Month</h4>
                  </div>
                  <p className="text-green-800 leading-relaxed">
                    {getMonthlyAction(band.label, score)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card variant="elevated" className="shadow-brutal">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl">Key Insights</CardTitle>
              </div>
              <p className="text-gray-600">
                Patterns discovered from your responses
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generateInsights(answers, band.label)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={onRetake} 
            variant="outline" 
            size="lg"
            className="group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Retake Assessment
          </Button>
          <Button 
            onClick={onShare} 
            variant="secondary" 
            size="lg"
            className="group"
          >
            <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Share Results
          </Button>
          <Button 
            variant="gradient" 
            size="lg"
            className="group shadow-glow hover:shadow-glow-lg"
          >
            <span className="mr-2">Explore More Quizzes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function getWeeklyAction(bandLabel: string, score: number): string {
  const actions: Record<string, string> = {
    'Low dissonance': 'Choose one decision this week to examine more deeply. Ask yourself: "What value am I honoring with this choice?"',
    'Moderate dissonance': 'Identify one small action you can take that better aligns with a value you care about. Make it specific and achievable.',
    'High dissonance': 'Pick one area where you feel the most tension between values and actions. Write down the specific behavior and the value it conflicts with.',
    'Low stress pattern load': 'Maintain your current wellness habits and add one 5-minute daily check-in to notice early stress signals.',
    'Moderate stress pattern load': 'Choose one stress amplifier (late screens, skipped meals, etc.) to reduce for the next 7 days.',
    'High stress pattern load': 'Schedule one supportive conversation with someone you trust and create a simple evening wind-down routine.',
    'Developing awareness': 'Start a 5-minute daily reflection practice. Write one observation about your behavior or emotions each day.',
    'Growing awareness': 'Seek feedback from one trusted person about a specific behavior pattern you\'ve noticed in yourself.',
    'Strong awareness': 'Use your self-awareness to mentor someone else or share one insight that might help others.',
  };

  return actions[bandLabel] || 'Focus on one small, specific action that moves you toward better alignment.';
}

function getMonthlyAction(bandLabel: string, score: number): string {
  const actions: Record<string, string> = {
    'Low dissonance': 'Deepen your self-awareness by exploring one area where you might have blind spots. Consider a 360-degree feedback process.',
    'Moderate dissonance': 'Create a simple system to track decisions and their alignment with your values. Review patterns monthly.',
    'High dissonance': 'Work with a coach or therapist to explore the deeper patterns behind your value-behavior gaps.',
    'Low stress pattern load': 'Establish one new wellness habit that builds resilience, like regular exercise or meditation practice.',
    'Moderate stress pattern load': 'Create a comprehensive stress management plan including boundaries, recovery activities, and support systems.',
    'High stress pattern load': 'Consider professional support to develop sustainable stress management strategies and address root causes.',
    'Developing awareness': 'Join a group or community focused on personal growth to accelerate your self-awareness journey.',
    'Growing awareness': 'Develop a systematic approach to gathering feedback and tracking your personal growth over time.',
    'Strong awareness': 'Consider how you can use your self-awareness to contribute to your community or help others grow.',
  };

  return actions[bandLabel] || 'Create a systematic approach to personal growth and pattern recognition.';
}

function generateInsights(answers: Record<string, any>, bandLabel: string): React.ReactNode[] {
  const insights = [];
  
  // Basic pattern recognition based on common response patterns
  const highScores = Object.entries(answers).filter(([_, value]) => 
    typeof value === 'number' && value >= 4
  );
  
  const lowScores = Object.entries(answers).filter(([_, value]) => 
    typeof value === 'number' && value <= 2
  );
  
  if (highScores.length > 0) {
    insights.push(
      <div key="high-patterns" className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🔥</span>
          <h5 className="font-bold text-purple-900">Strong Patterns</h5>
        </div>
        <p className="text-purple-800 leading-relaxed">
          Your responses indicate particularly strong patterns in {highScores.length} areas. 
          These represent consistent behaviors or beliefs worth exploring further.
        </p>
      </div>
    );
  }
  
  if (lowScores.length > 0) {
    insights.push(
      <div key="low-patterns" className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">✨</span>
          <h5 className="font-bold text-green-900">Areas of Strength</h5>
        </div>
        <p className="text-green-800 leading-relaxed">
          You show balanced responses in {lowScores.length} areas, suggesting these may be 
          strengths or areas where you have good alignment.
        </p>
      </div>
    );
  }
  
  insights.push(
    <div key="next-steps" className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🎯</span>
        <h5 className="font-bold text-blue-900">Recommended Focus</h5>
      </div>
      <p className="text-blue-800 leading-relaxed">
        Based on your {bandLabel.toLowerCase()} results, focus on implementing the weekly 
        and monthly actions provided above. Track your progress and adjust as needed.
      </p>
    </div>
  );
  
  return insights;
}
