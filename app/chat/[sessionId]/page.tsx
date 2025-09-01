'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { generateChatResponse } from '@/lib/ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load session data and initialize chat
    initializeChat();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // In a real app, you'd fetch session data from your backend
      // For now, we'll simulate it
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hi! I'm here to help you understand your quiz results better. I have access to your analysis and can answer questions about your patterns, provide more detailed explanations, or suggest specific actions you can take.

What would you like to explore about your results?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

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
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
