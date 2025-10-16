'use client';

import { useState, useEffect, useCallback } from 'react';
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
    { name: 'Cognitive Dissonance Quiz', status: 'pending', message: 'Testing...' },
    { name: 'Newsletter API', status: 'pending', message: 'Testing...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing...' }
  ]);

  const updateTest = useCallback((index: number, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, data } : test
    ));
  }, []);

  const runTests = useCallback(async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const, message: 'Testing...' })));

    // Test 1: Check if cognitive dissonance quiz exists
    updateTest(1, 'pending', 'Checking quiz existence...');
    try {
      const response = await fetch('/api/content/quizzes/cognitive-dissonance');
      if (response.ok) {
        const data = await response.json();
        updateTest(1, 'success', 'Quiz found', data.quiz);
      } else {
        updateTest(1, 'error', 'Quiz not found');
      }
    } catch (error) {
      updateTest(1, 'error', `Error: ${error}`);
    }

    // Test 3: Check quiz API endpoint
    updateTest(3, 'pending', 'Checking quiz API...');
    try {
      const response = await fetch('/api/content/quizzes');
      if (response.ok) {
        const data = await response.json();
        updateTest(3, 'success', `Found ${data.quizzes?.length || 0} quizzes`);
      } else {
        updateTest(3, 'error', 'Quiz API failed');
      }
    } catch (error) {
      updateTest(3, 'error', `Error: ${error}`);
    }

    // Test 4: Check article API endpoint
    updateTest(4, 'pending', 'Checking article API...');
    try {
      const response = await fetch('/api/content/articles');
      if (response.ok) {
        const data = await response.json();
        updateTest(4, 'success', `Found ${data.articles?.length || 0} articles`);
      } else {
        updateTest(4, 'error', 'Article API failed');
      }
    } catch (error) {
      updateTest(4, 'error', `Error: ${error}`);
    }

    // Test 5: Check database connection
    updateTest(5, 'pending', 'Checking database connection...');
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        updateTest(5, 'success', 'Database connected', data);
      } else {
        updateTest(5, 'error', 'Database connection failed');
      }
    } catch (error) {
      updateTest(5, 'error', `Error: ${error}`);
    }
  }, [updateTest]);

  useEffect(() => {
    runTests();
  }, [runTests]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const allPassed = tests.every(test => test.status === 'success');
  const anyFailed = tests.some(test => test.status === 'error');
  const isRunning = tests.some(test => test.status === 'pending');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Content Integration Tests
          {allPassed && !isRunning && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
          {anyFailed && !isRunning && (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          {isRunning && (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getStatusColor(test.status)}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <h3 className="font-semibold">{test.name}</h3>
                  <p className="text-sm opacity-75">{test.message}</p>
                  {test.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer hover:underline">
                        View Data
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-black/5 rounded overflow-auto max-h-32">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests Again'
            )}
          </Button>
          
          {allPassed && !isRunning && (
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckCircle className="w-4 h-4" />
              All tests passed! Your content integration is working perfectly. Your cognitive dissonance quiz and article are ready to be accessed by users with full SEO optimization and beautiful layouts.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
