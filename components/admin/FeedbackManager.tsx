'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserFeedback, QuizData } from '@/lib/quiz';

interface FeedbackManagerProps {
  feedback: UserFeedback[];
  quizzes: QuizData[];
  onDeleteFeedback: (id: string) => void;
}

export function FeedbackManager({ feedback, quizzes, onDeleteFeedback }: FeedbackManagerProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  const filteredFeedback = feedback
    .filter(f => selectedQuiz === 'all' || f.quizId === selectedQuiz)
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz?.title || 'Unknown Quiz';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const averageRating = filteredFeedback.length > 0 
    ? (filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length).toFixed(1)
    : '0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: filteredFeedback.filter(f => f.rating === rating).length,
    percentage: filteredFeedback.length > 0 
      ? Math.round((filteredFeedback.filter(f => f.rating === rating).length / filteredFeedback.length) * 100)
      : 0
  }));

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Feedback</h3>
          <p className="text-sm text-gray-600">
            {filteredFeedback.length} feedback entries • Average rating: {averageRating}/5
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Quizzes</option>
            {quizzes.map(quiz => (
              <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Rating Overview */}
      {filteredFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedbackItem) => (
          <Card key={feedbackItem.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">{renderStars(feedbackItem.rating)}</div>
                    <span className="text-sm text-gray-500">
                      {feedbackItem.createdAt.toLocaleDateString()}
                    </span>
                    {feedbackItem.helpful && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Helpful
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Quiz: {getQuizTitle(feedbackItem.quizId)}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteFeedback(feedbackItem.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            {feedbackItem.comment && (
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  "{feedbackItem.comment}"
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600">
              {selectedQuiz === 'all' 
                ? 'User feedback will appear here once people start taking your quizzes'
                : 'No feedback for this quiz yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
