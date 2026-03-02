'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FireCoinsContextType {
  coins: number;
  loading: boolean;
  refreshCoins: () => Promise<void>;
  earnCoins: (amount: number, orderId: string) => Promise<void>;
  redeemCoins: (amount: number, orderId: string) => Promise<boolean>;
}

const FireCoinsContext = createContext<FireCoinsContextType | undefined>(undefined);

export function FireCoinsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCoins();
    } else {
      setCoins(0);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fire-coins/balance');
      if (response.ok) {
        const data = await response.json();
        setCoins(data.balance);
      }
    } catch (error) {
      console.error('Error fetching fire coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnCoins = async (amount: number, orderId: string) => {
    try {
      const response = await fetch('/api/fire-coins/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      });

      if (response.ok) {
        await refreshCoins();
      }
    } catch (error) {
      console.error('Error earning fire coins:', error);
    }
  };

  const redeemCoins = async (amount: number, orderId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/fire-coins/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderId })
      });

      if (response.ok) {
        await refreshCoins();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error redeeming fire coins:', error);
      return false;
    }
  };

  return (
    <FireCoinsContext.Provider value={{ coins, loading, refreshCoins, earnCoins, redeemCoins }}>
      {children}
    </FireCoinsContext.Provider>
  );
}

export function useFireCoins() {
  const context = useContext(FireCoinsContext);
  if (context === undefined) {
    throw new Error('useFireCoins must be used within a FireCoinsProvider');
  }
  return context;
}
