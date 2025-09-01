'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Star, BookOpen, X } from 'lucide-react';

interface PostQuizChatProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
}

type ChatStep = 'welcome' | 'email' | 'feedback' | 'reading' | 'complete';

export function PostQuizChat({ isOpen, onClose, quizTitle }: PostQuizChatProps) {
  const [currentStep, setCurrentStep] = useState<ChatStep>('welcome');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [wantsReading, setWantsReading] = useState<boolean | null>(null);

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('email');
        break;
      case 'email':
        setCurrentStep('feedback');
        break;
      case 'feedback':
        setCurrentStep('reading');
        break;
      case 'reading':
        setCurrentStep('complete');
        break;
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({ email, feedback, rating, wantsReading });
    handleNext();
  };

  const renderChatBubble = (content: React.ReactNode, isBot = true) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isBot 
          ? 'bg-purple-100 text-purple-900' 
          : 'bg-purple-600 text-white'
      }`}>
        {content}
      </div>
    </motion.div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div>
            {renderChatBubble(
              <div>
                <p className="mb-2">🎉 Congratulations on completing the <strong>{quizTitle}</strong>!</p>
                <p>I'd love to send you a detailed report and gather some feedback. Ready?</p>
              </div>
            )}
            <div className="flex justify-end">
              <button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                Yes, let's go! <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'email':
        return (
          <div>
            {renderChatBubble(
              <div>
                <p className="mb-2">📧 What's your email address?</p>
                <p className="text-sm">I'll send you a detailed report with insights and personalized recommendations.</p>
              </div>
            )}
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full pl-10 h-10 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleNext} 
                  disabled={!email}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  Continue <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div>
            {renderChatBubble(
              <div>
                <p className="mb-3">⭐ How was your experience taking this quiz?</p>
                <p className="text-sm">Your feedback helps me improve the assessments for everyone.</p>
              </div>
            )}
            <div className="space-y-4">
              {/* Star Rating */}
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
              
              {/* Feedback Text */}
              <textarea
                placeholder="Share your thoughts about the quiz..."
                value={feedback}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
              />
              
              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  Continue <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div>
            {renderChatBubble(
              <div>
                <p className="mb-2">📚 Would you like personalized book and article recommendations?</p>
                <p className="text-sm">Based on your results, I can suggest specific reading materials to deepen your understanding.</p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setWantsReading(false);
                  handleNext();
                }}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                No thanks
              </button>
              <button 
                onClick={() => {
                  setWantsReading(true);
                  handleNext();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Yes, please!
              </button>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div>
            {renderChatBubble(
              <div>
                <p className="mb-2">✨ Perfect! Here's what happens next:</p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>📧 Detailed report sent to {email}</li>
                  <li>📊 Interactive charts and insights</li>
                  {wantsReading && <li>📚 Personalized reading list</li>}
                  <li>🔄 Track your progress over time</li>
                </ul>
                <p className="mt-3 text-sm">Thank you for taking the time to share your feedback!</p>
              </div>
            )}
            <div className="flex justify-center">
              <button 
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Perfect! Close
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <span className="font-medium">MyBeing Assistant</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {renderStep()}
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pb-4">
              <div className="flex space-x-2">
                {['welcome', 'email', 'feedback', 'reading', 'complete'].map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full ${
                      ['welcome', 'email', 'feedback', 'reading', 'complete'].indexOf(currentStep) >= index
                        ? 'bg-purple-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
