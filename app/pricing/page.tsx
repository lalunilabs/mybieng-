import { Metadata } from 'next';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing Plans - MyBeing',
  description: 'Choose the perfect plan for your self-discovery journey. From free basic assessments to premium psychological insights with AI-powered analysis.',
  keywords: ['pricing', 'plans', 'psychology assessment', 'self-discovery', 'premium features'],
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingSection />
    </div>
  );
}
