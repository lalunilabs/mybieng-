'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChatTracking } from '@/components/analytics/AIChat';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
}

export default function ChatSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = (params?.sessionId as string) || '';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const MAX_QUESTIONS = 6;

  // Read quiz context (optional) from query params
  const quizId = (searchParams?.get('quizId') as string) || '';
  const band = (searchParams?.get('band') as string) || '';
  const score = (searchParams?.get('score') as string) || '';
  const maxScore = (searchParams?.get('maxScore') as string) || '';

  // Build a lightweight context string for analytics
  const context = useMemo(() => {
    const parts: string[] = [];
    if (quizId) parts.push(`quiz=${quizId}`);
    if (band) parts.push(`band=${band}`);
    if (score && maxScore) parts.push(`score=${score}/${maxScore}`);
    return parts.join(' | ') || 'general';
  }, [quizId, band, score, maxScore]);

  // Initialize analytics tracking (tracks session start on mount)
  const { trackMessage } = useAIChatTracking(sessionId, context);

  // (initializeChat useEffect placed after initializeChat declaration)

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = useCallback(async () => {
    try {
      // In a real app, you'd fetch session data from your backend
      // For now, we'll simulate it
      const contextLine = band && score && maxScore
        ? `I see your result is "${band}" with a score of ${score}/${maxScore}.`
        : undefined;

      const welcomeText = [
        "Hi! I'm here to help you understand your quiz results better.",
        contextLine,
        "You can ask up to 6 questions in this session. After that, I'll summarize with a simple, actionable plan for you.",
        "What would you like to explore first?"
      ].filter(Boolean).join('\n\n');

      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  }, [band, score, maxScore]);

  // Load session data and initialize chat (placed after initializeChat is declared)
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    if (sessionEnded) {
      // Graceful message when session limit reached
      const limitMsg: ChatMessage = {
        role: 'assistant',
        content: 'You\'ve reached the 6-question limit for this session. You can start a new session from your report or dashboard anytime.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, limitMsg]);
      try { trackMessage('assistant'); } catch {}
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    // Compute next question count and append user message
    const newCount = (messages.filter(m => m.role === 'user').length) + 1;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try { trackMessage('user'); } catch {}

    try {
      // In a real app, you'd call your AI service with session context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: inputMessage,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I encountered an error. Please try asking your question again.',
        role: 'assistant',
        timestamp: new Date()
      };

      // Append assistant reply
      setMessages(prev => [...prev, assistantMessage]);
      try { trackMessage('assistant'); } catch {}
      setQuestionCount(newCount);

      // If this was the 6th question, provide a concise plan summary and end the session
      if (newCount >= MAX_QUESTIONS) {
        const plan: Message = {
          id: (Date.now() + 2).toString(),
          content: generateSimplePlan(band, score, maxScore),
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, plan]);
        try { trackMessage('assistant'); } catch {}
        setSessionEnded(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  function generateSimplePlan(band?: string, scoreStr?: string, maxStr?: string): string {
    const scoreText = scoreStr && maxStr ? `Score: ${scoreStr}/${maxStr}.` : '';
    const bandText = band ? `Band: ${band}.` : '';
    // Minimal, research-backed plan with daily EMA micro-check-ins and weekly/monthly modules
    return [
      'Your 4-week plan',
      '',
      [bandText, scoreText].filter(Boolean).join(' '),
      '',
      'Daily (EMA micro-check-in):',
      '- 2 minutes: note one situation, your reaction, and value alignment (yes/no).',
      '',
      'Weekly:',
      '- Pick one small behavior to align better with a value (eg, honest conversation, screen cutoff).',
      '- Do a 10-min reflection on patterns (justification, belief shift, selective evidence, identity protection, social reality).',
      '',
      'Monthly:',
      '- Review your log. Identify 1–2 repeating patterns and one concrete next habit.',
      '',
      'Tip:',
      'Use a “pause and reflect” cue when you notice instant justification. Ask: “What value matters here?”'
    ].join('\n');
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="relative glass border-b border-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-soft">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Results Discussion</h1>
              <p className="text-muted-foreground">
                Get personalized insights about your quiz results and next steps
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-2">🧠</span>
              Contextual AI
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔒</span>
              Private & Secure
            </div>
            <div className="flex items-center">
              <span className="mr-2">💡</span>
              Actionable Insights
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-primary to-purple-600 text-white' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`px-6 py-4 rounded-2xl shadow-soft transition-all duration-200 hover:shadow-medium ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                      : 'bg-white border border-border text-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  <div
                    className={`text-xs mt-3 ${
                      message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-sm text-white">
                  🤖
                </div>
                <div className="bg-white border border-border rounded-2xl px-6 py-4 shadow-soft">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative glass border-t border-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your results, patterns, or what you should do next..."
                className="w-full px-6 py-4 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-soft bg-white/90 backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground"
                rows={2}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-2xl shadow-glow hover:shadow-glow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="mr-2">Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="text-xs text-muted-foreground font-medium mb-2 w-full">💡 Quick suggestions:</div>
            {[
              "What does my score mean?",
              "How can I improve?", 
              "What should I focus on?",
              "Show me patterns in my results"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
