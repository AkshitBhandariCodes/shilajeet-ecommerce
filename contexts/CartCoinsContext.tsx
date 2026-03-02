'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartCoinsContextType {
  redeemedCoins: number;
  setRedeemedCoins: (amount: number) => void;
  clearRedeemedCoins: () => void;
}

const CartCoinsContext = createContext<CartCoinsContextType | undefined>(undefined);

export function CartCoinsProvider({ children }: { children: ReactNode }) {
  const [redeemedCoins, setRedeemedCoins] = useState(0);

  const clearRedeemedCoins = () => {
    setRedeemedCoins(0);
  };

  return (
    <CartCoinsContext.Provider value={{ redeemedCoins, setRedeemedCoins, clearRedeemedCoins }}>
      {children}
    </CartCoinsContext.Provider>
  );
}

export function useCartCoins() {
  const context = useContext(CartCoinsContext);
  if (context === undefined) {
    throw new Error('useCartCoins must be used within a CartCoinsProvider');
  }
  return context;
}
