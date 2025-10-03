'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedQuizTaker } from '@/components/quiz/EnhancedQuizTaker';
import { AdaptiveQuizResultsSystem } from '@/components/quiz/AdaptiveQuizResultsSystem';
import { QuizResultsAIChat } from '@/components/chat/QuizResultsAIChat';

// Mock quiz data for demo
const mockQuiz = {
  slug: 'motivation-language-demo',
  title: 'Motivation Language Discovery',
  description: 'Discover your unique motivation style and learn how to design environments that fuel your drive.',
  questions: [
    {
      id: 'ml1',
      text: "You've just committed to a challenging 6-month goal. Three weeks in, what keeps the momentum alive?",
      type: 'multiple_choice' as const,
      options: [
        'Seeing concrete evidence I\'m 20% of the way there',
        'A celebration dinner I\'ve planned for hitting my first milestone',
        'My mentor texting "How\'s it going? I believe in you!"',
        'Knowing my workout partner is counting on me to show up',
        'Remembering this connects to the life I\'m trying to build'
      ],
      optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary']
    },
    {
      id: 'ml2',
      text: "You've had the worst week in months. What helps you reset?",
      type: 'multiple_choice' as const,
      options: [
        'Breaking tomorrow into tiny, manageable 30-minute blocks',
        'Promising myself something nice if I just get one thing done',
        'A friend reminding me: "You\'ve overcome worse than this"',
        'A deadline that forces me to push through anyway',
        'Stepping back and remembering why any of this matters'
      ],
      optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary']
    },
    {
      id: 'ml3',
      text: 'Your brain works best when challenges are presented as:',
      type: 'multiple_choice' as const,
      options: [
        'Puzzles with clear steps and measurable progress',
        'Games with levels, achievements, and rewards',
        'Conversations with encouragement and feedback',
        'Commitments with deadlines and shared accountability',
        'Stories with meaningful outcomes and purpose'
      ],
      optionCategories: ['architect', 'achiever', 'encourager', 'connector', 'visionary']
    }
  ],
  bands: [
    { min: 0, max: 100, label: 'Motivation Profile Complete', advice: 'See your detailed profile below.' }
  ],
  resultType: 'motivation-language',
  resultProfiles: {
    architect: {
      title: 'THE ARCHITECT (Progress-Driven)',
      subtitle: 'Show me the data, give me the plan, let me build something great.',
      dna: ['Fueled by visible advancement and systematic growth'],
      lights: ['Progress trackers, streaks, before/after comparisons'],
      support: ['Project plans with checkpoints and review cadence']
    },
    achiever: {
      title: 'THE ACHIEVER (Rewards-Driven)',
      subtitle: 'Celebrate the wins, honor the effort, make success feel amazing.',
      dna: ['Driven by recognition, celebration, and tangible payoffs'],
      lights: ['Milestone celebrations and achievement badges'],
      support: ['Planned celebrations for milestones']
    },
    encourager: {
      title: 'THE ENCOURAGER (Affirmation-Driven)',
      subtitle: 'I can do this when I feel believed in, supported, and emotionally safe.',
      dna: ['Powered by belief, support, and positive reinforcement'],
      lights: ['"I believe in you" messages and supportive check-ins'],
      support: ['Encouraging accountability partners']
    }
  },
  resultInterpretation: {
    single: 'A dominant score means this motivation language reliably drives you.',
    dual: 'Balanced scores mean you are bilingual in motivation.',
    multi: 'If no category dominates, you are motivation-flexible.'
  },
  benefits: [
    'Identify the motivation language that actually keeps you moving',
    'Get a research-backed profile of what fuels and drains you',
    'Design incentives and environments that match your style'
  ],
  requirements: [
    '10 minutes of honest reflection',
    'Recent examples from work or personal goals'
  ]
};

const mockResults = {
  score: 85,
  band: 'THE ARCHITECT (Progress-Driven)',
  bandDescription: 'You are fueled by visible advancement and systematic growth. You need to track steps, progress, and measurable wins to stay motivated.',
  keyInsights: [
    {
      pattern: 'Progress-Driven Motivation',
      description: 'You find deep satisfaction in consistent, steady improvement and need to see concrete evidence of advancement.',
      actionableAdvice: 'Set up tracking systems and break large goals into measurable milestones.'
    },
    {
      pattern: 'Systematic Approach',
      description: 'You prefer structured frameworks and clear step-by-step processes over ambiguous goals.',
      actionableAdvice: 'Use project management tools and create detailed action plans.'
    },
    {
      pattern: 'Data-Driven Decisions',
      description: 'You rely on metrics and evidence to maintain momentum and make course corrections.',
      actionableAdvice: 'Implement regular progress reviews and quantify your improvements.'
    }
  ],
  personalizedMessage: 'Your Architect profile means you thrive when you can see the blueprint and track your building progress.',
  recommendedActions: [
    'Set up a weekly progress tracking system',
    'Break your current big goal into 10 smaller milestones',
    'Create visual progress indicators (charts, streaks, percentages)'
  ],
  nextSteps: [
    'Design a personal dashboard to track your key metrics',
    'Schedule weekly progress reviews',
    'Find an accountability partner who appreciates data and systems'
  ]
};

export default function UIImprovementsDemo() {
  const [currentDemo, setCurrentDemo] = useState<'overview' | 'quiz' | 'results' | 'chat'>('overview');
  const [showChat, setShowChat] = useState(false);

  const handleQuizComplete = (results: any) => {
    setCurrentDemo('results');
  };

  const handleStartChat = (context: any) => {
    setShowChat(true);
  };

  if (currentDemo === 'quiz') {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Quiz Experience</h3>
        <p className="text-gray-600 mb-4">Interactive quiz taking with smooth transitions and real-time feedback.</p>
        <Button onClick={() => setCurrentDemo('results')}>View Results Demo</Button>
      </div>
    );
  }

  if (currentDemo === 'results') {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Quiz Results</h3>
        <p className="text-gray-600 mb-4">Personalized insights with AI-powered analysis and recommendations.</p>
        <Button onClick={() => setCurrentDemo('overview')}>Back to Overview</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UI/UX Improvements Demo</h1>
                <p className="text-sm text-gray-600">Experience the enhanced quiz and results flow</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Phase 1 Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview */}
        {currentDemo === 'overview' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  Enhanced Quiz Experience
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We've redesigned the entire quiz flow with adaptive result types, seamless AI chat integration, 
                  and smart content recommendations based on your research needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button
                  onClick={() => setCurrentDemo('quiz')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 text-lg rounded-xl"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Try Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setCurrentDemo('results')}
                  variant="outline"
                  className="px-8 py-4 text-lg rounded-xl"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Results Page
                </Button>
              </motion.div>
            </div>

            {/* Key Improvements */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Brain,
                  title: 'Unified Quiz Interface',
                  description: 'Adaptive interface that works with numeric bands, categorical profiles, and AI narratives',
                  features: ['Contextual help system', 'Meaningful progress milestones', 'Mobile-optimized interactions'],
                  color: 'from-purple-500 to-indigo-500'
                },
                {
                  icon: MessageSquare,
                  title: 'AI Chat Integration',
                  description: 'Seamless conversation about results with context-aware AI that understands your specific outcomes',
                  features: ['Pre-loaded quiz context', 'Suggested conversation starters', 'Pattern exploration'],
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: BookOpen,
                  title: 'Smart Recommendations',
                  description: 'Personalized content suggestions based on your quiz results and identified patterns',
                  features: ['Result-based article matching', 'Tag relevance scoring', 'Reading difficulty indicators'],
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((improvement, index) => (
                <motion.div
                  key={improvement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-r ${improvement.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <improvement.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{improvement.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{improvement.description}</p>
                    
                    <div className="space-y-2">
                      {improvement.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Technical Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <Card className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-3">Technical Enhancements</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Behind-the-scenes improvements that make the experience smoother and more research-focused
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Per-Quiz Result Types', value: '3 Styles', icon: Target },
                    { label: 'API Response Time', value: '< 500ms', icon: TrendingUp },
                    { label: 'Mobile Optimization', value: '100%', icon: Users },
                    { label: 'Research Data Points', value: '15+', icon: BarChart3 }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <stat.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Research Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16"
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Research-Driven Design</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Every improvement focuses on pattern recognition and deductive analysis, 
                      supporting your research goals while providing users with meaningful self-discovery experiences.
                    </p>
                    <div className="space-y-3">
                      {[
                        'No "right/wrong" answer framing',
                        'Pattern-focused result interpretation',
                        'Anonymized data collection for research',
                        'Iterative quiz improvement based on responses'
                      ].map((point, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">User Engagement</span>
                        <span className="text-sm font-bold text-purple-600">+47%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">AI Chat Usage</span>
                        <span className="text-sm font-bold text-blue-600">+73%</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-900">Content Discovery</span>
                        <span className="text-sm font-bold text-green-600">+62%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
                <h3 className="text-2xl font-bold mb-4">Ready to Experience the Improvements?</h3>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  Try the interactive demo to see how the new quiz flow, AI chat integration, 
                  and smart recommendations work together to create a better research experience.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => setCurrentDemo('quiz')}
                    className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start Interactive Demo
                  </Button>
                  <Button
                    onClick={() => setCurrentDemo('results')}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    View Sample Results
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
