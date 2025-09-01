'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface QuizCompletionProps {
  quizSlug: string;
  quizTitle: string;
  responses: Array<{
    questionId: string;
    questionText: string;
    answer: string | number;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>;
}

export function QuizCompletion({ quizSlug, quizTitle, responses }: QuizCompletionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [quickResults, setQuickResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizSlug,
          responses,
          userEmail: email
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsComplete(true);
        setChatSessionId(data.chatSessionId);
        setQuickResults(data.analysis);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">
            Your detailed results have been sent to <strong>{email}</strong>
          </p>
        </div>

        {quickResults && (
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-brand-900 mb-2">Quick Results</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-brand-800">{quickResults.band}</p>
                <p className="text-sm text-brand-600">{quickResults.bandDescription}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-700">{quickResults.score}</p>
                <p className="text-xs text-brand-500">Score</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📧 Check Your Email</h4>
            <p className="text-sm text-gray-600">
              Your comprehensive analysis, insights, and personalized recommendations 
              have been sent to your email address.
            </p>
          </div>

          {chatSessionId && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">🤖 AI Chat Available</h4>
              <p className="text-sm text-purple-700 mb-3">
                Have questions about your results? Chat with our AI for deeper insights.
              </p>
              <a href={`/chat/${chatSessionId}`}>
                <Button className="w-full">
                  Start AI Chat Session
                </Button>
              </a>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <a href="/quizzes" className="flex-1">
              <Button variant="outline" className="w-full">
                Take Another Quiz
              </Button>
            </a>
            <a href="/blog" className="flex-1">
              <Button variant="outline" className="w-full">
                Read Our Blog
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your privacy matters: We don't store your responses on our servers. 
            All analysis is done in real-time and sent directly to your email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Results</h2>
        <p className="text-gray-600">
          Enter your email to receive your personalized {quizTitle} analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          />
          <p className="mt-2 text-xs text-gray-500">
            We'll send your detailed analysis and insights to this email address
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">What You'll Receive:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Personalized analysis of your response patterns</li>
            <li>• Actionable insights and recommendations</li>
            <li>• Specific next steps for personal growth</li>
            <li>• Access to AI chat for deeper exploration</li>
          </ul>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!email.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing Your Responses...
            </span>
          ) : (
            'Get My Results'
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <span className="mr-1">🔒</span>
            Privacy Protected
          </span>
          <span className="flex items-center">
            <span className="mr-1">📧</span>
            Email Only
          </span>
          <span className="flex items-center">
            <span className="mr-1">🤖</span>
            AI Insights
          </span>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          No account required • No data stored • Instant analysis
        </p>
      </div>
    </div>
  );
}
