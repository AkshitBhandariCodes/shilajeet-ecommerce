'use client';

import React, { createContext, useContext, useState } from 'react';

export interface AppliedCoupon {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  maxDiscount?: number;
}

interface CouponContextType {
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string, orderAmount: number) => Promise<boolean>;
  removeCoupon: () => void;
  isLoading: boolean;
  error: string | null;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyCoupon = async (code: string, orderAmount: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to apply coupon');
        return false;
      }

      const data = await response.json();
      setAppliedCoupon(data.coupon);
      return true;
    } catch (err) {
      setError('An error occurred while applying the coupon');
      console.error('Error applying coupon:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setError(null);
  };

  return (
    <CouponContext.Provider value={{ appliedCoupon, applyCoupon, removeCoupon, isLoading, error }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
}
