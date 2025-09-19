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
                Make better 
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent"> decisions</span>
                <span className="block mt-2">with clearer thinking</span>
              </h1>
              <p className="mx-auto lg:mx-0 mt-6 max-w-2xl text-xl leading-relaxed text-gray-700">
                Understand your decision-making patterns and cognitive biases to make choices that create positive impact. 
                <span className="block mt-2 font-medium text-gray-900">Better decisions lead to a better world.</span>
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <PrimaryCTA href="/blog" variant="uiverse" className="px-8 py-4 text-base font-semibold">
                  Start Reading Articles
                </PrimaryCTA>
                <PrimaryCTA href="/quizzes" variant="secondary" className="px-6 py-4 text-base">
                  Take a Quiz
                </PrimaryCTA>
              </div>
              <div className="mt-4 text-center lg:text-left">
                <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-purple-700 underline underline-offset-4 transition-colors">
                  Start reading articles →
                </Link>
              </div>
              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  <span>📚</span> <span className="font-medium">Free Articles</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  <span>🧪</span> <span className="font-medium">Research-Based</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  <span>🎯</span> <span className="font-medium">Actionable Insights</span>
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
                  cta: { href: '/subscribe', label: `Get Premium • $${PRICING.MONTHLY_USD}/mo` },
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
                <PrimaryCTA href="/subscribe" variant="outline" className="px-6 py-3">Upgrade Later • ${PRICING.MONTHLY_USD}/mo</PrimaryCTA>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Categories Section */}
      <MainCategoriesSection />
      
      {/* Fresh This Week */}
      <FreshThisWeek />
      
      {/* Content Toggle Section */}
      <ContentToggleSection />
      
      {/* Newsletter Section - After content consumption */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Newsletter />
      </div>
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

function MainCategoriesSection() {
  const categories = [
    {
      title: "Understanding Yourself",
      icon: <Users className="w-6 h-6" />,
      description: "Explore your inner world through psychology and self-awareness",
      subcategories: [
        { name: "Decision-Making Patterns", count: 8, href: "/blog/category/decision-making" },
        { name: "Cognitive Biases", count: 12, href: "/blog/category/cognitive-biases" },
        { name: "Emotional Intelligence", count: 6, href: "/blog/category/emotional-intelligence" },
        { name: "Personal Growth", count: 10, href: "/blog/category/personal-growth" }
      ],
      color: "from-purple-600 to-indigo-600"
    },
    {
      title: "Understanding Our Surroundings",
      icon: <Globe className="w-6 h-6" />,
      description: "Navigate the world with better awareness and insight",
      subcategories: [
        { name: "Social Psychology", count: 7, href: "/blog/category/social-psychology" },
        { name: "Environmental Impact", count: 5, href: "/blog/category/environment" },
        { name: "Technology & Society", count: 9, href: "/blog/category/technology" },
        { name: "Cultural Patterns", count: 4, href: "/blog/category/culture" }
      ],
      color: "from-fuchsia-500 to-violet-600"
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
            Two Ways to Understand Better
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dive deep into yourself and your environment to make better decisions and create positive impact.
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
      title: "Why Your Brain Tricks You Into Bad Decisions",
      excerpt: "Understanding cognitive biases that sabotage your choices",
      readTime: "5 min read",
      category: "Decision-Making",
      href: "/blog/cognitive-biases-bad-decisions",
      isNew: true
    },
    {
      type: "Quiz",
      title: "Your Decision-Making Style Assessment",
      excerpt: "Discover how you process information and make choices",
      readTime: "8 min quiz",
      category: "Self-Assessment",
      href: "/quizzes/decision-making-style",
      isNew: true
    },
    {
      type: "Article",
      title: "The Psychology of Social Media Influence",
      excerpt: "How digital environments shape our thoughts and behaviors",
      readTime: "7 min read",
      category: "Social Psychology",
      href: "/blog/social-media-psychology",
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
            <h2 className="text-2xl font-bold text-gray-900">Fresh This Week</h2>
            <p className="text-gray-600">New insights to expand your understanding</p>
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
      title: "The Science of Better Decision Making",
      excerpt: "Research-backed strategies to improve your choices",
      category: "Decision-Making",
      readTime: "6 min read",
      href: "/blog/science-better-decisions"
    },
    {
      title: "Understanding Confirmation Bias",
      excerpt: "Why we seek information that confirms our beliefs",
      category: "Cognitive Biases",
      readTime: "4 min read",
      href: "/blog/confirmation-bias"
    },
    {
      title: "Emotional Intelligence in Daily Life",
      excerpt: "Practical ways to understand and manage emotions",
      category: "Emotional Intelligence",
      readTime: "8 min read",
      href: "/blog/emotional-intelligence-daily"
    }
  ];

  const quizzes = [
    {
      title: "Cognitive Bias Assessment",
      excerpt: "Discover which biases most influence your thinking",
      category: "Self-Assessment",
      readTime: "10 min quiz",
      href: "/quizzes/cognitive-bias-assessment"
    },
    {
      title: "Decision-Making Under Pressure",
      excerpt: "How do you handle high-stakes choices?",
      category: "Decision-Making",
      readTime: "12 min quiz",
      href: "/quizzes/pressure-decisions"
    },
    {
      title: "Social Influence Patterns",
      excerpt: "Understand how others affect your choices",
      category: "Social Psychology",
      readTime: "8 min quiz",
      href: "/quizzes/social-influence"
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
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Read articles for insights or take quizzes to understand your patterns
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
              Start Reading
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
              Take a Quiz
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
            <PrimaryCTA href="/subscribe" size="sm" variant="premium" className="px-4 py-2">Premium • ${PRICING.MONTHLY_USD}/mo</PrimaryCTA>
          </div>
        </div>
      </div>
    </div>
  );
}
