'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useEffect, useState, useRef } from 'react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import NewThisWeek from '@/components/landing/NewThisWeek';
import FeaturedQuizzes from '@/components/landing/FeaturedQuizzes';
import FeaturedBlogs from '@/components/landing/FeaturedBlogs';
import BrowseLatest from '@/components/landing/BrowseLatest';
import PressBar from '@/components/landing/PressBar';
import { PRICING } from '@/lib/constants';
import { Sparkles, Brain, BookOpenCheck, MessageSquare, ShieldCheck, ChevronRight, Star, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';

export default function MetaLanding() {
  // Decorative blobs (deterministic for SSR)
  const blobs = useMemo(() => [
    { className: 'bg-gradient-to-tr from-violet-500/30 to-fuchsia-500/30', style: { top: '-6rem', right: '-8rem', width: '22rem', height: '22rem' } },
    { className: 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30', style: { top: '30%', left: '-6rem', width: '18rem', height: '18rem' } },
    { className: 'bg-gradient-to-tr from-purple-500/30 to-pink-500/30', style: { bottom: '-8rem', right: '-6rem', width: '20rem', height: '20rem' } },
  ], []);

  const heroImage = process.env.NEXT_PUBLIC_HERO_IMAGE || 'https://images.unsplash.com/photo-1534759846116-57972579d8d0?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=';
  // Parallax hooks
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const yHero = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -60]);
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.04]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#faf5ff_0%,#ffffff_40%,#eef2ff_100%)]" />
      {blobs.map((b, i) => (
        <div key={i} className={`hidden md:block pointer-events-none absolute rounded-full blur-3xl ${b.className}`} style={b.style as any} />
      ))}

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Left: Copy */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium tracking-wide text-black/70 shadow-sm">By Meum Labs</span>
              <h1 className="mt-6 text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight text-gray-900">
                Stop guessing. <span className="whitespace-nowrap">Understand your patterns</span>
                <span className="mx-3 inline-block rounded-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-2 text-white">
                  — clearly.
                </span>
              </h1>
              <p className="mx-auto lg:mx-0 mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
                Research‑backed assessments, weekly insights, and an AI companion that understands your results.
                <span className="block mt-1">Subscribers get 2 free quizzes/month (≤ $50), 3 premium articles with audio, and member discounts.</span>
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <PrimaryCTA href="/blog" variant="uiverse" className="px-7 py-4 text-base">
                  Start for Free
                </PrimaryCTA>
                <PrimaryCTA href="/subscribe" variant="secondary" className="px-7 py-4 text-base">
                  Subscribe • ${PRICING.MONTHLY_USD}/mo
                </PrimaryCTA>
                <Link href="/how-it-works" className="text-sm font-medium text-gray-700 hover:text-purple-700 underline underline-offset-4">
                  See how it works
                </Link>
              </div>
              {/* Trust signals */}
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <span>🔒</span> Private by default
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1">
                  <span>🧪</span> Research‑backed
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1">
                  <span>🧭</span> No right/wrong answers
                </span>
              </div>
            </div>
            {/* Right: Image (parallax) */}
            <div className="lg:col-span-5 order-first lg:order-none">
              <motion.div style={{ y: yHero, scale: scaleHero }} className="relative h-[340px] sm:h-[420px] rounded-3xl overflow-hidden border border-black/10 shadow-lg">
                <Image
                  src={heroImage}
                  alt="MyBeing hero"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTIwJyBoZWlnaHQ9JzQyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSIjZWVlZWZmIi8+PC9zdmc+"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-fuchsia-500/10 to-indigo-500/10" />
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Cards */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <HeroCard
              icon={<Brain className="w-5 h-5" />}
              title="Deep, non-clinical"
              desc="Pattern recognition, not right/wrong labels. Insights you can actually use."
              href="/how-it-works"
              color="from-purple-600 to-indigo-600"
            />
            <HeroCard
              icon={<BookOpenCheck className="w-5 h-5" />}
              title="Premium research"
              desc="3 premium articles/month with audio narration for subscribers."
              href="/blog"
              color="from-fuchsia-500 to-violet-600"
            />
            <HeroCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="AI that knows you"
              desc="Discuss your results and get contextual guidance — unlimited with Premium."
              href="/start"
              color="from-purple-600 to-pink-600"
            />
          </motion.div>
          {/* Marquee benefits strip */}
          <div className="mt-10">
            <MarqueeStrip />
          </div>
        </div>
      </section>
      {/* Press / Mentions */}
      <PressBar />

      {/* Narrative scrollytelling: Assess → Understand → Act */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sticky visual */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <motion.div
                  className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 p-8 text-white shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/25">
                      <PlayCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Your journey, step by step</h3>
                  </div>
                  <p className="mt-3 text-white/90">Assess your patterns, understand them deeply, and act with clarity — supported by research and an AI companion that knows your context.</p>
                  <div className="mt-6">
                    <PrimaryCTA href="/start" variant="outline" className="px-4 py-2">Begin now</PrimaryCTA>
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Steps */}
            <div className="lg:col-span-7 space-y-8">
              {[
                {
                  title: 'Assess',
                  desc: 'No right/wrong answers. Our assessments reveal patterns — cognitive dissonance, stress cycles, energy variability — using research-backed items.',
                  cta: { href: '/quizzes', label: 'Browse Assessments' },
                },
                {
                  title: 'Understand',
                  desc: 'Get a personalized report and discuss it with an AI that understands your results and context. Explore contradictions, drivers, and emerging themes.',
                  cta: { href: '/start', label: 'Open AI Companion' },
                },
                {
                  title: 'Act',
                  desc: 'Turn insights into action with weekly check-ins and monthly pacing. Subscribers get 2 free quizzes (≤ $50 each) and 3 premium audio articles per month.',
                  cta: { href: '/subscribe', label: `Subscribe • $${PRICING.MONTHLY_USD}/mo` },
                },
              ].map((s, i) => (
                <motion.div
                  key={s.title}
                  className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 opacity-20 blur-2xl" />
                  <div className="relative">
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-purple-700 border border-purple-200">{i + 1}</span>
                      {s.title.toUpperCase()}
                    </div>
                    <p className="text-gray-700">{s.desc}</p>
                    <div className="mt-4">
                      <Link href={s.cta.href} className="group inline-flex items-center text-sm font-medium text-gray-900">
                        {s.cta.label}
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Bento Highlights */}
      <section className="relative border-y border-black/5 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <BentoPanel className="lg:col-span-2" title="Assessments with depth" subtitle="2 free quizzes/month (≤ $50 value) for subscribers" gradient="from-violet-600 to-indigo-600">
              <ul className="mt-4 space-y-2 text-sm text-white/90">
                <li>• Cognitive dissonance, stress patterns, energy variability</li>
                <li>• Personalized reports and next steps</li>
                <li>• Research-backed, no pop-psych fluff</li>
              </ul>
              <div className="mt-5">
                <PrimaryCTA href="/quizzes" variant="premium" className="px-5 py-2.5 text-sm">Browse Quizzes</PrimaryCTA>
              </div>
            </BentoPanel>

            <BentoPanel title="Your privacy is yours" subtitle="You own your data. Export or delete anytime." icon={<ShieldCheck className="w-5 h-5" />}>
              <p className="text-sm text-gray-600 mt-2">
                Secure handling of sensitive information with clear consent. We focus on growth — not labels.
              </p>
              <Link href="/privacy" className="group mt-4 inline-flex items-center text-sm font-medium text-gray-800">
                Learn more
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </BentoPanel>

            <BentoPanel className="lg:col-span-1" title="Premium, not overwhelming" subtitle="Designed for monthly pacing" icon={<Sparkles className="w-5 h-5" />}>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>• 3 premium articles/month</li>
                <li>• 2 free quizzes/month (≤ $50)</li>
                <li>• Member discounts & no ads</li>
              </ul>
            </BentoPanel>

            <BentoPanel className="lg:col-span-2" title="An AI companion that remembers" subtitle="Unlimited chat for subscribers" icon={<MessageSquare className="w-5 h-5" />}>
              <p className="text-sm text-gray-600 mt-2">
                Ask questions about your results, explore patterns, and plan next steps — like a thinking partner.
              </p>
              <div className="mt-4">
                <PrimaryCTA href="/start" variant="outline" className="px-5 py-2.5 text-sm">Open AI Companion</PrimaryCTA>
              </div>
            </BentoPanel>

            <BentoPanel title="Made by a human, for humans" subtitle="Personal, ethical, research-informed">
              <p className="text-sm text-gray-600 mt-2">
                MyBeing is a personal platform focused on self-awareness and growth — not a marketplace for clinicians.
              </p>
              <Link href="/about" className="group mt-4 inline-flex items-center text-sm font-medium text-gray-800">
                About the creator
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </BentoPanel>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 p-8 sm:p-12 text-white shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Start your next chapter</h2>
              <p className="mt-3 max-w-2xl text-white/90">
                Subscribe for audio articles, monthly allowances, and unlimited AI conversations — or begin with a single assessment.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <PrimaryCTA href="/subscribe" variant="premium" className="px-6 py-3">Subscribe • ${PRICING.MONTHLY_USD}/mo</PrimaryCTA>
                <PrimaryCTA href="/quizzes" variant="outline" className="px-6 py-3">Take an Assessment</PrimaryCTA>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Reel */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <FeatureReel />
        </div>
      </section>

      {/* Content Sections: New, Trending Quizzes, Latest Articles, Browse */}
      <motion.div id="new" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
        <NewThisWeek />
      </motion.div>
      <motion.div id="trending" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
        <FeaturedQuizzes />
      </motion.div>
      <motion.div id="articles" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
        <FeaturedBlogs />
      </motion.div>
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Newsletter />
      </div>
      <motion.div id="browse" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
        <BrowseLatest />
      </motion.div>
      {/* Sticky CTA / Progress Bar */}
      <StickyCTA />
    </div>
  );
}

function HeroCard({ icon, title, desc, href, color }: { icon: React.ReactNode; title: string; desc: string; href: string; color: string; }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`} />
      <div className="relative">
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-gray-900">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
        <Link href={href} className="group mt-4 inline-flex items-center text-sm font-medium text-gray-800">
          Learn more
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function BentoPanel({ title, subtitle, icon, children, gradient, className }: { title: string; subtitle?: string; icon?: React.ReactNode; children?: React.ReactNode; gradient?: string; className?: string; }) {
  const decorated = gradient ? `relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br ${gradient} text-white` : 'relative overflow-hidden rounded-2xl border border-black/10 bg-white';
  return (
    <div className={`${decorated} p-6 ${className || ''}`}>
      {gradient && <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),rgba(255,255,255,0))]" />}
      <div className="relative">
        {icon && (
          <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${gradient ? 'bg-white/15 border border-white/25 text-white' : 'bg-white border border-black/10 text-gray-900'}`}>
            {icon}
          </div>
        )}
        <h3 className={`text-lg font-semibold ${gradient ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {subtitle && <p className={`mt-1 text-sm ${gradient ? 'text-white/90' : 'text-gray-600'}`}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function MarqueeStrip() {
  const items = [
    'Private by default',
    'Research‑backed',
    'AI that knows you',
    'Export or delete anytime',
    'Anonymized analytics',
    'No ads, no trackers',
    'No right/wrong answers'
  ];
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="hidden md:block relative overflow-hidden rounded-2xl border border-black/10 bg-white">
      <motion.div
        className="flex items-center gap-6 py-3 whitespace-nowrap"
        animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={prefersReducedMotion ? undefined : { duration: 36, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((label, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-700">
            <Star className="h-4 w-4 text-violet-600" aria-hidden="true" focusable={false} />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function FeatureReel() {
  const items = [
    {
      title: 'Cognitive Dissonance',
      desc: 'Spot contradictions between values and actions across 5 patterns.',
      href: '/quizzes/cognitive-dissonance/classic',
    },
    {
      title: 'Weekly Check‑ins',
      desc: 'EMA micro-check‑ins + weekly and monthly modules to track change.',
      href: '/check-ins',
    },
    {
      title: 'AI Companion',
      desc: 'Ask questions about your report. Explore patterns and next steps.',
      href: '/start',
    },
    {
      title: 'Premium Articles',
      desc: '3 advanced research pieces per month, with audio narration.',
      href: '/blog',
    },
    {
      title: 'Privacy Controls',
      desc: 'Export or delete your data anytime. Anonymized analytics only.',
      href: '/privacy',
    },
  ];
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
      <div className="-mx-6 overflow-x-auto px-6">
        <div className="flex gap-4 snap-x snap-mandatory">
          {items.map((item) => (
            <motion.div
              key={item.title}
              className="min-w-[280px] md:min-w-[360px] snap-start rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              <Link href={item.href} className="group mt-4 inline-flex items-center text-sm font-medium text-gray-900">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickyCTA() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = Math.min(100, Math.max(0, Math.round((scrolled / (max || 1)) * 100)));
      setProgress(pct);
      setShow(scrolled > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-4 z-40 px-4 transition-all motion-safe:duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
      <div className="mx-auto max-w-3xl rounded-2xl border border-purple-200/60 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-lg">
        <div className="h-1 w-full bg-purple-100 rounded-t-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
            <span>⭐</span>
            <span>Start your free journey</span>
          </div>
          <div className="flex items-center gap-2">
            <PrimaryCTA href="/blog" size="sm" variant="uiverse" className="px-4 py-2">Start Free</PrimaryCTA>
            <PrimaryCTA href="/subscribe" size="sm" variant="premium" className="px-4 py-2">Subscribe • ${PRICING.MONTHLY_USD}/mo</PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  );
}
