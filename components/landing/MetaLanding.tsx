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
import { Sparkles, Brain, BookOpenCheck, MessageSquare, ShieldCheck, ChevronRight, Star, ArrowRight, PlayCircle, Users, Globe, Heart, Lightbulb, TrendingUp, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';
import { PageWrapper } from '@/components/layout/PageWrapper';

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
    <PageWrapper>
      <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-white">
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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8">
              Discover the <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">hidden patterns</span><br />
              shaping your life
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Unlock deep self-awareness through science-backed assessments. Understand your mind, transform your decisions, and create lasting change.
            </p>
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl">
              <strong>2,847+ people</strong> have already started their journey to better self-understanding.
            </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <PrimaryCTA href="/quizzes" variant="uiverse" className="px-8 py-4 text-base font-semibold">
                  🧠 Take Your First Assessment
                </PrimaryCTA>
                <PrimaryCTA href="/blog" variant="secondary" className="px-6 py-4 text-base">
                  📚 Explore Free Articles
                </PrimaryCTA>
              </div>
              <div className="mt-4 text-center lg:text-left">
                <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-purple-700 underline underline-offset-4 transition-colors">
                  Start reading articles →
                </Link>
              </div>
              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200 text-green-700">
                  <span>✓</span>
                  <span>2,847+ Active Users</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 text-blue-700">
                  <span>✓</span>
                  <span>Research-Backed</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-200 text-purple-700">
                  <span>✓</span>
                  <span>5-Min Quick Start</span>
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
              icon={<BookOpenCheck className="w-5 h-5" />}
              title="Read & Learn"
              desc="Explore free articles on decision-making, cognitive biases, and psychology to improve your thinking."
              href="/blog"
              color="from-purple-600 to-indigo-600"
            />
            <HeroCard
              icon={<Brain className="w-5 h-5" />}
              title="Test Your Knowledge"
              desc="Take interactive quizzes to understand your decision patterns and cognitive tendencies."
              href="/quizzes"
              color="from-fuchsia-500 to-violet-600"
            />
            <HeroCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Get Personalized Insights"
              desc="Discuss your results with AI and get tailored recommendations for better decision-making."
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
      
      {/* Main Categories Section */}
      <MainCategoriesSection />
      
      {/* Fresh This Week */}
      <FreshThisWeek />
      
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
                    <h3 className="text-2xl font-bold tracking-tight">How MyBeing Works</h3>
                  </div>
                  <p className="mt-3 text-white/90">Three simple steps to unlock deeper self-understanding through science-backed assessments and personalized AI guidance.</p>
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
                  title: 'Take an Assessment',
                  desc: 'Choose from research-backed assessments that reveal your cognitive patterns, emotional responses, and behavioral tendencies. No right or wrong answers—just insights.',
                  cta: { href: '/quizzes', label: 'Start Your Assessment' },
                },
                {
                  title: 'Get Personalized Insights',
                  desc: 'Receive a detailed report analyzing your unique patterns. Then chat with our AI companion to explore what your results mean and how to apply them.',
                  cta: { href: '/start', label: 'Chat with AI' },
                },
                {
                  title: 'Apply Your Learning',
                  desc: 'Use your insights for real growth with weekly check-ins, premium research articles, and ongoing AI support. Premium members get 2 free assessments monthly.',
                  cta: { href: '/subscribe', label: `Get Premium • $${PRICING.monthly}/mo` },
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
            <BentoPanel className="lg:col-span-2" title="Science-Backed Assessments" subtitle="Discover your patterns through validated research methods" gradient="from-violet-600 to-indigo-600">
              <ul className="mt-4 space-y-2 text-sm text-white/90">
                <li>• Cognitive patterns and decision-making styles</li>
                <li>• Emotional responses and stress indicators</li>
                <li>• Behavioral tendencies and energy cycles</li>
                <li>• Detailed reports with actionable insights</li>
              </ul>
              <div className="mt-5">
                <PrimaryCTA href="/quizzes" variant="premium" className="px-5 py-2.5 text-sm">Explore Assessments</PrimaryCTA>
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

            <BentoPanel className="lg:col-span-1" title="Premium Membership" subtitle="Thoughtfully designed for sustainable growth" icon={<Sparkles className="w-5 h-5" />}>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>• 2 free assessments monthly</li>
                <li>• 3 premium research articles</li>
                <li>• Unlimited AI conversations</li>
                <li>• Member-only content & discounts</li>
              </ul>
            </BentoPanel>

            <BentoPanel className="lg:col-span-2" title="Your Personal AI Companion" subtitle="Unlimited conversations about your results" icon={<MessageSquare className="w-5 h-5" />}>
              <p className="text-sm text-gray-600 mt-2">
                Discuss your assessment results, explore patterns, and get personalized guidance. Your AI companion remembers your context and grows with you.
              </p>
              <div className="mt-4">
                <PrimaryCTA href="/start" variant="outline" className="px-5 py-2.5 text-sm">Start Chatting</PrimaryCTA>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to make better decisions?</h2>
              <p className="mt-3 max-w-2xl text-white/90">
                Start with free articles and quizzes. Upgrade to premium when you're ready for deeper insights and unlimited AI conversations.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <PrimaryCTA href="/blog" variant="premium" className="px-8 py-3 text-base font-semibold">Start Reading Free Articles</PrimaryCTA>
                <PrimaryCTA href="/subscribe" variant="outline" className="px-6 py-3">Upgrade Later • ${PRICING.monthly}/mo</PrimaryCTA>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Toggle Section */}
      <ContentToggleSection />
      
      {/* Featured Content Showcase */}
      <FeaturedContentShowcase />
      
      {/* How It Works Section - Above Newsletter */}
      <HowItWorksSection />
      
      {/* Newsletter Section - Improved */}
      <ImprovedNewsletterSection />
      
      {/* Sticky CTA / Progress Bar */}
      <StickyCTA />
      </div>
    </PageWrapper>
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

function MainCategoriesSection() {
  const categories = [
    {
      title: "🧠 Discover Your Inner Patterns",
      icon: <Users className="w-6 h-6" />,
      description: "Uncover the hidden forces driving your decisions through personalized assessments",
      subcategories: [
        { name: "The Mental Tug-of-War", count: "5 min", href: "/quizzes/cognitive-dissonance" },
        { name: "Decision-Making Patterns", count: "New", href: "/blog/mental-tug-of-war-cognitive-dissonance" },
        { name: "Behavioral Insights", count: "Free", href: "/blog" },
        { name: "Personal Growth Tools", count: "2+", href: "/blog" }
      ],
      color: "from-purple-600 to-indigo-600",
      cta: { text: "🎯 Start Your Assessment", href: "/quizzes" }
    },
    {
      title: "🌍 Navigate Your Environment",
      icon: <Globe className="w-6 h-6" />,
      description: "Understand how your surroundings shape your thoughts and behaviors",
      subcategories: [
        { name: "Social Influence", count: "Free", href: "/blog" },
        { name: "Research Insights", count: "Latest", href: "/research" },
        { name: "Evidence-Based Content", count: "3+", href: "/blog" },
        { name: "Practical Applications", count: "Guide", href: "/how-it-works" }
      ],
      color: "from-fuchsia-500 to-violet-600",
      cta: { text: "📖 Explore Articles", href: "/blog" }
    }
  ];

  return (
    <section className="relative py-16 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Two Powerful Paths to Self-Discovery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your journey: dive deep with personalized assessments or explore insights through research-backed articles. Both paths lead to profound self-understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${category.color} opacity-10 blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="group p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                          {sub.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {sub.count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6">
                  <PrimaryCTA 
                    href={category.cta.href} 
                    variant="uiverse" 
                    className="w-full justify-center"
                  >
                    {category.cta.text}
                  </PrimaryCTA>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreshThisWeek() {
  const freshContent = [
    {
      type: "Article",
      title: "The Mental Tug-of-War: Cognitive Dissonance",
      excerpt: "Understanding the psychological tension when beliefs conflict with actions",
      readTime: "8 min read",
      category: "Psychology",
      href: "/blog/mental-tug-of-war-cognitive-dissonance",
      isNew: true
    },
    {
      type: "Quiz",
      title: "Cognitive Dissonance Assessment",
      excerpt: "Detect contradictions between values and actions across 5 patterns",
      readTime: "10 min quiz",
      category: "Self-Assessment",
      href: "/quizzes/cognitive-dissonance",
      isNew: true
    },
    {
      type: "Article",
      title: "Example Article: Getting Started",
      excerpt: "A sample article to demonstrate the platform's capabilities",
      readTime: "5 min read",
      category: "Getting Started",
      href: "/blog/example-article",
      isNew: false
    }
  ];

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 This Week's Breakthroughs</h2>
            <p className="text-gray-600">Fresh insights that 2,847+ people are already exploring</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freshContent.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  {item.isNew && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        New
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {item.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.category}</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentToggleSection() {
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes'>('articles');

  const articles = [
    {
      title: "The Mental Tug-of-War: Cognitive Dissonance",
      excerpt: "Understanding the psychological tension when beliefs conflict with actions",
      category: "Psychology",
      readTime: "8 min read",
      href: "/blog/mental-tug-of-war-cognitive-dissonance"
    },
    {
      title: "Example Article: Getting Started",
      excerpt: "A sample article to demonstrate the platform's capabilities",
      category: "Getting Started",
      readTime: "5 min read",
      href: "/blog/example-article"
    },
    {
      title: "Explore All Articles",
      excerpt: "Browse our complete collection of research-backed insights",
      category: "Browse",
      readTime: "Browse",
      href: "/blog"
    }
  ];

  const quizzes = [
    {
      title: "Cognitive Dissonance Assessment",
      excerpt: "Detect contradictions between values and actions across 5 patterns",
      category: "Self-Assessment",
      readTime: "10 min quiz",
      href: "/quizzes/cognitive-dissonance"
    },
    {
      title: "Explore All Quizzes",
      excerpt: "Browse our complete collection of self-discovery assessments",
      category: "Browse",
      readTime: "Browse",
      href: "/quizzes"
    },
    {
      title: "Coming Soon: Stress Patterns",
      excerpt: "Understand your stress responses and coping mechanisms",
      category: "Coming Soon",
      readTime: "10 min quiz",
      href: "/quizzes"
    }
  ];

  return (
    <section className="relative py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Dive Deeper?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose your preferred path: quick insights through articles or deep self-discovery through personalized assessments
          </p>

          {/* Toggle Buttons */}
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'articles'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpenCheck className="w-4 h-4 inline mr-2" />
              📚 Quick Insights
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'quizzes'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              🧠 Deep Discovery
            </button>
          </div>
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {(activeTab === 'articles' ? articles : quizzes).map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {activeTab === 'articles' ? <BookOpenCheck className="w-3 h-3" /> : <Brain className="w-3 h-3" />}
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.readTime}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedContentShowcase() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <span>⭐</span>
            <span>Most Popular</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start Your Journey Here
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands who've already discovered profound insights about themselves through our flagship assessment and articles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Quiz */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group"
          >
            <Link href="/quizzes/cognitive-dissonance" className="block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-black/10 blur-2xl" />
                
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    <span>🧠</span>
                    <span>Featured Assessment</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">The Mental Tug-of-War</h3>
                  <p className="text-purple-100 mb-6 leading-relaxed">
                    Discover the hidden contradictions between your values and actions. This 5-minute assessment reveals patterns of cognitive dissonance that shape your daily decisions.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-purple-200">
                      <span>⏱️ 5-10 minutes</span>
                      <span>📊 Instant results</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg font-medium group-hover:bg-white/30 transition-colors">
                      <span>Start Assessment</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="group"
          >
            <Link href="/blog/mental-tug-of-war-cognitive-dissonance" className="block">
              <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] h-full">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-600/20 blur-2xl" />
                
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm font-medium mb-4">
                    <span>📖</span>
                    <span>Featured Article</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Understanding Cognitive Dissonance</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Dive deep into the psychology behind conflicting beliefs and actions. Learn how cognitive dissonance affects your decisions and discover practical strategies to align your values with your behavior.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📚 8 min read</span>
                      <span>🔬 Research-backed</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 group-hover:bg-gray-200 transition-colors">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Quick Access Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">Quick access:</span>
            <Link href="/quizzes" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              All Assessments
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/blog" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              All Articles
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/reports" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              View Reports
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative py-16 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <span>🔥</span>
            <span>Just Released</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            This Week's Breakthroughs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh insights and powerful assessments that thousands are already using to transform their self-understanding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Take an Assessment",
              description: "Choose from research-backed assessments that reveal your cognitive patterns and behavioral tendencies.",
              icon: <Brain className="w-8 h-8" />,
              color: "from-purple-600 to-indigo-600"
            },
            {
              step: "02", 
              title: "Get Personalized Insights",
              description: "Receive detailed reports analyzing your unique patterns and chat with AI for deeper understanding.",
              icon: <Lightbulb className="w-8 h-8" />,
              color: "from-fuchsia-500 to-violet-600"
            },
            {
              step: "03",
              title: "Apply Your Learning", 
              description: "Use insights for real growth with ongoing support, premium content, and progress tracking.",
              icon: <TrendingUp className="w-8 h-8" />,
              color: "from-purple-600 to-pink-600"
            }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative text-center"
            >
              <div className="relative mb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImprovedNewsletterSection() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <span>📬</span>
            <span>Weekly Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Weekly Reflection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get curated insights, new research findings, and practical tips for self-discovery delivered to your inbox every week.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <Newsletter />
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>Weekly delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>Research-backed content</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
            <PrimaryCTA href="/blog" size="sm" variant="uiverse" className="px-4 py-2">Read Articles</PrimaryCTA>
            <PrimaryCTA href="/subscribe" size="sm" variant="premium" className="px-4 py-2">Premium • ${PRICING.monthly}/mo</PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  );
}
