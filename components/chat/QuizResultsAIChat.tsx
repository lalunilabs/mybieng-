'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Target,
  TrendingUp,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdaptiveQuizResult } from '@/components/quiz/AdaptiveQuizResultsSystem';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuizResultsAIChatProps {
  result: AdaptiveQuizResult;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function QuizResultsAIChat({ 
  result, 
  isOpen, 
  onClose, 
  onMinimize,
  isMinimized = false 
}: QuizResultsAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message and context
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateWelcomeMessage(result),
        timestamp: new Date(),
        suggestions: generateInitialSuggestions(result)
      };
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, result]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Generate AI response based on quiz results and conversation context
      const aiResponse = await generateAIResponse(content, result, messages);
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your question right now. Could you try rephrasing it or ask something else about your quiz results?",
        timestamp: new Date(),
        suggestions: ['Tell me about my strengths', 'What should I work on?', 'How can I improve?']
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`}
      >
        <Card className="h-full shadow-2xl border-purple-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {isMinimized ? 'AI Chat' : 'Chat About Your Results'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {onMinimize && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMinimize}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {!isMinimized && (
              <p className="text-sm text-purple-100">
                Ask questions about your {result.quizTitle} results
              </p>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex flex-col h-full p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs text-gray-600 font-medium">Suggested questions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-white/50 hover:bg-white/80 rounded px-2 py-1 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your results..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function to generate welcome message based on quiz results
function generateWelcomeMessage(result: AdaptiveQuizResult): string {
  let message = `Hi! I'm here to help you explore your ${result.quizTitle} results. `;
  
  if (result.numericResult) {
    message += `You scored ${result.numericResult.score}/${result.numericResult.maxScore} (${result.numericResult.percentage.toFixed(1)}%), which puts you in the "${result.numericResult.band.label}" range. `;
  }
  
  if (result.categoricalResult) {
    message += `Your primary profile is "${result.categoricalResult.primaryCategory}". `;
  }
  
  if (result.aiResult) {
    message += `I have detailed AI analysis of your patterns and can provide personalized insights. `;
  }
  
  message += `What would you like to know more about?`;
  
  return message;
}

// Helper function to generate initial conversation suggestions
function generateInitialSuggestions(result: AdaptiveQuizResult): string[] {
  const suggestions = [];
  
  if (result.numericResult) {
    suggestions.push('What does my score mean?');
    suggestions.push('How can I improve my score?');
  }
  
  if (result.categoricalResult) {
    suggestions.push('Tell me about my personality type');
    suggestions.push('What are my key strengths?');
  }
  
  if (result.aiResult) {
    suggestions.push('What patterns did you notice?');
    suggestions.push('What should I focus on next?');
  }
  
  suggestions.push('How accurate are these results?');
  suggestions.push('What actions should I take?');
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
}

// Helper function to generate AI responses (in production, this would call an AI service)
async function generateAIResponse(
  userMessage: string, 
  result: AdaptiveQuizResult, 
  conversationHistory: ChatMessage[]
): Promise<{ content: string; suggestions?: string[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Pattern matching for common questions
  if (lowerMessage.includes('score') || lowerMessage.includes('mean')) {
    if (result.numericResult) {
      return {
        content: `Your score of ${result.numericResult.score}/${result.numericResult.maxScore} indicates ${result.numericResult.band.advice} This score reflects your current patterns and tendencies, not fixed traits. It's a snapshot that can help guide your personal development.`,
        suggestions: ['How can I improve?', 'Is this score good or bad?', 'What factors influenced my score?']
      };
    }
  }
  
  if (lowerMessage.includes('strength') || lowerMessage.includes('good at')) {
    if (result.categoricalResult) {
      const strengths = result.categoricalResult.profile.strengths;
      return {
        content: `Based on your results, your key strengths include: ${strengths.slice(0, 3).join(', ')}. These are areas where you naturally excel and can leverage for personal and professional growth.`,
        suggestions: ['How do I use these strengths?', 'What are my challenges?', 'Tell me more about my profile']
      };
    }
  }
  
  if (lowerMessage.includes('improve') || lowerMessage.includes('work on') || lowerMessage.includes('develop')) {
    if (result.aiResult?.actionPlan) {
      return {
        content: `Here are some specific areas to focus on: ${result.aiResult.actionPlan.immediate.slice(0, 2).join(' ')} These immediate actions can help you build momentum toward positive change.`,
        suggestions: ['What about long-term goals?', 'How do I stay motivated?', 'Can you be more specific?']
      };
    }
  }
  
  if (lowerMessage.includes('accurate') || lowerMessage.includes('reliable') || lowerMessage.includes('trust')) {
    return {
      content: `This assessment is based on ${result.researchContext.methodology} with a reliability score of ${(result.researchContext.reliability * 100).toFixed(1)}% from ${result.researchContext.sampleSize.toLocaleString()}+ participants. While no assessment is perfect, these results provide valuable insights into your behavioral patterns and preferences.`,
      suggestions: ['How were these results calculated?', 'Should I retake the quiz?', 'What do the patterns mean?']
    };
  }
  
  if (lowerMessage.includes('pattern') || lowerMessage.includes('notice')) {
    if (result.aiResult?.behavioralPatterns) {
      return {
        content: `I noticed several interesting patterns in your responses: ${result.aiResult.behavioralPatterns[0]} This suggests you have a thoughtful approach to self-reflection and decision-making.`,
        suggestions: ['What other patterns did you see?', 'How do these patterns affect my life?', 'Can I change these patterns?']
      };
    }
  }
  
  // Default response for unmatched queries
  return {
    content: `That's a great question about your ${result.quizTitle} results. Based on your assessment, you show unique patterns that reflect your individual approach to ${result.quizSlug.includes('motivation') ? 'motivation and goal achievement' : result.quizSlug.includes('stress') ? 'stress management and resilience' : 'personal development'}. What specific aspect would you like to explore further?`,
    suggestions: ['Tell me about my results', 'What should I focus on?', 'How can I use these insights?']
  };
}
