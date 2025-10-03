'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Brain, 
  Sparkles, 
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Target,
  BookOpen,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
}

interface QuizResultsChatProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    quiz: string;
    results: any;
    initialPrompt?: string;
  };
}

const SUGGESTED_PROMPTS = [
  "Explain my top pattern in simple terms",
  "What should I focus on improving?",
  "How do my results compare to others?",
  "Give me a specific action plan",
  "What might have influenced these results?",
  "How can I use this insight in daily life?"
];

export function QuizResultsChat({ isOpen, onClose, context }: QuizResultsChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = useCallback(async () => {
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `Hi! I've reviewed your **${context.quiz}** results. I can see you got "${context.results.band}" - that's really insightful! 

I'm here to help you understand your patterns better, explore what your results mean, and figure out practical next steps.

What would you like to dive into first?`,
      timestamp: new Date(),
      suggestions: [
        `Why did I get "${context.results.band}"?`,
        "What's my strongest pattern?",
        "How can I improve?",
        "What should I do next?"
      ]
    };

    setMessages([welcomeMessage]);

    // If there's an initial prompt, send it automatically
    if (context.initialPrompt) {
      setTimeout(() => {
        handleSendMessage(context.initialPrompt!);
      }, 1000);
    }
  }, [context.quiz, context.results.band, context.initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen, messages.length, initializeConversation]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationId,
          context: {
            mode: 'quiz-results',
            quiz: context.quiz,
            results: context.results,
            contextType: 'quiz-results',
            contextId: context.results.quizSlug || context.quiz
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Simulate typing effect
      const typingMessage: Message = {
        id: `msg_${Date.now()}_typing`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, typingMessage]);

      // Replace typing message with actual response after delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `msg_${Date.now()}_assistant`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestions: generateSuggestions(messageText, data.response)
        };

        setMessages(prev => prev.slice(0, -1).concat(assistantMessage));
      }, 1500);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Could you try asking your question again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (userMessage: string, response: string): string[] => {
    // Generate contextual follow-up suggestions based on the conversation
    const suggestions = [];
    
    if (userMessage.toLowerCase().includes('why')) {
      suggestions.push("Can you give me a specific example?", "How can I change this pattern?");
    }
    
    if (userMessage.toLowerCase().includes('improve') || userMessage.toLowerCase().includes('better')) {
      suggestions.push("What's the first step I should take?", "How long might this take?");
    }
    
    if (response.toLowerCase().includes('pattern') || response.toLowerCase().includes('tendency')) {
      suggestions.push("Is this pattern common?", "What causes this pattern?");
    }
    
    // Add some general follow-ups
    suggestions.push("Tell me more about this", "What else should I know?");
    
    return suggestions.slice(0, 3);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const provideFeedback = async (messageId: string, isPositive: boolean) => {
    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          conversationId,
          isPositive,
          context: 'quiz-results'
        })
      });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Results Explorer</h3>
                  <p className="text-purple-100 text-sm">{context.quiz} • AI-powered insights</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {context.results.band}
                </Badge>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <Brain className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">AI Assistant</span>
                        </div>
                      )}
                      
                      <Card className={`p-4 ${
                        message.role === 'user' 
                          ? 'bg-purple-600 text-white border-0' 
                          : 'bg-white border-gray-200'
                      }`}>
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-sm text-gray-500">Thinking...</span>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm max-w-none">
                              <div dangerouslySetInnerHTML={{ 
                                __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') 
                              }} />
                            </div>
                            
                            {message.role === 'assistant' && !message.isTyping && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => copyMessage(message.content)}
                                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </button>
                                <button
                                  onClick={() => provideFeedback(message.id, true)}
                                  className="text-xs text-gray-400 hover:text-green-600 flex items-center gap-1"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => provideFeedback(message.id, false)}
                                  className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </Card>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-500 font-medium">Suggested follow-ups:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-full transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (shown when no messages or conversation is starting) */}
            {messages.length <= 1 && (
              <div className="px-6 py-3 bg-white border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="text-sm bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your results..."
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all disabled:opacity-50"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • This AI understands your specific quiz results
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
