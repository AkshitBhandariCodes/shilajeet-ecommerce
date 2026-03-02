'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { FireCoinsProvider } from '@/contexts/FireCoinsContext';
import { CouponProvider } from '@/contexts/CouponContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <FireCoinsProvider>
              <CouponProvider>
                {children}
              </CouponProvider>
            </FireCoinsProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}