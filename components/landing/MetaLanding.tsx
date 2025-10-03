'use client';

import WorldClassHero from './WorldClassHero';
import PremiumArticleShowcase from './PremiumArticleShowcase';
import InteractiveAssessmentPreview from './InteractiveAssessmentPreview';
import PremiumTestimonials from './PremiumTestimonials';
import Newsletter from '@/components/Newsletter';
import AdSlot from '@/components/ads/AdSlot';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function MetaLanding() {
  return (
    <PageWrapper>
      {/* World-Class Hero Section */}
      <WorldClassHero />

      {/* Premium Article Showcase */}
      <PremiumArticleShowcase />

      {/* Interactive Assessment Preview */}
      <InteractiveAssessmentPreview />

      {/* Premium Testimonials */}
      <PremiumTestimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </PageWrapper>
  );
}
