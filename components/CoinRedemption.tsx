'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Check, X } from 'lucide-react';
import { useFireCoins } from '@/contexts/FireCoinsContext';

interface CoinRedemptionProps {
  maxRedeemable: number;
  onRedemptionChange: (amount: number) => void;
  appliedCoins: number;
}

export default function CoinRedemption({ maxRedeemable, onRedemptionChange, appliedCoins }: CoinRedemptionProps) {
  const { coins, loading } = useFireCoins();
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const availableCoins = Math.min(coins, maxRedeemable);

  const handleRedeemAll = () => {
    const amount = availableCoins;
    setRedeemAmount(amount);
    setInputValue(amount.toString());
    onRedemptionChange(amount);
    setError('');
  };

  const handleCustomAmount = () => {
    const amount = parseInt(inputValue) || 0;
    
    if (amount < 0) {
      setError('Amount cannot be negative');
      return;
    }
    
    if (amount > availableCoins) {
      setError(`You only have ${availableCoins} coins available`);
      return;
    }
    
    if (amount > maxRedeemable) {
      setError(`Maximum redeemable amount is ₹${maxRedeemable}`);
      return;
    }
    
    setRedeemAmount(amount);
    onRedemptionChange(amount);
    setError('');
    setShowInput(false);
  };

  const handleClear = () => {
    setRedeemAmount(0);
    setInputValue('');
    setShowInput(false);
    onRedemptionChange(0);
    setError('');
  };

  if (loading) {
    return (
      <div className="bg-black/50 border border-white/10 p-4 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading coins...</div>
        </div>
      </div>
    );
  }

  if (coins === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 p-4 rounded-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-white font-bold text-sm uppercase tracking-wider">Fire Coins</span>
        </div>
        <span className="text-orange-400 font-bold text-sm">{coins} Available</span>
      </div>

      {redeemAmount > 0 ? (
        <div className="space-y-3">
          <div className="bg-black/50 p-3 rounded border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Coins Redeemed:</span>
              <span className="text-green-400 font-bold">{redeemAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Discount:</span>
              <span className="text-green-400 font-bold">₹{redeemAmount}</span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="w-full px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
          >
            <X size={16} />
            Remove Coins
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {showInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max={availableCoins}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError('');
                  }}
                  placeholder={`Max: ${availableCoins}`}
                  className="flex-1 bg-black/50 border border-white/20 text-white px-3 py-2 rounded text-sm focus:border-orange-500 focus:outline-none"
                />
                <button
                  onClick={handleCustomAmount}
                  className="px-3 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-colors text-sm font-bold rounded"
                >
                  <Check size={16} />
                </button>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleRedeemAll}
                className="flex-1 px-3 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 transition-colors text-sm font-bold uppercase tracking-wider rounded"
              >
                Redeem All ({availableCoins})
              </button>
              <button
                onClick={() => setShowInput(true)}
                className="px-3 py-2 bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 transition-colors text-sm font-bold rounded"
              >
                Custom
              </button>
            </div>
          )}
          <p className="text-gray-400 text-xs">
            1 Fire Coin = ₹1 discount (Max: ₹{availableCoins})
          </p>
        </div>
      )}
    </motion.div>
  );
}
