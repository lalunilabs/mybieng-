'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Tag, ArrowRight } from 'lucide-react';

interface CheckoutItem {
  name: string;
  description: string;
  price: number;
}

interface CheckoutCardProps {
  items: CheckoutItem[];
  onCheckout?: (promoCode?: string) => Promise<void>;
  className?: string;
}

export function CheckoutCard({ items, onCheckout, className = "" }: CheckoutCardProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    // Simulate promo code validation
    if (promoCode.toLowerCase() === 'mybeing20') {
      setDiscount(20);
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(10);
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await onCheckout?.(promoApplied ? promoCode : undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`checkout-card w-full max-w-md bg-yellow-50 dark:bg-yellow-950/20 shadow-[0px_187px_75px_rgba(0,0,0,0.01),0px_105px_63px_rgba(0,0,0,0.05),0px_47px_47px_rgba(0,0,0,0.09),0px_12px_26px_rgba(0,0,0,0.1)] ${className}`}
    >
      {/* Cart Section */}
      <div className="cart rounded-t-3xl">
        <div className="title w-full h-10 flex items-center px-5 border-b border-slate-600/75 font-bold text-xs text-slate-900 dark:text-slate-100">
          ORDER SUMMARY
        </div>
        
        <div className="steps flex flex-col p-5">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="step grid gap-2 mb-4"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {item.name}
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <hr className="h-px bg-slate-600/75 border-none" />

        {/* Promo Code Section */}
        <div className="promo p-5">
          <form onSubmit={handlePromoSubmit} className="grid grid-cols-[1fr_80px] gap-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="input_field w-auto h-9 px-3 rounded-md outline-none border border-slate-600 bg-yellow-100 dark:bg-yellow-900/30 text-slate-900 dark:text-slate-100 transition-all duration-300 focus:border-transparent focus:shadow-[0px_0px_0px_2px_theme(colors.yellow.200)] focus:bg-yellow-200 dark:focus:bg-yellow-800/50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center justify-center px-4 gap-2 w-full h-9 bg-slate-600/75 hover:bg-slate-600 shadow-[0px_0.5px_0.5px_theme(colors.orange.200)] rounded-md border-0 font-semibold text-xs text-slate-100 transition-colors"
            >
              <Tag className="w-3 h-3" />
              Apply
            </motion.button>
          </form>
          
          {promoApplied && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium"
            >
              ✓ Promo code applied: {discount}% off
            </motion.div>
          )}
        </div>

        <hr className="h-px bg-slate-600/75 border-none" />

        {/* Payment Details */}
        <div className="payments p-5">
          <div className="details grid grid-cols-[10fr_1fr] gap-1 mb-4">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Subtotal
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 text-right">
              ${subtotal.toFixed(2)}
            </span>
            
            {discount > 0 && (
              <>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Discount ({discount}%)
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                  -${discountAmount.toFixed(2)}
                </span>
              </>
            )}
            
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Tax
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 text-right">
              $0.00
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="checkout">
        <div className="footer flex items-center justify-between py-3 px-5 bg-slate-600/50">
          <div className="price text-2xl text-slate-800 dark:text-slate-200 font-black">
            ${total.toFixed(2)}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={isLoading}
            className="checkout-btn flex items-center justify-center w-36 h-9 bg-slate-600/55 hover:bg-slate-600/70 shadow-[0px_0.5px_0.5px_rgba(71,85,105,0.75)] rounded-lg border border-slate-600 text-slate-900 dark:text-slate-100 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CheckoutCard;
