'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SignupDiscountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
}

export default function SignupDiscountPopup({ isOpen, onClose, couponCode }: SignupDiscountPopupProps) {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  // Auto-close after 8 seconds if not interacted
  useEffect(() => {
    if (isOpen && !couponCode) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, couponCode, onClose]);

  const handleCopy = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 sm:mx-0"
          >
            <div className="bg-gradient-to-br from-jet-900 via-jet-800 to-jet-900 border border-primary-400/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-2xl -ml-12 -mb-12" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Gift Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4 sm:mb-6"
                >
                  <div className="bg-primary-400/20 p-3 sm:p-4 rounded-full">
                    <Gift className="w-6 sm:w-8 h-6 sm:h-8 text-primary-400" />
                  </div>
                </motion.div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome to Agnishila!
                </h2>

                {/* Subheading */}
                <p className="text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Enjoy an exclusive welcome bonus on your first order
                </p>

                {/* Discount Badge */}
                <div className="bg-gradient-to-r from-primary-400/20 to-primary-500/20 border border-primary-400/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="text-4xl sm:text-5xl font-bold text-primary-400 mb-2">
                    5%
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Discount on your first purchase
                  </p>
                </div>

                {/* Coupon Code */}
                {couponCode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-jet-800/50 border border-primary-400/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
                  >
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                      Your Coupon Code
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                      <code className="text-base sm:text-lg font-mono font-bold text-primary-400 break-all">
                        {couponCode}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-400/20 hover:bg-primary-400/30 text-primary-400 rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Benefits */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-left">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Valid for 30 days from signup
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Use on any product in your first order
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Maximum discount up to ₹500
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Start Shopping
                </button>

                {/* Footer text */}
                <p className="text-xs text-gray-500 mt-3 sm:mt-4">
                  This offer is automatically applied at checkout
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
