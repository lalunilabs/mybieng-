import { QuizBand } from '@/data/quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AIChat } from '@/components/ui/AIChat';
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Results Header */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl mb-2">Assessment Complete</CardTitle>
          <p className="text-lg text-gray-600">
            {quizTitle}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {score}
              </div>
              <p className="text-lg text-gray-600">
                out of {maxScore} points
              </p>
            </div>
            
            <div className="w-full max-w-xs mx-auto">
              <Progress value={percentage} className="h-3" />
              <p className="text-sm text-gray-500 mt-2">
                {percentage}% completion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Band */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-900">{band.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-800 text-lg leading-relaxed">
            {band.advice}
          </p>
        </CardContent>
      </Card>

      {/* Action Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Your Next Steps</CardTitle>
          <p className="text-gray-600">
            Based on your responses, here are specific actions to consider
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">This Week</h4>
              <p className="text-gray-700">
                {getWeeklyAction(band.label, score)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">This Month</h4>
              <p className="text-gray-700">
                {getMonthlyAction(band.label, score)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Insights</CardTitle>
          <p className="text-gray-600">
            Patterns from your responses
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateInsights(answers, band.label)}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onRetake} variant="outline">
          Retake Assessment
        </Button>
        <Button onClick={onShare} variant="secondary">
          Share Results
        </Button>
        <Button>
          Explore Next Assessment
        </Button>
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
      <div key="high-patterns" className="p-4 border-l-4 border-purple-500 bg-purple-50">
        <h5 className="font-semibold text-purple-900 mb-1">Strong Patterns</h5>
        <p className="text-purple-800 text-sm">
          Your responses indicate particularly strong patterns in {highScores.length} areas. 
          These are worth exploring further as they represent consistent behaviors or beliefs.
        </p>
      </div>
    );
  }
  
  if (lowScores.length > 0) {
    insights.push(
      <div key="low-patterns" className="p-4 border-l-4 border-green-500 bg-green-50">
        <h5 className="font-semibold text-green-900 mb-1">Areas of Strength</h5>
        <p className="text-green-800 text-sm">
          You show low scores in {lowScores.length} areas, suggesting these may be 
          strengths or areas where you have good alignment.
        </p>
      </div>
    );
  }
  
  insights.push(
    <div key="next-steps" className="p-4 border-l-4 border-gray-400 bg-gray-50">
      <h5 className="font-semibold text-gray-900 mb-1">Recommended Focus</h5>
      <p className="text-gray-800 text-sm">
        Based on your {bandLabel.toLowerCase()} results, focus on implementing the weekly 
        and monthly actions provided above. Track your progress and adjust as needed.
      </p>
    </div>
  );
  
  return insights;
}
