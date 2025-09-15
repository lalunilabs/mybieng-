'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckoutCard } from './CheckoutCard';
import { PricingModal } from './PricingModal';

const sampleCheckoutItems = [
  {
    name: 'Premium Membership',
    description: 'Unlimited assessments, AI chat, and advanced insights',
    price: 19.99
  },
  {
    name: 'Cognitive Assessment Bundle',
    description: 'Complete cognitive pattern analysis suite',
    price: 9.99
  }
];

const pricingPlans = [
  {
    id: 'discoverer',
    name: 'Discoverer',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      'Unlimited quiz access',
      'Basic AI insights',
      'Progress tracking',
      'Email support'
    ]
  },
  {
    id: 'researcher',
    name: 'Researcher',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    popular: true,
    features: [
      'Everything in Discoverer',
      'Advanced AI chat guidance',
      'Detailed pattern analysis',
      'Export reports',
      'Priority support',
      'Early access to new assessments'
    ]
  },
  {
    id: 'explorer',
    name: 'Explorer',
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    features: [
      'Everything in Researcher',
      '1-on-1 coaching sessions',
      'Custom assessment creation',
      'API access',
      'White-label options',
      'Dedicated account manager'
    ]
  }
];

export function PaymentShowcase() {
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleCheckout = async (promoCode?: string) => {
    console.log('Processing checkout with promo:', promoCode);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Payment processed successfully!');
  };

  const handleUpgrade = async (planId: string, billing: 'monthly' | 'yearly') => {
    console.log('Upgrading to:', planId, billing);
    // Simulate upgrade processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Upgraded to ${planId} (${billing})!`);
  };

  return (
    <div className="payment-showcase w-full max-w-6xl mx-auto p-8 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Payment Components Showcase
        </h1>
        <p className="text-lg text-muted-foreground">
          Beautiful checkout and pricing components with MyBeing brand colors
        </p>
      </motion.div>

      {/* Checkout Card */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Checkout Card
        </motion.h2>
        
        <div className="flex justify-center">
          <CheckoutCard
            items={sampleCheckoutItems}
            onCheckout={handleCheckout}
          />
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Try promo codes: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">MYBEING20</code> or <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">WELCOME10</code></p>
        </div>
      </section>

      {/* Pricing Modal */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Pricing Modal
        </motion.h2>
        
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPricingModal(true)}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            View Pricing Plans
          </motion.button>
        </div>

        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onUpgrade={handleUpgrade}
          plans={pricingPlans}
        />
      </section>

      {/* Design System Notes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">Payment Design System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Checkout Card</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Yellow pastel background with subtle shadows</li>
              <li>• Slate borders and accents for contrast</li>
              <li>• Promo code validation with visual feedback</li>
              <li>• Smooth animations and hover effects</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Pricing Modal</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Green gradient header with brand consistency</li>
              <li>• Animated billing toggle with smooth transitions</li>
              <li>• Plan selection with visual feedback</li>
              <li>• Feature lists with check icons</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Interactions</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Hover effects with scale transforms</li>
              <li>• Loading states with spinners</li>
              <li>• Form validation and error handling</li>
              <li>• Smooth modal animations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Accessibility</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Keyboard navigation support</li>
              <li>• Focus states and outlines</li>
              <li>• Screen reader friendly markup</li>
              <li>• High contrast color combinations</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default PaymentShowcase;
