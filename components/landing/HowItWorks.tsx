"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageSquare, TrendingUp, CheckCircle2, BarChart3, FileText } from 'lucide-react';

interface Step {
  title: string;
  caption: string;
  image: string;
}

export default function HowItWorks() {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Take a quiz",
        caption: "Short, research-backed assessments to map your patterns.",
        image:
          "https://images.unsplash.com/photo-1523246194503-8fda2be8b6f5?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "See AI insights",
        caption: "Conversational guidance that understands your results.",
        image:
          "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Timeline",
        caption: "A gentle week-by-week view to track progress and patterns.",
        image:
          "https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Your report",
        caption: "Clear visuals and next steps you can act on.",
        image:
          "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Related article",
        caption: "Read a concise, evidence-based explainer to go deeper.",
        image:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, 3000);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How it works</h2>
          <p className="text-muted-foreground mt-2">From assessment to insights in minutes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: iPad-like frame with carousel */}
          <div className="flex items-center justify-center">
            <div className="relative w-[560px] h-[360px]">
              {/* Soft glow */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-purple-200/30 via-indigo-200/30 to-cyan-200/30 blur-2xl" />

              {/* Aluminum body */}
              <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-b from-slate-200 to-slate-300 shadow-2xl border border-slate-400/40 p-2">
                {/* Black bezel */}
                <div className="w-full h-full rounded-[1.8rem] bg-black p-2">
                  {/* Camera dot */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-400/70 rounded-full" />
                  </div>

                  {/* Screen */}
                  <div className="relative w-full h-full overflow-hidden rounded-[1.4rem] bg-white">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={index}
                        src={steps[index].image}
                        alt={steps[index].title}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0.0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6 }}
                      />
                    </AnimatePresence>
                    {/* Gradient overlay for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute left-0 right-0 bottom-0 p-5 text-white">
                      <div className="text-lg font-semibold">{steps[index].title}</div>
                      <div className="text-sm opacity-90">{steps[index].caption}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === index ? "bg-indigo-500" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: copy points */}
          <div>
            <ul className="space-y-6">
              <li>
                <div className="text-sm font-semibold text-indigo-600">Step 1</div>
                <div className="text-xl font-semibold text-foreground">Take a quiz</div>
                <p className="text-muted-foreground">Evidence-based, no right/wrong — just patterns.</p>
              </li>
              <li>
                <div className="text-sm font-semibold text-indigo-600">Step 2</div>
                <div className="text-xl font-semibold text-foreground">Get AI insights</div>
                <p className="text-muted-foreground">Natural conversation with context from your results.</p>
              </li>
              <li>
                <div className="text-sm font-semibold text-indigo-600">Step 3</div>
                <div className="text-xl font-semibold text-foreground">Timeline</div>
                <p className="text-muted-foreground">Weekly rhythm and check-ins for steady progress.</p>
              </li>
              <li>
                <div className="text-sm font-semibold text-indigo-600">Step 4</div>
                <div className="text-xl font-semibold text-foreground">Your report</div>
                <p className="text-muted-foreground">Highlights, visuals, and clear takeaways.</p>
              </li>
              <li>
                <div className="text-sm font-semibold text-indigo-600">Step 5</div>
                <div className="text-xl font-semibold text-foreground">Related article</div>
                <p className="text-muted-foreground">A concise explainer to deepen understanding.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Report Preview */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">What your report looks like</h3>
            <p className="text-muted-foreground mt-1">Clear visuals, highlights, and next steps. No right/wrong — just patterns.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-purple-200/60">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" /> Sample Report · Stress Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-purple-200/60 p-4 bg-white">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                      <BarChart3 className="w-4 h-4" /> Highlights
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/90">
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Calm baseline with spikes under time pressure</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Recovers quickly with structured breaks</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Most affected by ambiguity vs. volume of tasks</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-purple-200/60 p-4 bg-white">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                      <TrendingUp className="w-4 h-4" /> Key patterns
                    </div>
                    <ul className="space-y-2 text-sm text-foreground/90">
                      <li>Trigger: deadlines with unclear criteria</li>
                      <li>Buffer: checklist with 3 concrete steps</li>
                      <li>Leverage: pairing decisions with timeboxing</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-purple-200/60 p-4 bg-white md:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2">
                      <CheckCircle2 className="w-4 h-4" /> Next steps (7‑day plan)
                    </div>
                    <ol className="list-decimal ml-5 space-y-1 text-sm text-foreground/90">
                      <li>Daily 5‑min check‑in: note one trigger and one helpful behavior</li>
                      <li>Use a 3‑step checklist whenever a task feels ambiguous</li>
                      <li>Timebox high‑ambiguity work to 25‑minute focus blocks</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200/60">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" /> Ask the AI about this
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The AI understands your specific results and explains the <em>why</em> behind patterns.
                  Try: “Why does my score spike under time pressure, and what should I do next week?”
                </p>
                <PrimaryCTA href="/start" surface="how_it_works" className="w-full" variant="uiverse">
                  Start a conversation
                </PrimaryCTA>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
