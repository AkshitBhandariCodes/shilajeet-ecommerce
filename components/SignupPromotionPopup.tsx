'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SignupPromotionPopupProps {
  onSignupClick?: () => void;
}

export default function SignupPromotionPopup({ onSignupClick }: SignupPromotionPopupProps) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  // Show popup only for non-authenticated users, once per session
  useEffect(() => {
    if (!isAuthenticated && !hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasSeenPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasSeenPopup]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSignup = () => {
    handleClose();
    // Dispatch custom event to trigger signup in Navbar
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  return (
    <AnimatePresence>
      {isOpen && !isAuthenticated && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-sm"
          >
            <div className="bg-gradient-to-br from-jet-900 via-jet-800 to-jet-900 border border-primary-400/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400/5 rounded-full blur-2xl -ml-16 -mb-16" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              {/* Content */}
              <div className="relative z-10">
                {/* Gift Icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-primary-400/20 p-3 rounded-full">
                    <Gift className="w-6 h-6 text-primary-400" />
                  </div>
                </motion.div>

                {/* Heading */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  Exclusive Welcome Offer!
                </h3>

                {/* Subheading */}
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Sign up now and get <span className="text-primary-400 font-bold">5% off</span> your first order on premium Himalayan Shilajit
                </p>

                {/* Discount Badge */}
                <div className="bg-gradient-to-r from-primary-400/20 to-primary-500/20 border border-primary-400/50 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-primary-400">
                    5% OFF
                  </div>
                  <p className="text-gray-300 text-xs mt-1">
                    On your first purchase
                  </p>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleSignup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-black font-bold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Footer text */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Unique coupon code sent after signup
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
