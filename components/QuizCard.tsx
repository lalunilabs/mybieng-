'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Brain, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import { designSystem } from '@/lib/design-system';

type Props = {
  slug: string;
  title: string;
  description: string;
  benefits?: string[];
  requirements?: string[];
};

const quizIcons = ['🧠', '🎯', '💭', '🔍', '⚡', '🌟', '🎨', '🔮'];

export default function QuizCard({ slug, title, description, benefits, requirements }: Props) {
  const randomIcon = quizIcons[Math.floor(Math.random() * quizIcons.length)];
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/quizzes/${slug}`} className="block group">
        <Card variant="elevated" className={`h-full overflow-hidden ${designSystem.components.card.base} ${designSystem.components.card.hover}`}>
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20" />
            <div className="absolute top-4 left-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                {randomIcon}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold rounded-full border border-purple-200 shadow-sm">
                Assessment
              </span>
            </div>
            {/* Floating elements */}
            <div className="absolute bottom-2 right-6 w-8 h-8 bg-white/20 rounded-full" />
            <div className="absolute bottom-6 right-2 w-4 h-4 bg-white/30 rounded-full" />
          </div>
          
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-200 leading-tight">
              {title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <p className="text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
              {description}
            </p>
            {(!!benefits?.length || !!requirements?.length) && (
              <div className="mb-5 space-y-3">
                {benefits?.length ? (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">What you'll get</div>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                      {benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="line-clamp-1">{b}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {requirements?.length ? (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">What you need</div>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                      {requirements.slice(0, 1).map((r, i) => (
                        <li key={i} className="line-clamp-1">{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5-15 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>Retakeable</span>
                </div>
              </div>
              
              <Button 
                variant="gradient" 
                size="lg" 
                className={`${designSystem.components.button.base} w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:shadow-glow-lg transition-all duration-300`}
              >
                <span className="mr-2">Start Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
