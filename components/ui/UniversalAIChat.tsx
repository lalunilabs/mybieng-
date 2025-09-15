'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { BookOpen, Star, Sparkles, Lock, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { 
  Message, 
  UniversalAIChatProps, 
  FeedbackData 
} from '@/types/ai-chat';
import { 
  generateMessageId, 
  calculateSubscriptionLimits 
} from '@/lib/ai-chat-utils';
import { useAIChat } from '@/hooks/useAIChat';

export function UniversalAIChat({ 
  mode, 
  quizResults, 
  userSubscription = { isSubscribed: false, plan: 'free' },
  onFeedback,
  className = ''
}: UniversalAIChatProps) {
  const { state, actions } = useAIChat({
    mode,
    quizResults,
    userSubscription,
    onFeedback
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Initial context setup based on mode
  useEffect(() => {
    let initialMessage: Message;

    if (mode === 'quiz-results' && quizResults) {
      initialMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `🎉 Great job completing the **${quizResults.quizTitle}**!\n\nYou scored ${quizResults.score}/${quizResults.maxScore}, placing you in the "${quizResults.band.label}" category.\n\n${quizResults.band.description}\n\nI'm here to help you understand your results better. Feel free to ask:\n• "What does this mean for my daily life?"\n• "How can I work on this pattern?"\n• "Can you recommend related content?"\n• "What should I focus on this week?"`,
        timestamp: new Date()
      };
    } else if (mode === 'subscription' && userSubscription.isSubscribed) {
      const limits = calculateSubscriptionLimits(userSubscription);
      
      initialMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `✨ Welcome back! As a **Premium** subscriber ($32/month), you have access to enhanced features:\n\n**This Month:**\n🎯 Free quizzes remaining: ${limits.freeQuizzesRemaining}/2 (under $50 value)\n📚 Premium articles remaining: ${limits.premiumArticlesRemaining}/3\n💬 Unlimited AI conversations\n\nWhat would you like to explore today?\n• Get personalized quiz recommendations\n• Read premium articles with advanced insights\n• Create a custom learning plan\n• Explore patterns from your previous results`,
        timestamp: new Date()
      };
    } else {
      initialMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `👋 Hi! I'm your MyBeing AI assistant. I can help you:\n\n**Free Features:**\n• Understand quiz results\n• Get basic content recommendations\n• Answer questions about self-discovery\n\n**Premium Features** ($32/month):\n• 2 free quizzes monthly (under $50 value)\n• 3 premium articles with advanced research\n• Unlimited AI conversations\n• Personalized content curation\n• Custom learning plans\n• Subscriber discounts on additional content\n\nWhat can I help you with today?`,
        timestamp: new Date()
      };
    }

    actions.setInitialMessage(initialMessage);
  }, [mode, quizResults, userSubscription, actions]);

  const handleSend = async () => {
    await actions.sendMessage(state.input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedbackSubmit = () => {
    actions.submitFeedback();
  };

  const getSuggestedPrompts = () => {
    if (mode === 'quiz-results') {
      return [
        "What does my result mean for daily life?",
        "How can I work on this pattern?",
        "Show me related content",
        "What should I focus on this week?"
      ];
    } else if (mode === 'subscription' && userSubscription.isSubscribed) {
      return [
        "Recommend premium articles for me",
        "Find quizzes with my free allowance",
        "Create a learning plan",
        "Show my subscription benefits"
      ];
    } else {
      return [
        "Help me understand myself better",
        "What quizzes should I take?",
        "Tell me about premium benefits",
        "How does self-discovery work?"
      ];
    }
  };

  const renderRecommendations = (recommendations: Message['recommendations']) => {
    if (!recommendations) return null;

    return (
      <div className="mt-4 space-y-3">
        {recommendations.quizzes && recommendations.quizzes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Recommended Quizzes
            </h4>
            <div className="space-y-2">
              {recommendations.quizzes.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/quizzes/${quiz.slug}`}
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-purple-900 flex items-center gap-2">
                        {quiz.title}
                        {quiz.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Free</span>}
                        {quiz.price && !quiz.isFree && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">${quiz.price}</span>}
                      </h5>
                      <p className="text-sm text-purple-700 mt-1">{quiz.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recommendations.blogs && recommendations.blogs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Recommended Reading
            </h4>
            <div className="space-y-2">
              {recommendations.blogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900 flex items-center gap-2">
                        {blog.title}
                        {blog.isPremium && !blog.isFree && <Lock className="w-3 h-3 text-amber-500" />}
                        {blog.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Free</span>}
                      </h5>
                      <p className="text-sm text-blue-700 mt-1">{blog.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              MyBeing AI Assistant
              {userSubscription.isSubscribed && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">
              {mode === 'quiz-results' 
                ? 'Ask questions about your results' 
                : userSubscription.isSubscribed 
                  ? 'Premium insights and recommendations'
                  : 'Your self-discovery companion'
              }
            </p>
          </div>
          {mode === 'quiz-results' && (
            <Button
              variant="outline"
              size="sm"
              onClick={actions.showFeedbackModal}
              className="text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Feedback
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {message.role === 'assistant' && renderRecommendations(message.recommendations)}
          </div>
        ))}
        
        {state.isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {getSuggestedPrompts().map((prompt, index) => (
            <button
              key={index}
              onClick={() => actions.updateInput(prompt)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={state.input}
            onChange={(e) => actions.updateInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === 'quiz-results' 
                ? "Ask about your results..." 
                : "What would you like to explore?"
            }
            className="flex-1 resize-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={1}
            disabled={state.isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!state.input.trim() || state.isLoading}
            className="px-4 py-2"
          >
            {state.isLoading ? '...' : 'Send'}
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      {state.showFeedback && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h4 className="font-semibold mb-4">How was your experience?</h4>
            
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => actions.updateFeedbackRating(star)}
                  className={`p-1 ${state.feedbackRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            
            <textarea
              placeholder="Any additional feedback? (optional)"
              value={state.feedbackComment}
              onChange={(e) => actions.updateFeedbackComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-4"
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={actions.hideFeedbackModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFeedbackSubmit}
                disabled={state.feedbackRating === 0}
                className="flex-1"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
