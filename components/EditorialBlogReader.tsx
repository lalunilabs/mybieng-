'use client';

import { useMemo, useEffect, useState } from 'react';
import type { Blog } from '@/data/blogs';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import NewsletterModal from '@/components/modals/NewsletterModal';
import SubscriptionOfferModal from '@/components/modals/SubscriptionOfferModal';

interface EditorialBlogReaderProps {
  blog: Blog;
}

export default function EditorialBlogReader({ blog }: EditorialBlogReaderProps) {
  // Split content into paragraphs for layout control
  const paragraphs = useMemo(() => {
    if (!blog?.content) return [] as string[];
    return blog.content
      .split(/\n\s*\n/g)
      .map(p => p.trim())
      .filter(Boolean);
  }, [blog?.content]);

  const pullQuote = (blog as any).pullQuote as string | undefined;
  const imageUrl = blog.imageUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop';

  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showSubscriptionOffer, setShowSubscriptionOffer] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const percent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (!showNewsletterModal && percent >= 35) {
        try {
          const dismissed = localStorage.getItem('newsletter-modal-dismissed') === 'true';
          const subscribed = localStorage.getItem('newsletter-subscribed') === 'true';
          if (!dismissed && !subscribed) setShowNewsletterModal(true);
        } catch {
          setShowNewsletterModal(true);
        }
      }
      if (!showSubscriptionOffer && percent >= 90) {
        try {
          const dismissed = localStorage.getItem('subscription-offer-dismissed') === 'true';
          if (!dismissed) setShowSubscriptionOffer(true);
        } catch {
          setShowSubscriptionOffer(true);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showNewsletterModal, showSubscriptionOffer]);

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Masthead */}
        <header className="mb-10 border-b border-gray-200 pb-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {blog.tags?.map((t) => (
              <span key={t} className="tracking-wide uppercase font-medium text-gray-700">
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] text-gray-900 mb-4">
            {blog.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-light max-w-3xl">
            {blog.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="font-medium text-gray-900">By {blog.author}</span>
            <span className="hidden sm:inline">•</span>
            <span>{blog.readTime} min read</span>
            <span className="hidden sm:inline">•</span>
            <time dateTime={blog.publishedAt.toISOString()}>
              {blog.publishedAt.toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Lead Image and Quote */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <figure className="overflow-hidden rounded-md bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="lead" className="w-full h-[420px] object-cover" />
            </figure>
          </div>
          <aside className="lg:col-span-1 flex items-center">
            <blockquote className="font-serif text-2xl sm:text-3xl text-gray-900 leading-snug">
              <span className="text-4xl align-[-0.2em] mr-2">“</span>
              {pullQuote || 'Simplicity is complexity resolved.'}
              <span className="text-4xl align-[-0.2em] ml-2">”</span>
              <footer className="mt-3 text-sm text-gray-500">— {blog.author}</footer>
            </blockquote>
          </aside>
        </section>

        {/* Editorial Columns */}
        <section className="mb-12">
          <div className="lg:columns-2 gap-10 [column-fill:_balance]"></div>
          <div className="lg:columns-2 gap-10 [column-fill:_balance]">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className={
                  'mb-6 text-gray-800 leading-relaxed text-[17px] tracking-[0.003em] break-inside-avoid ' +
                  (idx === 0
                    ? ' first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:text-gray-900'
                    : '')
                }
              >
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Collage strip */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0,1,2,3].map((i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/photo-15${89757148 + i * 11}?q=80&w=600&auto=format&fit=crop`}
                  alt="collage"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-gray-900 mb-1">Continue your journey</h3>
              <p className="text-gray-600">Take a related assessment or get weekly insights.</p>
            </div>
            <div className="flex gap-3">
              <PrimaryCTA href="/quizzes" variant="uiverse">Explore Quizzes</PrimaryCTA>
              <PrimaryCTA href="#newsletter">Join Newsletter</PrimaryCTA>
            </div>
          </div>
        </footer>
      </article>
      {/* Engagement Modals */}
      <NewsletterModal isOpen={showNewsletterModal} onClose={() => setShowNewsletterModal(false)} />
      <SubscriptionOfferModal isOpen={showSubscriptionOffer} onClose={() => setShowSubscriptionOffer(false)} />
    </div>
  );
}
