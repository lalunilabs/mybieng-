'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Zap } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (planId: string, billing: 'monthly' | 'yearly') => Promise<void>;
  plans: PricingPlan[];
  className?: string;
}

export function PricingModal({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  plans,
  className = "" 
}: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = plans.find(p => p.id === selectedPlan);
  const currentPrice = billingCycle === 'monthly' 
    ? currentPlan?.monthlyPrice || 0 
    : currentPlan?.yearlyPrice || 0;

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      await onUpgrade(selectedPlan, billingCycle);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`pricing-modal w-full max-w-md bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-slate-900 shadow-[0px_187px_75px_rgba(0,0,0,0.01),0px_105px_63px_rgba(0,0,0,0.05),0px_47px_47px_rgba(0,0,0,0.09),0px_12px_26px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden ${className}`}
          >
            {/* Header */}
            <div className="relative">
              <div className="banner w-full h-8 bg-gradient-to-r from-green-400 to-emerald-500" />
              
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="p-6 pb-4">
                <h2 className="title font-bold text-lg text-center text-slate-800 dark:text-slate-200 mb-4">
                  Upgrade Your Experience
                </h2>
                <p className="description max-w-[80%] mx-auto font-semibold text-xs leading-relaxed text-center text-slate-600 dark:text-slate-400">
                  Unlock advanced insights, unlimited assessments, and personalized AI guidance
                </p>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="tab-container flex relative p-0.5 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-5 mb-6">
              <motion.div
                className="indicator absolute top-0.5 w-1/2 h-7 bg-white dark:bg-slate-600 rounded-xl shadow-[0px_3px_8px_rgba(0,0,0,0.12)] z-10"
                animate={{
                  left: billingCycle === 'monthly' ? '2px' : 'calc(50% - 2px)'
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
              
              <button
                onClick={() => setBillingCycle('monthly')}
                className="tab w-1/2 h-7 relative z-20 bg-transparent border-0 outline-none font-medium text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Monthly
              </button>
              
              <button
                onClick={() => setBillingCycle('yearly')}
                className="tab w-1/2 h-7 relative z-20 bg-transparent border-0 outline-none font-medium text-sm text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-center gap-1"
              >
                Yearly
                <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Plan Selection */}
            <div className="px-5 mb-6">
              <div className="space-y-3">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-4 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                            ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selectedPlan === plan.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="benefits px-5 pb-5">
              <span className="text-base text-slate-800 dark:text-slate-200 font-bold mb-4 block">
                What's included:
              </span>
              
              <ul className="space-y-3">
                {currentPlan?.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-xs text-slate-600 dark:text-slate-400">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="modal--footer flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-700">
              <div className="price relative">
                <span className="text-3xl text-slate-800 dark:text-slate-200 font-black">
                  ${currentPrice}
                </span>
                <sup className="text-sm">USD</sup>
                <sub className="absolute bottom-1 text-xs text-slate-600 dark:text-slate-400">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </sub>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#059669' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                disabled={isLoading}
                className="upgrade-btn flex items-center justify-center w-52 h-10 bg-green-600 hover:bg-green-700 shadow-[0px_0.5px_0.5px_theme(colors.slate.200)] rounded-lg border-0 outline-none text-white text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;
