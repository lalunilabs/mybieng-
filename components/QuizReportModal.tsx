'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/shadcn/input';
import { QuizReportVisualization } from '@/components/ui/QuizReportVisualization';
import { QuizBand } from '@/data/quizzes';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

interface QuizReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  maxScore: number;
  band: QuizBand;
  quizTitle: string;
  quizSlug: string;
  responses: Array<{
    questionId: string;
    questionText: string;
    answer: string | number;
    questionType: 'multiple-choice' | 'scale' | 'text';
  }>;
  onEmailReport: (email: string) => void;
}

export function QuizReportModal({
  isOpen,
  onClose,
  score,
  maxScore,
  band,
  quizTitle,
  quizSlug,
  responses,
  onEmailReport
}: QuizReportModalProps) {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onEmailReport(email);
      setIsEmailSent(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsEmailSent(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-6">
              <QuizReportVisualization
                score={score}
                maxScore={maxScore}
                band={band}
                quizTitle={quizTitle}
                quizSlug={quizSlug}
                responses={responses}
                onRetake={() => {
                  onClose();
                  // Retake functionality would go here
                }}
                onShare={() => {
                  // Share functionality would go here
                }}
              />

              {/* Discuss with AI CTA */}
              <div className="mt-6 flex justify-end">
                <PrimaryCTA
                  surface="report_modal"
                  eventName="report_chat_start"
                  variant="uiverse"
                  onClick={() => {
                    const id = (globalThis as any)?.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
                    const params = new URLSearchParams({
                      quizId: quizSlug,
                      band: band.label,
                      score: String(score),
                      maxScore: String(maxScore),
                    });
                    router.push(`/chat/${id}?${params.toString()}`);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> Ask AI about this report
                </PrimaryCTA>
              </div>

              {/* Email form for anonymous users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Detailed Report</h3>
                <p className="text-gray-700 mb-4">
                  Enter your email to receive a detailed report with personalized insights and recommendations.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="report-email" className="sr-only">Email address</Label>
                    <Input
                      id="report-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-12 px-4 rounded-lg focus-visible:ring-brand-500"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="gradient"
                    className="whitespace-nowrap"
                    disabled={isEmailSent}
                  >
                    {isEmailSent ? (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Report
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
