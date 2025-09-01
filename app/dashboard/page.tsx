import Link from 'next/link';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

export default async function DashboardPage() {
  const sessionId = cookies().get('sessionId')?.value;
  const runs = sessionId
    ? await prisma.quizRun.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, quizSlug: true, total: true, bandLabel: true, createdAt: true },
      })
    : [];

  const totalQuizzes = runs.length;
  const completionRate = totalQuizzes > 0 ? Math.min((totalQuizzes / 3) * 100, 100) : 0; // Assume 3 total quizzes for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-soft">
              <span className="mr-2 text-lg">📊</span>
              <span className="font-semibold">Personal Dashboard</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              <span className="block">Your Self-Discovery</span>
              <span className="block text-gradient bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h1>
            
            <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Track your progress, explore insights, and continue your path to self-awareness.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{totalQuizzes}</div>
                <div className="text-sm text-muted-foreground font-medium">Quizzes Completed</div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{Math.round(completionRate)}%</div>
                <div className="text-sm text-muted-foreground font-medium">Profile Complete</div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {runs.length > 0 ? Math.floor((Date.now() - new Date(runs[runs.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Days Since Start</div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground font-medium">Growth Potential</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Recent Results */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-3 text-2xl">📈</span>
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {runs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Begin?</h3>
                    <p className="text-muted-foreground mb-6">Take your first quiz to start discovering patterns in your thoughts and behaviors.</p>
                    <Link href="/quizzes">
                      <Button variant="gradient" size="lg">
                        <span className="mr-2">Start Your Journey</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {runs.map((r: { id: string; quizSlug: string; total: number; bandLabel: string; createdAt: Date }) => (
                      <div key={r.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl border border-primary/10 hover:shadow-soft transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                            🧠
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground capitalize">
                              {r.quizSlug.replace(/-/g, ' ')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {r.bandLabel} • Score: {r.total}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                          <Link href={`/chat/${r.id}`} className="text-xs text-primary hover:underline">
                            Discuss Results →
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {runs.length > 0 && (
                      <div className="pt-4 border-t border-border/30">
                        <div className="flex flex-wrap gap-3">
                          <a
                            href="/api/runs/export"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                          >
                            <span className="mr-2">📄</span>
                            Export JSON
                          </a>
                          <a
                            href="/api/runs/export.csv"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors duration-200"
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-3 text-xl">🎯</span>
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Profile Completion</span>
                      <span className="font-medium text-primary">{Math.round(completionRate)}%</span>
                    </div>
                    <Progress value={completionRate} variant="gradient" size="lg" />
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">
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

              {/* Recommended Next */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-3 text-xl">✨</span>
                    Recommended Next
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/quizzes/cognitive-dissonance" className="block group">
                    <div className="p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        The Mental Tug-of-War
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Explore cognitive dissonance patterns
                      </p>
                    </div>
                  </Link>
                  
                  <Link href="/quizzes/stress-patterns" className="block group">
                    <div className="p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Stress Patterns Check-in
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Identify your stress signals
                      </p>
                    </div>
                  </Link>
                  
                  <div className="pt-3 border-t border-border/30">
                    <Link href="/quizzes">
                      <Button variant="outline" size="sm" className="w-full">
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
