'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartNotificationProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

export default function CartNotification({ show, productName, onClose }: CartNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-24 right-4 z-50 bg-jet-900 border border-primary-400/50 p-4 max-w-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm uppercase tracking-wider">
                Added to Cart
              </p>
              <p className="text-gray-300 text-sm font-light">
                {productName}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-primary-400" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-primary-400/50"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}