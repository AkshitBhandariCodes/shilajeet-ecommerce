'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, X, Check } from 'lucide-react';
import { useCoupon } from '@/contexts/CouponContext';

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied?: (discount: number) => void;
}

export default function CouponInput({ orderAmount, onCouponApplied }: CouponInputProps) {
  const { appliedCoupon, applyCoupon, removeCoupon, isLoading, error } = useCoupon();
  const [couponCode, setCouponCode] = useState('');
  const [localError, setLocalError] = useState('');

  const handleApply = async () => {
    setLocalError('');
    if (!couponCode.trim()) {
      setLocalError('Please enter a coupon code');
      return;
    }

    const success = await applyCoupon(couponCode, orderAmount);
    if (success) {
      setCouponCode('');
      if (onCouponApplied) {
        onCouponApplied(appliedCoupon?.discountAmount || 0);
      }
    } else {
      setLocalError(error || 'Failed to apply coupon');
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCouponCode('');
    setLocalError('');
  };

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-600/20 border border-green-600/30 p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 font-bold uppercase tracking-wider text-sm">
                Coupon Applied
              </p>
              <p className="text-green-300 text-sm">
                {appliedCoupon.code} - Save ₹{appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <motion.button
            onClick={handleRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-green-400 hover:bg-green-400/20 transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Tag className="w-4 h-4 text-primary-400" />
        <label className="text-gray-300 text-sm font-medium uppercase tracking-wider">
          Have a coupon code?
        </label>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            setLocalError('');
          }}
          placeholder="Enter coupon code"
          disabled={isLoading}
          className="flex-1 bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary-400 transition-colors disabled:opacity-50 placeholder-gray-500"
        />
        <motion.button
          onClick={handleApply}
          disabled={isLoading || !couponCode.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </motion.button>
      </div>

      {(error || localError) && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-2"
        >
          {error || localError}
        </motion.p>
      )}
    </div>
  );
}
