'use client';

import { useState, useEffect } from 'react';
import { Brain, MessageCircle, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface QuizResult {
  id: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  band: string;
  completedAt: Date;
}

export function UserDashboard() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [stats, setStats] = useState({
    quizzesCompleted: 3,
    articlesRead: 12,
    aiChats: 8,
    streakDays: 7
  });

  useEffect(() => {
    // Mock data - replace with API calls
    setQuizResults([
      {
        id: '1',
        quizTitle: 'Cognitive Dissonance Assessment',
        score: 28,
        maxScore: 40,
        band: 'Moderate Dissonance',
        completedAt: new Date('2024-01-15')
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 🌟</h1>
        <p className="text-purple-100">Continue your self-discovery journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.quizzesCompleted}</p>
            <p className="text-sm text-gray-600">Quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.articlesRead}</p>
            <p className="text-sm text-gray-600">Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.aiChats}</p>
            <p className="text-sm text-gray-600">AI Chats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-xl font-bold">{stats.streakDays}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          {quizResults.map((result) => (
            <div key={result.id} className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold">{result.quizTitle}</h3>
              <p className="text-sm text-gray-600">Score: {result.score}/{result.maxScore}</p>
              <p className="text-sm text-purple-600">{result.band}</p>
              <Button size="sm" className="mt-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat about results
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/quizzes">
          <Button className="w-full h-16 bg-purple-600 hover:bg-purple-700">
            <Brain className="w-6 h-6 mr-2" />
            Take New Quiz
          </Button>
        </Link>
        <Link href="/blog">
          <Button variant="outline" className="w-full h-16">
            <BookOpen className="w-6 h-6 mr-2" />
            Read Articles
          </Button>
        </Link>
      </div>
    </div>
  );
}
