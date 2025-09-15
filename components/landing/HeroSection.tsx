'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratedImage } from '@/components/hooks/useGeneratedImage';
import { Search, Lightbulb, BookOpen, ArrowRight, Sparkles, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import Link from 'next/link';

export default function HeroSection() {
  // Slides for the iPad carousel in the hero
  const slides = useMemo(
    () => [
      {
        title: 'Quizzes',
        caption: 'Research-backed assessments to map your patterns.',
        image:
          'https://images.unsplash.com/photo-1523246194503-8fda2be8b6f5?q=80&w=1400&auto=format&fit=crop',
      },
      {
        title: 'AI insights',
        caption: 'Conversational guidance that understands your results.',
        image:
          'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop',
      },
      {
        title: 'Timeline',
        caption: 'Weekly check-ins and steady progress.',
        image:
          'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1400&auto=format&fit=crop',
      },
      {
        title: 'Report',
        caption: 'Clear visuals and next steps you can act on.',
        image:
          'https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1400&auto=format&fit=crop',
      },
      {
        title: 'Articles',
        caption: 'Concise explainers to deepen understanding.',
        image:
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, [slides.length]);

  // Optional Google image generation (Imagen 3) with safe, editorial prompts
  const prompts = useMemo(
    () => [
      'Editorial abstract pastel cover representing research-backed quizzes. Minimal, soft gradients, no people, high quality, magazine style.',
      'Editorial abstract pastel cover representing AI insights conversation bubbles. Minimal, soft gradients, no people, high quality.',
      'Editorial abstract pastel cover representing a weekly timeline/progress. Minimal, soft gradients, no people, high quality.',
      'Editorial abstract pastel cover representing a personal report with charts. Minimal, soft gradients, no people, high quality.',
      'Editorial abstract pastel cover representing an article/explainer. Minimal, soft gradients, no people, high quality.',
    ],
    []
  );
  const g0 = useGeneratedImage(prompts[0], '16:9');
  const g1 = useGeneratedImage(prompts[1], '16:9');
  const g2 = useGeneratedImage(prompts[2], '16:9');
  const g3 = useGeneratedImage(prompts[3], '16:9');
  const g4 = useGeneratedImage(prompts[4], '16:9');
  const gens = [g0, g1, g2, g3, g4];
  const displayedSrc = (gens[index]?.enabled && gens[index]?.src) || slides[index].image;

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Research-backed self-discovery
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Understand Your
              <span className="block bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Inner Patterns</span>
            </h1>
            <p className="mt-4 text-lg text-slate-700 max-w-xl">
              Assessments and guidance designed for gentle, steady growth.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <PrimaryCTA href="/start" surface="hero_min" variant="uiverse">Start Your Journey</PrimaryCTA>
              <Button variant="outline" className="border-2 border-purple-400 text-purple-600" asChild>
                <Link href="/quizzes" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" /> Explore Quizzes
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative w-[540px] h-[360px]"
            >
              {/* soft glow */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-purple-200/30 via-indigo-200/30 to-cyan-200/30 blur-2xl" />

              {/* aluminum body */}
              <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl border border-slate-400/40 p-2">
                {/* black bezel */}
                <div className="w-full h-full rounded-[1.8rem] bg-black p-2">
                  {/* camera dot */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-400/70 rounded-full" />
                  </div>

                  {/* screen */}
                  <div className="relative w-full h-full rounded-[1.4rem] overflow-hidden bg-white">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={index}
                        src={displayedSrc}
                        alt={slides[index].title}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6 }}
                      />
                    </AnimatePresence>
                    {/* overlay for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute left-0 right-0 bottom-0 p-4 text-white">
                      <div className="text-base font-semibold">{slides[index].title}</div>
                      <div className="text-xs opacity-90">{slides[index].caption}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

