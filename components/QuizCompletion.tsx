'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/shadcn/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { QuizBand, getBandForScore } from '@/data/quizzes';
import { Mail, CheckCircle, BarChart3, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QuizReportModal } from '@/components/QuizReportModal';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

interface QuizCompletionProps {
  sessionId: string;
  quizId: string;
  quizTitle: string;
  quizSlug?: string;
  responses: Record<string, any> | Array<{
    questionId: string;
    answer: string | number;
    questionText: string;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>;
  score: number;
  maxScore: number;
  onComplete?: () => void;
}

export function QuizCompletion({
  sessionId,
  quizId,
  quizTitle,
  quizSlug: initialQuizSlug,
  responses: initialResponses,
  score,
  maxScore,
  onComplete
}: QuizCompletionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [band, setBand] = useState<QuizBand | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [quizSlug, setQuizSlug] = useState(initialQuizSlug || quizId);
  const [responses, setResponses] = useState<Array<{
    questionId: string;
    answer: string | number;
    questionText: string;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>>(Array.isArray(initialResponses) ? initialResponses : []);
  const [showReportModal, setShowReportModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Determine the band based on score
    const calculatedBand = getBandForScore(score, maxScore);
    setBand(calculatedBand);
    
    // If responses is a simple object, we need to convert it
    if (!Array.isArray(initialResponses) && quizId) {
      // For now, we'll just set an empty array since we don't have the question texts
      // In a real implementation, we would fetch the quiz details to get question texts
      setResponses([]);
    }
  }, [score, maxScore, quizId, initialResponses]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit quiz results
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          quizId,
          responses,
          score,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      // If email provided, send results
      if (email) {
        const emailResponse = await fetch('/api/quiz/email-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            quizId,
            quizTitle,
            score,
            maxScore,
            band: band?.label,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error('Failed to send email');
        }
      }

      setIsSubmitted(true);
      
      // For anonymous users, show the report modal immediately after submission
      if (!session) {
        setShowReportModal(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailReport = async (email: string) => {
    try {
      const emailResponse = await fetch('/api/quiz/email-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          quizId,
          quizTitle,
          score,
          maxScore,
          band: band?.label,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // For logged-in users, redirect to dashboard to see their report
  if (session && band) {
    router.push('/dashboard');
    return null;
  }

  if (showDetailedReport && band) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your {quizTitle} Report</h1>
            <Button 
              onClick={() => session ? router.push('/dashboard') : setShowDetailedReport(false)}
              variant="outline"
            >
              {session ? 'Back to Dashboard' : 'Back to Results'}
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                <p className="text-gray-600 mb-6">Here's your personalized report with insights and recommendations.</p>
                
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{score}</div>
                    <div className="text-gray-600">Your Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">{Math.round((score / maxScore) * 100)}%</div>
                    <div className="text-gray-600">Percentile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{band.label}</div>
                    <div className="text-gray-600">Category</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-4">What This Means</h3>
                <p className="text-purple-800 mb-4">{band?.advice}</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => session ? router.push('/dashboard') : router.push('/')}
                  variant="gradient"
                >
                  {session ? 'View All Reports' : 'Take Another Quiz'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/quizzes/${quizSlug}`)}
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Want Deeper Insights?
              </CardTitle>
              <CardDescription>
                Continue your journey with personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <p className="flex-grow text-gray-700">
                  Explore your results in depth with our AI-powered insights session.
                </p>
                <PrimaryCTA
                  variant="uiverse"
                  className="whitespace-nowrap"
                  onClick={() => {
                    const params = new URLSearchParams({
                      quizId: String(quizSlug),
                      band: String(band?.label || ''),
                      score: String(score),
                      maxScore: String(maxScore),
                    });
                    router.push(`/chat/${sessionId}?${params.toString()}`);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start AI Session
                </PrimaryCTA>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Great job completing the {quizTitle}. Here's a quick summary of your results.
            </p>
            
            <Card className="mb-8 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-100">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{score}</div>
                    <div className="text-sm text-gray-600">Your Score</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{Math.round((score / maxScore) * 100)}%</div>
                    <div className="text-sm text-gray-600">Percentile</div>
                  </div>
                  {band && (
                    <div className="text-center bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 border border-pink-100">
                      <div className="text-3xl font-bold text-pink-600 mb-1">{band.label}</div>
                      <div className="text-sm text-gray-600">Category</div>
                    </div>
                  )}
                </div>
                
                {band && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-purple-900">What This Means</h3>
                    </div>
                    <p className="text-purple-800">{band.advice}</p>
                  </div>
                )}
                
                <Button 
                  onClick={() => setShowDetailedReport(true)}
                  variant="gradient"
                  className="rounded-xl py-2.5 font-medium px-6"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>
            
            {!session && (
              <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Mail className="w-5 h-5" />
                    Get Your Results
                  </CardTitle>
                  <CardDescription className="text-blue-800">
                    Enter your email to receive a detailed report with personalized insights and recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-900">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12 px-4 rounded-xl focus-visible:ring-brand-500"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || isSubmitted}
                      variant="gradient"
                      className="w-full rounded-xl py-2.5 font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Report Sent!
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Email My Detailed Report
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Report Modal for Anonymous Users */}
      {band && (
        <QuizReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            router.push('/');
          }}
          score={score}
          maxScore={maxScore}
          band={band}
          quizTitle={quizTitle}
          quizSlug={quizSlug}
          responses={responses}
          onEmailReport={handleEmailReport}
        />
      )}
    </>
  );
}
