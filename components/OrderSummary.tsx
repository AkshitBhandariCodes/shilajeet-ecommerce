'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Package } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { useCoupon } from '@/contexts/CouponContext';
import CouponInput from '@/components/CouponInput';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const { appliedCoupon } = useCoupon();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = 0; // No tax
  const discount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal - discount + tax + shipping);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-jet-900 border border-white/20 p-8 sticky top-32 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[30px] border-r-transparent border-b-[30px] border-b-primary-400/30"></div>
      
      <div className="flex items-center space-x-3 mb-8">
        <ShoppingBag className="w-6 h-6 text-primary-400" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Order Summary
        </h2>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-white/10">
            {/* Product Image */}
            <div className="w-16 h-16 bg-jet-800 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package className="w-8 h-8 text-primary-400/50" />
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                {item.name}
              </h3>
              {item.variant && (
                <p className="text-gray-400 text-xs mb-1">{item.variant}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                <span className="text-primary-400 font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Input */}
      <div className="mb-8 pb-8 border-b border-white/20">
        <CouponInput orderAmount={subtotal} />
      </div>

      {/* Totals */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white font-bold">{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-green-400">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span className="font-bold">-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Shipping</span>
          <span className="text-primary-400 font-bold">FREE</span>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-white uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold text-primary-400">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-primary-400"></div>
          <span>SSL Encrypted Checkout</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-primary-400"></div>
          <span>30-Day Money Back Guarantee</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-primary-400"></div>
          <span>Free Shipping on All Orders</span>
        </div>
      </div>
    </motion.div>
  );
}