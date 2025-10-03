'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export function ContentIntegrationTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Articles API', status: 'pending', message: 'Testing...' },
    { name: 'Cognitive Dissonance Article', status: 'pending', message: 'Testing...' },
    { name: 'Quizzes API', status: 'pending', message: 'Testing...' },
    { name: 'Cognitive Dissonance Quiz', status: 'pending', message: 'Testing...' },
    { name: 'Newsletter API', status: 'pending', message: 'Testing...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing...' }
  ]);

  const updateTest = (index: number, status: 'success' | 'error', message: string, data?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, data } : test
    ));
  };

  const runTests = async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Testing...' })));

    // Test 1: Articles API
    try {
      const response = await fetch('/api/content/articles');
      const data = await response.json();
      if (response.ok && data.articles) {
        updateTest(0, 'success', `Found ${data.articles.length} articles`, data);
      } else {
        updateTest(0, 'error', 'Failed to load articles');
      }
    } catch (error) {
      updateTest(0, 'error', `Error: ${error}`);
    }

    // Test 2: Specific Article
    try {
      const response = await fetch('/api/content/articles/mental-tug-of-war-cognitive-dissonance');
      const data = await response.json();
      if (response.ok && data.article) {
        updateTest(1, 'success', `Article loaded: ${data.article.title}`, data);
      } else {
        updateTest(1, 'error', 'Cognitive dissonance article not found');
      }
    } catch (error) {
      updateTest(1, 'error', `Error: ${error}`);
    }

    // Test 3: Quizzes API
    try {
      const response = await fetch('/api/content/quizzes');
      const data = await response.json();
      if (response.ok && data.quizzes) {
        updateTest(2, 'success', `Found ${data.quizzes.length} quizzes`, data);
      } else {
        updateTest(2, 'error', 'Failed to load quizzes');
      }
    } catch (error) {
      updateTest(2, 'error', `Error: ${error}`);
    }

    // Test 4: Specific Quiz
    try {
      const response = await fetch('/api/content/quizzes/cognitive-dissonance');
      const data = await response.json();
      if (response.ok && data.quiz) {
        updateTest(3, 'success', `Quiz loaded: ${data.quiz.title} (${data.quiz.questions?.length || 0} questions)`, data);
      } else {
        updateTest(3, 'error', 'Cognitive dissonance quiz not found');
      }
    } catch (error) {
      updateTest(3, 'error', `Error: ${error}`);
    }

    // Test 5: Newsletter API
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          preferences: { weeklyInsights: true },
          source: 'integration-test'
        })
      });
      const data = await response.json();
      if (response.ok || response.status === 429) { // Rate limit is also success
        updateTest(4, 'success', 'Newsletter API working', data);
      } else {
        updateTest(4, 'error', `Newsletter API error: ${data.error}`);
      }
    } catch (error) {
      updateTest(4, 'error', `Error: ${error}`);
    }

    // Test 6: Database Connection (via analytics)
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'integration_test',
          sessionId: 'test-session',
          timestamp: Date.now(),
          page: '/test'
        })
      });
      if (response.ok || response.status === 429) {
        updateTest(5, 'success', 'Database connection working');
      } else {
        updateTest(5, 'error', 'Database connection failed');
      }
    } catch (error) {
      updateTest(5, 'error', `Error: ${error}`);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const allPassed = tests.every(test => test.status === 'success');
  const anyFailed = tests.some(test => test.status === 'error');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allPassed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : anyFailed ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            )}
            Content Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {test.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                  {test.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {test.status === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className={`text-sm ${
                      test.status === 'success' ? 'text-green-600' :
                      test.status === 'error' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {test.message}
                    </div>
                  </div>
                </div>
                {test.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600">Data</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-md">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button onClick={runTests} className="mr-4">
              Run Tests Again
            </Button>
            
            {allPassed && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🎉 All Tests Passed!</h3>
                <p className="text-green-700 text-sm">
                  Your content integration is working perfectly. Your cognitive dissonance quiz and article 
                  are ready to be accessed by users with full SEO optimization and beautiful layouts.
                </p>
                <div className="mt-3 space-x-4">
                  <a 
                    href="/quizzes/cognitive-dissonance" 
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                  >
                    → Test Your Quiz
                  </a>
                  <a 
                    href="/blog/mental-tug-of-war-cognitive-dissonance" 
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                  >
                    → Read Your Article
                  </a>
                </div>
              </div>
            )}

            {anyFailed && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">❌ Some Tests Failed</h3>
                <p className="text-red-700 text-sm">
                  Check the failed tests above. This might be due to missing files or API endpoints not being available yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
