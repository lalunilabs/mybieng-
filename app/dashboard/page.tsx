import Link from 'next/link';
import { cookies } from 'next/headers';
import { prisma, safeDbOperation } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import InsightsReviewsPanel from '@/components/dashboard/InsightsReviewsPanel';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BarChart3, MessageCircle, Calendar, TrendingUp, BookOpen } from "lucide-react";
import { QuizReportVisualization } from '@/components/ui/QuizReportVisualization';
import { headers } from 'next/headers';
import { PRICING } from '@/lib/constants';
import { getItemPriceWithDiscounts } from '@/lib/subscription';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const email = (session as any)?.user?.email as string | undefined;
  // TODO: Implement proper premium check
  const isPremium = false;
  // TODO: Implement subscription stats
  const subscriptionStats: { endDate: Date } | null = null;
  // Safe, precomputed renewal date for rendering (avoids TS narrowing issues)
  const renewalDateText: string = '';
  const sessionId = cookies().get('sessionId')?.value;
  const runs = sessionId
    ? await safeDbOperation(
        () => prisma!.quizRun.findMany({
          where: { sessionId },
          orderBy: { createdAt: 'desc' },
          include: { 
            answers: true,
            user: true
          },
        }),
        []
      )
    : [];

  const totalQuizzes = runs.length;
  const completionRate = totalQuizzes > 0 ? Math.min((totalQuizzes / 5) * 100, 100) : 0; // Assume 5 total quizzes for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-lilac-200/20 to-lilac-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-lilac-300/20 to-lilac-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-lilac-100 to-pink-100 px-6 py-3 text-sm font-medium text-lilac-800 ring-1 ring-lilac-200/30 shadow-sm">
              <span className="mr-2 text-lg">📊</span>
              <span className="font-semibold">Personal Dashboard</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="bg-gradient-to-r from-lilac-400 to-lilac-300 bg-clip-text text-transparent">{session?.user?.name || 'Explorer'}</span>
            </h1>
            
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-gray-700">
              Track your progress, explore insights, and continue your path to self-awareness.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-lilac-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Quizzes Taken</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-lilac-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 mb-4">
                  <span className="text-lg">📈</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(completionRate)}%</p>
                <p className="text-sm font-medium text-gray-600">Profile Complete</p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-lilac-200 overflow-hidden">
              <CardContent className="pt-6 pb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-lilac-500 to-lilac-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-lg">📅</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {runs.length > 0 ? Math.floor((Date.now() - new Date(runs[runs.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Days Since Last Quiz</p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-lilac-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-lilac-400 to-lilac-300 text-lilac-900 mb-4">
                  <span className="text-lg">⭐</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {isPremium ? 'Premium' : 'Free'}
                </p>
                <p className="text-sm font-medium text-gray-600">Membership</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Recent Results */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900">
                    <span className="mr-3 text-2xl">📈</span>
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {runs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-lilac-100 to-lilac-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-lilac-600">🎯</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Begin?</h3>
                      <p className="text-gray-600 mb-6">Take your first quiz to start discovering patterns in your thoughts and behaviors.</p>
                      <PrimaryCTA href="/start" surface="dashboard_empty" variant="uiverse" className="px-6 py-2.5 rounded-xl font-medium transition-all duration-300">
                        <span className="mr-2">Start Your Journey</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </PrimaryCTA>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {runs.map((r) => {
                        // Get the price for this quiz with any applicable discounts
                        const quizPrice = email ? getItemPriceWithDiscounts(email, 'quiz', r.quizSlug) : 50;
                        const isFree = quizPrice === 0;
                        
                        return (
                          <div key={r.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-lilac-400 to-lilac-300 rounded-xl flex items-center justify-center text-lilac-900 text-lg shadow-sm">
                                🧠
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {r.quizSlug.replace(/-/g, ' ')}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-lilac-100 text-lilac-800">
                                    {r.bandLabel}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    Score: {r.total} {isFree ? '(Free)' : `($${quizPrice})`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 mb-2">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/chat/${r.id}`} className="text-xs text-lilac-600 hover:text-lilac-800 font-medium px-2 py-1 rounded-lg hover:bg-lilac-50 transition-colors duration-200">
                                  Discuss
                                </Link>
                                <Link href={`/reports?runId=${r.id}`} className="text-xs text-lilac-600 hover:text-lilac-800 font-medium px-2 py-1 rounded-lg hover:bg-lilac-50 transition-colors duration-200">
                                  Report
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {runs.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-3">
                            <a
                              href="/api/runs/export"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                              <span className="mr-2">📄</span>
                              Export JSON
                            </a>
                            <a
                              href="/api/runs/export.csv"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                              <span className="mr-2">📊</span>
                              Export CSV
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Latest Detailed Report Preview */}
              {runs.length > 0 && runs[0].answers && (
                <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-3 text-2xl">📊</span>
                        Detailed Report Preview
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/reports/${runs[0].id}`}>
                          <Button variant="outline" size="sm" className="border-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                            View Full Report
                          </Button>
                        </Link>
                        <PrimaryCTA
                          href={`/chat/${runs[0].id}?quizId=${encodeURIComponent(runs[0].quizSlug)}&score=${encodeURIComponent(String(runs[0].total))}&maxScore=50&band=${encodeURIComponent(runs[0].bandLabel || '')}`}
                          surface="dashboard_report_preview"
                          eventName="dashboard_chat_start"
                          size="sm"
                          variant="uiverse"
                          className="rounded-lg"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" /> Ask AI
                        </PrimaryCTA>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <QuizReportVisualization 
                        score={runs[0].total}
                        maxScore={50}
                        band={{ label: runs[0].bandLabel, advice: '', min: 0, max: 0 }}
                        quizTitle={runs[0].quizSlug.replace(/-/g, ' ')}
                        quizSlug={runs[0].quizSlug}
                        responses={runs[0].answers.map((r: any) => ({
                          questionId: r.id,
                          answer: r.value,
                          questionText: r.question || 'Question text not available',
                          questionType: 'scale'
                        }))}
                        onRetake={() => {}}
                        onShare={() => {}}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Insights & Reviews (collapsible, gated) */}
              <InsightsReviewsPanel isPremium={isPremium} />
              {/* Progress Card */}
              <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900">
                    <span className="mr-3 text-xl">🎯</span>
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Profile Completion</span>
                      <span className="font-medium text-lilac-600">{Math.round(completionRate)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-lilac-400 to-lilac-300 h-2.5 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {completionRate < 50 
                        ? "You're just getting started! Complete more assessments to unlock deeper insights."
                        : completionRate < 100
                        ? "Great progress! You're building a comprehensive self-awareness profile."
                        : "Excellent! You've completed your initial assessment suite. Consider retaking quizzes to track changes over time."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Details */}
              {isPremium && subscriptionStats && (
                <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-gray-900">
                      <span className="mr-3 text-xl">💳</span>
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Plan</span>
                        <span className="font-medium text-gray-900">Premium Monthly</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price</span>
                        <span className="font-medium text-gray-900">${PRICING.monthly}/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Renewal Date</span>
                        <span className="font-medium text-gray-900">{renewalDateText}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-700 font-medium mb-3">Monthly Benefits</div>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-lilac-500 mt-1">•</span>
                          <span className="text-gray-600">2 premium articles included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lilac-500 mt-1">•</span>
                          <span className="text-gray-600">Subscriber discounts on additional content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lilac-500 mt-1">•</span>
                          <span className="text-gray-600">Priority AI chat support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-lilac-500 mt-1">•</span>
                          <span className="text-gray-600">Unlimited AI conversations</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/pricing">
                        <Button variant="outline" size="sm" className="w-full border-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                          Manage Subscription
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Recommended Next */}
              <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900">
                    <span className="mr-3 text-xl">✨</span>
                    Recommended Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/quizzes/cognitive-dissonance" className="block group">
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-lilac-300 hover:bg-lilac-50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-lilac-400 to-lilac-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lilac-900 text-sm">🧠</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-lilac-700 transition-colors">
                            The Mental Tug-of-War
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Explore cognitive dissonance patterns
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/quizzes/stress-patterns" className="block group">
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-lilac-300 hover:bg-lilac-50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-lilac-400 to-lilac-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lilac-900 text-sm">📊</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-lilac-700 transition-colors">
                            Stress Patterns Check-in
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Identify your stress signals
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Link href="/quizzes">
                      <Button variant="outline" size="sm" className="w-full border-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                        View All Quizzes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
