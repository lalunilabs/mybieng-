import { useState, useCallback } from 'react';
import { 
  Message, 
  ChatMode, 
  QuizResults, 
  UserSubscription, 
  FeedbackData,
  ChatState 
} from '@/types/ai-chat';
import { generateMessageId } from '@/lib/ai-chat-utils';

interface UseAIChatProps {
  mode: ChatMode;
  quizResults?: QuizResults;
  userSubscription?: UserSubscription;
  onFeedback?: (feedback: FeedbackData) => void;
}

export function useAIChat({ 
  mode, 
  quizResults, 
  userSubscription, 
  onFeedback 
}: UseAIChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    isLoading: false,
    showFeedback: false,
    feedbackRating: 0,
    feedbackComment: ''
  });

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, userMessage],
      input: '',
      isLoading: true
    }));

    try {
      const response = await fetch('/api/ai/universal-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode,
          context: {
            quizResults,
            userSubscription,
            conversationHistory: state.messages.slice(-5).map(m => ({
              role: m.role,
              content: m.content
            }))
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        recommendations: data.recommendations
      };

      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting. Please try again in a moment.',
        timestamp: new Date()
      };
      
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }));
    }
  }, [mode, quizResults, userSubscription, state.messages, state.isLoading]);

  const submitFeedback = useCallback(() => {
    if (onFeedback && state.feedbackRating > 0) {
      const feedbackData: FeedbackData = {
        rating: state.feedbackRating,
        comment: state.feedbackComment,
        quizSlug: quizResults?.quizTitle.toLowerCase().replace(/\s+/g, '-'),
        timestamp: new Date()
      };
      
      onFeedback(feedbackData);
      
      setState(prev => ({ 
        ...prev, 
        showFeedback: false,
        feedbackRating: 0,
        feedbackComment: ''
      }));
      
      // Add feedback confirmation message
      const confirmationMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `Thank you for your feedback! ${state.feedbackRating >= 4 ? '🌟' : '💙'} Your input helps me improve and provide better insights for everyone.`,
        timestamp: new Date()
      };
      
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, confirmationMessage]
      }));
    }
  }, [onFeedback, state.feedbackRating, state.feedbackComment, quizResults]);

  const updateInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }));
  }, []);

  const showFeedbackModal = useCallback(() => {
    setState(prev => ({ ...prev, showFeedback: true }));
  }, []);

  const hideFeedbackModal = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showFeedback: false,
      feedbackRating: 0,
      feedbackComment: ''
    }));
  }, []);

  const updateFeedbackRating = useCallback((rating: number) => {
    setState(prev => ({ ...prev, feedbackRating: rating }));
  }, []);

  const updateFeedbackComment = useCallback((comment: string) => {
    setState(prev => ({ ...prev, feedbackComment: comment }));
  }, []);

  const setInitialMessage = useCallback((message: Message) => {
    setState(prev => ({ ...prev, messages: [message] }));
  }, []);

  return {
    state,
    actions: {
      sendMessage,
      submitFeedback,
      updateInput,
      showFeedbackModal,
      hideFeedbackModal,
      updateFeedbackRating,
      updateFeedbackComment,
      setInitialMessage
    }
  };
}
