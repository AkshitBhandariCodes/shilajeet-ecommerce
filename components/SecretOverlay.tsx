'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SecretOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show overlay after 2 seconds on every page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative bg-gradient-to-br from-purple-900 via-black to-purple-900 border-2 border-purple-500 rounded-2xl p-12 max-w-2xl mx-4 shadow-2xl pointer-events-auto"
      >
        {/* Content */}
        <div className="text-center space-y-6">
          {/* Joker Emoji - Animated */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="text-8xl"
          >
            🤡
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-pulse">
              I LOVE YOU
            </h2>

            <div className="space-y-3 text-lg text-gray-300 font-light">
              <p className="text-xl">
                <span className="text-purple-400 font-semibold">You see me</span>
              </p>
              <p className="text-xl">
                <span className="text-pink-400 font-semibold">And now you can't</span>
              </p>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 pt-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              💜
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              ✨
            </motion.div>
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10" />
      </motion.div>
    </motion.div>
  );
}
