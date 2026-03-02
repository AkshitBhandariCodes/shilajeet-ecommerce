'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useFireCoins } from '@/contexts/FireCoinsContext';

export default function FireCoinsDisplay() {
  const { coins, loading } = useFireCoins();

  if (loading) {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30">
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        <span className="text-white text-xs">...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      title={`You have ${coins} Fire Coins (₹${coins} discount)`}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Flame className="w-4 h-4 text-orange-500 group-hover:text-orange-400" />
      </motion.div>
      <span className="text-white font-bold text-sm">{coins}</span>
    </motion.div>
  );
}
