"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import {
  Brain,
  MessageSquare,
  ListChecks,
  BookOpen,
  Beaker,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function BentoGrid() {
  const chatSessionId = useMemo(() => {
    try {
      return (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
    } catch {
      return Math.random().toString(36).slice(2);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Everything in one place
          </h2>
          <p className="text-muted-foreground text-lg">
            Quizzes, articles, AI guidance, and a simple plan—curated for steady growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Quizzes (Primary) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/10 p-6 flex flex-col justify-between h-64"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                Assessments
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-primary" />
                Discover your inner patterns
              </h3>
              <p className="text-muted-foreground">
                Research-backed quizzes that surface how you think, decide, and respond.
              </p>
            </div>
            <Link
              href="/quizzes"
              className="inline-flex items-center w-max px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-400 text-white font-medium shadow hover:shadow-md transition"
            >
              Start a quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

          {/* Removed AI Conversation tile for starter mode */}

          {/* Weekly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-50 to-green-50 p-6 h-48"
          >
            <div className="flex items-start gap-3">
              <ListChecks className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Your weekly plan</h4>
                <p className="text-muted-foreground text-sm">
                  A 4-week rhythm with daily micro‑check‑ins, weekly focus, and a monthly review.
                </p>
                <div className="mt-3 text-sm text-emerald-700 font-medium">Non-medical, behavior-focused</div>
              </div>
            </div>
          </motion.div>

          {/* Articles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-50 to-orange-50 p-6 h-48"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Articles</h4>
                <p className="text-muted-foreground text-sm">
                  Evidence-based insights you can use without information overload.
                </p>
                <Link href="/blog" className="inline-flex items-center text-amber-700 mt-3 font-medium">
                  Read the latest <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Research */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-2xl border border-fuchsia-300/30 bg-gradient-to-br from-fuchsia-50 to-pink-50 p-6 h-48"
          >
            <div className="flex items-start gap-3">
              <Beaker className="w-5 h-5 text-fuchsia-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Research-backed</h4>
                <p className="text-muted-foreground text-sm">
                  Built for pattern recognition—not right or wrong answers.
                </p>
                <Link href="/research" className="inline-flex items-center text-fuchsia-700 mt-3 font-medium">
                  See the approach <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="md:col-span-6 rounded-2xl border border-purple-300/30 bg-gradient-to-br from-purple-50 to-indigo-50 p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Stay in the loop</h4>
                  <p className="text-muted-foreground text-sm">
                    New assessments, guides, and small steps that actually fit your week.
                  </p>
                </div>
              </div>
              <Link
                href="#newsletter"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-400 text-white font-medium shadow hover:shadow-md transition"
              >
                Join newsletter <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
