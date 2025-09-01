'use client';

import { useState } from 'react';
import { BlogManager } from '@/components/admin/BlogManager';
import { QuizManager } from '@/components/admin/QuizManager';
import { FeedbackManager } from '@/components/admin/FeedbackManager';
import { PricingManager } from '@/components/admin/PricingManager';
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  toggleBlogPostPublished,
  BlogPost 
} from '@/lib/blog';
import { 
  getAllQuizzes, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  toggleQuizPublished,
  getAllFeedback,
  deleteFeedback,
  QuizData,
  UserFeedback 
} from '@/lib/quiz';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'blogs' | 'quizzes' | 'feedback' | 'pricing'>('blogs');
  const [blogs, setBlogs] = useState<BlogPost[]>(getAllBlogPosts(true));
  const [quizzes, setQuizzes] = useState<QuizData[]>(getAllQuizzes(true));
  const [feedback, setFeedback] = useState<UserFeedback[]>(getAllFeedback());

  // Blog handlers
  const handleCreateBlog = (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBlog = createBlogPost(blogData);
    setBlogs(getAllBlogPosts(true));
  };

  const handleUpdateBlog = (id: string, blogData: Partial<BlogPost>) => {
    updateBlogPost(id, blogData);
    setBlogs(getAllBlogPosts(true));
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogPost(id);
      setBlogs(getAllBlogPosts(true));
    }
  };

  const handleToggleBlogPublished = (id: string) => {
    toggleBlogPostPublished(id);
    setBlogs(getAllBlogPosts(true));
  };

  // Quiz handlers
  const handleCreateQuiz = (quizData: Omit<QuizData, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => {
    const newQuiz = createQuiz(quizData);
    setQuizzes(getAllQuizzes(true));
  };

  const handleUpdateQuiz = (id: string, quizData: Partial<QuizData>) => {
    updateQuiz(id, quizData);
    setQuizzes(getAllQuizzes(true));
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Are you sure you want to delete this quiz? This will also remove all associated feedback.')) {
      deleteQuiz(id);
      setQuizzes(getAllQuizzes(true));
      setFeedback(getAllFeedback());
    }
  };

  const handleToggleQuizPublished = (id: string) => {
    toggleQuizPublished(id);
    setQuizzes(getAllQuizzes(true));
  };

  // Feedback handlers
  const handleDeleteFeedback = (id: string) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedback(id);
      setFeedback(getAllFeedback());
    }
  };

  const tabs = [
    { id: 'blogs', name: 'Blog Posts', icon: '📝', count: blogs.length },
    { id: 'quizzes', name: 'Quizzes', icon: '🧠', count: quizzes.length },
    { id: 'feedback', name: 'User Feedback', icon: '💬', count: feedback.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your blog posts, quizzes, and user feedback
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'blogs'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Blogs
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quizzes'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Quizzes
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'feedback'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💬 Feedback
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pricing'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💰 Pricing
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'blogs' && (
            <BlogManager
              blogs={blogs}
              onCreateBlog={handleCreateBlog}
              onUpdateBlog={handleUpdateBlog}
              onDeleteBlog={handleDeleteBlog}
              onTogglePublished={handleToggleBlogPublished}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizManager
              quizzes={quizzes}
              onCreateQuiz={handleCreateQuiz}
              onUpdateQuiz={handleUpdateQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onTogglePublished={handleToggleQuizPublished}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackManager
              feedback={feedback}
              quizzes={quizzes}
              onDeleteFeedback={handleDeleteFeedback}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingManager />
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <span className="text-brand-600 text-sm">📝</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Blogs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogs.filter(b => b.published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">🧠</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quizzes.filter(q => q.published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {feedback.length > 0 
                    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
